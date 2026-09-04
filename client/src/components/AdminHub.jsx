import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { 
  ShieldCheck, 
  ShieldAlert,
  Lock,
  KeyRound,
  Check, 
  X, 
  Clock, 
  Bus, 
  Users, 
  BarChart3, 
  AlertTriangle, 
  RefreshCw,
  TrendingUp
} from "lucide-react";

const API = "/api";

export default function AdminHub() {
  const { user, verifyAdminPin } = useAuth();
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [adminPin, setAdminPin] = useState("");
  const [verifyingPin, setVerifyingPin] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem("tp_token");
      const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

      const [repRes, anaRes] = await Promise.all([
        axios.get(`${API}/reports`, { withCredentials: true, headers }),
        axios.get(`${API}/analytics`, { withCredentials: true, headers })
      ]);

      setReports(repRes.data || []);
      setAnalytics(anaRes.data || null);
    } catch (e) {
      toast.error("Failed to load admin moderation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!adminPin.trim()) {
      toast.error("Please enter the Master Admin PIN");
      return;
    }
    setVerifyingPin(true);
    const res = await verifyAdminPin(adminPin.trim());
    setVerifyingPin(false);
    if (res.success) {
      setAdminPin("");
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    setActionLoading(reportId);
    try {
      const storedToken = localStorage.getItem("tp_token");
      const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

      await axios.patch(
        `${API}/reports/${reportId}/status`,
        { status: newStatus },
        { withCredentials: true, headers }
      );

      toast.success(`Report #${reportId.slice(-4)} marked as ${newStatus.toUpperCase()}`);
      
      // Update local state
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      const msg = err.response?.data?.detail || "Action failed";
      toast.error(typeof msg === "string" ? msg : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  // -------------------------------------------------------------
  // PRIVACY GATE: If not verified Admin, render security lock screen
  // -------------------------------------------------------------
  if (user?.role !== "admin") {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-slate-900/90 border border-indigo-900/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md text-center space-y-6">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Icon Badge */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-950/50">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-[10px] font-mono text-indigo-300 uppercase tracking-wider mb-2">
              <KeyRound className="w-3 h-3" />
              Restricted Authority Priority
            </div>
            <h3 className="text-xl font-black text-white">Admin Security Clearance</h3>
            <p className="text-xs text-slate-400 mt-2">
              This moderation hub is strictly restricted. Only verified transit administrators can moderate commuter reports and view authority telemetry.
            </p>
          </div>

          {/* PIN Input Form */}
          <form onSubmit={handlePinSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 text-left">
                Enter Master Admin PIN / Passcode
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Default PIN: 9988"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-lg tracking-widest text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={verifyingPin}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{verifyingPin ? "Verifying..." : "Unlock Admin Priority"}</span>
            </button>

            {/* Demo 1-Click Passcode Button */}
            <button
              type="button"
              onClick={() => {
                setAdminPin("9988");
                verifyAdminPin("9988");
              }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium block mx-auto"
            >
              Quick Test: Unlock with Default PIN (9988)
            </button>
          </form>

        </div>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === "pending");
  const processedReports = reports.filter((r) => r.status !== "pending");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-800/50 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                Transit Authority Moderation & Intelligence Hub
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-bold border border-indigo-800">
                Admin Priority Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify community crowd & delay reports to update passenger algorithms in real time
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          title="Refresh Data"
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Analytics KPI Bar */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Active Fleet</span>
              <Bus className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{analytics.activeBuses}</span>
              <span className="text-xs text-slate-400">/ {analytics.totalBuses} total</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Punctuality Score</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">
                {analytics.onTimePercentage}%
              </span>
              <span className="text-xs text-slate-400">on-time</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Delayed Buses</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">{analytics.delayedBuses}</span>
              <span className="text-xs text-slate-400">buses late</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Pending Moderation</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-400">{pendingReports.length}</span>
              <span className="text-xs text-slate-400">reports awaiting</span>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Queue Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pending Verification Queue ({pendingReports.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Approving updates the live AI delay model
          </span>
        </div>

        {pendingReports.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-3xl text-slate-400">
            <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
            <p className="text-sm font-semibold text-white">All caught up!</p>
            <p className="text-xs text-slate-500 mt-1">
              No commuter reports currently require authority moderation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-bold font-mono">
                      Route {report.routeId}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      Reported by {report.userName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200">{report.description}</p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 capitalize">
                      Type: {report.type}
                    </span>
                    {report.delayMinutes > 0 && (
                      <span className="text-rose-400 font-semibold">
                        +{report.delayMinutes} min delay
                      </span>
                    )}
                    {report.crowdingLevel && (
                      <span className="text-amber-400 font-semibold capitalize">
                        {report.crowdingLevel} rush
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    disabled={actionLoading === report.id}
                    onClick={() => handleUpdateStatus(report.id, "approved")}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    disabled={actionLoading === report.id}
                    onClick={() => handleUpdateStatus(report.id, "rejected")}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Moderation History */}
      {processedReports.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Recent Moderation Activity ({processedReports.length})
          </h4>
          <div className="space-y-2">
            {processedReports.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    r.status === "approved" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-rose-950 text-rose-300 border border-rose-800"
                  }`}>
                    {r.status}
                  </span>
                  <span className="truncate">{r.description}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
