import React, { useState, useEffect } from "react";

const API = "/api";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Other"];

const CATEGORY_COLORS = {
  Food: { bg: "#fff3e0", color: "#e65100", emoji: "🍔" },
  Travel: { bg: "#e3f2fd", color: "#1565c0", emoji: "✈️" },
  Shopping: { bg: "#fce4ec", color: "#880e4f", emoji: "🛍️" },
  Bills: { bg: "#f3e5f5", color: "#6a1b9a", emoji: "💡" },
  Health: { bg: "#e8f5e9", color: "#2e7d32", emoji: "💊" },
  Entertainment: { bg: "#fffde7", color: "#f57f17", emoji: "🎬" },
  Other: { bg: "#eceff1", color: "#37474f", emoji: "📦" },
};

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "30px 20px",
  },
  container: { maxWidth: "640px", margin: "0 auto" },
  header: { textAlign: "center", marginBottom: "32px" },
  emoji: { fontSize: "48px" },
  title: { color: "#fff", fontSize: "30px", fontWeight: "800", margin: "8px 0 4px" },
  subtitle: { color: "rgba(255,255,255,0.45)", fontSize: "14px" },

  totalCard: {
    background: "linear-gradient(135deg, #f093fb, #f5576c)",
    borderRadius: "20px",
    padding: "24px 28px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(240,147,251,0.3)",
  },
  totalLabel: { color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600" },
  totalAmount: { color: "#fff", fontSize: "36px", fontWeight: "800" },
  totalCount: { color: "rgba(255,255,255,0.7)", fontSize: "13px" },

  card: {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  formTitle: { color: "#fff", fontSize: "16px", fontWeight: "700", marginBottom: "16px" },
  row: { display: "flex", gap: "10px", marginBottom: "12px" },
  input: {
    flex: 1,
    padding: "13px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    padding: "13px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  addBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #f093fb, #f5576c)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "4px",
  },

  listTitle: { color: "#fff", fontSize: "16px", fontWeight: "700", marginBottom: "14px" },
  expenseItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    borderRadius: "14px",
    marginBottom: "10px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  catBadge: (cat) => ({
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    background: CATEGORY_COLORS[cat]?.bg || "#eee",
    color: CATEGORY_COLORS[cat]?.color || "#333",
    whiteSpace: "nowrap",
  }),
  expTitle: { flex: 1, color: "#fff", fontSize: "14px" },
  amount: { color: "#f5576c", fontWeight: "800", fontSize: "16px" },
  delBtn: {
    background: "rgba(245,87,108,0.15)",
    border: "1px solid rgba(245,87,108,0.3)",
    color: "#f5576c",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "12px",
  },
  empty: { textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "24px", fontSize: "15px" },

  catSummary: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "16px",
  },
  catChip: (cat) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    background: CATEGORY_COLORS[cat]?.bg || "#eee",
    color: CATEGORY_COLORS[cat]?.color || "#333",
  }),
};

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API}/expenses`);
      setExpenses(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const addExpense = async () => {
    if (!title.trim() || !amount || isNaN(amount) || Number(amount) <= 0) return;
    await fetch(`${API}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount: parseFloat(amount), category }),
    });
    setTitle(""); setAmount("");
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await fetch(`${API}/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  };

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  // Category totals
  const catTotals = CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + parseFloat(e.amount), 0)
  })).filter(c => c.total > 0);

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.emoji}>💸</div>
          <h1 style={s.title}>Expense Tracker</h1>
          <p style={s.subtitle}>Dockerized Full-Stack App · React + Node.js + PostgreSQL</p>
        </div>

        {/* Total Card */}
        <div style={s.totalCard}>
          <div>
            <div style={s.totalLabel}>TOTAL SPENT</div>
            <div style={s.totalAmount}>₹{total.toFixed(2)}</div>
            <div style={s.totalCount}>{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</div>
          </div>
          <div style={{ fontSize: "52px" }}>📊</div>
        </div>

        {/* Add Form */}
        <div style={s.card}>
          <div style={s.formTitle}>➕ Add New Expense</div>
          <div style={s.row}>
            <input
              style={s.input}
              placeholder="Expense name (e.g. Lunch)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addExpense()}
            />
          </div>
          <div style={s.row}>
            <input
              style={{ ...s.input, flex: "0 0 140px" }}
              placeholder="Amount (₹)"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addExpense()}
            />
            <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_COLORS[c].emoji} {c}</option>
              ))}
            </select>
          </div>
          <button style={s.addBtn} onClick={addExpense}>Add Expense</button>
        </div>

        {/* Category Summary */}
        {catTotals.length > 0 && (
          <div style={s.card}>
            <div style={s.formTitle}>📂 By Category</div>
            <div style={s.catSummary}>
              {catTotals.map(({ cat, total }) => (
                <span key={cat} style={s.catChip(cat)}>
                  {CATEGORY_COLORS[cat].emoji} {cat}: ₹{total.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expense List */}
        <div style={s.card}>
          <div style={s.listTitle}>🧾 All Expenses</div>
          {loading ? (
            <div style={s.empty}>Loading...</div>
          ) : expenses.length === 0 ? (
            <div style={s.empty}>No expenses yet. Add your first one!</div>
          ) : (
            expenses.map(exp => (
              <div key={exp.id} style={s.expenseItem}>
                <span style={s.catBadge(exp.category)}>
                  {CATEGORY_COLORS[exp.category]?.emoji} {exp.category}
                </span>
                <span style={s.expTitle}>{exp.title}</span>
                <span style={s.amount}>₹{parseFloat(exp.amount).toFixed(2)}</span>
                <button style={s.delBtn} onClick={() => deleteExpense(exp.id)}>✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
