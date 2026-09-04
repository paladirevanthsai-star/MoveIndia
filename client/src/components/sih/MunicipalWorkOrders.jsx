import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Building2, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HardHat
} from "lucide-react";
import { toast } from "sonner";

export default function MunicipalWorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchWorkOrders = async () => {
    try {
      const res = await axios.get("/api/sih/work-orders");
      setWorkOrders(res.data || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const handleUpdateStatus = async (woId, newStatus) => {
    try {
      await axios.patch(`/api/sih/work-orders/${woId}/status`, { status: newStatus });
      toast.success(`Work order ${woId} updated to ${newStatus.toUpperCase()}!`);
      fetchWorkOrders();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const filtered = workOrders.filter((w) => {
    if (statusFilter !== "all" && w.status !== statusFilter) return false;
    return true;
  });

  const totalEstimatedCost = workOrders.reduce((sum, w) => sum + (w.estimatedCost || 0), 0);
  const completedCount = workOrders.filter((w) => w.status === "completed" || w.status === "verified_by_bus").length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/60 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-bold">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  Municipal PWD Maintenance Work Order Dispatcher
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-800">
                  SMART CITY PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated road repair tickets generated from edge bus camera telemetry • GHMC, BBMP, PWD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800 font-bold">
              {completedCount} of {workOrders.length} Repairs Resolved
            </span>
          </div>
        </div>

        {/* Municipal KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Work Orders</span>
            <span className="text-xl font-black text-white">{workOrders.length}</span>
            <span className="text-[9px] text-slate-500 block">Active Municipal Tickets</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget Allocated</span>
            <span className="text-xl font-black text-emerald-400">₹{totalEstimatedCost.toLocaleString("en-IN")}</span>
            <span className="text-[9px] text-slate-500 block">PWD Repair Fund</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">In Progress</span>
            <span className="text-xl font-black text-amber-400">
              {workOrders.filter((w) => w.status === "in_progress").length}
            </span>
            <span className="text-[9px] text-slate-500 block">Contractors on Site</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Bus Auto-Verified</span>
            <span className="text-xl font-black text-teal-300">
              {completedCount}
            </span>
            <span className="text-[9px] text-slate-500 block">Re-scanned & Cleared</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-bold mr-1">Status:</span>
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1 rounded-xl font-bold transition-all ${
            statusFilter === "all" ? "bg-slate-700 text-white" : "bg-slate-900 border border-slate-800 text-slate-400"
          }`}
        >
          All ({workOrders.length})
        </button>
        <button
          onClick={() => setStatusFilter("assigned")}
          className={`px-3 py-1 rounded-xl font-bold transition-all ${
            statusFilter === "assigned" ? "bg-amber-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-400"
          }`}
        >
          Assigned
        </button>
        <button
          onClick={() => setStatusFilter("in_progress")}
          className={`px-3 py-1 rounded-xl font-bold transition-all ${
            statusFilter === "in_progress" ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-400"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`px-3 py-1 rounded-xl font-bold transition-all ${
            statusFilter === "completed" ? "bg-emerald-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-400"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Work Order Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((wo) => {
          const isCritical = wo.priority.includes("P0");

          return (
            <div
              key={wo.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] text-slate-500 block uppercase">
                    {wo.id}
                  </span>
                  <h4 className="font-bold text-sm text-white mt-0.5">{wo.title}</h4>
                </div>

                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  isCritical ? "bg-rose-950 text-rose-300 border border-rose-800" : "bg-amber-950 text-amber-300 border border-amber-800"
                }`}>
                  {wo.priority}
                </span>
              </div>

              {/* Location & Division */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1">
                <p className="text-slate-300"><strong>Location:</strong> {wo.location}</p>
                <p className="text-slate-400 text-[11px]">{wo.division}</p>
                <p className="text-[11px] text-slate-400">Contractor: <strong className="text-white">{wo.contractorAssigned}</strong></p>
              </div>

              {/* Budget & Target Date */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Est. Cost</span>
                  <span className="font-black text-emerald-400">₹{wo.estimatedCost.toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Target Date</span>
                  <span className="font-black text-slate-300">{wo.targetCompletion}</span>
                </div>
              </div>

              {/* Source Verification Tag */}
              <div className="text-[10px] text-teal-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Source: {wo.verificationSource}</span>
              </div>

              {/* Status Update Control */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Current Status:</span>
                <select
                  value={wo.status}
                  onChange={(e) => handleUpdateStatus(wo.id, e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-emerald-400 font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="verified_by_bus">Verified by Bus Cam</option>
                </select>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
