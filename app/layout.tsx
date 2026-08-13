import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "嵌入式 C 语言｜77 节零基础学习手册",
  description: "正点原子 BV1vkhQzeEzD 全系列交互笔记：大白话、最小代码、练习、易错点与学习进度。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "嵌入式 C 语言｜77 节零基础学习手册",
    description: "每一节课，都讲到你听懂。",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
