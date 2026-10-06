// 前端脚本：负责界面交互、发送计算请求、展示后端返回的结果与历史。
// 核心计算完全由后端完成，前端只做展示与请求，绝不自己计算结果。

// ---------------------------------------------------------------------------
// 后端服务地址（部署后请改成实际的后端 URL，例如：
//   const API_BASE = "https://your-backend.onrender.com";
// 本地开发默认指向 127.0.0.1:8000）
// ---------------------------------------------------------------------------
const API_BASE = "https://eight32401311-calculator-backend.onrender.com";

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const historyListEl = document.getElementById("history-list");
const historyEmptyEl = document.getElementById("history-empty");
const clearAllBtn = document.getElementById("clear-all");

// 当前输入的表达式（内部用 * 和 / 表示乘除）。
let expression = "";
// 上一次成功计算的结果（用于连续运算）。
let lastResult = "";
// 刚算完：下一次输入数字时开启新表达式。
let justCalculated = false;

// ---------------------------------------------------------------------------
// 显示辅助
// ---------------------------------------------------------------------------
function displayExpression() {
  const shown = expression.replace(/\*/g, "×").replace(/\//g, "÷");
  expressionEl.textContent = shown || "\u00A0";
}

function setResult(text, isError = false) {
  resultEl.textContent = text;
  resultEl.classList.toggle("error", isError);
}

// ---------------------------------------------------------------------------
// 输入处理
// ---------------------------------------------------------------------------
function isNumberStart(value) {
  return /[0-9.]/.test(value);
}

function pressValue(value) {
  if (justCalculated) {
    // 算完后输入数字/括号 -> 开启新表达式；输入运算符 -> 基于结果继续运算。
    if (isNumberStart(value) || value === "(") {
      expression = "";
    } else {
      expression = lastResult;
    }
    justCalculated = false;
  }
  expression += value;
  displayExpression();
}

function backspace() {
  expression = expression.slice(0, -1);
  justCalculated = false;
  displayExpression();
}

function clearExpression() {
  expression = "";
  lastResult = "";
  justCalculated = false;
  displayExpression();
  setResult("0");
}

// ---------------------------------------------------------------------------
// 与后端交互
// ---------------------------------------------------------------------------
async function calculate() {
  const expr = expression.trim();
  if (!expr) {
    setResult("请输入表达式", true);
    return;
  }
  setResult("计算中…");
  try {
    const res = await fetch(`${API_BASE}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression: expr }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      lastResult = String(data.result);
      justCalculated = true;
      setResult(lastResult);
      await loadHistory();
    } else {
      setResult(data.message || "计算出错", true);
    }
  } catch (err) {
    // 后端不可用：前端无法独立得到计算结果。
    setResult("无法连接后端服务", true);
  }
}

async function loadHistory() {
  try {
    const res = await fetch(`${API_BASE}/api/history`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      renderHistory([]);
      return;
    }
    renderHistory(data.history || []);
  } catch (err) {
    renderHistory([]);
  }
}

function renderHistory(records) {
  historyListEl.innerHTML = "";
  if (!records.length) {
    historyEmptyEl.style.display = "block";
    historyListEl.style.display = "none";
    return;
  }
  historyEmptyEl.style.display = "none";
  historyListEl.style.display = "flex";
  // 后端已按 id 倒序返回（最新在前）。
  for (const rec of records) {
    const li = document.createElement("li");
    li.className = "history-item";

    const expr = document.createElement("span");
    expr.className = "h-expr";
    expr.textContent = rec.expression.replace(/\*/g, "×").replace(/\//g, "÷");

    const res = document.createElement("span");
    res.className = "h-result";
    res.textContent = "= " + rec.result;

    const time = document.createElement("span");
    time.className = "h-time";
    time.textContent = rec.created_at;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "删除";
    del.addEventListener("click", () => deleteRecord(rec.id, li));

    li.append(expr, res, time, del);
    historyListEl.appendChild(li);
  }
}

async function deleteRecord(id, li) {
  try {
    const res = await fetch(`${API_BASE}/api/history/${id}`, { method: "DELETE" });
    if (res.ok) {
      li.remove();
      if (!historyListEl.children.length) {
        historyEmptyEl.style.display = "block";
        historyListEl.style.display = "none";
      }
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "删除失败");
    }
  } catch (err) {
    alert("无法连接后端服务");
  }
}

async function clearAll() {
  if (!confirm("确定清空所有历史记录吗？")) return;
  try {
    const res = await fetch(`${API_BASE}/api/history`, { method: "DELETE" });
    if (res.ok) {
      await loadHistory();
    } else {
      alert("清空失败");
    }
  } catch (err) {
    alert("无法连接后端服务");
  }
}

// ---------------------------------------------------------------------------
// 事件绑定
// ---------------------------------------------------------------------------
document.querySelector(".buttons").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const value = btn.dataset.value;
  if (action === "value") {
    pressValue(value);
  } else if (action === "backspace") {
    backspace();
  } else if (action === "clear") {
    clearExpression();
  } else if (action === "equals") {
    calculate();
  }
});

clearAllBtn.addEventListener("click", clearAll);

// 键盘快捷键（加分项）。
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (/^[0-9.]$/.test(key) || ["+", "-", "*", "/", "(", ")"].includes(key)) {
    pressValue(key);
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    e.preventDefault();
    backspace();
  } else if (key === "Escape") {
    clearExpression();
  }
});

// 初始加载历史。
loadHistory();
displayExpression();
