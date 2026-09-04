import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Camera, 
  Cpu, 
  Layers, 
  Wifi, 
  AlertTriangle, 
  Eye, 
  ShieldAlert, 
  Activity, 
  Car, 
  Users, 
  Maximize2,
  Play,
  Pause,
  CheckCircle2,
  HardDrive
} from "lucide-react";
import { toast } from "sonner";

export default function OnboardEdgeAiVision({ buses = [], selectedBus, onSelectBus }) {
  const [activeBusId, setActiveBusId] = useState(selectedBus?.id || buses[0]?.id || "b101_1");
  const [telemetry, setTelemetry] = useState(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const [activeCamTab, setActiveCamTab] = useState("all"); // all, front, left, right, anpr

  const currentBus = buses.find((b) => b.id === activeBusId) || buses[0];

  // Fetch live telemetry from edge endpoint
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await axios.get("/api/sih/edge-telemetry");
        setTelemetry(res.data);
      } catch (e) {}
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* SIH Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
              <Camera className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  Onboard Edge-AI Multi-Camera Perception
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 animate-pulse">
                  EDGE INFERENCE ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Transforming bus cameras into mobile urban sensors • Real-time Potholes, Zebra Crossings, Pedestrian Safety & ANPR
              </p>
            </div>
          </div>

          {/* Bus Selector */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-1.5 rounded-2xl">
            <span className="text-xs text-slate-400 font-bold px-2">Select Bus Unit:</span>
            <select
              value={activeBusId}
              onChange={(e) => {
                setActiveBusId(e.target.value);
                const chosen = buses.find((b) => b.id === e.target.value);
                if (chosen && onSelectBus) onSelectBus(chosen);
              }}
              className="bg-slate-900 text-xs text-emerald-400 font-black border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.busNumber} ({b.routeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Edge-AI Bandwidth Minimization & Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Bandwidth Saved</span>
            <span className="text-lg font-black text-emerald-400">
              {telemetry?.bandwidthSavingsPercent || 99.87}%
            </span>
            <span className="text-[9px] text-slate-500 block">Intelligent Edge Pruning</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Edge vs Cloud Data</span>
            <span className="text-lg font-black text-white">
              {telemetry?.edgeMetadataTransmittedMb || 112} MB <span className="text-xs font-normal text-slate-500">/ {telemetry?.rawVideoBandwidthEquivalentGb || 84} GB raw</span>
            </span>
            <span className="text-[9px] text-slate-500 block">Only JSON metadata streamed</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Edge AI Latency</span>
            <span className="text-lg font-black text-teal-300">
              {telemetry?.avgInferenceLatencyMs || 24} ms
            </span>
            <span className="text-[9px] text-slate-500 block">Jetson Edge Neural Core</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicles Counted Today</span>
            <span className="text-lg font-black text-indigo-400">
              {telemetry?.activeDetectionsToday?.vehiclesClassified || "26,410"}
            </span>
            <span className="text-[9px] text-slate-500 block">2-Wheelers, Autos, Cars</span>
          </div>
        </div>

      </div>

      {/* 4-Camera Live Split Perception View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CAMERA 1: FRONT WINDSHIELD ROAD SCANNER */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl relative group">
          {/* Camera Header Bar */}
          <div className="flex items-center justify-between p-3 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-extrabold text-white">CAM 01: Front Road Scanner (Wide 120°)</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              28.5 FPS • 1080p
            </span>
          </div>

          {/* Video Simulator Frame */}
          <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
            {/* Synthetic Asphalt Road Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 opacity-90"></div>
            
            {/* Perspective Road Markings */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 225">
              {/* Horizon & Vanishing Point */}
              <line x1="160" y1="90" x2="40" y2="225" stroke="#334155" strokeWidth="3" />
              <line x1="240" y1="90" x2="360" y2="225" stroke="#334155" strokeWidth="3" />
              <line x1="200" y1="90" x2="200" y2="225" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="12,16" className="animate-[dash_1s_linear_infinite]" />
            </svg>

            {/* AI Bounding Box 1: Pothole Detected */}
            <div className="absolute top-[52%] left-[32%] w-28 h-14 border-2 border-rose-500 bg-rose-500/10 rounded shadow-lg shadow-rose-500/20 animate-pulse">
              <div className="absolute -top-6 left-0 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                <span>⚠️ Pothole (Depth ~14cm) 94%</span>
              </div>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[9px] font-mono text-rose-300 font-bold">CRITICAL DEFECT</span>
              </div>
            </div>

            {/* AI Bounding Box 2: Leading Car */}
            <div className="absolute top-[35%] left-[54%] w-24 h-16 border-2 border-sky-500 bg-sky-500/10 rounded">
              <div className="absolute -top-5 left-0 bg-sky-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                Vehicle: Maruti Swift (98%)
              </div>
            </div>

            {/* AI Bounding Box 3: Missing Zebra Crossing */}
            <div className="absolute bottom-2 left-6 right-6 h-10 border-2 border-dashed border-amber-400 bg-amber-400/10 rounded flex items-center justify-center">
              <span className="text-[10px] font-black text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500">
                ⚠️ DEFICIENCY: Missing Zebra Crossing Detected (89%)
              </span>
            </div>

            {/* Edge AI Watermark Overlay */}
            <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
              MODEL: YOLO-v8-RoadDefect • LATENCY: 22ms
            </div>
          </div>

          {/* Camera Footer Detections summary */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Primary Focus: <strong>Road Surface & Signs</strong></span>
            <span className="text-rose-400 font-bold">1 Pothole • 1 Deficient Crossing</span>
          </div>
        </div>

        {/* CAMERA 2: LEFT CURB & PEDESTRIAN SAFETY */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl relative group">
          <div className="flex items-center justify-between p-3 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-extrabold text-white">CAM 02: Left Curb & Pedestrian Safety</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              29.0 FPS • 1080p
            </span>
          </div>

          <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950"></div>

            {/* AI Bounding Box: Vulnerable School Child */}
            <div className="absolute top-[38%] left-[26%] w-16 h-28 border-2 border-amber-400 bg-amber-400/15 rounded-lg shadow-lg shadow-amber-500/20 animate-pulse">
              <div className="absolute -top-6 left-0 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                <span>🚸 School Child (95%)</span>
              </div>
              <div className="w-full h-full flex items-end justify-center pb-1">
                <span className="text-[8px] font-mono text-amber-300 font-bold">CROSSING ZONE</span>
              </div>
            </div>

            {/* AI Bounding Box: Bus Stop Shelter */}
            <div className="absolute top-[30%] right-[18%] w-32 h-36 border border-teal-500 bg-teal-500/5 rounded">
              <div className="absolute -top-5 left-0 bg-teal-600 text-white text-[9px] font-bold px-1 py-0.2 rounded">
                Shelter Curb (91%)
              </div>
            </div>

            <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
              MODEL: YOLO-Pedestrian-Safe • LATENCY: 19ms
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Pedestrian Proximity: <strong className="text-amber-400">Caution Active</strong></span>
            <span className="text-emerald-400 font-bold">Speed Governed &lt; 25 km/h</span>
          </div>
        </div>

        {/* CAMERA 3: RIGHT TRAFFIC & VEHICLE DENSITY */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl relative group">
          <div className="flex items-center justify-between p-3 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-extrabold text-white">CAM 03: Right Traffic & Vehicle Density</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              27.8 FPS • 1080p
            </span>
          </div>

          <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-900 to-slate-950"></div>

            {/* AI Bounding Box: Two Wheeler */}
            <div className="absolute top-[42%] left-[22%] w-16 h-20 border-2 border-emerald-500 bg-emerald-500/10 rounded">
              <div className="absolute -top-5 left-0 bg-emerald-600 text-slate-950 text-[9px] font-black px-1 py-0.2 rounded">
                2-Wheeler (96%)
              </div>
            </div>

            {/* AI Bounding Box: Auto-Rickshaw */}
            <div className="absolute top-[36%] left-[48%] w-22 h-24 border-2 border-amber-400 bg-amber-400/10 rounded">
              <div className="absolute -top-5 left-0 bg-amber-500 text-slate-950 text-[9px] font-black px-1 py-0.2 rounded">
                Auto-Rickshaw (93%)
              </div>
            </div>

            {/* Traffic Density Banner */}
            <div className="absolute top-3 right-3 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-bold">
              <span className="text-slate-400">Flow Density: </span>
              <span className="text-amber-400">24 veh / 100m (Moderate)</span>
            </div>

            <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
              MODEL: DeepSort-TrafficFlow • LATENCY: 26ms
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Classified: <strong>1 Moto, 1 Auto, 2 Sedans</strong></span>
            <span className="text-emerald-400 font-bold">Flow Status: Normal</span>
          </div>
        </div>

        {/* CAMERA 4: HIGH-SPEED ANPR & RASH DRIVING */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl relative group">
          <div className="flex items-center justify-between p-3 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-extrabold text-white">CAM 04: High-Speed ANPR Telephoto Zoom</span>
            </div>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 font-bold">
              OFFENSE FLAGGED
            </span>
          </div>

          <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-950"></div>

            {/* Zoom Reticle */}
            <div className="absolute inset-8 border border-dashed border-rose-500/40 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-12 h-12 border-t-2 border-l-2 border-rose-500 absolute top-2 left-2"></div>
              <div className="w-12 h-12 border-t-2 border-r-2 border-rose-500 absolute top-2 right-2"></div>
              <div className="w-12 h-12 border-b-2 border-l-2 border-rose-500 absolute bottom-2 left-2"></div>
              <div className="w-12 h-12 border-b-2 border-r-2 border-rose-500 absolute bottom-2 right-2"></div>
            </div>

            {/* Cropped License Plate Card */}
            <div className="relative bg-slate-900 border-2 border-rose-500 p-4 rounded-2xl shadow-2xl text-center space-y-2 max-w-[260px]">
              <div className="bg-yellow-400 text-slate-950 font-mono font-black text-base px-3 py-1 rounded tracking-widest border border-slate-950 shadow-inner">
                TS 09 EA 3112
              </div>
              <div className="text-[11px] text-slate-300 space-y-0.5">
                <p>Speed: <strong className="text-rose-400">86 km/h</strong> (Limit: 40 km/h)</p>
                <p>OCR Confidence: <strong className="text-emerald-400">97.4%</strong></p>
                <p className="text-[10px] text-slate-400">Rash Driving & Bus Bay Encroachment</p>
              </div>
            </div>

            <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
              ANPR OCR CORE: LPRNet-India • LATENCY: 18ms
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="text-rose-400 font-bold">🚨 Offense Transmitted to Police</span>
            <span className="text-slate-400">FIR Evidence Logged</span>
          </div>
        </div>

      </div>

    </div>
  );
}
