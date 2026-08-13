"use client";

import { useEffect, useMemo, useState } from "react";
import { lessons, unitOrder } from "./course-data";

export default function Home() {
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState("全部");
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem("mcu-course-done") || "[]")); } catch { setDone([]); }
  }, []);

  const visible = useMemo(() => lessons.filter((l) =>
    (unit === "全部" || l.unit === unit) &&
    (`${l.id} ${l.title} ${l.summary}`.toLowerCase().includes(query.toLowerCase()))
  ), [query, unit]);

  const minutes = Math.round(lessons.reduce((n, l) => {
    const [m, s] = l.duration.split(":").map(Number); return n + m + s / 60;
  }, 0));

  return <main className="course-home">
    <header className="course-nav">
      <a className="brand" href="#top"><span className="brand-dot">μ</span><span>嵌入式 C<br/><b>学习手册</b></span></a>
      <div className="course-progress"><span><i style={{width:`${done.length / lessons.length * 100}%`}} /></span><b>{done.length} / {lessons.length}</b></div>
      <a className="bili-link" href="https://www.bilibili.com/video/BV1vkhQzeEzD/" target="_blank" rel="noreferrer">打开课程 ↗</a>
    </header>

    <section className="course-hero" id="top">
      <div className="course-hero-copy">
        <span className="tiny-label">正点原子 · BV1vkhQzeEzD</span>
        <h1>每一节课，<br/><mark>都讲到你听懂。</mark></h1>
        <p>不是把视频字幕抄一遍，而是把 77 节内容重新翻译成大白话。每课只解决一个问题，配一个最小例子、一个练习和一个完成标准。</p>
        <div className="course-stats"><div><b>{lessons.length}</b><span>视频条目</span></div><div><b>{Math.floor(minutes/60)}h</b><span>课程时长</span></div><div><b>{unitOrder.length}</b><span>学习阶段</span></div></div>
      </div>
      <div className="roadmap-card">
        <span>你的学习路线</span>
        {unitOrder.map((u, i) => { const list=lessons.filter(l=>l.unit===u); const count=list.filter(l=>done.includes(l.id)).length; return <div key={u} className="road-row"><i style={{background:list[0].color}}>{i+1}</i><b>{u}</b><small>{count}/{list.length}</small></div> })}
      </div>
    </section>

    <section className="catalog">
      <div className="catalog-head"><div><span className="tiny-label">课程目录</span><h2>今天想学哪一节？</h2></div><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索：指针、printf、循环…" /></label></div>
      <div className="unit-filters"><button className={unit==="全部"?"on":""} onClick={()=>setUnit("全部")}>全部 · {lessons.length}</button>{unitOrder.map(u=><button key={u} className={unit===u?"on":""} onClick={()=>setUnit(u)}>{u} · {lessons.filter(l=>l.unit===u).length}</button>)}</div>

      <div className="lesson-list">
        {visible.map(l => <a href={`/lesson/${l.id}`} key={l.id} className={`lesson-row ${done.includes(l.id)?"is-done":""}`}>
          <div className="lesson-no" style={{"--lesson":l.color} as React.CSSProperties}>{l.id===0?"导":String(l.id).padStart(2,"0")}</div>
          <div className="lesson-main"><div><span>{l.unit}</span><small>{l.duration}</small>{done.includes(l.id)&&<b className="done-pill">✓ 已完成</b>}</div><h3>{l.title}</h3><p>{l.summary}</p></div>
          <div className="lesson-action">学习笔记 <span>→</span></div>
        </a>)}
        {visible.length===0&&<div className="empty">没有找到相关课程，换个关键词试试。</div>}
      </div>
    </section>

    <section className="method"><div><span>固定结构</span><h2>每节笔记都这样学</h2></div><div className="method-grid"><article><b>01</b><h3>先听人话</h3><p>用生活类比理解“它到底是干嘛的”。</p></article><article><b>02</b><h3>再看最小代码</h3><p>只保留当前知识点，不被复杂工程干扰。</p></article><article><b>03</b><h3>亲手做练习</h3><p>预测结果、运行验证、故意制造一次错误。</p></article><article><b>04</b><h3>完成再打勾</h3><p>达到明确标准，进度自动保存在这台设备。</p></article></div></section>

    <footer><b>嵌入式 C 学习手册</b><span>77 节 · 零基础解释 · 实际 Keil 排错</span><a href="#top">回到顶部 ↑</a></footer>
  </main>
}
