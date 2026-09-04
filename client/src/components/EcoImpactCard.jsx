import React from "react";
import { Leaf, IndianRupee, Fuel, Sparkles, TrendingUp } from "lucide-react";

export default function EcoImpactCard({ activeRoute }) {
  const fare = activeRoute?.fare || 35;
  const estimatedCabFare = Math.round(fare * 8.5); // Approx cab fare
  const rupeeSaved = estimatedCabFare - fare;
  const co2SavedKg = (12 * 0.18).toFixed(1); // Approx 12km transit vs single passenger auto

  return (
    <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/40 rounded-2xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Heading with Eco Leaf */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white">
                Green Transit & Pocket Savings Meter
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                Eco Impact
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              By riding Route {activeRoute?.routeNumber || "101-H"} instead of a private cab/auto today:
            </p>
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Money Saved</span>
            <span className="text-sm font-black text-emerald-400">₹{rupeeSaved}</span>
          </div>

          <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">CO₂ Reduced</span>
            <span className="text-sm font-black text-teal-300">{co2SavedKg} kg</span>
          </div>

          <div className="hidden md:block bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Fuel Conserved</span>
            <span className="text-sm font-black text-amber-400">~1.4 L</span>
          </div>
        </div>

      </div>
    </div>
  );
}
