import { useState, useEffect, useCallback } from "react";
import { fetchExpenses, addExpense } from "../api";

export function useExpenses() {
  const [expenses, setExpenses]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [adding, setAdding]       = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (payload) => {
    setAdding(true);
    try {
      await addExpense(payload);
      await load(); // refresh list
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setAdding(false);
    }
  }, [load]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome   = totalExpenses * 1.62; // illustrative — replace with real income API if available
  const balance       = totalIncome - totalExpenses;

  return { expenses, loading, error, adding, reload: load, addExpense: add, totalExpenses, totalIncome, balance };
}
