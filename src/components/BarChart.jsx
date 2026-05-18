import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MONTHS, aggregateByMonth } from "../api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "rect",
        boxWidth: 10,
        boxHeight: 10,
        padding: 20,
        font: { family: "'Plus Jakarta Sans'", size: 12, weight: "600" },
        color: "#64748B",
      },
    },
    tooltip: {
      backgroundColor: "#1E1B4B",
      titleFont: { family: "'Syne'", size: 13, weight: "700" },
      bodyFont: { family: "'Plus Jakarta Sans'", size: 12 },
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label: (ctx) => ` $${ctx.parsed.y.toFixed(2)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { family: "'Plus Jakarta Sans'", size: 11 }, color: "#94A3B8" },
    },
    y: {
      grid: { color: "#F1F5F9" },
      border: { display: false },
      ticks: {
        font: { family: "'Plus Jakarta Sans'", size: 11 },
        color: "#94A3B8",
        callback: (v) => `$${v}`,
      },
    },
  },
  barPercentage: 0.6,
  categoryPercentage: 0.7,
};

export default function ExpenseBarChart({ expenses }) {
  const currentYear = new Date().getFullYear();
  const prevYear    = currentYear - 1;

  const currentData = useMemo(() => aggregateByMonth(expenses, currentYear), [expenses, currentYear]);
  const prevData    = useMemo(() => aggregateByMonth(expenses, prevYear),    [expenses, prevYear]);

  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: "This Year",
        data: currentData,
        backgroundColor: "#7C3AED",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Last Year",
        data: prevData,
        backgroundColor: "#06B6D4",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  return <Bar data={data} options={OPTIONS} />;
}
