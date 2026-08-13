# 嵌入式 C 语言｜77 节零基础学习手册

一套面向嵌入式初学者的交互式中文笔记网站。内容按课程章节组织，从 C 语言基础逐步过渡到单片机编译、内存、指针、结构体等核心知识。

在线阅读：[mcu-compile-notes.zichenluo821.chatgpt.site](https://mcu-compile-notes.zichenluo821.chatgpt.site/)

## 网站特点

- 77 节课程均有独立目录和笔记页
- 用生活类比解释抽象概念，适合零基础学习
- 包含代码示例、练习、易错点和完成标准
- 支持章节导航、搜索与学习进度浏览
- 响应式布局，可在电脑和手机上阅读

## 本地运行

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

随后按照终端提示打开本地地址。

## 检查项目

```bash
npm run lint
npm test
```

项目基于 React、TypeScript、vinext 和 Cloudflare Vite 插件构建。

## 主要目录

- `app/course-data.ts`：77 节课程内容与章节数据
- `app/page.tsx`：首页、课程目录和交互界面
- `app/lesson/[id]/page.tsx`：单节课程笔记页面
- `app/globals.css`：网站整体视觉样式
- `tests/`：构建和渲染检查

## 使用说明

本项目用于个人学习与知识整理。课程笔记应配合实际编程练习使用；遇到编译错误时，优先阅读完整错误信息并检查芯片型号、编译器选项和工程配置。
