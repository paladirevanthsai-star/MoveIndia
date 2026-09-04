import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, LogIn, UserPlus, Shield, UserCheck, Lock, Mail, Phone, User } from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, demoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("passenger");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let res;
    if (isRegister) {
      res = await register(name, email, password, phone, role);
    } else {
      res = await login(email, password);
    }
    setSubmitting(false);
    if (res.success) {
      onClose();
    }
  };

  const handleDemoSelect = async (selectedRole) => {
    setSubmitting(true);
    const res = await demoLogin(selectedRole);
    setSubmitting(false);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        data-testid="auth-modal"
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          data-testid="close-auth-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-black text-white">
              {isRegister ? "Create Move India Account" : "Sign In to Move India"}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Access live Indian bus schedules, crowd reports & operator controls
          </p>
        </div>

        {/* 1-Click Fast Demo Login Switchers */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Instant 1-Click Role Login:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              data-testid="auth-demo-passenger-btn"
              onClick={() => handleDemoSelect("passenger")}
              className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 text-[11px] font-bold transition-all text-center"
            >
              🟢 Passenger
            </button>
            <button
              type="button"
              data-testid="auth-demo-operator-btn"
              onClick={() => handleDemoSelect("operator")}
              className="p-2 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800/80 text-[11px] font-bold transition-all text-center"
            >
              🟡 Operator
            </button>
            <button
              type="button"
              data-testid="auth-demo-admin-btn"
              onClick={() => handleDemoSelect("admin")}
              className="p-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 text-[11px] font-bold transition-all text-center"
            >
              🟣 Admin
            </button>
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-semibold">Or Email / Password</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  data-testid="auth-name-input"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                data-testid="auth-email-input"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                data-testid="auth-password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">User Role</label>
              <select
                data-testid="auth-role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="passenger">Passenger (Commuter)</option>
                <option value="operator">Operator (Bus Driver / Depot Lead)</option>
                <option value="admin">Transit Admin (Authority)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            data-testid="auth-submit-btn"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 mt-2"
          >
            {submitting ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle between Register and Login */}
        <div className="mt-4 text-center">
          <button
            type="button"
            data-testid="auth-toggle-mode-btn"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            {isRegister
              ? "Already have an account? Sign In"
              : "Don't have an account? Register as Passenger/Operator"}
          </button>
        </div>
      </div>
    </div>
  );
}
