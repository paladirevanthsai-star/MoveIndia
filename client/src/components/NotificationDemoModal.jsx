import React, { useState } from "react";
import { 
  Bell, 
  X, 
  Volume2, 
  ShieldAlert, 
  AlertTriangle, 
  Bus, 
  QrCode, 
  CloudRain, 
  CheckCircle2,
  Smartphone,
  Sparkles
} from "lucide-react";
import { 
  playBusApproachingChime, 
  playEmergencyAlertSound, 
  playHazardWarningSound, 
  playSuccessChime,
  requestNotificationPermission 
} from "../utils/audioAlarm";
import { toast } from "sonner";

export default function NotificationDemoModal({ isOpen, onClose }) {
  const [hasPermission, setHasPermission] = useState(
    typeof window !== "undefined" && "Notification" in window 
      ? Notification.permission === "granted" 
      : false
  );

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      toast.success("Push notifications enabled! You will now receive system notifications.");
    } else {
      toast.error("Notification permission denied or blocked by browser.");
    }
  };

  const triggerNotification = (title, body, soundFn, type = "info") => {
    // 1. Play synthesized audio chime
    soundFn();

    // 2. Trigger native OS / Phone system notification
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z'/></svg>",
          vibrate: [200, 100, 200]
        });
      } catch (e) {}
    }

    // 3. Trigger Sonner rich in-app toast
    if (type === "emergency") {
      toast.error(title, { description: body, duration: 6000 });
    } else if (type === "warning") {
      toast.warning(title, { description: body, duration: 5000 });
    } else if (type === "success") {
      toast.success(title, { description: body, duration: 5000 });
    } else {
      toast.info(title, { description: body, duration: 5000 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Move India Notification Demo Center
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  LIVE AUDIO & PUSH
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Test audio chimes, native smartphone notifications & SIH alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* Permission Status Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Native Browser & Smartphone Push: {hasPermission ? "🟢 ENABLED" : "🟡 PENDING"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {hasPermission 
                    ? "System alerts will appear on your desktop & phone lockscreen" 
                    : "Enable to test real OS push notifications on your device"}
                </span>
              </div>
            </div>

            {!hasPermission && (
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-500/20 shrink-0 cursor-pointer"
              >
                Enable Push
              </button>
            )}
          </div>

          <div className="space-y-3">
            
            {/* Demo 1: Bus Approaching Proximity Chime */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-white block">
                    1. Bus Approaching Proximity Alert
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Plays ascending harmonic chime (F#5 ➔ A#5 ➔ C#6) when bus is ~2 mins / 1 stop away.
                  </p>
                </div>
              </div>

              <button
                onClick={() => triggerNotification(
                  "🚍 Bus Approaching: TSRTC 101-A",
                  "Your bus is arriving at Begumpet Stop in ~2 mins! Ready to board.",
                  playBusApproachingChime,
                  "info"
                )}
                className="px-3 py-2 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shrink-0 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Chime</span>
              </button>
            </div>

            {/* Demo 2: SIH Police ANPR Hit-and-Run Violation */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-red-500/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 text-rose-400 border border-red-500/20 mt-0.5">
                  <ShieldAlert className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-black text-rose-300 block">
                    2. Police ANPR Emergency Alert
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Plays dual-tone police siren (880Hz / 1175Hz). Flagged vehicle plate TS 09 EA 3112.
                  </p>
                </div>
              </div>

              <button
                onClick={() => triggerNotification(
                  "🚨 POLICE ALERT: Hit-and-Run Detected!",
                  "Vehicle TS 09 EA 3112 (97.4% OCR Confidence) near Begumpet Flyover. Dispatched to Command Center.",
                  playEmergencyAlertSound,
                  "emergency"
                )}
                className="px-3 py-2 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shrink-0 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Siren</span>
              </button>
            </div>

            {/* Demo 3: Municipal PWD Road Defect Alert */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-amber-300 block">
                    3. Municipal PWD Defect Alert
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Low-frequency rumble pulse. Auto-generates work order ticket for GHMC / BBMP.
                  </p>
                </div>
              </div>

              <button
                onClick={() => triggerNotification(
                  "🕳️ ROAD DEFECT: Severe 14cm Pothole Detected",
                  "Verified by Bus 101 AI camera. Maintenance Work Order #WO-HYD-2024-001 created.",
                  playHazardWarningSound,
                  "warning"
                )}
                className="px-3 py-2 bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shrink-0 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Rumble</span>
              </button>
            </div>

            {/* Demo 4: Monsoon Flood & Choke-Point Alert */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-blue-300 block">
                    4. Monsoon Waterlogging Advisory
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Advises commuters of heavy waterlogging and real-time route diversions.
                  </p>
                </div>
              </div>

              <button
                onClick={() => triggerNotification(
                  "🌊 MONSOON ALERT: Waterlogging at Underpass",
                  "1.5 ft water detected near Begumpet. Bus Route 101 diverted via SP Road Flyover.",
                  playHazardWarningSound,
                  "warning"
                )}
                className="px-3 py-2 bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shrink-0 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Flood</span>
              </button>
            </div>

            {/* Demo 5: UPI Ticket Pass Confirmed */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-teal-500/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 mt-0.5">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-teal-300 block">
                    5. UPI Digital Ticket Confirmed
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Crisp positive confirmation chime (C6 ➔ G6) when QR pass is paid & issued.
                  </p>
                </div>
              </div>

              <button
                onClick={() => triggerNotification(
                  "🎫 TICKET CONFIRMED: Move India Pass",
                  "₹25 paid via Google Pay. Dynamic security QR pass activated for Bus 101.",
                  playSuccessChime,
                  "success"
                )}
                className="px-3 py-2 bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-teal-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shrink-0 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Success</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
