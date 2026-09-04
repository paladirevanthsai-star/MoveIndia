import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { 
  Wrench, 
  Bus, 
  Clock, 
  Users, 
  ShieldAlert, 
  CheckCircle, 
  Navigation,
  Lock,
  KeyRound,
  ShieldCheck,
  Radio,
  Smartphone,
  Signal,
  MapPin
} from "lucide-react";

const API = "/api";

export default function OperatorDashboard({ buses = [], stops = [], onRefresh }) {
  const { user, verifyOperatorPin } = useAuth();
  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || "");
  const [status, setStatus] = useState("on_time");
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [occupancyLevel, setOccupancyLevel] = useState("seats_available");
  const [selectedStopId, setSelectedStopId] = useState("");
  const [speedKmph, setSpeedKmph] = useState(32);
  const [loading, setLoading] = useState(false);
  const [operatorPin, setOperatorPin] = useState("");
  const [verifyingPin, setVerifyingPin] = useState(false);

  // Phone GPS Beacon State
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [beaconCoords, setBeaconCoords] = useState(null);
  const watchIdRef = useRef(null);

  const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleToggleBeacon = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your device browser.");
      return;
    }

    if (isBeaconActive) {
      // Turn Off
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsBeaconActive(false);
      setBeaconCoords(null);
      if (activeBus) {
        axios.post(`${API}/buses/${activeBus.id}/beacon`, {
          latitude: activeBus.currentLatitude,
          longitude: activeBus.currentLongitude,
          active: false
        }).catch(() => {});
      }
      toast.info("Phone GPS beacon stopped. Switched back to transit engine simulation.");
    } else {
      // Turn On
      if (!activeBus) return;
      toast.loading("Acquiring GPS satellite fix...");

      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, speed, heading, accuracy } = position.coords;
          setBeaconCoords({ latitude, longitude, speed, heading, accuracy });
          try {
            await axios.post(`${API}/buses/${activeBus.id}/beacon`, {
              latitude,
              longitude,
              speedKmph: speed ? Math.round(speed * 3.6) : 32,
              heading: heading !== null ? heading : 90,
              accuracyMeters: Math.round(accuracy),
              active: true
            });
          } catch (err) {}
        },
        (err) => {
          toast.dismiss();
          toast.error("GPS Permission Denied or Signal Weak: " + err.message);
          setIsBeaconActive(false);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 6000 }
      );

      watchIdRef.current = id;
      setIsBeaconActive(true);
      toast.dismiss();
      toast.success(`Live GPS Beacon active for Bus ${activeBus.busNumber}!`);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!operatorPin.trim()) {
      toast.error("Please enter the Operator Badge PIN");
      return;
    }
    setVerifyingPin(true);
    const res = await verifyOperatorPin(operatorPin.trim());
    setVerifyingPin(false);
    if (res.success) {
      setOperatorPin("");
    }
  };

  const handleUpdateBusStatus = async (e) => {
    e.preventDefault();
    if (!activeBus) return;

    setLoading(true);
    try {
      const storedToken = localStorage.getItem("tp_token");
      const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

      const payload = {
        status,
        delayMinutes: Number(delayMinutes),
        occupancyLevel,
        currentStopId: selectedStopId || activeBus.currentStopId,
        speedKmph: Number(speedKmph)
      };

      await axios.patch(`${API}/buses/${activeBus.id}/status`, payload, {
        withCredentials: true,
        headers
      });

      toast.success(`Bus ${activeBus.busNumber} updated successfully!`);
      if (onRefresh) onRefresh();
    } catch (err) {
      const msg = err.response?.data?.detail || "Update failed";
      toast.error(typeof msg === "string" ? msg : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // OPERATOR SECURITY LOCK: If not operator or admin, require PIN
  // -------------------------------------------------------------
  if (user?.role !== "operator" && user?.role !== "admin") {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-slate-900/90 border border-amber-900/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md text-center space-y-6">
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-950/50">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-[10px] font-mono text-amber-300 uppercase tracking-wider mb-2">
              <KeyRound className="w-3 h-3" />
              Depot Controller Access
            </div>
            <h3 className="text-xl font-black text-white">Driver & Operator Clearance</h3>
            <p className="text-xs text-slate-400 mt-2">
              Fleet delay, speed, and occupancy overrides are protected. Enter your Driver Badge PIN or Depot Passcode to unlock the command deck.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 text-left">
                Enter Driver Badge / Depot PIN
              </label>
              <input
                type="password"
                value={operatorPin}
                onChange={(e) => setOperatorPin(e.target.value)}
                placeholder="Default PIN: 1234"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-lg tracking-widest text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={verifyingPin}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>{verifyingPin ? "Verifying..." : "Unlock Operator Deck"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOperatorPin("1234");
                verifyOperatorPin("1234");
              }}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium block mx-auto"
            >
              Quick Test: Unlock with Default PIN (1234)
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-800/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                Operator & Driver Command Deck
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-800">
                Security Cleared
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Broadcast phone GPS, override delay, live occupancy, or current stop checkpoint
            </p>
          </div>
        </div>
      </div>

      {/* Main Control Panel Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* 1. Select Bus */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Select Assigned Bus Fleet
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {buses.map((bus) => {
              const isSelected = activeBus?.id === bus.id;
              return (
                <button
                  key={bus.id}
                  onClick={() => {
                    setSelectedBusId(bus.id);
                    setStatus(bus.status || "on_time");
                    setDelayMinutes(bus.delayMinutes || 0);
                    setOccupancyLevel(bus.occupancyLevel || "seats_available");
                    setSelectedStopId(bus.currentStopId || "");
                    setSpeedKmph(bus.speedKmph || 32);
                  }}
                  className={`flex flex-col text-left p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 text-white shadow-lg"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-amber-400">{bus.busNumber}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      Route {bus.routeId}
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 truncate">{bus.routeName}</span>
                  <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Driver: {bus.operatorName || "Depot Captain"}</span>
                    <span className="text-emerald-400 font-semibold">{bus.speedKmph} km/h</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. REAL PHONE GPS BEACON CARD (Driver Smartphone Transmitter) */}
        {activeBus && (
          <div className="bg-slate-950 border border-blue-900/40 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${
                isBeaconActive 
                  ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30 animate-pulse" 
                  : "bg-slate-900 text-blue-400 border-slate-800"
              }`}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    Phone as Live GPS Beacon
                  </span>
                  {isBeaconActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 animate-pulse flex items-center gap-1">
                      <Signal className="w-3 h-3" />
                      STREAMING REAL GPS
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Turn this smartphone into a live hardware tracker for <strong>{activeBus.busNumber}</strong>
                </p>
                {beaconCoords && isBeaconActive && (
                  <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-2">
                    <span>{beaconCoords.latitude.toFixed(5)}°N, {beaconCoords.longitude.toFixed(5)}°E</span>
                    <span>• ±{beaconCoords.accuracy}m</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleBeacon}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                isBeaconActive
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{isBeaconActive ? "Stop GPS Beacon" : "Start Live Phone Beacon"}</span>
            </button>
          </div>
        )}

        {/* 3. Manual Fleet Override Form */}
        {activeBus && (
          <form onSubmit={handleUpdateBusStatus} className="space-y-5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Override Controls for {activeBus.busNumber}
              </h3>
              <span className="text-xs text-amber-400 font-medium">
                Current Speed: {activeBus.speedKmph} km/h
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bus Status */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Operational Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="on_time">🟢 On Time (Normal Run)</option>
                  <option value="delayed">🔴 Delayed (Traffic / Diversion)</option>
                  <option value="maintenance">🟡 Maintenance / In Depot</option>
                </select>
              </div>

              {/* Delay Minutes */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Added Delay (Minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Passenger Occupancy Level */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Passenger Occupancy Level
                </label>
                <select
                  value={occupancyLevel}
                  onChange={(e) => setOccupancyLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="seats_available">🟢 Seats Available (&lt; 40%)</option>
                  <option value="medium">🟡 Medium Rush / Standing (40% - 75%)</option>
                  <option value="crowded">🔴 Crowded / Packed (&gt; 75%)</option>
                  <option value="full">🚫 Full / Not Boarding</option>
                </select>
              </div>

              {/* Cruising Speed */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Cruising Speed (km/h)
                </label>
                <input
                  type="number"
                  min="10"
                  max="70"
                  value={speedKmph}
                  onChange={(e) => setSpeedKmph(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Checkpoint Stop Override */}
            {stops.length > 0 && (
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Manual Stop Checkpoint Override
                </label>
                <select
                  value={selectedStopId}
                  onChange={(e) => setSelectedStopId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Keep Current Live GPS Progression --</option>
                  {stops.map((s) => (
                    <option key={s.id} value={s.id}>
                      Stop #{s.sequenceNumber}: {s.stopName} ({s.landmark || "Road"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? "Transmitting..." : "Broadcast Fleet Status to Commuters"}</span>
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
