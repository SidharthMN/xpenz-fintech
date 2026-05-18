import React, { useState, useMemo } from "react";
import { MdSearch, MdFilterList, MdDownload } from "react-icons/md";
import { CATEGORY_COLORS } from "../api";

const CATEGORY_ICONS = {
  Food:          "🍕",
  Travel:        "✈️",
  Shopping:      "🛍️",
  Entertainment: "🎬",
  Health:        "💊",
  Utilities:     "⚡",
  Other:         "📦",
};

function formatDate(exp) {
  const ts = exp.timestamp ?? null;
  if (ts) {
    const d = new Date(ts);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
           + "\n" + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  const d = new Date(parseInt(exp.expenseId) || Date.now());
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
       + "\n" + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function TransactionsTable({ expenses, loading }) {
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const categories = useMemo(() => {
    const cats = [...new Set(expenses.map((e) => e.category || "Other"))];
    return ["All", ...cats];
  }, [expenses]);

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => {
        const q = search.toLowerCase();
        return (
          (e.category?.toLowerCase().includes(q) ||
           e.userId?.toLowerCase().includes(q) ||
           e.description?.toLowerCase().includes(q) ||
           String(e.amount).includes(q)) &&
          (filterCat === "All" || e.category === filterCat)
        );
      })
      .sort((a, b) => parseInt(b.expenseId) - parseInt(a.expenseId));
  }, [expenses, search, filterCat]);

  function downloadCSV() {
    const header = "ID,UserID,Category,Amount,Description,Date";
    const rows = filtered.map((e) =>
      `${e.expenseId},${e.userId},${e.category},${e.amount},"${e.description ?? ""}",${e.timestamp ?? ""}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "xpenz_transactions.csv"; a.click();
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="font-display font-bold text-slate-800 text-base" style={{ fontFamily: "'Syne', sans-serif" }}>
          Latest Transactions
        </h2>
        <select
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Search + actions */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            className="input-field pl-9"
            placeholder="Search here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 transition-colors">
          <MdFilterList /> Filters
        </button>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 transition-colors"
        >
          <MdDownload /> Download
        </button>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] px-5 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Name</span>
        <span>Date</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Status</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
              <div className="w-9 h-9 bg-slate-100 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-100 rounded w-28" />
                <div className="h-2.5 bg-slate-50 rounded w-20" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-sm">
            <span className="text-2xl mb-2">🔍</span>
            No transactions found
          </div>
        ) : (
          filtered.map((exp) => {
            const cat   = exp.category || "Other";
            const color = CATEGORY_COLORS[cat] ?? "#64748B";
            const icon  = CATEGORY_ICONS[cat] ?? "📦";
            const lines = formatDate(exp).split("\n");
            return (
              <div
                key={exp.expenseId}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr] items-center px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: color + "20" }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 leading-tight">{cat}</p>
                    <p className="text-xs text-slate-400">{exp.description || exp.userId}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">{lines[0]}</p>
                  <p className="text-xs text-slate-400">{lines[1]}</p>
                </div>
                <p className="text-right text-sm font-bold" style={{ color }}>
                  ${exp.amount.toFixed(1)}
                </p>
                <div className="flex justify-end">
                  <span className="badge-success">Success</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
