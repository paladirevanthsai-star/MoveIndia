import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Bus as BusIcon, 
  Navigation, 
  Compass, 
  Maximize2, 
  Layers, 
  ExternalLink,
  MapPin
} from "lucide-react";

// Google Maps & Dark Map Tile Configurations
const MAP_TILES = {
  google_streets: {
    id: "google_streets",
    name: "Google Roads",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google Maps",
    maxZoom: 20
  },
  google_hybrid: {
    id: "google_hybrid",
    name: "Google Satellite",
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google Maps Satellite",
    maxZoom: 20
  },
  dark: {
    id: "dark",
    name: "Dark Transit",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    subdomains: ["a", "b", "c", "d"],
    attribution: "&copy; CARTO &copy; OpenStreetMap",
    maxZoom: 19
  }
};

const MONSOON_HAZARDS = [
  {
    id: "h_begumpet",
    city: "Hyderabad",
    title: "Begumpet Underpass Waterlogging",
    lat: 17.4447,
    lng: 78.4664,
    depth: "1.2 ft water accumulation",
    delay: "+15m delay",
    diversion: "Buses taking Greenlands Flyover"
  },
  {
    id: "h_tolichowki",
    city: "Hyderabad",
    title: "Tolichowki Drainage Block",
    lat: 17.3995,
    lng: 78.4124,
    depth: "Water accumulation",
    delay: "+10m delay",
    diversion: "Single lane crawl near Galaxy theatre"
  },
  {
    id: "b_silkboard",
    city: "Bengaluru",
    title: "Silk Board Junction Flooding",
    lat: 12.9176,
    lng: 77.6234,
    depth: "Rainwater ponding",
    delay: "+25m delay",
    diversion: "BMTC buses rerouted via HSR 5th Main"
  },
  {
    id: "d_minto",
    city: "Delhi",
    title: "Minto Bridge Underpass Waterlogged",
    lat: 28.6360,
    lng: 77.2240,
    depth: "Flooded road underpass",
    delay: "+20m delay",
    diversion: "DTC traffic diverted via Barakhamba Road"
  }
];

