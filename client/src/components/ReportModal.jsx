import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { 
  X, 
  Send, 
  Users, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

const API = "/api";

export default function ReportModal({ isOpen, onClose, preselectedBus, activeRoute, onReportSubmitted }) {
  const { user } = useAuth();
  
  const [reportType, setReportType] = useState("crowding"); // crowding, delay, route_problem
  const [crowdingLevel, setCrowdingLevel] = useState("medium"); // seats_available, medium, high, full
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in or use 1-Click Demo Login to submit a report.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        routeId: preselectedBus?.routeId || activeRoute?.id || "101",
        busId: preselectedBus?.id || null,
        stopId: preselectedBus?.currentStopId || null,
        type: reportType,
        crowdingLevel: reportType === "crowding" ? crowdingLevel : null,
        delayMinutes: reportType === "delay" ? Number(delayMinutes) : null,
        description: description.trim() || `Reported via Move India Mobile (${reportType})`
      };

      const storedToken = localStorage.getItem("tp_token");
      const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

      const res = await axios.post(`${API}/reports`, payload, {
        withCredentials: true,
        headers
      });

      toast.success(
        user.role === "admin" || user.role === "operator"
          ? "Report submitted & automatically approved!"
          : "Report submitted! Sent to Transit Authority queue for verification."
      );
      
      if (onReportSubmitted) onReportSubmitted(res.data.report);
      onClose();
    } catch (err) {
      const errDetail = err.response?.data?.detail || "Failed to submit report";
      toast.error(typeof errDetail === "string" ? errDetail : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        data-testid="report-modal"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          data-testid="close-report-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              Report Transit Status
            </h2>
            <p className="text-xs text-slate-400">
              Help fellow Indian commuters get accurate live crowd & delay updates
            </p>
          </div>
        </div>

        {/* Bus / Route Badge info */}
        {(preselectedBus || activeRoute) && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Selected Target:</span>
            <span className="font-bold text-emerald-400">
              {preselectedBus ? `${preselectedBus.busNumber} (${preselectedBus.routeName})` : activeRoute?.routeName}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Report Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Issue or Status Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="report-type-crowding"
                onClick={() => setReportType("crowding")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  reportType === "crowding"
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Users className="w-4 h-4 mb-1" />
                Crowd Rush
              </button>

              <button
                type="button"
                data-testid="report-type-delay"
                onClick={() => setReportType("delay")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  reportType === "delay"
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Clock className="w-4 h-4 mb-1" />
                Traffic Delay
              </button>

              <button
                type="button"
                data-testid="report-type-problem"
                onClick={() => setReportType("route_problem")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  reportType === "route_problem"
                    ? "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <AlertTriangle className="w-4 h-4 mb-1" />
                Route Issue
              </button>
            </div>
          </div>

          {/* 2. Crowding Level Options (if type == crowding) */}
          {reportType === "crowding" && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Live Seating & Rush Level
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { key: "seats_available", label: "Seats Free", color: "emerald" },
                  { key: "medium", label: "Medium / Standing", color: "amber" },
                  { key: "high", label: "Heavy Rush", color: "orange" },
                  { key: "full", label: "Bus Full", color: "rose" }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    data-testid={`crowd-option-${item.key}`}
                    onClick={() => setCrowdingLevel(item.key)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      crowdingLevel === item.key
                        ? "bg-slate-800 border-emerald-400 text-white ring-2 ring-emerald-500/40"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Delay Minutes Selector (if type == delay) */}
          {reportType === "delay" && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Estimated Delay (Minutes)
              </label>
              <div className="flex items-center gap-3">
                {[5, 10, 15, 25, 40].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    data-testid={`delay-option-${mins}`}
                    onClick={() => setDelayMinutes(mins)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      delayMinutes === mins
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    +{mins}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Commuter Notes / Location Details (Optional)
            </label>
            <textarea
              data-testid="report-description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Heavy rush at Jubilee Hills Checkpost stop. Conductor giving change smoothly."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            data-testid="submit-report-btn"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Broadcasting..." : "Submit Live Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
