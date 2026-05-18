import React, { useState, useMemo } from "react";
import {
  MdSearch, MdFilterList, MdDownload, MdDelete,
  MdCheckBox, MdCheckBoxOutlineBlank, MdSwapVert,
  MdAdd, MdCalendarMonth, MdTrendingUp, MdTrendingDown,
} from "react-icons/md";
import { CATEGORY_COLORS } from "../api";

const CATEGORY_ICONS = {
  Food: "🍕", Travel: "✈️", Shopping: "🛍️",
  Entertainment: "🎬", Health: "💊", Utilities: "⚡", Other: "📦",
};

function formatDate(exp) {
  const d = new Date(exp.timestamp ?? parseInt(exp.expenseId) ?? Date.now());
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

const PAGE_SIZE = 10;

export default function TransactionsPage({ expenses, loading, onAdd }) {
  const [search, setSearch]       = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [sortDir, setSortDir]     = useState("desc");
  const [selected, setSelected]   = useState(new Set());
  const [page, setPage]           = useState(1);

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
           e.description?.toLowerCase().includes(q) ||
           String(e.amount).includes(q)) &&
          (filterCat === "All" || e.category === filterCat)
        );
      })
      .sort((a, b) => {
        const diff = parseInt(b.expenseId) - parseInt(a.expenseId);
        return sortDir === "desc" ? diff : -diff;
      });
  }, [expenses, search, filterCat, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  function toggleSelect(id) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleAll() {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map((e) => e.expenseId)));
  }

  function downloadCSV() {
    const rows = filtered.map((e) => `${e.expenseId},${e.userId},${e.category},${e.amount},"${e.description ?? ""}"`);
    const blob = new Blob([["ID,UserID,Category,Amount,Description", ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "xpenz_transactions.csv"; a.click();
  }

  return (
    <div className="flex flex-col gap-6 p-8 h-full overflow-y-auto">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>
            Transactions
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">All your expense records in one place</p>
        </div>
        <button onClick={onAdd} className="btn-primary">
          <MdAdd /> Add Expense
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Records", val: expenses.length, icon: MdCalendarMonth, color: "#7C3AED", bg: "#EEF2FF" },
          { label: "Filtered Total", val: `$${totalFiltered.toFixed(2)}`, icon: MdTrendingDown, color: "#EF4444", bg: "#FFF1F2" },
          { label: "Avg per Entry", val: expenses.length ? `$${(expenses.reduce((s,e)=>s+e.amount,0)/expenses.length).toFixed(2)}` : "—", icon: MdSwapVert, color: "#06B6D4", bg: "#ECFEFF" },
          { label: "Categories", val: categories.length - 1, icon: MdFilterList, color: "#10B981", bg: "#ECFDF5" },
        ].map(({ label, val, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon style={{ color }} className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
              <p className="font-display font-bold text-slate-800 text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>{val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col flex-1">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input-field pl-9" placeholder="Search transactions..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="input-field w-36" value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button onClick={() => setSortDir((d) => d === "desc" ? "asc" : "desc")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 hover:border-purple-400 transition-colors">
            <MdSwapVert /> {sortDir === "desc" ? "Newest" : "Oldest"}
          </button>
          {selected.size > 0 && (
            <button className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 hover:bg-red-100 transition-colors">
              <MdDelete /> Delete ({selected.size})
            </button>
          )}
          <button onClick={downloadCSV} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 hover:border-purple-400 transition-colors ml-auto">
            <MdDownload /> Export CSV
          </button>
        </div>

        {/* Table head */}
        <div className="grid grid-cols-[40px_2fr_1.5fr_1.2fr_1fr_1fr] items-center px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
          <button onClick={toggleAll}>
            {selected.size === paged.length && paged.length > 0
              ? <MdCheckBox className="text-purple-600 text-lg" />
              : <MdCheckBoxOutlineBlank className="text-slate-300 text-lg" />}
          </button>
          <span>Category / Description</span>
          <span>Date & Time</span>
          <span>User ID</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Status</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50 flex-1 overflow-y-auto">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-[40px_2fr_1.5fr_1.2fr_1fr_1fr] items-center px-5 py-4 animate-pulse">
                <div className="w-4 h-4 bg-slate-100 rounded" />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-full" />
                  <div className="space-y-1.5"><div className="h-3 bg-slate-100 rounded w-24" /><div className="h-2 bg-slate-50 rounded w-16" /></div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-24" />
                <div className="h-3 bg-slate-100 rounded w-16" />
                <div className="h-3 bg-slate-100 rounded w-12 ml-auto" />
                <div className="h-5 bg-slate-100 rounded-full w-16 ml-auto" />
              </div>
            ))
          ) : paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <span className="text-4xl mb-3">🔍</span>
              <p className="font-semibold">No matching transactions</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            paged.map((exp) => {
              const cat   = exp.category || "Other";
              const color = CATEGORY_COLORS[cat] ?? "#64748B";
              const icon  = CATEGORY_ICONS[cat] ?? "📦";
              const { date, time } = formatDate(exp);
              const isSelected = selected.has(exp.expenseId);
              return (
                <div key={exp.expenseId}
                  className={`grid grid-cols-[40px_2fr_1.5fr_1.2fr_1fr_1fr] items-center px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? "bg-purple-50" : ""}`}
                  onClick={() => toggleSelect(exp.expenseId)}
                >
                  <div onClick={(e) => { e.stopPropagation(); toggleSelect(exp.expenseId); }}>
                    {isSelected
                      ? <MdCheckBox className="text-purple-600 text-lg" />
                      : <MdCheckBoxOutlineBlank className="text-slate-300 text-lg" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: color + "20" }}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{cat}</p>
                      <p className="text-xs text-slate-400">{exp.description || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">{date}</p>
                    <p className="text-xs text-slate-400">{time}</p>
                  </div>
                  <p className="text-sm text-slate-500 font-mono">{exp.userId}</p>
                  <p className="text-right font-bold text-sm" style={{ color }}>${exp.amount.toFixed(2)}</p>
                  <div className="flex justify-end"><span className="badge-success">Success</span></div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-semibold">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${p === page ? "bg-[#4A17C8] text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}