export default function LiveMap({ 
  buses = [], 
  stops = [], 
  activeRoute, 
  selectedBus, 
  onSelectBus 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const busMarkersRef = useRef({});
  const stopMarkersRef = useRef([]);
  const monsoonMarkersRef = useRef([]);
  const routePolylineRef = useRef(null);
  
  const [mapStyle, setMapStyle] = useState("google_streets"); // google_streets, google_hybrid, dark
  const [showMonsoonAlerts, setShowMonsoonAlerts] = useState(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = stops[0]?.latitude || 17.4344;
      const initialLng = stops[0]?.longitude || 78.5015;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add Base Layer
      const cfg = MAP_TILES[mapStyle] || MAP_TILES.google_streets;
      const tileLayer = L.tileLayer(cfg.url, {
        maxZoom: cfg.maxZoom,
        subdomains: cfg.subdomains,
        attribution: cfg.attribution
      }).addTo(map);

      map._tileLayer = tileLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Tile Layer when user switches style (Google Roads / Google Satellite / Dark)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (map._tileLayer) {
      map.removeLayer(map._tileLayer);
    }

    const cfg = MAP_TILES[mapStyle] || MAP_TILES.google_streets;
    const newTiles = L.tileLayer(cfg.url, {
      maxZoom: cfg.maxZoom,
      subdomains: cfg.subdomains,
      attribution: cfg.attribution
    }).addTo(map);

    newTiles.bringToBack();
    map._tileLayer = newTiles;
  }, [mapStyle]);

  // Update Route Polyline with Real-Road Geometry & Stop Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !stops || stops.length === 0) return;

    // Remove old stops
    stopMarkersRef.current.forEach((m) => map.removeLayer(m));
    stopMarkersRef.current = [];

    // Remove old route polylines
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    // Real-Road Waypoints: Prioritize high-definition road points over straight stop lines!
    const roadCoords = (activeRoute?.roadWaypoints && activeRoute.roadWaypoints.length >= 2)
      ? activeRoute.roadWaypoints
      : stops.map((s) => [s.latitude, s.longitude]);

    // 1. Road Asphalt Base Casing
    const roadCasing = L.polyline(roadCoords, {
      color: mapStyle === "google_streets" ? "#0f172a" : "#022c22",
      weight: 8,
      opacity: 0.85,
      lineCap: "round",
      lineJoin: "round"
    });

    // 2. High-Visibility Glowing Transit Line
    const mainRoadLine = L.polyline(roadCoords, {
      color: "#10b981",
      weight: 5,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round"
    });

    // 3. Directional White Traffic Flow Dashing
    const flowLine = L.polyline(roadCoords, {
      color: "#ffffff",
      weight: 2,
      opacity: 0.75,
      dashArray: "4, 14",
      lineCap: "round"
    });

    routePolylineRef.current = L.layerGroup([roadCasing, mainRoadLine, flowLine]).addTo(map);

    // Add Stop Markers along the Real Roads
    stops.forEach((stop, index) => {
      const isStart = index === 0;
      const isEnd = index === stops.length - 1;
      
      const stopHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xl ${
            isStart
              ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 ring-offset-2 ring-offset-slate-950"
              : isEnd
              ? "bg-rose-500 text-white ring-4 ring-rose-500/30 ring-offset-2 ring-offset-slate-950"
              : "bg-slate-900 text-emerald-400 border-2 border-emerald-500 ring-2 ring-emerald-500/20"
          }">
            ${stop.sequenceNumber}
          </div>
        </div>
      `;

      const stopIcon = L.divIcon({
        className: "custom-stop-icon",
        html: stopHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon }).addTo(map);
      
      marker.bindPopup(
        `<div class="bg-slate-950 text-white p-3 rounded-xl border border-slate-700 shadow-2xl min-w-[210px]">
          <div class="flex items-center gap-1.5 pb-1 mb-1 border-b border-slate-800">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <p class="font-extrabold text-xs text-emerald-400">Stop #${stop.sequenceNumber}: ${stop.stopName}</p>
          </div>
          <p class="text-[11px] text-slate-300 mt-1">Landmark: <strong>${stop.landmark || "Road Waypoint"}</strong></p>
          <div class="mt-2.5 pt-2 border-t border-slate-800">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${stop.latitude},${stop.longitude}&travelmode=transit" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold shadow transition-all">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>Get Directions to Stop via Google Maps</span>
            </a>
          </div>
        </div>`,
        { className: "custom-bus-popup" }
      );

      stopMarkersRef.current.push(marker);
    });

    // Fit map bounds to show full real-road corridor
    if (roadCoords.length > 0) {
      map.fitBounds(L.latLngBounds(roadCoords), { padding: [40, 40], maxZoom: 15 });
    }
  }, [stops, activeRoute, mapStyle]);

  // Monsoon Flood Hazard Warning Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    monsoonMarkersRef.current.forEach((m) => map.removeLayer(m));
    monsoonMarkersRef.current = [];

    if (!showMonsoonAlerts) return;

    MONSOON_HAZARDS.forEach((h) => {
      const hazardHtml = `
        <div class="relative flex items-center justify-center animate-bounce">
          <div class="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xl border-2 border-slate-900">
            ⚠️
          </div>
        </div>
      `;
      const icon = L.divIcon({
        className: "hazard-icon",
        html: hazardHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([h.lat, h.lng], { icon }).addTo(map);
      marker.bindPopup(
        `<div class="bg-slate-950 text-white p-3 rounded-xl border border-amber-500/60 shadow-2xl min-w-[210px]">
          <div class="flex items-center gap-1.5 pb-1 mb-1 border-b border-slate-800">
            <span class="text-amber-400 font-black text-xs">🌧️ Monsoon Flood Alert</span>
          </div>
          <p class="font-bold text-sm text-slate-100 mt-1">${h.title}</p>
          <div class="space-y-1 text-xs text-slate-300 mt-1.5">
            <p><strong class="text-slate-400">Depth:</strong> ${h.depth}</p>
            <p><strong class="text-rose-400">${h.delay}</strong></p>
            <p class="text-[11px] text-amber-300 bg-amber-950/60 p-1.5 rounded-lg border border-amber-900">${h.diversion}</p>
          </div>
        </div>`
      );
      monsoonMarkersRef.current.push(marker);
    });
  }, [showMonsoonAlerts]);

  // Update Live Moving Bus Markers with Exact Road Heading
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const displayBuses = activeRoute
      ? buses.filter((b) => b.routeId === activeRoute.id)
      : buses;

    const currentBusIds = new Set(displayBuses.map((b) => b.id));

    // Remove markers for buses that are no longer active
    Object.keys(busMarkersRef.current).forEach((busId) => {
      if (!currentBusIds.has(busId)) {
        map.removeLayer(busMarkersRef.current[busId]);
        delete busMarkersRef.current[busId];
      }
    });

    displayBuses.forEach((bus) => {
      if (!bus.currentLatitude || !bus.currentLongitude) return;

      const isSelected = selectedBus?.id === bus.id;
      
      let colorClass = "from-emerald-500 to-teal-600";
      let pulseColor = "rgba(16, 185, 129, 0.6)";
      let occupancyBadgeText = "Seats Available";
      let occupancyBadgeBg = "bg-emerald-950 text-emerald-300 border-emerald-700";

      if (bus.occupancyLevel === "medium") {
        colorClass = "from-amber-500 to-yellow-600";
        pulseColor = "rgba(245, 158, 11, 0.6)";
        occupancyBadgeText = "Medium Rush";
        occupancyBadgeBg = "bg-amber-950 text-amber-300 border-amber-700";
      } else if (bus.occupancyLevel === "crowded" || bus.occupancyLevel === "full") {
        colorClass = "from-rose-500 to-red-600";
        pulseColor = "rgba(244, 63, 94, 0.6)";
        occupancyBadgeText = "Crowded";
        occupancyBadgeBg = "bg-rose-950 text-rose-300 border-rose-700";
      }

      const bearingAngle = bus.bearing || 0;

      // Realistic bus marker with compass bearing arrow aligned to road
      const busMarkerHtml = `
        <div class="relative flex items-center justify-center select-none" style="transform: rotate(0deg);">
          <div class="absolute -inset-2 rounded-full animate-ping opacity-30" style="background-color: ${pulseColor};"></div>
          
          <div class="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br ${colorClass} text-white shadow-2xl border-2 ${
            isSelected ? 'border-white scale-125 ring-4 ring-emerald-400/50' : 'border-slate-900'
          } transition-all duration-300">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
            </svg>

            <!-- Direction Pointer aligned to Road Heading -->
            <div class="absolute -top-1 w-2.5 h-2.5 bg-white rounded-full border border-slate-900" style="transform: rotate(${bearingAngle}deg) translateY(-8px);"></div>
          </div>

          <!-- Speed Pill -->
          <div class="absolute -bottom-3 px-1.5 py-0.2 rounded-full bg-slate-950/90 border border-slate-700 text-[9px] font-mono font-bold text-white shadow">
            ${bus.speedKmph || 25}k
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        className: "custom-live-bus-marker",
        html: busMarkerHtml,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const newPos = [bus.currentLatitude, bus.currentLongitude];

      if (busMarkersRef.current[bus.id]) {
        busMarkersRef.current[bus.id].setLatLng(newPos);
        busMarkersRef.current[bus.id].setIcon(busIcon);
      } else {
        const marker = L.marker(newPos, { icon: busIcon }).addTo(map);
        marker.on("click", () => {
          onSelectBus(bus);
        });
        busMarkersRef.current[bus.id] = marker;
      }

      // Bus Popup with Real-Road Details and Google Maps Integration
      busMarkersRef.current[bus.id].bindPopup(
        `<div class="bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-700 shadow-2xl min-w-[230px]">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div>
              <span class="font-extrabold text-sm text-emerald-400 block">${bus.busNumber}</span>
              <span class="text-[10px] text-slate-400 font-mono">Heading ${Math.round(bearingAngle)}°</span>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded border ${occupancyBadgeBg} font-bold">${occupancyBadgeText}</span>
          </div>

          <div class="space-y-1 text-xs">
            <p class="text-slate-300"><strong class="text-slate-400">Road Location:</strong> ${bus.currentStopName ? `Near ${bus.currentStopName}` : "In Transit"}</p>
            <p class="text-slate-300"><strong class="text-slate-400">Next Approaching:</strong> ${bus.nextStopName || "Approaching"}</p>
            <div class="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>Cruising: <strong>${bus.speedKmph || 30} km/h</strong></span>
              <span>Status: <strong class="${bus.status === 'delayed' ? 'text-rose-400' : 'text-emerald-400'}">${bus.status === 'delayed' ? `+${bus.delayMinutes}m delay` : 'On Time'}</strong></span>
            </div>
          </div>

          <!-- Google Maps Integration Links -->
          <div class="mt-3 pt-2.5 border-t border-slate-800 flex flex-col gap-1.5">
            <a href="https://www.google.com/maps?q=${bus.currentLatitude},${bus.currentLongitude}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/30">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>Track Live in Google Maps</span>
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${bus.currentLatitude},${bus.currentLongitude}&travelmode=transit" target="_blank" rel="noopener noreferrer" class="text-center text-[10px] text-blue-400 hover:text-blue-300 font-semibold py-0.5">
              Get Turn-by-Turn Directions &rarr;
            </a>
          </div>
        </div>`,
        { className: "custom-bus-popup", closeButton: false }
      );
    });
  }, [buses, activeRoute, selectedBus]);

  // Center on Selected Bus
  const handleCenterSelectedBus = () => {
    if (!selectedBus || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(
      [selectedBus.currentLatitude, selectedBus.currentLongitude],
      15,
      { animate: true, duration: 1.2 }
    );
  };

  // Automatically flyTo and highlight bus when selected via SearchBar or cards
  useEffect(() => {
    if (selectedBus && mapInstanceRef.current && selectedBus.currentLatitude && selectedBus.currentLongitude) {
      mapInstanceRef.current.flyTo(
        [selectedBus.currentLatitude, selectedBus.currentLongitude],
        15,
        { animate: true, duration: 1.0 }
      );
      const marker = busMarkersRef.current[selectedBus.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 400);
      }
    }
  }, [selectedBus?.id]);

  // Fit all route waypoints
  const handleFitRouteBounds = () => {
    if (!mapInstanceRef.current || stops.length === 0) return;
    const coords = (activeRoute?.roadWaypoints && activeRoute.roadWaypoints.length >= 2)
      ? activeRoute.roadWaypoints
      : stops.map((s) => [s.latitude, s.longitude]);
    mapInstanceRef.current.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });
  };

  // Full corridor Google Maps Transit Link
  const googleMapsRouteUrl = stops.length >= 2
    ? `https://www.google.com/maps/dir/?api=1&origin=${stops[0].latitude},${stops[0].longitude}&destination=${stops[stops.length - 1].latitude},${stops[stops.length - 1].longitude}&travelmode=transit`
    : `https://www.google.com/maps?q=${stops[0]?.latitude || 17.4344},${stops[0]?.longitude || 78.5015}`;

  return (
    <div className="relative w-full h-full min-h-[440px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        data-testid="leaflet-live-map"
        className="w-full h-full min-h-[440px] z-0" 
      />

      {/* Floating Map Status Overlay Top-Left */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 px-3 py-1.5 rounded-xl shadow-lg">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-slate-200">
          Real-Road GPS: <strong className="text-emerald-400">{buses.length} Buses Moving</strong>
        </span>
      </div>

      {/* Map Action Quick Controls & Google Maps Connectivity Top-Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        
        {/* Google Maps Layer Switcher Pill */}
        <div className="flex items-center bg-slate-900/90 border border-slate-700/70 p-1 rounded-xl shadow-lg backdrop-blur-md text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMapStyle("google_streets")}
            title="Google Maps Real Roads"
            className={`px-2 py-1 rounded-lg transition-all ${
              mapStyle === "google_streets"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Google Roads
          </button>
          <button
            type="button"
            onClick={() => setMapStyle("google_hybrid")}
            title="Google Maps Satellite Hybrid"
            className={`px-2 py-1 rounded-lg transition-all ${
              mapStyle === "google_hybrid"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapStyle("dark")}
            title="Dark Transit Theme"
            className={`px-2 py-1 rounded-lg transition-all ${
              mapStyle === "dark"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Dark
          </button>
        </div>

        {/* Open Corridor in Google Maps Directions */}
        <a
          href={googleMapsRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open entire corridor in Google Maps Transit Navigation"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 backdrop-blur-md transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Google Maps</span>
        </a>

        {/* Monsoon Road Hazard Alerts Toggle */}
        <button
          type="button"
          onClick={() => setShowMonsoonAlerts(!showMonsoonAlerts)}
          title="Toggle Monsoon Waterlogging & Flood Obstacle Alerts"
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1 ${
            showMonsoonAlerts
              ? "bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/20 shadow-lg"
              : "bg-slate-900/80 border-slate-700/70 text-slate-400 hover:text-white"
          }`}
        >
          <span>🌧️ Alerts</span>
        </button>

        {/* Fit Bounds */}
        <button
          data-testid="map-fit-route-btn"
          onClick={handleFitRouteBounds}
          title="Fit Route to Screen"
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/70 shadow-lg backdrop-blur-md transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Focus Bus */}
        {selectedBus && (
          <button
            data-testid="map-center-bus-btn"
            onClick={handleCenterSelectedBus}
            title="Focus Active Bus"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 backdrop-blur-md transition-all animate-pulse"
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Focus</span>
          </button>
        )}
      </div>

      {/* Legend Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[11px] shadow-xl">
        <span className="text-slate-400 font-semibold">Real-Road Flow:</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
          <span className="text-slate-300 font-medium">Seats Available</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
          <span className="text-slate-300 font-medium">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
          <span className="text-slate-300 font-medium">Crowded</span>
        </div>
      </div>
    </div>
  );
}
