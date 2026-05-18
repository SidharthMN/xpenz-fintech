import React, { useState } from "react";
import {
  MdAccountBalance, MdAdd, MdArrowUpward, MdArrowDownward,
  MdSync, MdVerified, MdMoreHoriz, MdTrendingUp,
} from "react-icons/md";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Tooltip);

const ACCOUNTS = [
  {
    id: "a1", bank: "State Bank of India", type: "Savings Account",
    number: "•••• •••• 4521", balance: 45800, currency: "INR",
    color: "#1E3A5F", icon: "🏦", verified: true,
    income: 62000, expense: 16200, change: +8.4,
  },
  {
    id: "a2", bank: "HDFC Bank", type: "Current Account",
    number: "•••• •••• 8810", balance: 128500, currency: "INR",
    color: "#7C1D2B", icon: "🏛️", verified: true,
    income: 215000, expense: 86500, change: +14.2,
  },
  {
    id: "a3", bank: "ICICI Bank", type: "Savings Account",
    number: "•••• •••• 3307", balance: 22150, currency: "INR",
    color: "#374151", icon: "🏢", verified: false,
    income: 30000, expense: 7850, change: -2.1,
  },
];

const TRANSFERS = [
  { from: "SBI", to: "HDFC", amount: 15000, date: "Today 10:30 AM", status: "success" },
  { from: "HDFC", to: "Wallet", amount: 3000, date: "Yesterday 2:15 PM", status: "success" },
  { from: "ICICI", to: "SBI", amount: 8000, date: "Jun 14, 11:00 AM", status: "pending" },
  { from: "SBI", to: "External", amount: 22000, date: "Jun 12, 4:45 PM", status: "success" },
];

function MiniDonut({ income, expense }) {
  const total = income + expense;
  return (
    <Doughnut
      data={{
        datasets: [{
          data: [income, expense],
          backgroundColor: ["#10B981", "#EF4444"],
          borderWidth: 0,
        }],
      }}
      options={{ responsive: false, cutout: "70%", plugins: { legend: { display: false }, tooltip: { enabled: false } } }}
      width={60} height={60}
    />
  );
}

export default function BankAccountsPage() {
  const [selected, setSelected] = useState("a1");
  const active = ACCOUNTS.find((a) => a.id === selected);
  const totalBalance = ACCOUNTS.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="flex flex-col gap-6 p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>Bank Accounts</h1>
          <p className="text-slate-400 text-sm mt-0.5">Monitor all linked accounts</p>
        </div>
        <button className="btn-primary"><MdAdd /> Link Account</button>
      </div>

      {/* Total balance banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4A17C8, #7C3AED)" }}
      >
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">Total Net Worth</p>
        <p className="text-4xl font-display font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
          ₹{totalBalance.toLocaleString()}
        </p>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <MdTrendingUp /> +6.8% this month
          </span>
          <span className="text-white/50 text-xs">{ACCOUNTS.length} accounts linked</span>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Account cards */}
        <div className="flex flex-col gap-3 w-72 flex-shrink-0">
          {ACCOUNTS.map((acc) => (
            <div
              key={acc.id}
              onClick={() => setSelected(acc.id)}
              className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${selected === acc.id ? "border-purple-400 shadow-md ring-2 ring-purple-200" : "border-slate-100"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{acc.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{acc.bank}</p>
                    <p className="text-xs text-slate-400">{acc.type}</p>
                  </div>
                </div>
                {acc.verified && <MdVerified className="text-blue-500" />}
              </div>
              <p className="text-xs text-slate-400 mb-1">{acc.number}</p>
              <p className="font-display font-bold text-slate-800 text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
                ₹{acc.balance.toLocaleString()}
              </p>
              <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${acc.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {acc.change >= 0 ? <MdArrowUpward /> : <MdArrowDownward />}
                {Math.abs(acc.change)}% this month
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Income vs expense */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>
                {active.bank} — Overview
              </h2>
              <button className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <MdSync className="text-slate-500" />
              </button>
            </div>
            <div className="flex items-center gap-8">
              <MiniDonut income={active.income} expense={active.expense} />
              <div className="flex-1 grid grid-cols-2 gap-4">
                {[
                  { label: "Total Income", val: `₹${active.income.toLocaleString()}`, color: "#10B981", icon: MdArrowDownward },
                  { label: "Total Expense", val: `₹${active.expense.toLocaleString()}`, color: "#EF4444", icon: MdArrowUpward },
                  { label: "Net Balance", val: `₹${active.balance.toLocaleString()}`, color: "#7C3AED", icon: MdAccountBalance },
                  { label: "Monthly Change", val: `${active.change > 0 ? "+" : ""}${active.change}%`, color: active.change >= 0 ? "#10B981" : "#EF4444", icon: MdTrendingUp },
                ].map(({ label, val, color, icon: Icon }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon style={{ color }} className="text-sm" />
                      <p className="text-xs text-slate-400 font-semibold">{label}</p>
                    </div>
                    <p className="font-bold text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transfer history */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex-1">
            <h2 className="font-display font-bold text-slate-800 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Transfer History
            </h2>
            <div className="divide-y divide-slate-50">
              {TRANSFERS.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <MdSync className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{t.from} → {t.to}</p>
                      <p className="text-xs text-slate-400">{t.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-sm">₹{t.amount.toLocaleString()}</p>
                    <span className={t.status === "success" ? "badge-success" : "badge-pending"}>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}