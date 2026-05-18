import React, { useState } from "react";
import { MdEmail, MdKey, MdPerson, MdLockOpen, MdPersonAdd } from "react-icons/md";

export default function LoginPage({ onSignIn, onSignUp, loading, error }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [localError, setLocalError] = useState("");

  function resetForm() {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setLocalError("");
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    resetForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError("");

    if (mode === "signup") {
      if (!firstName || !lastName) {
        setLocalError("Please enter both first and last name.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
      await onSignUp({ firstName, lastName, email, password });
      return;
    }

    await onSignIn({ email, password });
  }

  return (
    <div className="min-h-screen bg-[#F0F2FA] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#4A17C8] to-[#6E3CFF] p-12 text-white shadow-2xl flex flex-col justify-between">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] font-semibold mb-6">
              Expense tracker
            </span>
            <h1 className="text-4xl font-bold leading-tight mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>
              Secure sign in to your Xpenz dashboard.
            </h1>
            <p className="text-slate-200/90 leading-relaxed max-w-lg">
              Use your account to access spending insights, manage cards, and update your profile. New users can create an account in seconds.
            </p>
          </div>
          <div className="mt-8 space-y-4 text-sm text-slate-100">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-white/80" />
              <p>Realtime authentication with Firebase Auth.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-white/80" />
              <p>Profile storage in Firestore for user settings.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-white/80" />
              <p>Secure password updates in the security tab.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white shadow-2xl p-10">
          <div className="flex items-center justify-between mb-8 gap-4">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition ${mode === "signin" ? "bg-[#4A17C8] text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <MdLockOpen className="inline mr-2" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition ${mode === "signup" ? "bg-[#4A17C8] text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <MdPersonAdd className="inline mr-2" /> Create Account
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase text-slate-500 mb-2 inline-block">First Name</span>
                  <div className="input-field flex items-center gap-2">
                    <MdPerson className="text-slate-400" />
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase text-slate-500 mb-2 inline-block">Last Name</span>
                  <div className="input-field flex items-center gap-2">
                    <MdPerson className="text-slate-400" />
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </label>
              </div>
            )}

            <label className="block">
              <span className="text-xs font-semibold uppercase text-slate-500 mb-2 inline-block">Email</span>
              <div className="input-field flex items-center gap-2">
                <MdEmail className="text-slate-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase text-slate-500 mb-2 inline-block">Password</span>
              <div className="input-field flex items-center gap-2">
                <MdKey className="text-slate-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter password"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </label>

            {mode === "signup" && (
              <label className="block">
                <span className="text-xs font-semibold uppercase text-slate-500 mb-2 inline-block">Confirm Password</span>
                <div className="input-field flex items-center gap-2">
                  <MdKey className="text-slate-400" />
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm password"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </label>
            )}

            {(localError || error) && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {localError || error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold"
            >
              {loading ? "Working..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            By continuing, you agree to the terms of service and privacy policy for using Xpenz.
          </div>
        </div>
      </div>
    </div>
  );
}
