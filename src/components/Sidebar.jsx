import React from "react";
import {
  MdDashboard, MdSwapHoriz, MdCreditCard,
  MdAccountBalance, MdNotifications, MdSettings,
} from "react-icons/md";
import { RiBarChart2Fill } from "react-icons/ri";

const NAV = [
  { icon: MdDashboard,      label: "DASHBOARD",      id: "dashboard" },
  { icon: MdSwapHoriz,      label: "TRANSACTIONS",   id: "transactions" },
  { icon: MdCreditCard,     label: "CARDS",          id: "cards" },
  { icon: MdAccountBalance, label: "BANK ACCOUNTS",  id: "bank" },
  { icon: MdNotifications,  label: "NOTIFICATIONS",  id: "notifications" },
  { icon: MdSettings,       label: "SETTINGS",       id: "settings" },
];

export default function Sidebar({ active = "dashboard", onNav, onSignOut }) {
  return (
    <aside
      style={{ background: "linear-gradient(175deg, #5B1FD4 0%, #3D0FAE 100%)" }}
      className="w-64 min-h-screen flex flex-col py-8 px-4 shadow-2xl flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-10">
        <div className="bg-white/20 rounded-xl p-2">
          <RiBarChart2Fill className="text-white text-2xl" />
        </div>
        <span
          className="text-white text-xl font-display font-bold tracking-widest uppercase"
          style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "0.12em" }}
        >
          Xpenz
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {NAV.map(({ icon: Icon, label, id }) => (
          <button
            key={id}
            onClick={() => onNav?.(id)}
            className={`nav-item text-left ${active === id ? "active" : ""}`}
          >
            <Icon className="text-lg flex-shrink-0" />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom card */}
      <div className="mt-auto mx-1">
        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <RiBarChart2Fill className="text-white text-sm" />
          </div>
          <p className="text-white text-sm font-semibold mb-1">AWS Cloud</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Serverless · DynamoDB · Free Tier
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="pulse-dot w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span className="text-emerald-300 text-xs font-semibold">Live</span>
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="mt-4 w-full rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-semibold py-3 hover:bg-white/20 transition"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
