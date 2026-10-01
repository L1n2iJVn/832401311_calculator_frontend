# 832401311_calculator_frontend

前后端分离计算器系统 —— **前端界面**。

纯静态 Web 客户端，负责界面展示、按钮交互、发送计算请求、展示后端返回的结果与历史、发送删除请求。**不承担任何计算逻辑**，计算结果完全由后端返回。

> 架构原则：前端只做「输入 → 请求 → 展示」，把表达式发给后端，显示后端返回的结果。

## 功能特性

- 计算器按键界面：数字、`+ - × ÷`、括号、小数点、退格、清空
- 复合表达式输入与展示（界面显示 `× ÷`，内部发送 `* /`）
- 结果显示与错误提示（非法表达式、除零、后端不可用等）
- 计算历史展示（实时从后端数据库读取）
- 删除单条历史、清空全部历史
- 键盘快捷键（加分项）：数字/运算符直接输入、`Enter`/`=` 等于、`Backspace` 退格、`Esc` 清空

## 技术栈

| 类别 | 选择 |
|------|------|
| 结构 | HTML5 |
| 样式 | CSS3（Grid / Flexbox） |
| 逻辑 | 原生 JavaScript（ES6+，`fetch` + `async/await`） |
| 构建 | 无框架、无构建步骤、零依赖 |

## 运行环境

- 任意现代浏览器（Chrome / Edge / Firefox / Safari 均可）
- 本地运行可选 Python 或任意静态文件服务器

## 目录结构

```
832401311_calculator_frontend/
├── src/
│   ├── index.html    # 页面结构
│   ├── style.css     # 样式
│   └── app.js        # 交互与 API 请求
├── README.md
├── codestyle.md
└── .gitignore
```

## 运行方式

### 方式一：直接打开

双击 `src/index.html` 即可在浏览器打开（前提是后端已在运行）。

### 方式二：本地静态服务器（推荐）

```bash
cd src
python -m http.server 8080
```

打开 http://127.0.0.1:8080 。

## 配置后端地址

编辑 `src/app.js` 顶部的常量：

```js
const API_BASE = "http://127.0.0.1:8000";
```

改为你部署的后端地址，例如：

```js
const API_BASE = "https://your-backend.onrender.com";
```

## 前后端连接方式

前端通过 `fetch` 调用后端 REST API：

| 操作 | 请求 |
|------|------|
| 计算 | `POST /api/calculate` |
| 查历史 | `GET /api/history` |
| 删单条 | `DELETE /api/history/{id}` |
| 清空 | `DELETE /api/history` |

后端需开启 CORS（本项目后端已开启 `Access-Control-Allow-Origin: *`）。

## 验证「前后端分离」

停掉后端服务后，前端仍能输入、点按钮，但点击「=」会提示「无法连接后端服务」，无法得到任何新的计算结果 —— 证明前端不参与计算。

## 部署

### GitHub Pages

1. 仓库 Settings → Pages → Source 选择分支，Folder 选 `/src`。
2. 部署前先把 `app.js` 的 `API_BASE` 改成线上后端地址。

### Vercel / Netlify

1. 导入仓库，Root Directory（输出目录）设为 `src`。
2. 构建命令留空（纯静态，无构建）。

## 代码规范

见 [codestyle.md](./codestyle.md)，遵循 [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)。
