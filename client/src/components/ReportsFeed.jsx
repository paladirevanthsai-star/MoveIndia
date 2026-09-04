import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, MessageSquare, Plus, Clock, Users, ShieldCheck, AlertCircle } from "lucide-react";

const API = "/api";

export default function ReportsFeed({ onOpenReportModal, activeRoute }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, approved, pending

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/reports`);
      setReports(res.data || []);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    if (filter === "approved") return r.status === "approved";
    if (filter === "pending") return r.status === "pending";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white">
              Live Commuter Crowd & Delay Feed
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time crowdsourced reports from fellow passengers across Indian transit routes
          </p>
        </div>

        <button
          data-testid="feed-report-btn"
          onClick={onOpenReportModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-xl shadow-emerald-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Submit Transit Report
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          data-testid="filter-all-reports"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "all" ? "bg-slate-800 text-white border border-slate-700" : "text-slate-400 hover:text-white"
          }`}
        >
          All Reports ({reports.length})
        </button>

        <button
          data-testid="filter-approved-reports"
          onClick={() => setFilter("approved")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "approved" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "text-slate-400 hover:text-white"
          }`}
        >
          Verified Authority Data ({reports.filter((r) => r.status === "approved").length})
        </button>

        <button
          data-testid="filter-pending-reports"
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "pending" ? "bg-amber-950 text-amber-300 border border-amber-800" : "text-slate-400 hover:text-white"
          }`}
        >
          Pending Review ({reports.filter((r) => r.status === "pending").length})
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => {
          const isApproved = report.status === "approved";

          return (
            <div
              key={report.id}
              data-testid={`report-feed-card-${report.id}`}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-slate-800 text-emerald-400 border border-slate-700">
                    Line {report.routeId}
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {report.type.replace("_", " ")}
                  </span>
                </div>

                {isApproved ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified by Transit Authority
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Verification
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                "{report.description}"
              </p>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400 gap-2">
                <div className="flex items-center gap-3">
                  {report.crowdingLevel && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      Status: <strong className="text-white capitalize">{report.crowdingLevel.replace("_", " ")}</strong>
                    </span>
                  )}
                  {report.delayMinutes > 0 && (
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      +{report.delayMinutes}m delay
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>By {report.userName} ({report.userRole})</span>
                  <span>•</span>
                  <span>{new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
