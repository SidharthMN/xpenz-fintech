import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import ExpenseBarChart from "./components/BarChart";
import DonutCharts from "./components/DonutCharts";
import TransactionsPage from "./pages/TransactionsPage";
import CardsPage from "./pages/CardsPage";
import BankAccountsPage from "./pages/Bankaccountspage";
import NotificationsPage from "./pages/Notificationspage";
import SettingsPage from "./pages/Settingspage";
import LoginPage from "./pages/LoginPage";
import TransactionsTable from "./components/TransactionsTable";
import AddExpenseModal from "./components/AddExpenseModal";
import { useExpenses } from "./hooks/useExpenses";
import { MdAdd, MdRefresh, MdSearch, MdNotifications } from "react-icons/md";
import {
  observeUser,
  signInUser,
  signUpUser,
  signOutUser,
  getUserProfile,
  saveUserProfile,
  updateUserDisplayName,
  updateUserPassword,
} from "./firebase";

function fmt(n) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function App() {
  const { expenses, loading, error, adding, reload, addExpense, totalExpenses, totalIncome, balance } = useExpenses();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [chartRange, setChartRange] = useState("Year");

  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = observeUser(async (user) => {
      if (user) {
        setAuthUser(user);
        const userProfile = await getUserProfile(user.uid).catch(() => null);
        setProfile(userProfile || {
          displayName: user.displayName || "",
          email: user.email || "",
        });
      } else {
        setAuthUser(null);
        setProfile(null);
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async ({ email, password }) => {
    setAuthBusy(true);
    setAuthError("");
    try {
      await signInUser({ email, password });
    } catch (err) {
      setAuthError(err.message || "Unable to sign in.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignUp = async ({ firstName, lastName, email, password }) => {
    setAuthBusy(true);
    setAuthError("");
    try {
      await signUpUser({ firstName, lastName, email, password });
    } catch (err) {
      setAuthError(err.message || "Unable to create your account.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setActiveNav("dashboard");
  };

  const handleProfileSave = async ({ firstName, lastName }) => {
    if (!authUser) return;
    const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
    await updateUserDisplayName(authUser, displayName);
    await saveUserProfile(authUser.uid, { firstName, lastName, displayName });
    setProfile((prev) => ({ ...prev, firstName, lastName, displayName }));
  };

  const handlePasswordChange = async ({ currentPassword, newPassword }) => {
    if (!authUser) throw new Error("No authenticated user.");
    await signInUser({ email: authUser.email, password: currentPassword });
    await updateUserPassword(authUser, newPassword);
  };

  const renderPage = () => {
    switch (activeNav) {
      case "transactions":
        return <TransactionsPage expenses={expenses} loading={loading} onAdd={() => setModalOpen(true)} />;
      case "cards":
        return <CardsPage profile={profile} />;
      case "bank":
        return <BankAccountsPage />;
      case "notifications":
        return <NotificationsPage />;
      case "settings":
        return (
          <SettingsPage
            user={authUser}
            profile={profile}
            onProfileSave={handleProfileSave}
            onPasswordChange={handlePasswordChange}
          />
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2FA] text-slate-600">
        Loading authentication...
      </div>
    );
  }

  if (!authUser) {
    return <LoginPage onSignIn={handleSignIn} onSignUp={handleSignUp} loading={authBusy} error={authError} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F0F2FA]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar active={activeNav} onNav={setActiveNav} onSignOut={handleSignOut} />

      {/* Main */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeNav !== "dashboard" ? (
          renderPage()
        ) : (
          <>
            {/* Top bar */}
            <header className="flex items-center justify-between px-8 pt-7 pb-2">
              <div>
                <h1 className="font-display font-bold text-2xl text-slate-800 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Cloud Expense<br />Tracker
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Welcome back, {profile?.displayName || authUser?.email?.split("@")[0] || "User"}.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-primary"
                >
                  <MdAdd className="text-lg" />
                  Add Expense
                </button>
                <button
                  onClick={reload}
                  className={`w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:text-purple-700 transition-all ${loading ? "animate-spin" : ""}`}
                >
                  <MdRefresh />
                </button>
                <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:text-purple-700 transition-colors">
                  <MdSearch />
                </button>
                <button className="relative w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:text-purple-700 transition-colors">
                  <MdNotifications />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </header>

        {/* Error banner */}
        {error && (
          <div className="mx-8 mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-semibold flex items-center justify-between">
            <span>⚠ API Error: {error}</span>
            <button onClick={reload} className="text-red-500 hover:text-red-700 underline text-xs">Retry</button>
          </div>
        )}

        <div className="flex flex-1 gap-5 px-8 py-5 overflow-hidden">
          {/* Left column */}
          <div className="flex-1 flex flex-col gap-5 min-w-0 overflow-y-auto pr-1">
            {/* Stat cards */}
            <div className="flex gap-4">
              <StatsCard
                title="Current Balance"
                value={loading ? "—" : fmt(balance)}
                delta="vs last month"
                deltaDir="up"
                bg="#EEF2FF"
              />
              <StatsCard
                title="Total Income"
                value={loading ? "—" : fmt(totalIncome)}
                delta="7.9%"
                deltaDir="up"
                bg="#F5F3FF"
              />
              <StatsCard
                title="Total Expenses"
                value={loading ? "—" : fmt(totalExpenses)}
                delta="32%"
                deltaDir="down"
                bg="#FFF1F2"
              />
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Monthly Expenses
                </h2>
                <select
                  className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
                  value={chartRange}
                  onChange={(e) => setChartRange(e.target.value)}
                >
                  <option>Year</option>
                  <option>6 Months</option>
                  <option>Quarter</option>
                </select>
              </div>
              <div className="h-52">
                <ExpenseBarChart expenses={expenses} />
              </div>
            </div>

            {/* Donut charts */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Spend by Category
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  {expenses.length} expenses
                </span>
              </div>
              {loading ? (
                <div className="flex gap-8 justify-center">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                      <div className="w-20 h-20 rounded-full bg-slate-100" />
                      <div className="h-3 w-12 bg-slate-100 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <DonutCharts expenses={expenses} />
              )}
            </div>
          </div>

          {/* Right column — transactions */}
          <div className="w-80 flex-shrink-0 flex flex-col">
            <TransactionsTable expenses={expenses} loading={loading} />
          </div>
        </div>
          </>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <AddExpenseModal
          onClose={() => setModalOpen(false)}
          onAdd={addExpense}
          adding={adding}
        />
      )}
    </div>
  );
}
