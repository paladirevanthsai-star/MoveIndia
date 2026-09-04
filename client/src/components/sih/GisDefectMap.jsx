import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { 
  AlertTriangle, 
  Layers, 
  Filter, 
  MapPin, 
  ExternalLink, 
  Wrench, 
  CheckCircle2, 
  Sparkles,
  Flame,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

export default function GisDefectMap({ activeRoute, onOpenWorkOrderModal }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [defects, setDefects] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all, pothole, missing_zebra_crossing, missing_road_divider, damaged_signboard
  const [filterSeverity, setFilterSeverity] = useState("all"); // all, critical, high, moderate
  const [mapLayer, setMapLayer] = useState("google_streets");
  const [selectedDefect, setSelectedDefect] = useState(null);

  // Fetch defects from backend
  useEffect(() => {
    const fetchDefects = async () => {
      try {
        const res = await axios.get("/api/sih/defects");
        setDefects(res.data || []);
      } catch (e) {
        console.error("Failed to load defects", e);
      }
    };
    fetchDefects();
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [17.4375, 78.4482],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const tileUrl = mapLayer === "google_hybrid"
        ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

      const tile = L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(map);
      map._tileLayer = tile;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (map._tileLayer) map.removeLayer(map._tileLayer);

    const tileUrl = mapLayer === "google_hybrid"
      ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
      : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

    const newTile = L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(map);
    newTile.bringToBack();
    map._tileLayer = newTile;
  }, [mapLayer]);

  // Render Defect Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || defects.length === 0) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const filtered = defects.filter((d) => {
      if (filterType !== "all" && d.type !== filterType) return false;
      if (filterSeverity !== "all" && d.severity !== filterSeverity) return false;
      return true;
    });

    filtered.forEach((d) => {
      const isCritical = d.severity === "critical";
      const isHigh = d.severity === "high";

      let iconColor = isCritical ? "bg-rose-500 text-white" : isHigh ? "bg-amber-500 text-slate-950" : "bg-yellow-500 text-slate-950";
      let pulseColor = isCritical ? "bg-rose-500" : isHigh ? "bg-amber-500" : "bg-yellow-500";
      let iconEmoji = d.type === "pothole" ? "🕳️" : d.type === "missing_zebra_crossing" ? "🦓" : d.type === "missing_road_divider" ? "🚧" : "🛑";

      const html = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-1.5 rounded-full animate-ping opacity-40 ${pulseColor}"></div>
          <div class="w-8 h-8 rounded-2xl ${iconColor} flex items-center justify-center font-bold text-sm shadow-2xl border-2 border-slate-900 transition-transform group-hover:scale-125">
            ${iconEmoji}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: "defect-map-icon",
        html,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([d.latitude, d.longitude], { icon }).addTo(map);

      marker.on("click", () => {
        setSelectedDefect(d);
      });

      marker.bindPopup(
        `<div class="bg-slate-950 text-white p-3 rounded-2xl border border-slate-700 shadow-2xl min-w-[240px]">
          <div class="flex items-center justify-between pb-1 mb-2 border-b border-slate-800">
            <span class="text-xs font-black text-white">${d.title}</span>
            <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}">
              ${d.severity}
            </span>
          </div>
          <p class="text-[11px] text-slate-300">${d.locationName}</p>
          <div class="mt-2 text-[10px] text-slate-400 space-y-1">
            <p>Confidence: <strong class="text-emerald-400">${(d.confidence * 100).toFixed(1)}%</strong></p>
            <p>Verified By: <strong class="text-teal-300">${d.detectedByBusesCount} Bus Edge Cams</strong></p>
            <p class="text-rose-400 font-semibold">${d.hazardLevel}</p>
          </div>
          <div class="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5">
            <a href="https://www.google.com/maps?q=${d.latitude},${d.longitude}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all">
              Google Maps
            </a>
          </div>
        </div>`
      );

      markersRef.current.push(marker);
    });

    if (filtered.length > 0) {
      const coords = filtered.map((d) => [d.latitude, d.longitude]);
      map.fitBounds(L.latLngBounds(coords), { padding: [50, 50], maxZoom: 15 });
    }
  }, [defects, filterType, filterSeverity]);

  const handleCreateWorkOrder = async (defect) => {
    try {
      const res = await axios.post(`/api/sih/defects/${defect.id}/work-order`);
      toast.success(`Work Order ${res.data.workOrder.id} dispatched to PWD Rapid Repair Unit!`);
      // Update local state
      setDefects((prev) =>
        prev.map((d) => (d.id === defect.id ? { ...d, status: "work_order_created" } : d))
      );
      if (selectedDefect?.id === defect.id) {
        setSelectedDefect({ ...selectedDefect, status: "work_order_created" });
      }
    } catch (e) {
      toast.error("Failed to dispatch work order");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/60 border border-rose-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/30">
              <AlertTriangle className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  GIS Road Defect & Infrastructure Deficiency Map
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-800">
                  {defects.length} ACTIVE DEFECTS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Aggregated from entire bus fleet • Potholes, damaged dividers, missing zebra crossings & signboards
              </p>
            </div>
          </div>

          {/* Map Layer Switcher */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setMapLayer("google_streets")}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapLayer === "google_streets" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Google Roads
            </button>
            <button
              onClick={() => setMapLayer("google_hybrid")}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapLayer === "google_hybrid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-rose-400" />
            Filter Defect Type:
          </span>

          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              filterType === "all" ? "bg-slate-700 text-white" : "bg-slate-950 border border-slate-800 text-slate-400"
            }`}
          >
            All Types ({defects.length})
          </button>
          <button
            onClick={() => setFilterType("pothole")}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              filterType === "pothole" ? "bg-rose-600 text-white" : "bg-slate-950 border border-slate-800 text-slate-400"
            }`}
          >
            🕳️ Potholes
          </button>
          <button
            onClick={() => setFilterType("missing_zebra_crossing")}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              filterType === "missing_zebra_crossing" ? "bg-amber-600 text-white" : "bg-slate-950 border border-slate-800 text-slate-400"
            }`}
          >
            🦓 Missing Zebra Crossings
          </button>
          <button
            onClick={() => setFilterType("missing_road_divider")}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              filterType === "missing_road_divider" ? "bg-red-600 text-white" : "bg-slate-950 border border-slate-800 text-slate-400"
            }`}
          >
            🚧 Broken Dividers
          </button>
          <button
            onClick={() => setFilterType("damaged_signboard")}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              filterType === "damaged_signboard" ? "bg-yellow-600 text-white" : "bg-slate-950 border border-slate-800 text-slate-400"
            }`}
          >
            🛑 Damaged Signs
          </button>
        </div>
      </div>

      {/* Map + Detail Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaflet GIS Map Container (2 cols) */}
        <div className="lg:col-span-2 relative h-[540px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          
          {/* Defect Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[11px] shadow-xl">
            <span className="text-slate-400 font-bold">Severity Legend:</span>
            <span className="flex items-center gap-1 text-rose-300 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical</span>
            <span className="flex items-center gap-1 text-amber-300 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High</span>
            <span className="flex items-center gap-1 text-yellow-300 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Moderate</span>
          </div>
        </div>

        {/* Selected Defect Detail Card & Work Order Action (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              Defect Telemetry Evidence
            </h3>
            <span className="text-[10px] text-slate-400">Click any map pin</span>
          </div>

          {selectedDefect ? (
            <div className="space-y-4">
              {/* Photo Evidence */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
                <img 
                  src={selectedDefect.snapshotUrl} 
                  alt={selectedDefect.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-emerald-400 border border-slate-800">
                  BUS EDGE CAM PROOF #{selectedDefect.busId}
                </div>
              </div>

              <div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  selectedDefect.severity === "critical" ? "bg-rose-950 text-rose-300 border border-rose-800" : "bg-amber-950 text-amber-300 border border-amber-800"
                }`}>
                  {selectedDefect.severity} Priority
                </span>
                <h4 className="font-bold text-base text-white mt-1.5">{selectedDefect.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedDefect.locationName}</p>
              </div>

              {/* Defect Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">AI Confidence</span>
                  <span className="font-black text-emerald-400">{(selectedDefect.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Verified By</span>
                  <span className="font-black text-teal-300">{selectedDefect.detectedByBusesCount} Bus Scans</span>
                </div>
              </div>

              {/* Hazard Note */}
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
                <strong>Hazard Impact:</strong> {selectedDefect.hazardLevel}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {selectedDefect.status === "work_order_created" ? (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>PWD Work Order Dispatched & Tracked</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCreateWorkOrder(selectedDefect)}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Dispatch Municipal PWD Work Order</span>
                  </button>
                )}

                <a
                  href={`https://www.google.com/maps?q=${selectedDefect.latitude},${selectedDefect.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Navigate in Google Maps</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <MapPin className="w-10 h-10 mx-auto text-slate-700 animate-bounce" />
              <p className="text-sm font-semibold">Select a defect marker on the map</p>
              <p className="text-xs">Click any icon to inspect edge camera evidence, dimensions, and dispatch PWD maintenance tickets.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
