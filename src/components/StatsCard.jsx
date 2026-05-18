import React from "react";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

export default function StatsCard({ title, value, delta, deltaDir = "up", bg = "#EEF2FF" }) {
  const isUp = deltaDir === "up";
  return (
    <div
      className="stat-card flex-1 min-w-0"
      style={{ background: bg }}
    >
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">{title}</p>
      <p
        className="text-3xl font-display font-bold text-slate-800 mb-3"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {value}
      </p>
      <div className={`flex items-center gap-1 text-sm font-semibold ${isUp ? "text-emerald-600" : "text-red-500"}`}>
        {isUp
          ? <MdTrendingUp className="text-base" />
          : <MdTrendingDown className="text-base" />
        }
        <span className={`w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center ${isUp ? "bg-emerald-500" : "bg-red-500"}`}>
          {isUp ? "↑" : "↓"}
        </span>
        <span>{delta}</span>
      </div>
    </div>
  );
}
