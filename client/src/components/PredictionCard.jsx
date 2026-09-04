import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, TrendingUp, AlertCircle, ShieldCheck, Zap } from "lucide-react";

const API = "/api";

export default function PredictionCard({ activeRoute }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeRoute?.id) return;
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/predictions/${activeRoute.id}`);
        setPrediction(res.data);
      } catch (e) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [activeRoute]);

  if (!prediction) return null;

  const scorePct = Math.round((prediction.crowdingScore || 0.45) * 100);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              AI & Passenger Crowd Prediction
            </h3>
            <p className="text-[10px] text-slate-400">
              Computed from live passenger reports + historical rush
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
          Confidence: {prediction.confidence}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        {/* Crowding Score Gauge */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 font-medium">Crowding Probability</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-white">{scorePct}%</span>
            <span className={`text-[11px] font-bold ${
              scorePct > 70 ? 'text-rose-400' : scorePct > 40 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {prediction.crowdingLabel}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                scorePct > 70 ? 'bg-rose-500' : scorePct > 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${scorePct}%` }}
            ></div>
          </div>
        </div>

        {/* Average Delay & Verified Reports */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Verified Average Delay</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white">
                {prediction.averageDelayMinutes || 0}
              </span>
              <span className="text-xs text-slate-400">mins</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            {prediction.recentReportsAnalyzed} community signals verified
          </p>
        </div>
      </div>
    </div>
  );
}
