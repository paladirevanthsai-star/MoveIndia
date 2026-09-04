import React from "react";
import { 
  Bus, 
  Users, 
  Clock, 
  Gauge, 
  BatteryCharging, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Heart,
  ExternalLink,
  Bell,
  BellRing,
  QrCode,
  LayoutGrid
} from "lucide-react";

export default function BusCards({ 
  buses = [], 
  selectedBus, 
  onSelectBus, 
  activeRoute,
  onOpenReportModal,
  favorites = [],
  onToggleFavorite,
  onOpenSeatsModal,
  onOpenTicketModal,
  proximityAlarms = [],
  onToggleProximityAlarm
}) {
  const routeBuses = activeRoute ? buses.filter((b) => b.routeId === activeRoute.id) : buses;

  if (routeBuses.length === 0) {
    return (
      <div className="p-6 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400">
        <Bus className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-bounce" />
        <p className="text-sm font-semibold">No active buses on this route right now</p>
        <p className="text-xs text-slate-500 mt-1">Check back in a moment or select another route.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Live Fleet Status ({routeBuses.length})
          </h3>
        </div>
        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Real-Time GPS Synced
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {routeBuses.map((bus) => {
          const isSelected = selectedBus?.id === bus.id;
          const isFav = favorites.includes(bus.id);
          const hasAlarm = proximityAlarms.includes(bus.id);

          // Crowding Badge Setup
          let occBadgeClass = "bg-emerald-950/80 text-emerald-300 border-emerald-800/60";
          let occLabel = "Seats Available";
          let occProgress = bus.occupancyPercent || 35;
          let progressColor = "bg-emerald-500";

          if (bus.occupancyLevel === "medium") {
            occBadgeClass = "bg-amber-950/80 text-amber-300 border-amber-800/60";
            occLabel = "Medium (Standing)";
            occProgress = bus.occupancyPercent || 65;
            progressColor = "bg-amber-500";
          } else if (bus.occupancyLevel === "crowded" || bus.occupancyLevel === "full") {
            occBadgeClass = "bg-rose-950/80 text-rose-300 border-rose-800/60";
            occLabel = "Crowded / Full";
            occProgress = bus.occupancyPercent || 90;
            progressColor = "bg-rose-500";
          }

          const isDelayed = bus.status === "delayed" && bus.delayMinutes > 0;

          return (
            <div
              key={bus.id}
              data-testid={`bus-card-${bus.id}`}
              onClick={() => onSelectBus(bus)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/10"
                  : "bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400'}`}>
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white tracking-wide">
                        {bus.busNumber}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                        {bus.busType?.split(" ")[0] || "TSRTC"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                      Driver: {bus.operatorName || "Depot Captain"}
                    </p>
                  </div>
                </div>

                {/* Right Header: Proximity Alert, Heart Icon & Status */}
                <div className="flex items-center gap-1.5">
                  {/* Proximity Alarm Chime Toggle */}
                  <button
                    type="button"
                    title={hasAlarm ? "Proximity chime alarm active!" : "Notify with audio chime when 2 stops away"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleProximityAlarm) onToggleProximityAlarm(bus);
                    }}
                    className={`p-1.5 rounded-xl border transition-all ${
                      hasAlarm
                        ? "bg-amber-500/20 text-amber-400 border-amber-500 ring-2 ring-amber-500/30 shadow animate-pulse"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700"
                    }`}
                  >
                    {hasAlarm ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </button>

                  {/* Heart Favorite Toggle */}
                  <button
                    type="button"
                    title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleFavorite) onToggleFavorite(bus);
                    }}
                    className={`p-1.5 rounded-xl border transition-all ${
                      isFav 
                        ? "bg-rose-950 text-rose-500 border-rose-800 shadow-sm shadow-rose-500/20" 
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-slate-700"
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform ${isFav ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
                  </button>

                  {/* Status indicator */}
                  <div className="flex flex-col items-end">
                    {isDelayed ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                        <AlertTriangle className="w-3 h-3" />
                        +{bus.delayMinutes}m Late
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        On Time
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      ETA ~{bus.calculatedRemainingEtaMinutes || 8} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Stop & Next Stop Navigation */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 mb-3 text-xs">
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span className="text-slate-500 text-[10px] font-semibold">Approaching:</span>
                  <span className="font-bold text-white truncate max-w-[190px]">
                    {bus.nextStopName || "Next stop"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Last: {bus.currentStopName}</span>
                  <span className="text-emerald-400 font-mono font-semibold">{bus.speedKmph} km/h</span>
                </div>
              </div>

              {/* Live Occupancy Meter */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Live Crowd Level
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${occBadgeClass}`}>
                    {occLabel}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                    style={{ width: `${occProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Feature Action Bar: Seats • Ticket • Google Maps • Report */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 gap-2">
                <div className="flex items-center gap-2">
                  {/* View Seats Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenSeatsModal) onOpenSeatsModal(bus);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors"
                  >
                    <LayoutGrid className="w-3 h-3 text-teal-400" />
                    <span>Seats</span>
                  </button>

                  {/* Buy Ticket Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenTicketModal) onOpenTicketModal(bus);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[11px] font-bold transition-colors"
                  >
                    <QrCode className="w-3 h-3 text-emerald-400" />
                    <span>Ticket</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps?q=${bus.currentLatitude},${bus.currentLongitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                    title="Track live in Google Maps"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <span className="text-slate-700">•</span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenReportModal) onOpenReportModal(bus);
                    }}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
                  >
                    <span>Report</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
