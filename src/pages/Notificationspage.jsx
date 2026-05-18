import React, { useState } from "react";
import {
  MdNotifications, MdCheckCircle, MdWarning, MdInfo,
  MdError, MdDoneAll, MdDeleteSweep, MdFilterList,
} from "react-icons/md";

const NOTIFICATIONS = [
  {
    id: 1, type: "success", title: "Expense Added Successfully",
    body: "Your Food expense of ₹340 was recorded at 12:45 PM today.",
    time: "Just now", read: false, group: "Today",
  },
  {
    id: 2, type: "warning", title: "Monthly Budget Alert",
    body: "You've used 78% of your Food budget for this month. Consider reducing spending.",
    time: "2 hours ago", read: false, group: "Today",
  },
  {
    id: 3, type: "info", title: "DynamoDB Sync Complete",
    body: "All 24 expense records have been successfully synced with AWS DynamoDB.",
    time: "5 hours ago", read: false, group: "Today",
  },
  {
    id: 4, type: "error", title: "Payment Failed",
    body: "Transaction of ₹1,200 to Medplus failed. Please retry or use a different card.",
    time: "8 hours ago", read: true, group: "Today",
  },
  {
    id: 5, type: "info", title: "New Month Started",
    body: "June analytics are now available. Your total spend last month was ₹16,400.",
    time: "Yesterday 9:00 AM", read: true, group: "Yesterday",
  },
  {
    id: 6, type: "success", title: "Card Linked",
    body: "Your HDFC Bank Debit Card ending in 8810 was successfully linked.",
    time: "Yesterday 3:30 PM", read: true, group: "Yesterday",
  },
  {
    id: 7, type: "warning", title: "Unusual Spending Detected",
    body: "A Travel expense of ₹4,500 is 3× higher than your average. Review if correct.",
    time: "Jun 14, 4:15 PM", read: true, group: "Earlier",
  },
  {
    id: 8, type: "info", title: "AWS Lambda Function Updated",
    body: "expenseHandler function was updated to v2.1. All new expenses will use the latest schema.",
    time: "Jun 12, 11:00 AM", read: true, group: "Earlier",
  },
];

const TYPE_CONFIG = {
  success: { icon: MdCheckCircle, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
  warning: { icon: MdWarning,     color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  info:    { icon: MdInfo,        color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  error:   { icon: MdError,       color: "#EF4444", bg: "#FFF1F2", border: "#FECACA" },
};

const FILTERS = ["All", "Unread", "Success", "Warnings", "Errors"];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("All");

  const filtered = notifs.filter((n) => {
    if (filter === "All")      return true;
    if (filter === "Unread")   return !n.read;
    if (filter === "Success")  return n.type === "success";
    if (filter === "Warnings") return n.type === "warning";
    if (filter === "Errors")   return n.type === "error";
    return true;
  });

  const groups = [...new Set(filtered.map((n) => n.group))];
  const unread = notifs.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  }
  function markRead(id) {
    setNotifs((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n));
  }
  function dismiss(id) {
    setNotifs((ns) => ns.filter((n) => n.id !== id));
  }

  return (
    <div className="flex flex-col gap-6 p-8 h-full overflow-y-auto max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>
              Notifications
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {unread > 0 ? `${unread} unread alerts` : "All caught up!"}
            </p>
          </div>
          {unread > 0 && (
            <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 hover:border-purple-400 transition-colors">
            <MdDoneAll /> Mark all read
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? "bg-[#4A17C8] text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:border-purple-400"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="flex flex-col gap-6">
        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center text-slate-400">
            <MdNotifications className="text-5xl mb-3 text-slate-200" />
            <p className="font-semibold">No notifications</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">{group}</p>
              <div className="flex flex-col gap-2">
                {filtered.filter((n) => n.group === group).map((n) => {
                  const cfg = TYPE_CONFIG[n.type];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${!n.read ? "border-l-4" : "border-slate-100"}`}
                      style={!n.read ? { borderLeftColor: cfg.color, borderTopColor: "#F1F5F9", borderRightColor: "#F1F5F9", borderBottomColor: "#F1F5F9" } : {}}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                          <Icon style={{ color: cfg.color }} className="text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-bold ${n.read ? "text-slate-600" : "text-slate-800"}`}>{n.title}</p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-slate-400">{n.time}</span>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-purple-500" />}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.body}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                          className="w-6 h-6 flex-shrink-0 rounded-lg bg-slate-100 hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}