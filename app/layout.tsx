import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "单片机编译过程｜零基础交互笔记",
  description: "用动画和 Keil 仿真理解预处理、编译、汇编与链接。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "单片机编译过程｜零基础交互笔记",
    description: "C 代码如何经过四步变成可运行程序",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
