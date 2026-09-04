import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  X, 
  Bus, 
  MapPin, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  Heart
} from "lucide-react";

export default function SearchBar({ 
  buses = [], 
  routes = [], 
  activeRoute, 
  onSelectBus, 
  onSelectRoute,
  favorites = [],
  onToggleFavorite
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filterState, setFilterState] = useState("all"); // all, favorites, on_time, delayed, hyd, blr, del
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Keyboard shortcut '/' to focus search, and 'Escape' to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  // Filter buses based on query and filter pills
  const matchingBuses = buses.filter((b) => {
    // Filter pill matching
    if (filterState === "favorites" && !favorites.includes(b.id)) return false;
    if (filterState === "on_time" && (b.status !== "on_time" || b.delayMinutes > 5)) return false;
    if (filterState === "delayed" && (b.status !== "delayed" && (!b.delayMinutes || b.delayMinutes <= 5))) return false;
    if (filterState === "hyd" && !b.routeName.includes("Hitec") && !b.routeName.includes("WaveRock")) return false;
    if (filterState === "blr" && !b.routeName.includes("ITPL") && !b.routeName.includes("Majestic")) return false;
    if (filterState === "del" && !b.routeName.includes("Delhi") && !b.routeName.includes("Mehrauli")) return false;

    if (!cleanQuery) return true;

    const matchesPlate = b.busNumber?.toLowerCase().includes(cleanQuery);
    const matchesOperator = b.operatorName?.toLowerCase().includes(cleanQuery);
    const matchesRoute = b.routeName?.toLowerCase().includes(cleanQuery);
    const matchesStop = b.currentStopName?.toLowerCase().includes(cleanQuery) || b.nextStopName?.toLowerCase().includes(cleanQuery);
    const matchesType = b.busType?.toLowerCase().includes(cleanQuery);

    return matchesPlate || matchesOperator || matchesRoute || matchesStop || matchesType;
  });

  // Filter routes based on query
  const matchingRoutes = cleanQuery ? routes.filter((r) => {
    const matchesName = r.routeName?.toLowerCase().includes(cleanQuery);
    const matchesNum = r.routeNumber?.toLowerCase().includes(cleanQuery);
    const matchesCity = r.city?.toLowerCase().includes(cleanQuery);
    const matchesStop = r.stops?.some(
      (s) => s.stopName?.toLowerCase().includes(cleanQuery) || s.landmark?.toLowerCase().includes(cleanQuery)
    );
    return matchesName || matchesNum || matchesCity || matchesStop;
  }) : [];

  const handleBusClick = (bus) => {
    const route = routes.find((r) => r.id === bus.routeId);
    if (route && onSelectRoute) {
      onSelectRoute(route);
    }
    if (onSelectBus) {
      onSelectBus(bus);
    }
    setIsOpen(false);
  };

  const handleRouteClick = (route) => {
    if (onSelectRoute) {
      onSelectRoute(route);
    }
    const firstBus = buses.find((b) => b.routeId === route.id);
    if (firstBus && onSelectBus) {
      onSelectBus(firstBus);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full z-30">
      
      {/* Search Input Box */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-xl backdrop-blur-md focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
        
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3 text-emerald-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search by Bus plate (e.g. TS-09, 4421), Route (101-H), Stop or Landmark..."
            className="w-full pl-10 pr-10 py-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-medium"
          />

          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-sm">
              /
            </kbd>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setFilterState("all")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterState === "all"
                ? "bg-emerald-500 text-slate-950 font-black shadow-sm shadow-emerald-500/20"
                : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            All Fleet ({buses.length})
          </button>

          {/* Favorites Filter Pill */}
          <button
            type="button"
            onClick={() => setFilterState("favorites")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              filterState === "favorites"
                ? "bg-rose-500 text-white font-black shadow-sm shadow-rose-500/20"
                : "bg-slate-800/80 text-rose-400 hover:text-rose-300 hover:bg-slate-800"
            }`}
          >
            <Heart className={`w-3 h-3 ${favorites.length > 0 ? "fill-current" : ""}`} />
            <span>Saved ({favorites.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterState("on_time")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterState === "on_time"
                ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                : "bg-slate-800/80 text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
            }`}
          >
            🟢 On Time
          </button>

          <button
            type="button"
            onClick={() => setFilterState("delayed")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterState === "delayed"
                ? "bg-rose-500 text-white font-black shadow-sm"
                : "bg-slate-800/80 text-slate-400 hover:text-rose-400 hover:bg-slate-800"
            }`}
          >
            🔴 Delayed
          </button>

          <button
            type="button"
            onClick={() => setFilterState("hyd")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterState === "hyd"
                ? "bg-indigo-500 text-white font-black shadow-sm"
                : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            TSRTC
          </button>

          <button
            type="button"
            onClick={() => setFilterState("blr")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterState === "blr"
                ? "bg-indigo-500 text-white font-black shadow-sm"
                : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            BMTC
          </button>

          <button
            type="button"
            onClick={() => setFilterState("del")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterState === "del"
                ? "bg-indigo-500 text-white font-black shadow-sm"
                : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            DTC
          </button>
        </div>
      </div>

      {/* Live Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[420px] overflow-y-auto">
          
          {/* 1. Matching Buses Section */}
          <div className="p-2 border-b border-slate-800/80">
            <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Bus className="w-3.5 h-3.5" />
                Live Moving Buses ({matchingBuses.length})
              </span>
              <span className="text-[10px] text-slate-500">Click to locate on Map • Heart to Pin</span>
            </div>

            {matchingBuses.length === 0 ? (
              <p className="px-3 py-2 text-xs text-slate-500 italic">
                No active buses match your query or filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {matchingBuses.map((bus) => {
                  const isDelayed = bus.status === "delayed" || (bus.delayMinutes && bus.delayMinutes > 5);
                  const isFav = favorites.includes(bus.id);

                  return (
                    <button
                      key={bus.id}
                      onClick={() => handleBusClick(bus)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-emerald-500 text-left transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                          <Bus className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-white">
                              {bus.busNumber}
                            </span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                              Route {bus.routeId}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {bus.currentStopName ? `Near ${bus.currentStopName}` : bus.routeName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end gap-1">
                          {isDelayed ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                              +{bus.delayMinutes || 10}m
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              On Time
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            {bus.speedKmph || 25} km/h
                          </span>
                        </div>

                        {/* Heart Button right in dropdown */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleFavorite) onToggleFavorite(bus);
                          }}
                          title={isFav ? "Unpin from favorites" : "Pin to favorite commute"}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isFav 
                              ? "bg-rose-950 text-rose-500 border-rose-800 shadow-sm" 
                              : "bg-slate-900 border-slate-800 text-slate-500 hover:text-rose-400 hover:border-slate-700"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Matching Routes & Stops Section */}
          {cleanQuery && (
            <div className="p-2 bg-slate-950/40">
              <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Navigation className="w-3.5 h-3.5" />
                  Corridors & Key Stops ({matchingRoutes.length})
                </span>
              </div>

              {matchingRoutes.length === 0 ? (
                <p className="px-3 py-1 text-xs text-slate-500 italic">No route lines match query.</p>
              ) : (
                <div className="space-y-1">
                  {matchingRoutes.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => handleRouteClick(route)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                          {route.routeNumber}
                        </span>
                        <div>
                          <span className="text-xs font-semibold text-white block">
                            {route.routeName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {route.city} • ₹{route.fare} • {route.stopsCount} stops
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Helper */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Tip: Type any bus plate or click ❤️ on any bus to save it for quick commute</span>
            <span>Press ESC to close</span>
          </div>

        </div>
      )}

    </div>
  );
}
