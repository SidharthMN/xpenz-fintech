import React, { useMemo } from "react";
import {
  Chart as ChartJS, ArcElement, Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { aggregateByCategory, CATEGORY_COLORS } from "../api";

ChartJS.register(ArcElement, Tooltip);

const DONUT_OPTIONS = {
  responsive: false,
  cutout: "72%",
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
};

function SingleDonut({ label, total, color, allTotal }) {
  const pct   = allTotal > 0 ? (total / allTotal) * 100 : 0;
  const data  = {
    datasets: [{
      data: [total, Math.max(0, allTotal - total)],
      backgroundColor: [color, "#F1F5F9"],
      borderWidth: 0,
    }],
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <Doughnut data={data} options={DONUT_OPTIONS} width={80} height={80} />
        <span
          className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-700"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {pct.toFixed(0)}%
        </span>
      </div>
      <p className="text-slate-800 text-sm font-display font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
        ${total.toFixed(0)}
      </p>
      <p className="text-slate-400 text-[11px] font-semibold text-center leading-tight">{label}</p>
    </div>
  );
}

export default function DonutCharts({ expenses }) {
  const cats     = useMemo(() => aggregateByCategory(expenses), [expenses]);
  const allTotal = useMemo(() => cats.reduce((s, c) => s + c.total, 0), [cats]);

  // Show top 4 categories, or placeholders
  const display = cats.slice(0, 4);
  while (display.length < 4) {
    display.push({ label: "–", total: 0, color: "#E2E8F0" });
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {display.map((c, i) => (
        <SingleDonut key={i} {...c} allTotal={allTotal || 1} />
      ))}
    </div>
  );
}
