# 前端代码规范（codestyle）

> **规范来源**：本项目 JavaScript 遵循 [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)，HTML/CSS 参考同规范中的对应章节。

## 1. 命名规范

| 对象 | 规范 | 示例 |
|------|------|------|
| 变量 / 函数 | `camelCase` | `loadHistory`、`deleteRecord` |
| 常量 | `UPPER_SNAKE_CASE` | `API_BASE` |
| DOM 元素变量 | 语义后缀 `El` | `expressionEl`、`resultEl` |

## 2. 缩进与行长

- 使用 **2 个空格**缩进。
- 行宽尽量不超过 100 个字符。

## 3. 分号与引号

- 每条语句以**分号**结尾。
- 字符串统一使用**单引号**。

## 4. 变量声明

- 优先使用 `const`，需要重新赋值时用 `let`，**禁止使用 `var`**。
- 比较使用严格相等 `===` / `!==`。

## 5. 函数

- 每个函数职责单一，命名用「动词 + 名词」。
- 异步请求统一使用 `async/await` 并配合 `try/catch` 处理网络错误。

## 6. 注释

- 关键逻辑、魔法值（如后端地址、替换规则）写注释说明「为什么」。
- 中文注释，与代码保持一致缩进。

## 7. 架构红线

- **禁止**在前端执行任何计算逻辑（计算结果必须来自后端）。
- 前端只负责：收集输入、发请求、渲染后端返回的数据、展示错误信息。

## 8. HTML / CSS

- HTML 语义化标签，属性值用双引号。
- CSS 使用自定义属性（CSS Variables）管理主题色，选择器命名清晰。
