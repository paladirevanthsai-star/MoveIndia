import React from "react";
import { Navigation, Clock, IndianRupee, MapPin } from "lucide-react";

export default function RouteSelector({ routes = [], activeRoute, onSelectRoute }) {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Select Transit Route
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {routes.length} Active Lines
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {routes.map((route) => {
          const isSelected = activeRoute?.id === route.id;
          return (
            <button
              key={route.id}
              data-testid={`route-card-${route.id}`}
              onClick={() => onSelectRoute(route)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? "bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10"
                  : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                  <div className="bg-emerald-500 rotate-45 transform origin-bottom-right w-12 h-3.5 -mr-4 -mt-1 shadow-sm"></div>
                </div>
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span className={`px-2 py-0.5 rounded text-xs font-black tracking-wide ${
                  isSelected ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-emerald-400"
                }`}>
                  {route.routeNumber}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                  {route.city}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-100 line-clamp-1 mb-2">
                {route.routeName}
              </h4>

              <div className="mt-auto flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  ~{route.durationMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {route.stopsCount || route.stops?.length || 6} stops
                </span>
                <span className="flex items-center text-emerald-400 font-bold">
                  <IndianRupee className="w-3 h-3" />
                  {route.fare || 30}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
