"use client";

import { useMemo, useState } from "react";

type Stage = {
  key: string;
  no: string;
  name: string;
  action: string;
  plain: string;
  input: string;
  output: string;
  color: string;
  icon: string;
};

const stages: Stage[] = [
  { key: "pre", no: "01", name: "预处理", action: "准备材料", plain: "展开头文件、宏和条件代码", input: "main.c + sys.h", output: "展开后的 C 代码", color: "#ffb86b", icon: "#" },
  { key: "compile", no: "02", name: "编译", action: "翻译配方", plain: "检查语法，把 C 语言翻译成汇编语言", input: "展开后的 C 代码", output: "汇编指令", color: "#6ee7c7", icon: "C" },
  { key: "assemble", no: "03", name: "汇编", action: "制作零件", plain: "把汇编指令变成机器码零件", input: "汇编指令", output: "main.o / sys.o", color: "#75a7ff", icon: "01" },
  { key: "link", no: "04", name: "链接", action: "组装成品", plain: "把所有 .o 零件和函数库拼在一起", input: "多个 .o + 库", output: "Tamplate.axf", color: "#d89cff", icon: "∞" },
];

const errors = [
  { title: "头文件引号没写全", raw: "expected a file name", human: "Keil 看不懂你要包含哪个文件。", fix: '#include "sys/sys.h"', tag: "预处理" },
  { title: "工程错误地启用了 FPU", raw: "device without an FPU", human: "工程说有小数计算硬件，设备资料却说没有。", fix: "Floating Point Hardware → Not Used", tag: "编译" },
  { title: "工程里有两个 main()", raw: "main multiply defined", human: "程序入口出现了两次，链接器不知道选谁。", fix: "只让一个带 main() 的文件参与编译", tag: "链接" },
  { title: "调试时找不到 .axf", raw: "Could not load Tamplate.axf", human: "前面的构建失败，最终程序根本没有生成。", fix: "先 Rebuild，解决第一条 error，再 Debug", tag: "调试" },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [scenario, setScenario] = useState<"success" | "duplicate" | "fpu">("success");
  const [quiz, setQuiz] = useState<number | null>(null);

  const logLines = useMemo(() => {
    if (scenario === "duplicate") return ["Rebuild target 'template'", "compiling main.c...", "compiling demo1.c...", "linking...", "Error: Symbol main multiply defined", "Target not created."];
    if (scenario === "fpu") return ["Rebuild target 'template'", "compiling system_ARMCM4.c...", "Error: Compiler generates FPU instructions", "for a device without an FPU", "Target not created."];
    return ["Rebuild target 'template'", "assembling startup_ARMCM4.s...", "compiling main.c...", "compiling sys.c...", "linking...", "Program Size: Code=2636  RO=1264  RW=16  ZI=1120", '".\\Objects\\Tamplate.axf" - 0 Error(s), 0 Warning(s).'];
  }, [scenario]);

  function runBuild() {
    if (running) return;
    setRunning(true);
    setStep(0);
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= logLines.length - 1) {
        window.clearInterval(timer);
        setRunning(false);
      }
    }, 460);
  }

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top"><span className="brand-dot">μ</span><span>MCU<br /><b>NOTES</b></span></a>
        <nav><a href="#flow">编译流程</a><a href="#sim">Keil 仿真</a><a href="#errors">你的报错</a><a href="#quiz">自测</a></nav>
        <a className="course" href="https://www.bilibili.com/video/BV1vkhQzeEzD/" target="_blank" rel="noreferrer">BV1vkhQzeEzD ↗</a>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span></span> 第 4 讲 · 零基础重制笔记</div>
        <h1>你写的 C 代码，<br />是怎样<span>跑进单片机</span>的？</h1>
        <p className="hero-sub">别背术语。跟着一份 <code>main.c</code>，亲眼看它经过四个车间，最后变成 Keil 可以运行的 <code>Tamplate.axf</code>。</p>
        <div className="hero-actions"><a className="primary" href="#flow">从动画开始学习 ↓</a><a className="secondary" href="#sim">我想直接看 Keil</a></div>
        <div className="hero-card">
          <div className="window-bar"><i className="red"></i><i className="yellow"></i><i className="green"></i><span>main.c</span></div>
          <pre><em>1</em> <b>#include</b> <span>&quot;sys/sys.h&quot;</span>{"\n"}<em>2</em>{"\n"}<em>3</em> <b>int</b> main(<b>void</b>){"\n"}<em>4</em> {`{`}{"\n"}<em>5</em>   printf(<span>&quot;Hello World!\n&quot;</span>);{"\n"}<em>6</em>   <b>return</b> 0;{"\n"}<em>7</em> {`}`}</pre>
          <div className="machine-tag">人类可读</div><div className="arrow-beam">→</div><div className="chip"><small>ARM</small><strong>0101<br />1100</strong><b>Cortex-M4</b></div>
        </div>
      </section>

      <section className="section flow-section" id="flow">
        <div className="section-heading"><span>01 / 核心概念</span><h2>四个车间，一条流水线</h2><p>点击任意步骤。先看“大白话”，专业名字自然就记住了。</p></div>
        <div className="pipeline">
          {stages.map((s, i) => <button key={s.key} className={`stage ${active === i ? "active" : ""}`} onClick={() => setActive(i)} style={{"--accent": s.color} as React.CSSProperties}><small>{s.no}</small><div className="stage-icon">{s.icon}</div><strong>{s.name}</strong><span>{s.action}</span>{i < 3 && <i className="connector">→</i>}</button>)}
        </div>
        <div className="stage-detail" style={{"--accent": stages[active].color} as React.CSSProperties}>
          <div className="detail-copy"><span className="number">STEP {stages[active].no}</span><h3>{stages[active].name} = {stages[active].action}</h3><p>{stages[active].plain}。</p><div className="io"><div><small>进去的东西</small><b>{stages[active].input}</b></div><span>→</span><div><small>出来的东西</small><b>{stages[active].output}</b></div></div></div>
          <div className="analogy"><span className="cake">{["🥣", "🧑‍🍳", "🧩", "🎂"][active]}</span><p>{[
            "像把面粉、鸡蛋和配方全部摆到桌上。#include 就是在拿材料。",
            "像厨师读懂配方并检查：材料名写对了吗？步骤有没有漏？",
            "每份材料先做成蛋糕胚、奶油等独立零件，也就是 .o 文件。",
            "最后把所有零件拼起来。只有成品 .axf 才能交给调试器。",
          ][active]}</p></div>
        </div>
      </section>

      <section className="section sim-section" id="sim">
        <div className="section-heading light"><span>02 / 动手仿真</span><h2>在这里“编译”一次</h2><p>选择一种情况，再点击 Rebuild。观察 Build Output 最先出现的错误。</p></div>
        <div className="sim-wrap">
          <div className="scenario-tabs">
            <button className={scenario === "success" ? "on" : ""} onClick={() => {setScenario("success"); setStep(-1)}}>✓ 正常工程</button>
            <button className={scenario === "duplicate" ? "on danger" : ""} onClick={() => {setScenario("duplicate"); setStep(-1)}}>两个 main()</button>
            <button className={scenario === "fpu" ? "on danger" : ""} onClick={() => {setScenario("fpu"); setStep(-1)}}>FPU 设置错误</button>
          </div>
          <div className="keil">
            <div className="keil-title"><b>μVision</b><span>G:\环境搭建工程\Tamplate.uvprojx</span><button onClick={runBuild} disabled={running}>↻ Rebuild</button></div>
            <div className="keil-body">
              <aside><b>Project: Tamplate</b><span>▾ template</span><span>　▾ user</span><span>　　📄 main.c</span>{scenario === "duplicate" && <span className="bad">　　📄 demo1.c</span>}<span>　▾ sys</span><span>　　📄 sys.c</span><span>　◇ CMSIS</span><span>　◇ Device</span></aside>
              <div className="editor"><div className="editor-tabs"><b>main.c</b><span>sys.c</span></div><pre><i>1</i> <b>#include</b> <span>&quot;sys/sys.h&quot;</span>{"\n"}<i>2</i>{"\n"}<i>3</i> <b>int</b> main(<b>void</b>){"\n"}<i>4</i> {`{`}{"\n"}<i>5</i>   <b>int</b> num;{"\n"}<i>6</i>   printf(<span>&quot;Hello World!\n&quot;</span>);{"\n"}<i>7</i>   scanf(<span>&quot;%d&quot;</span>, &amp;num);{"\n"}<i>8</i>   <b>return</b> 0;{"\n"}<i>9</i> {`}`}</pre></div>
            </div>
            <div className="output"><div className="output-title">Build Output <span>{running ? "● BUILDING" : ""}</span></div><div className="terminal">{step < 0 ? <p className="muted">点击右上角 Rebuild 开始构建…</p> : logLines.slice(0, step + 1).map((line, i) => <p key={i} className={/Error|not created/.test(line) ? "error" : /0 Error/.test(line) ? "ok" : ""}>{line}</p>)}</div></div>
          </div>
          {step >= logLines.length - 1 && <div className={`result ${scenario === "success" ? "good" : "fail"}`}>{scenario === "success" ? <><b>构建成功！</b><span>已经生成 Tamplate.axf，现在才可以进入 Debug。</span></> : <><b>构建失败</b><span>{scenario === "duplicate" ? "链接阶段发现两个 main()。请让 demo1.c 暂时不参与编译。" : "编译设置与设备冲突。把 Floating Point Hardware 改为 Not Used。"}</span></>}</div>}
        </div>
      </section>

      <section className="section" id="errors">
        <div className="section-heading"><span>03 / 你的实战记录</span><h2>四次报错，其实是一条因果链</h2><p>不只告诉你怎么改，还要知道错误发生在哪一步。</p></div>
        <div className="error-grid">{errors.map((e, i) => <article key={e.raw}><div className="error-top"><span>0{i + 1}</span><b>{e.tag}</b></div><h3>{e.title}</h3><code>{e.raw}</code><p>{e.human}</p><div className="fix"><small>这样解决</small><strong>{e.fix}</strong></div></article>)}</div>
        <div className="causal"><b>记住这条线：</b><span>两个 main()</span><i>→</i><span>链接失败</span><i>→</i><span>.axf 没生成</span><i>→</i><span>Debug 找不到文件</span></div>
      </section>

      <section className="section files-section">
        <div className="section-heading"><span>04 / 文件认知</span><h2>现在只需认识三个后缀</h2></div>
        <div className="file-cards"><article><div className="file-icon c">.c</div><h3>你写的代码</h3><p>人能读懂，单片机暂时看不懂。</p></article><span>加工</span><article><div className="file-icon o">.o</div><h3>机器码零件</h3><p>每个源文件各自生成一份，还不是完整程序。</p></article><span>组装</span><article className="featured"><div className="file-icon axf">.axf</div><h3>最终成品</h3><p>Keil 用它打断点、单步和查看变量。</p></article></div>
      </section>

      <section className="section quiz-section" id="quiz">
        <div className="section-heading light"><span>05 / 30 秒自测</span><h2>找不到 Tamplate.axf，第一步该做什么？</h2></div>
        <div className="quiz-options">
          {["继续反复点击 Debug", "重新安装 Keil", "Rebuild，并找 Build Output 的第一条 error", "删除 CMSIS 文件"].map((q, i) => <button key={q} className={quiz === i ? (i === 2 ? "correct" : "wrong") : ""} onClick={() => setQuiz(i)}><span>{String.fromCharCode(65 + i)}</span>{q}</button>)}
        </div>
        {quiz !== null && <div className={`quiz-answer ${quiz === 2 ? "yes" : "no"}`}>{quiz === 2 ? "答对了！.axf 不存在通常只是结果，真正原因在前面的第一条错误。" : "再想想：Debug 只能加载已经生成的成品，应该先查成品为什么没生成。"}</div>}
      </section>

      <section className="summary">
        <span>最后只背这五句</span><h2>预处理准备材料，编译翻译代码，<br />汇编生成零件，链接拼成 <mark>.axf</mark>，<br />成功后才能 Debug。</h2>
        <div><b>1</b> 一个程序只能有一个 main() <b>2</b> 第一条 error 最重要 <b>3</b> 目标是 0 Error(s)</div>
      </section>

      <footer><b>MCU NOTES</b><span>为 BV1vkhQzeEzD 第 4 讲整理 · 结合你的 Keil 实际报错</span><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
