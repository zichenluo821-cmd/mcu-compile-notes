"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { lessons } from "../../course-data";

const compileStages = [
  ["预处理","准备材料","处理 #include、宏和条件代码","main.c + sys.h","展开后的 C"],
  ["编译","翻译配方","检查语法并翻译 C 代码","展开后的 C","汇编指令"],
  ["汇编","制作零件","把指令做成机器码零件","汇编指令","main.o / sys.o"],
  ["链接","组装成品","拼起所有零件与函数库","多个 .o + 库","Tamplate.axf"],
];

export default function LessonPage() {
  const params = useParams<{id:string}>();
  const id = Number(params.id);
  const lesson = lessons.find(l=>l.id===id) || lessons[0];
  const [done, setDone] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState(false);

  useEffect(()=>{ try{setDone(JSON.parse(localStorage.getItem("mcu-course-done")||"[]"))}catch{setDone([])} },[]);
  const completed = done.includes(lesson.id);
  const next = lessons.find(l=>l.id===lesson.id+1);
  const prev = lessons.find(l=>l.id===lesson.id-1);
  const related = useMemo(()=>lessons.filter(l=>l.unit===lesson.unit&&l.id!==lesson.id).slice(0,3),[lesson]);

  function toggleDone(){ const n=completed?done.filter(x=>x!==lesson.id):[...done,lesson.id]; setDone(n); localStorage.setItem("mcu-course-done",JSON.stringify(n)); }
  async function copy(){ await navigator.clipboard.writeText(lesson.code); setCopied(true); setTimeout(()=>setCopied(false),1400); }

  return <main className="lesson-page" style={{"--lesson":lesson.color} as React.CSSProperties}>
    <header className="lesson-nav"><a href="/" className="back">← 全部目录</a><div><span>{lesson.unit}</span><b>{lesson.id===0?"先导片":`第 ${lesson.id} 讲`}</b></div><button onClick={toggleDone} className={completed?"completed":""}>{completed?"✓ 已学会":"标记为已完成"}</button></header>

    <section className="lesson-hero"><div className="lesson-meta"><span>{lesson.id===0?"INTRO":`LESSON ${String(lesson.id).padStart(2,"0")}`}</span><i></i><span>{lesson.duration}</span></div><h1>{lesson.title}</h1><p>{lesson.summary}</p><a href={`https://www.bilibili.com/video/BV1vkhQzeEzD?p=${lesson.p}`} target="_blank" rel="noreferrer">播放本节视频 ↗</a></section>

    <div className="lesson-layout">
      <aside className="toc"><b>本节目录</b><a href="#plain">先听大白话</a><a href="#points">三个核心点</a><a href="#code">最小代码</a>{lesson.id===4&&<a href="#lab">互动图解</a>}<a href="#pitfall">易错提醒</a><a href="#practice">动手练习</a><a href="#check">完成标准</a></aside>
      <article className="lesson-content">
        <section id="plain" className="plain-card"><span>先听大白话</span><h2>它到底是什么意思？</h2><p>{lesson.plain}</p></section>

        <section id="points" className="content-section"><div className="section-kicker">01 / 核心知识</div><h2>这节只记住三点</h2><div className="point-list">{lesson.points.map((p,i)=><div key={p}><b>{i+1}</b><p>{p}</p></div>)}</div></section>

        <section id="code" className="content-section"><div className="section-kicker">02 / 最小例子</div><h2>先看懂，再亲手敲</h2><div className="code-box"><div><span>example.c</span><button onClick={copy}>{copied?"✓ 已复制":"复制代码"}</button></div><pre>{lesson.code}</pre></div><p className="code-tip">建议：先遮住运行结果，自己在纸上预测一次，再到 Keil 中验证。</p></section>

        {lesson.id===4&&<section id="lab" className="content-section"><div className="section-kicker">03 / 互动图解</div><h2>点击查看“做蛋糕”流水线</h2><div className="mini-pipeline">{compileStages.map((s,i)=><button onClick={()=>setStage(i)} className={stage===i?"on":""} key={s[0]}><b>{i+1}</b><span>{s[0]}</span><small>{s[1]}</small></button>)}</div><div className="mini-stage"><div><span>{compileStages[stage][0]} = {compileStages[stage][1]}</span><h3>{compileStages[stage][2]}</h3></div><div><small>输入</small><b>{compileStages[stage][3]}</b><i>→</i><small>输出</small><b>{compileStages[stage][4]}</b></div></div></section>}

        <section id="pitfall" className="content-section"><div className="section-kicker">{lesson.id===4?"04":"03"} / 易错提醒</div><div className="pitfall"><b>⚠ 新手最容易错在这里</b><p>{lesson.pitfall}</p></div></section>

        <section id="practice" className="content-section"><div className="section-kicker">{lesson.id===4?"05":"04"} / 动手练习</div><h2>现在轮到你</h2><div className="practice-card"><span>本节任务</span><p>{lesson.practice}</p><button onClick={()=>setAnswer(!answer)}>{answer?"收起具体提示":"不知道怎么开始？看具体步骤"}</button>{answer&&<div className="practice-hint"><b>照着这 3 步做</b>{lesson.hint.split("\n").map((step)=><p key={step}>{step}</p>)}</div>}</div></section>

        <section id="check" className="content-section"><div className="section-kicker">{lesson.id===4?"06":"05"} / 完成标准</div><h2>做到这个程度才算学会</h2><div className="done-card"><p>{lesson.done}</p><button className={completed?"completed":""} onClick={toggleDone}>{completed?"✓ 本节已完成":"我做到了，完成本节"}</button></div></section>

        <section className="related"><h3>同阶段接着学</h3><div>{related.map(l=><a key={l.id} href={`/lesson/${l.id}`}><span>{String(l.id).padStart(2,"0")}</span><b>{l.title}</b>→</a>)}</div></section>
      </article>
    </div>

    <nav className="lesson-bottom">{prev?<a href={`/lesson/${prev.id}`}><small>← 上一节</small><b>{prev.title}</b></a>:<span/>}{next?<a className="next" href={`/lesson/${next.id}`}><small>下一节 →</small><b>{next.title}</b></a>:<a className="next" href="/"><small>已经到底了</small><b>回到课程目录</b></a>}</nav>
  </main>
}
