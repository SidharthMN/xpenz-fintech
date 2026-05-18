import React, { useState } from "react";
import { MdClose, MdAddCircle } from "react-icons/md";
import { ALL_CATEGORIES } from "../api";

export default function AddExpenseModal({ onClose, onAdd, adding }) {
  const [form, setForm] = useState({ amount: "", category: "Food", description: "" });
  const [error, setError] = useState("");

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSubmit() {
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");
    const result = await onAdd({ ...form, amount: parseFloat(form.amount) });
    if (result.success) onClose();
    else setError(result.error ?? "Something went wrong.");
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-slide bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>
            Add New Expense
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <MdClose className="text-slate-500" />
          </button>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="input-field text-lg font-bold"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => update("category", c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                  form.category === c
                    ? "bg-[#4A17C8] text-white border-[#4A17C8]"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Description <span className="font-normal normal-case text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="What was this expense for?"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-semibold mb-4 bg-red-50 px-4 py-2 rounded-lg">
            ⚠ {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={adding}
            className="flex-1 btn-primary justify-center py-3 disabled:opacity-60"
          >
            <MdAddCircle />
            {adding ? "Saving..." : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}
