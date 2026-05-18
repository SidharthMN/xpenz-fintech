const BASE_URL = "https://o3sqoe6ba1.execute-api.ap-south-1.amazonaws.com/prod";

export const DEFAULT_USER = "user1";

/**
 * Fetch all expenses from DynamoDB via Lambda
 */
export async function fetchExpenses() {
  const res = await fetch(`${BASE_URL}/get-expenses`);
  if (!res.ok) throw new Error(`GET /get-expenses failed: ${res.status}`);
  const data = await res.json();
  // Normalise amount to number
  return data.map((e) => ({
    ...e,
    amount: parseFloat(e.amount) || 0,
    expenseId: e.expenseId?.toString() ?? String(Date.now()),
  }));
}

/**
 * Add a new expense to DynamoDB via Lambda
 * @param {{ amount: number, category: string, description?: string }} payload
 */
export async function addExpense({ amount, category, description = "" }) {
  const body = {
    userId: DEFAULT_USER,
    amount: parseFloat(amount),
    category,
    description,
    timestamp: new Date().toISOString(),
  };
  const res = await fetch(`${BASE_URL}/add-expense`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST /add-expense failed: ${res.status}`);
  return res.json();
}

/** Category colour map */
export const CATEGORY_COLORS = {
  Food:          "#7C3AED",
  Travel:        "#06B6D4",
  Shopping:      "#10B981",
  Entertainment: "#F59E0B",
  Health:        "#EF4444",
  Utilities:     "#8B5CF6",
  Other:         "#64748B",
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS);

/** Month names */
export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/**
 * Aggregate expenses by month for a given year.
 * Returns an array of 12 totals indexed 0–11.
 */
export function aggregateByMonth(expenses, year = new Date().getFullYear()) {
  const totals = new Array(12).fill(0);
  expenses.forEach((e) => {
    const d = new Date(e.timestamp ?? parseInt(e.expenseId));
    if (d.getFullYear() === year) totals[d.getMonth()] += e.amount;
  });
  return totals;
}

/**
 * Aggregate expenses by category.
 * Returns { label: string, total: number, color: string }[]
 */
export function aggregateByCategory(expenses) {
  const map = {};
  expenses.forEach((e) => {
    const cat = e.category || "Other";
    map[cat] = (map[cat] || 0) + e.amount;
  });
  return Object.entries(map).map(([label, total]) => ({
    label,
    total,
    color: CATEGORY_COLORS[label] ?? "#64748B",
  }));
}
