import React, { useState } from "react";
import { 
  MapPin, 
  Sparkles, 
  Leaf, 
  Heart, 
  TrendingUp, 
  Bus, 
  Clock, 
  QrCode, 
  BellRing,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import StopTimeline from "./StopTimeline";
import PredictionCard from "./PredictionCard";
import EcoImpactCard from "./EcoImpactCard";

export default function SidebarInsights({
  stops = [],
  activeRoute,
  buses = [],
  selectedBus,
  onSelectBus,
  favorites = [],
  onToggleFavorite,
  proximityAlarms = [],
  onToggleProximityAlarm,
  onOpenSeatsModal,
  onOpenTicketModal
}) {
  const [activeTab, setActiveTab] = useState("stops"); // stops, insights, favorites
  const favoriteBuses = buses.filter((b) => favorites.includes(b.id));

  return (
    <div className="flex flex-col h-[540px] lg:h-[620px] bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
      
      {/* Top Segmented Tab Switcher */}
      <div className="flex items-center p-2 bg-slate-950/80 border-b border-slate-800/80 gap-1 shrink-0">
        
        {/* Tab 1: Stops Sequence */}
        <button
          type="button"
          onClick={() => setActiveTab("stops")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "stops"
              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Stops ({stops.length})</span>
        </button>

        {/* Tab 2: AI & Eco Insights */}
        <button
          type="button"
          onClick={() => setActiveTab("insights")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "insights"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI & Eco</span>
        </button>

        {/* Tab 3: Saved Commute Fleet */}
        <button
          type="button"
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "favorites"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/20 font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? "fill-rose-300 text-rose-300" : ""}`} />
          <span className="hidden sm:inline">Fleet</span>
          <span>({favorites.length})</span>
        </button>

      </div>

      {/* Tab Panels Body (Scrollable with Sleek Scrollbar) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        
        {/* Tab 1: Stops Sequence Timeline */}
        {activeTab === "stops" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="font-semibold text-slate-300">
                {activeRoute?.source} ➔ {activeRoute?.destination}
              </span>
              <span>{stops.length} Total Waypoints</span>
            </div>
            <StopTimeline
              stops={stops}
              activeRoute={activeRoute}
              buses={buses}
              selectedBus={selectedBus}
            />
          </div>
        )}

        {/* Tab 2: AI & Eco Impact */}
        {activeTab === "insights" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Green Eco & Money Savings Meter */}
            {activeRoute && (
              <EcoImpactCard activeRoute={activeRoute} />
            )}

            {/* AI Congestion Prediction Gauge */}
            {activeRoute && (
              <PredictionCard activeRoute={activeRoute} />
            )}
          </div>
        )}

        {/* Tab 3: Saved Commute Fleet */}
        {activeTab === "favorites" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold text-white">Your Pinned Buses</span>
              <span className="text-rose-400 font-semibold">{favoriteBuses.length} Active</span>
            </div>

            {favoriteBuses.length > 0 ? (
              favoriteBuses.map((bus) => {
                const isSelected = selectedBus?.id === bus.id;
                const isAlarmActive = proximityAlarms.includes(bus.id);

                return (
                  <div
                    key={bus.id}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                    }`}
                    onClick={() => onSelectBus(bus)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {bus.busNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {bus.operatorName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(bus);
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="Remove from favorites"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      Next Stop: <span className="font-semibold text-emerald-400">{bus.nextStopName}</span>
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                      <span>Speed: {bus.speedKmph || 25} km/h</span>
                      <span className="text-emerald-400 font-semibold">
                        ETA ~{bus.calculatedRemainingEtaMinutes || 5} min
                      </span>
                      {onToggleProximityAlarm && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleProximityAlarm(bus);
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isAlarmActive
                              ? "bg-amber-500 text-slate-950"
                              : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <BellRing className="w-3 h-3" />
                          <span>{isAlarmActive ? "Chime ON" : "Chime"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                <Heart className="w-8 h-8 text-slate-600 mx-auto" />
                <p>No favorite buses saved yet.</p>
                <p className="text-[11px] text-slate-500">
                  Tap the ❤️ heart on any bus card below to pin it here for instant monitoring!
                </p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
