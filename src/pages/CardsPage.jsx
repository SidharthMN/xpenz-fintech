import React, { useState } from "react";
import {
  MdCreditCard, MdAdd, MdMoreHoriz, MdWifi,
  MdLock, MdLockOpen, MdVisibility, MdVisibilityOff,
  MdContactless, MdSecurity,
} from "react-icons/md";
import { SiVisa, SiMastercard } from "react-icons/si";

const CARDS = [
  {
    id: "c1", label: "Primary Card", number: "4532 •••• •••• 8821",
    fullNumber: "4532 1234 5678 8821", expiry: "09/27", cvv: "382",
    holder: "David Mitchell", type: "visa", balance: 8200,
    color: ["#4A17C8", "#7C3AED"], active: true,
  },
  {
    id: "c2", label: "Business Card", number: "5412 •••• •••• 3341",
    fullNumber: "5412 7890 1234 3341", expiry: "03/26", cvv: "741",
    holder: "David Mitchell", type: "mastercard", balance: 3450,
    color: ["#0F172A", "#1E3A5F"], active: true,
  },
  {
    id: "c3", label: "Savings Card", number: "4916 •••• •••• 0092",
    fullNumber: "4916 5555 4444 0092", expiry: "11/28", cvv: "209",
    holder: "David Mitchell", type: "visa", balance: 12750,
    color: ["#065F46", "#059669"], active: false,
  },
];

const RECENT = [
  { icon: "🍕", name: "Swiggy", date: "Today, 12:45 PM", amount: -340, status: "success" },
  { icon: "✈️", name: "MakeMyTrip", date: "Yesterday, 03:20 PM", amount: -4500, status: "success" },
  { icon: "🛍️", name: "Amazon", date: "Jun 15, 10:00 AM", amount: -1299, status: "success" },
  { icon: "⚡", name: "KSEB Bill", date: "Jun 12, 09:15 AM", amount: -850, status: "success" },
  { icon: "💊", name: "Medplus", date: "Jun 10, 05:30 PM", amount: -210, status: "failed" },
];

function VirtualCard({ card, selected, onClick, profile }) {
  const [reveal, setReveal] = useState(false);
  const isSelected = selected === card.id;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 overflow-hidden shadow-lg ${isSelected ? "ring-4 ring-purple-300 scale-[1.02]" : "hover:scale-[1.01]"}`}
      style={{ background: `linear-gradient(135deg, ${card.color[0]}, ${card.color[1]})`, minHeight: 190 }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-8 w-52 h-52 rounded-full bg-white/5" />

      <div className="relative z-10 flex flex-col h-full gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">{card.label}</p>
            <p className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>
              ${card.balance.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${card.active ? "bg-emerald-400/30" : "bg-red-400/30"}`}>
              {card.active ? <MdLockOpen className="text-white text-sm" /> : <MdLock className="text-white text-sm" />}
            </div>
            <MdContactless className="text-white/70 text-xl" />
          </div>
        </div>

        <div>
          <p className="text-white font-mono text-base tracking-widest">{card.number}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Card Holder</p>
            <p className="text-white text-sm font-semibold">{profile?.displayName || card.holder}</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Expires</p>
            <p className="text-white text-sm font-semibold">{card.expiry}</p>
          </div>
          <div className="text-white text-2xl opacity-80">
            {card.type === "visa" ? <SiVisa /> : <SiMastercard />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardsPage({ profile }) {
  const [selected, setSelected] = useState("c1");
  const activeCard = CARDS.find((c) => c.id === selected);

  return (
    <div className="flex gap-6 p-8 h-full overflow-y-auto">
      {/* Left — cards list */}
      <div className="flex flex-col gap-5 w-96 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>Cards</h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage your payment cards</p>
          </div>
          <button className="btn-primary text-sm"><MdAdd /> New Card</button>
        </div>

        <div className="flex flex-col gap-4">
          {CARDS.map((c) => (
            <VirtualCard key={c.id} card={c} profile={profile} selected={selected} onClick={() => setSelected(c.id)} />
          ))}
        </div>
      </div>

      {/* Right — card details */}
      <div className="flex-1 flex flex-col gap-5">
        {/* Card detail panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-slate-800" style={{ fontFamily: "'Syne', sans-serif" }}>
              Card Details
            </h2>
            <button className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
              <MdMoreHoriz className="text-slate-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Card Type", val: activeCard.type.toUpperCase() },
              { label: "Status", val: activeCard.active ? "Active" : "Frozen", color: activeCard.active ? "#10B981" : "#EF4444" },
              { label: "Expiry Date", val: activeCard.expiry },
              { label: "Balance", val: `$${activeCard.balance.toLocaleString()}` },
            ].map(({ label, val, color }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
                <p className="font-bold text-slate-800" style={color ? { color } : {}}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-display font-bold text-slate-800 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: MdLock,       label: "Freeze",   color: "#EF4444", bg: "#FFF1F2" },
              { icon: MdSecurity,   label: "Security", color: "#7C3AED", bg: "#EEF2FF" },
              { icon: MdCreditCard, label: "Limits",   color: "#06B6D4", bg: "#ECFEFF" },
              { icon: MdWifi,       label: "Online",   color: "#10B981", bg: "#ECFDF5" },
            ].map(({ icon: Icon, label, color, bg }) => (
              <button key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:shadow-md transition-all border border-slate-100 hover:border-transparent"
                style={{ background: bg }}>
                <Icon style={{ color }} className="text-2xl" />
                <span className="text-xs font-semibold text-slate-600">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent card transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1">
          <h2 className="font-display font-bold text-slate-800 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Recent Card Activity</h2>
          <div className="divide-y divide-slate-50">
            {RECENT.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">{t.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${t.amount < 0 ? "text-red-500" : "text-emerald-500"}`}>
                    {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount).toLocaleString()}
                  </p>
                  <span className={t.status === "success" ? "badge-success" : "badge-failed"}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}