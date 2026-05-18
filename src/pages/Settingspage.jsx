import React, { useState, useEffect } from "react";
import {
  MdPerson, MdSecurity, MdNotifications, MdCloud,
  MdPalette, MdLanguage, MdSave, MdEdit, MdCheckCircle,
  MdVisibility, MdVisibilityOff, MdRefresh,
} from "react-icons/md";

const TABS = [
  { id: "profile",  label: "Profile",       icon: MdPerson },
  { id: "security", label: "Security",      icon: MdSecurity },
  { id: "notif",    label: "Notifications", icon: MdNotifications },
  { id: "appear",   label: "Appearance",    icon: MdPalette },
];

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors ${on ? "bg-purple-600" : "bg-slate-200"}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? "left-7" : "left-1"}`} />
    </button>
  );
}

function Field({ label, value, type = "text", onChange, hint, readOnly = false }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={isPass && !show ? "password" : "text"}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className="input-field pr-10"
        />
        {isPass && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShow((s) => !s)}>
            {show ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-display font-bold text-slate-800 mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, on, onToggle }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

export default function SettingsPage({ user, profile, onProfileSave, onPasswordChange }) {
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [toggles, setToggles] = useState({
    emailNotif: true, pushNotif: false, budgetAlert: true,
    twoFA: false, sessionLog: true,
    darkMode: false, compactView: false,
  });
  const [form, setForm] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    displayName: profile?.displayName || "",
    email: profile?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        displayName: profile.displayName || "",
        email: profile.email || "",
      }));
    }
  }, [profile]);

  function toggle(key) {
    setToggles((t) => ({ ...t, [key]: !t[key] }));
  }

  async function save() {
    setError("");
    try {
      if (tab === "profile") {
        await onProfileSave({ firstName: form.firstName, lastName: form.lastName });
      } else if (tab === "security") {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
          throw new Error("Fill all password fields to update your password.");
        }
        if (form.newPassword !== form.confirmPassword) {
          throw new Error("New password and confirmation do not match.");
        }
        await onPasswordChange({ currentPassword: form.currentPassword, newPassword: form.newPassword });
        setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Unable to save changes.");
    }
  }

  return (
    <div className="flex gap-6 p-8 h-full overflow-y-auto">
      {/* Sidebar tabs */}
      <div className="w-52 flex-shrink-0">
        <h1 className="font-display font-bold text-2xl text-slate-800 mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>Settings</h1>
        <nav className="flex flex-col gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${tab === id ? "bg-[#4A17C8] text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}>
              <Icon className="text-lg flex-shrink-0" />{label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-5 max-w-2xl">

        {tab === "profile" && (
          <>
            <Section title="Personal Information">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {form.firstName?.[0] || "U"}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{form.displayName || "Your name"}</p>
                  <p className="text-sm text-slate-400">{user?.uid ? user.uid.slice(0, 8) : "No user"} · Free Tier</p>
                  <button className="text-xs text-purple-600 font-semibold flex items-center gap-1 mt-1 hover:underline"><MdEdit className="text-xs" /> Change Photo</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
                <Field label="Last Name" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
              </div>
              <Field label="Email Address" value={form.email} readOnly hint="Email is managed by Firebase Auth" />
              <Field label="User ID" value={user?.uid || "—"} readOnly hint="Your Firebase user identifier" />
            </Section>
            <Section title="Currency & Region">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Currency</label>
                  <select className="input-field"><option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option></select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Timezone</label>
                  <select className="input-field"><option>Asia/Kolkata (IST)</option><option>UTC</option></select>
                </div>
              </div>
            </Section>
          </>
        )}

        {tab === "security" && (
          <>
            <Section title="Change Password">
              <Field
                label="Current Password"
                value={form.currentPassword}
                type="password"
                onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
              />
              <Field
                label="New Password"
                value={form.newPassword}
                type="password"
                onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                hint="Minimum 8 characters"
              />
              <Field
                label="Confirm Password"
                value={form.confirmPassword}
                type="password"
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              />
            </Section>
            <Section title="Security Options">
              <ToggleRow label="Two-Factor Authentication" desc="Add extra login security via SMS or app" on={toggles.twoFA} onToggle={() => toggle("twoFA")} />
              <ToggleRow label="Session Activity Log" desc="Track all login sessions and devices" on={toggles.sessionLog} onToggle={() => toggle("sessionLog")} />
            </Section>
          </>
        )}

        {tab === "notif" && (
          <Section title="Notification Preferences">
            <ToggleRow label="Email Notifications" desc="Receive expense summaries and alerts by email" on={toggles.emailNotif} onToggle={() => toggle("emailNotif")} />
            <ToggleRow label="Push Notifications" desc="Browser push alerts for transactions" on={toggles.pushNotif} onToggle={() => toggle("pushNotif")} />
            <ToggleRow label="Budget Alert Warnings" desc="Alert when you exceed 80% of any budget" on={toggles.budgetAlert} onToggle={() => toggle("budgetAlert")} />
          </Section>
        )}

        {tab === "aws" && (
          <>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <MdCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-700">AWS Backend Connected</p>
                <p className="text-xs text-emerald-600">ap-south-1 · DynamoDB Free Tier · Lambda active</p>
              </div>
            </div>
            <Section title="API Gateway">
              <Field label="Base URL" value="https://o3sqoe6ba1.execute-api.ap-south-1.amazonaws.com/prod" hint="Your AWS API Gateway endpoint" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="POST Route" value="/add-expense" />
                <Field label="GET Route"  value="/get-expenses" />
              </div>
            </Section>
            <Section title="DynamoDB">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Table Name"      value="expenses" />
                <Field label="Region"          value="ap-south-1" />
                <Field label="Partition Key"   value="userId" />
                <Field label="Sort Key"        value="expenseId" />
              </div>
            </Section>
            <Section title="Lambda Functions">
              {[
                { name: "expenseHandler", route: "POST /add-expense", runtime: "Node.js 22.x" },
                { name: "getExpenses",    route: "GET /get-expenses",  runtime: "Node.js 22.x" },
              ].map((fn) => (
                <div key={fn.name} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 text-sm font-bold">λ</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{fn.name}</p>
                      <p className="text-xs text-slate-400">{fn.route} · {fn.runtime}</p>
                    </div>
                  </div>
                  <span className="badge-success">Active</span>
                </div>
              ))}
            </Section>
          </>
        )}

        {tab === "appear" && (
          <Section title="Display Preferences">
            <ToggleRow label="Dark Mode" desc="Switch to dark theme (coming soon)" on={toggles.darkMode} onToggle={() => toggle("darkMode")} />
            <ToggleRow label="Compact View" desc="Reduce spacing for denser information display" on={toggles.compactView} onToggle={() => toggle("compactView")} />
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Accent Color</label>
              <div className="flex gap-3">
                {["#4A17C8","#0F766E","#B45309","#BE185D","#1D4ED8"].map((c) => (
                  <button key={c} className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform" style={{ background: c }} />
                ))}
              </div>
            </div>
          </Section>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button onClick={save} className={`btn-primary px-8 transition-all ${saved ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}>
            {saved ? <><MdCheckCircle /> Saved!</> : <><MdSave /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}