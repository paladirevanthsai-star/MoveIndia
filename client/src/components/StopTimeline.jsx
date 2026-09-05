import React from "react";
import { MapPin, Bus, CheckCircle2 } from "lucide-react";

export default function StopTimeline({ stops = [], activeRoute, buses = [], selectedBus }) {
  if (!stops || stops.length === 0) return null;

  return (
    <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3 shadow-inner">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Route Stop Sequence ({stops.length} Stops)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          {activeRoute?.source} ➔ {activeRoute?.destination}
        </span>
      </div>

      {/* Vertical Stop Timeline */}
      <div className="relative pl-6 space-y-4">
        {/* Continuous Connecting Line */}
        <div className="absolute top-2 bottom-4 left-[15px] w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-indigo-500"></div>

        {stops.map((stop, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === stops.length - 1;

          // Check if any bus is currently nearest or approaching this stop
          const busesAtStop = buses.filter(
            (b) => b.currentStopId === stop.id || b.currentStopName === stop.stopName
          );

          return (
            <div key={stop.id} className="relative flex items-start gap-3 group">
              {/* Timeline Bullet Node */}
              <div className={`relative z-10 flex items-center justify-center -ml-6 w-8 h-8 rounded-full border-2 transition-all ${
                busesAtStop.length > 0
                  ? "bg-emerald-500 border-white ring-4 ring-emerald-500/40 text-slate-950 animate-bounce"
                  : isFirst
                  ? "bg-emerald-600 border-emerald-400 text-white"
                  : isLast
                  ? "bg-rose-600 border-rose-400 text-white"
                  : "bg-slate-950 border-slate-700 text-slate-400 group-hover:border-emerald-500"
              }`}>
                {busesAtStop.length > 0 ? (
                  <Bus className="w-4 h-4" />
                ) : (
                  <span className="text-[11px] font-black">{stop.sequenceNumber}</span>
                )}
              </div>

              {/* Stop Info Container */}
              <div className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-100">
                    {stop.stopName}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Stop #{stop.sequenceNumber}
                  </span>
                </div>

                {stop.landmark && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Near: {stop.landmark}
                  </p>
                )}

                {/* Bus Present Indicator Tag */}
                {busesAtStop.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {busesAtStop.map((b) => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold shadow-md animate-pulse"
                      >
                        <Bus className="w-3 h-3" />
                        {b.busNumber} ({b.occupancyLevel === "seats_available" ? "Seats Avail" : b.occupancyLevel})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
