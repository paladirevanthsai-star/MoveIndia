import React from "react";
import { 
  Heart, 
  Bus, 
  MapPin, 
  Clock, 
  Navigation, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2,
  ChevronRight,
  Zap
} from "lucide-react";

export default function FavoritesBar({ 
  favorites = [], 
  buses = [], 
  routes = [], 
  selectedBus, 
  onSelectBus, 
  onSelectRoute, 
  onToggleFavorite 
}) {
  const favoriteBuses = buses.filter((b) => favorites.includes(b.id));

  // If no favorites, show helpful tip card
  if (favorites.length === 0) {
    const suggestedBus = buses[0];
    return (
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/20 border border-slate-800/90 rounded-2xl p-3.5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs sm:text-sm">
                Favorite Buses (Quick Commute Access)
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                0 Saved
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click the <span className="text-rose-400 font-bold">❤️ Heart icon</span> on any bus to pin it here. Your saved buses are remembered automatically every time you open Move India!
            </p>
          </div>
        </div>

        {suggestedBus && (
          <button
            onClick={() => onToggleFavorite(suggestedBus)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-xl text-xs font-bold transition-all shrink-0"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Pin Daily {suggestedBus.busNumber}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900/95 via-slate-900 to-rose-950/30 border border-rose-900/40 rounded-2xl p-4 shadow-xl space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                My Pinned Commute Fleet ({favoriteBuses.length})
              </h3>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800/80">
                Auto-Saved
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Instant live GPS telemetry ready upon opening app
            </span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Click any bus to jump map camera
        </span>
      </div>

      {/* Grid of Saved Buses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {favoriteBuses.map((bus) => {
          const isSelected = selectedBus?.id === bus.id;
          const isDelayed = bus.status === "delayed" || (bus.delayMinutes && bus.delayMinutes > 5);

          return (
            <div
              key={bus.id}
              onClick={() => {
                const route = routes.find((r) => r.id === bus.routeId);
                if (route && onSelectRoute) onSelectRoute(route);
                if (onSelectBus) onSelectBus(bus);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? "bg-slate-900 border-rose-500 ring-2 ring-rose-500/20 shadow-lg shadow-rose-500/10"
                  : "bg-slate-950/80 border-slate-800 hover:border-rose-800/80 hover:bg-slate-900/80"
              }`}
            >
              {/* Top Row: Plate & Heart Button */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white tracking-wide">
                    {bus.busNumber}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    Route {bus.routeId}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Remove from favorites"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(bus);
                    }}
                    className="p-1 rounded-md text-rose-500 hover:text-rose-400 hover:bg-rose-950/60 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500 hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Route & Destination */}
              <p className="text-[11px] text-slate-300 truncate mb-2">
                {bus.routeName}
              </p>

              {/* Live Approaching Telemetry */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1 text-slate-400 truncate max-w-[170px]">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">Near {bus.currentStopName || "In Route"}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isDelayed ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      +{bus.delayMinutes}m
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      On Time
                    </span>
                  )}
                  <span className="font-mono text-emerald-400 font-bold text-xs">
                    {bus.speedKmph || 25} km/h
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
