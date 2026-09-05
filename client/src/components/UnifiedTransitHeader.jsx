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
  ChevronDown, 
  ChevronRight, 
  Heart, 
  QrCode, 
  Sparkles, 
  Activity,
  Layers,
  IndianRupee
} from "lucide-react";

export default function UnifiedTransitHeader({
  routes = [],
  activeRoute,
  onSelectRoute,
  buses = [],
  selectedBus,
  onSelectBus,
  favorites = [],
  onToggleFavorite,
  onOpenTicketModal,
  onOpenReportModal,
  t = (key) => key
}) {
  const [isRouteDropdownOpen, setIsRouteDropdownOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const routeDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const favoritesDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Keyboard shortcut '/' to focus search, and 'Escape' to close dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsRouteDropdownOpen(false);
        setIsFavoritesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (routeDropdownRef.current && !routeDropdownRef.current.contains(e.target)) {
        setIsRouteDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (favoritesDropdownRef.current && !favoritesDropdownRef.current.contains(e.target)) {
        setIsFavoritesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cleanQuery = searchQuery.trim().toLowerCase();

  // Filter matching buses
  const matchingBuses = cleanQuery ? buses.filter((b) => {
    return (
      b.busNumber?.toLowerCase().includes(cleanQuery) ||
      b.operatorName?.toLowerCase().includes(cleanQuery) ||
      b.routeName?.toLowerCase().includes(cleanQuery) ||
      b.currentStopName?.toLowerCase().includes(cleanQuery) ||
      b.nextStopName?.toLowerCase().includes(cleanQuery)
    );
  }) : [];

  // Filter matching routes
  const matchingRoutes = cleanQuery ? routes.filter((r) => {
    return (
      r.routeName?.toLowerCase().includes(cleanQuery) ||
      r.routeNumber?.toLowerCase().includes(cleanQuery) ||
      r.city?.toLowerCase().includes(cleanQuery) ||
      r.stops?.some((s) => s.stopName?.toLowerCase().includes(cleanQuery))
    );
  }) : [];

  const favoriteBuses = buses.filter((b) => favorites.includes(b.id));

  return (
    <div className="relative z-30 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-2.5 sm:p-3 shadow-xl space-y-2.5">
      
      {/* Top Row: Route Pill, Omnisearch, and Quick Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        
        {/* Left Side: Route Switcher Dropdown */}
        <div className="relative shrink-0" ref={routeDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsRouteDropdownOpen(!isRouteDropdownOpen);
              setIsFavoritesOpen(false);
              setIsSearchOpen(false);
            }}
            className="w-full lg:w-auto flex items-center justify-between gap-2.5 px-3.5 py-2 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-700/70 hover:border-emerald-500/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-left">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="truncate max-w-[220px] sm:max-w-[300px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs sm:text-sm text-white tracking-wide">
                    {activeRoute ? activeRoute.routeNumber : "Select Corridor"}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {activeRoute?.city || "Transit"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {activeRoute ? activeRoute.routeName : "Tap to choose route"}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isRouteDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Route Selector Dropdown Popover */}
          {isRouteDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-full sm:w-96 max-h-96 overflow-y-auto bg-slate-950/95 border border-slate-700 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl z-50 divide-y divide-slate-800/60 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>Select Urban Transit Line ({routes.length})</span>
                <span className="text-emerald-400">Live GPS Active</span>
              </div>
              <div className="py-1 space-y-1">
                {routes.map((route) => {
                  const isSelected = activeRoute?.id === route.id;
                  return (
                    <button
                      key={route.id}
                      data-testid={`route-card-${route.id}`}
                      onClick={() => {
                        onSelectRoute(route);
                        setIsRouteDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500/10 border-emerald-500/50 text-white"
                          : "bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/70 hover:border-slate-700 text-slate-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-black ${
                            isSelected ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-emerald-400"
                          }`}>
                            {route.routeNumber}
                          </span>
                          <span className="font-bold text-xs text-white">
                            {route.routeName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          <span>{route.city}</span>
                          <span>•</span>
                          <span>{route.stopsCount || route.stops?.length || 6} Stops</span>
                          <span>•</span>
                          <span>~{route.durationMinutes} min</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">₹{route.fare || 30}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Center: Sleek Omnisearch Bar */}
        <div className="relative flex-1 min-w-[200px]" ref={searchContainerRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search bus number, route name, or stop... (Press /)"
              className="w-full pl-9 pr-14 py-2 bg-slate-950/80 hover:bg-slate-950 border border-slate-700/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 p-0.5 text-slate-400 hover:text-white rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="absolute right-3 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 rounded">
                /
              </kbd>
            )}
          </div>

          {/* Autocomplete Search Dropdown */}
          {isSearchOpen && cleanQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto bg-slate-950/95 border border-slate-700 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl z-50 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Bus matches */}
              {matchingBuses.length > 0 && (
                <div className="pb-2">
                  <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Live Active Buses ({matchingBuses.length})
                  </span>
                  <div className="space-y-1">
                    {matchingBuses.map((bus) => (
                      <button
                        key={bus.id}
                        type="button"
                        onClick={() => {
                          const route = routes.find((r) => r.id === bus.routeId);
                          if (route) onSelectRoute(route);
                          onSelectBus(bus);
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <Bus className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-white">{bus.busNumber}</span>
                              <span className="text-[10px] text-slate-400">({bus.operatorName})</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Approaching: {bus.nextStopName} • {bus.speedKmph || 25} km/h
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          bus.status === "on_time" ? "bg-emerald-950 text-emerald-300" : "bg-amber-950 text-amber-300"
                        }`}>
                          {bus.status === "on_time" ? "On Time" : `${bus.delayMinutes || 10}m Delay`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Route matches */}
              {matchingRoutes.length > 0 && (
                <div className="pt-2">
                  <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Matching Corridors ({matchingRoutes.length})
                  </span>
                  <div className="space-y-1">
                    {matchingRoutes.map((route) => (
                      <button
                        key={route.id}
                        type="button"
                        onClick={() => {
                          onSelectRoute(route);
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-bold text-xs text-white">
                            {route.routeNumber} • {route.routeName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{route.city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingBuses.length === 0 && matchingRoutes.length === 0 && (
                <div className="py-4 text-center text-xs text-slate-400">
                  No matching buses or routes found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Favorites Button, Ticket, and Report */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Quick Favorites Pill / Popover */}
          <div className="relative" ref={favoritesDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsFavoritesOpen(!isFavoritesOpen);
                setIsRouteDropdownOpen(false);
                setIsSearchOpen(false);
              }}
              title="Quick access to pinned favorite buses"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                favorites.length > 0
                  ? "bg-rose-950/40 border-rose-800/70 text-rose-300 hover:bg-rose-900/40"
                  : "bg-slate-950/80 border-slate-700/70 text-slate-400 hover:text-white"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              <span className="hidden sm:inline">Saved</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                {favorites.length}
              </span>
            </button>

            {/* Favorites Popover */}
            {isFavoritesOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-80 overflow-y-auto bg-slate-950/95 border border-slate-700 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl z-50 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                  <span>Favorite Commute Buses</span>
                  <span className="text-rose-400">❤️ {favorites.length} Pinned</span>
                </div>
                <div className="py-1 space-y-1.5">
                  {favoriteBuses.length > 0 ? (
                    favoriteBuses.map((bus) => (
                      <div
                        key={bus.id}
                        className="p-2 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-rose-900/60 flex items-center justify-between transition-colors"
                      >
                        <div
                          className="cursor-pointer flex-1"
                          onClick={() => {
                            const route = routes.find((r) => r.id === bus.routeId);
                            if (route) onSelectRoute(route);
                            onSelectBus(bus);
                            setIsFavoritesOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-white">{bus.busNumber}</span>
                            <span className="text-[10px] text-slate-400">({bus.operatorName})</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Next: {bus.nextStopName} • ETA ~{bus.calculatedRemainingEtaMinutes || 5}m
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(bus);
                          }}
                          className="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer"
                          title="Unpin bus"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No pinned buses yet. Tap the ❤️ icon on any bus card to pin it for quick tracking!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 1-Click Buy Digital Ticket */}
          <button
            type="button"
            onClick={onOpenTicketModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t("digital_ticket")}</span>
          </button>

          {/* Report Delay / Crowding */}
          <button
            data-testid="report-crowding-button"
            type="button"
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t("report_action")}</span>
            <span className="sm:hidden">Report</span>
          </button>

        </div>

      </div>

      {/* Corridor Quick Highlights Strip (Thin, compact bar) */}
      {activeRoute && (
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1 pt-1 border-t border-slate-800/60 gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Corridor: {activeRoute.source} ➔ {activeRoute.destination}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>{activeRoute.stopsCount || activeRoute.stops?.length || 0} Stops</span>
            <span>•</span>
            <span>~{activeRoute.durationMinutes || 35} mins</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">₹{activeRoute.fare || 30} Fare</span>
            <span>•</span>
            <span className="text-teal-300 font-semibold">Real-Road GPS Stream Active</span>
          </div>
        </div>
      )}

    </div>
  );
}
