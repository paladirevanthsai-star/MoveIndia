import React, { useState, useEffect } from "react";
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  Bus, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CreditCard,
  Download,
  Share2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function TicketModal({ isOpen, onClose, activeRoute, stops = [] }) {
  const { user } = useAuth();
  const [fromStopId, setFromStopId] = useState(stops[0]?.id || "");
  const [toStopId, setToStopId] = useState(stops[stops.length - 1]?.id || "");
  const [passengerCount, setPassengerCount] = useState(1);
  const [paymentApp, setPaymentApp] = useState("gpay"); // gpay, phonepe, paytm
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTicket, setActiveTicket] = useState(() => {
    try {
      const saved = localStorage.getItem("move_india_active_ticket");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Calculate fare based on stop distance
  const fromIdx = stops.findIndex((s) => s.id === fromStopId);
  const toIdx = stops.findIndex((s) => s.id === toStopId);
  const stopDiff = Math.max(1, Math.abs(toIdx - fromIdx));
  const baseFare = activeRoute?.fare || 30;
  const unitFare = Math.round(Math.max(15, (baseFare / Math.max(1, stops.length)) * stopDiff * 1.2));
  const totalAmount = unitFare * passengerCount;

  const fromStop = stops.find((s) => s.id === fromStopId) || stops[0];
  const toStop = stops.find((s) => s.id === toStopId) || stops[stops.length - 1];

  const handlePayAndGenerateTicket = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newTicket = {
        id: `MI-${activeRoute?.routeNumber?.replace("-", "") || "TSRTC"}-${Math.floor(100000 + Math.random() * 900000)}`,
        routeNumber: activeRoute?.routeNumber || "101-H",
        routeName: activeRoute?.routeName || "Metro Corridor",
        city: activeRoute?.city || "Hyderabad (TSRTC)",
        fromStopName: fromStop?.stopName || "Origin",
        toStopName: toStop?.stopName || "Destination",
        passengers: passengerCount,
        fare: totalAmount,
        paymentApp: paymentApp.toUpperCase(),
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
        passengerName: user?.name || "Commuter"
      };

      setActiveTicket(newTicket);
      try {
        localStorage.setItem("move_india_active_ticket", JSON.stringify(newTicket));
      } catch (e) {}

      setIsProcessing(false);
      toast.success(`Payment of ₹${totalAmount} via ${paymentApp.toUpperCase()} successful! QR Pass issued.`);
    }, 1200);
  };

  const handleCancelTicket = () => {
    setActiveTicket(null);
    localStorage.removeItem("move_india_active_ticket");
    toast.info("Ticket pass expired/cleared");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {activeTicket ? "Active Digital Transit Pass" : "Buy Instant Digital Bus Ticket"}
              </h3>
              <p className="text-xs text-slate-400">
                100% Cashless • Instant Conductor Validation via QR
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

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {activeTicket ? (
            /* ------------------ ACTIVE TICKET PASS VIEW ------------------ */
            <div className="space-y-4">
              
              {/* Animated Anti-Fraud Security Ribbon */}
              <div className="relative h-2 rounded-full overflow-hidden bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 animate-[shimmer_2s_infinite] w-[200%]"></div>
              </div>

              {/* Physical-style Pass Card */}
              <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden space-y-4">
                
                {/* Brand & Route Title */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white">Move India Pass</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                      LIVE & VALID
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    Route {activeTicket.routeNumber}
                  </span>
                </div>

                {/* Journey Stops */}
                <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Boarding</span>
                    <span className="font-bold text-white text-sm">{activeTicket.fromStopName}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Destination</span>
                    <span className="font-bold text-white text-sm">{activeTicket.toStopName}</span>
                  </div>
                </div>

                {/* Dynamic SVG QR Code Matrix */}
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner">
                  <div className="relative p-2 bg-white">
                    <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                      {/* Stylized high-density QR code visual */}
                      <rect x="0" y="0" width="30" height="30" rx="3" fill="#0f172a" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="#0f172a" />
                      
                      <rect x="70" y="0" width="30" height="30" rx="3" fill="#0f172a" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" fill="#0f172a" />

                      <rect x="0" y="70" width="30" height="30" rx="3" fill="#0f172a" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" fill="#0f172a" />

                      {/* Pattern Dots */}
                      <circle cx="45" cy="15" r="4" fill="#0f172a" />
                      <circle cx="55" cy="25" r="3" fill="#0f172a" />
                      <circle cx="40" cy="45" r="4" fill="#0f172a" />
                      <circle cx="50" cy="50" r="5" fill="#10b981" />
                      <circle cx="60" cy="45" r="4" fill="#0f172a" />
                      <circle cx="85" cy="55" r="4" fill="#0f172a" />
                      <circle cx="75" cy="75" r="4" fill="#0f172a" />
                      <circle cx="45" cy="85" r="4" fill="#0f172a" />
                      <circle cx="60" cy="80" r="3" fill="#0f172a" />
                    </svg>
                  </div>
                  <span className="font-mono text-[11px] font-black text-slate-800 tracking-wider mt-1">
                    {activeTicket.id}
                  </span>
                  <span className="text-[9px] text-slate-500">Scan via Conductor Device or Turnstile</span>
                </div>

                {/* Ticket Meta Details */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Passengers</span>
                    <span className="font-black text-white">{activeTicket.passengers} Adult</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Total Fare</span>
                    <span className="font-black text-emerald-400">₹{activeTicket.fare}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Paid Via</span>
                    <span className="font-black text-blue-400">{activeTicket.paymentApp}</span>
                  </div>
                </div>

                {/* Validity Note */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Valid for 2 Hours from issuance
                  </span>
                  <span className="text-slate-300 font-medium">Passenger: {activeTicket.passengerName}</span>
                </div>

              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    toast.success("Ticket Pass saved to device / gallery!");
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Pass</span>
                </button>
                <button
                  onClick={handleCancelTicket}
                  className="py-2.5 px-4 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs rounded-xl transition-all"
                >
                  Clear / Close
                </button>
              </div>

            </div>
          ) : (
            /* ------------------ BUY TICKET FORM VIEW ------------------ */
            <div className="space-y-4">
              
              {/* Route Info Badge */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-white">{activeRoute?.routeName}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{activeRoute?.city}</span>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {activeRoute?.routeNumber}
                </span>
              </div>

              {/* Boarding Stop */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  1. Boarding Stop (From)
                </label>
                <select
                  value={fromStopId}
                  onChange={(e) => setFromStopId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {stops.map((s) => (
                    <option key={s.id} value={s.id}>
                      Stop #{s.sequenceNumber}: {s.stopName} ({s.landmark || "Road"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Stop */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  2. Destination Stop (To)
                </label>
                <select
                  value={toStopId}
                  onChange={(e) => setToStopId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {stops.map((s) => (
                    <option key={s.id} value={s.id}>
                      Stop #{s.sequenceNumber}: {s.stopName} ({s.landmark || "Road"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Passengers */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  3. Number of Passengers
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPassengerCount(num)}
                      className={`py-2 rounded-xl text-xs font-black border transition-all ${
                        passengerCount === num
                          ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm shadow-emerald-500/20"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {num} {num === 1 ? "Person" : "People"}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI Payment Gateway Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  4. Pay with Instant UPI
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentApp("gpay")}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      paymentApp === "gpay"
                        ? "bg-blue-950/60 border-blue-500 text-blue-300 ring-2 ring-blue-500/20"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Google Pay</span>
                    <span className="text-[10px] text-slate-500 font-normal">GPay UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentApp("phonepe")}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      paymentApp === "phonepe"
                        ? "bg-purple-950/60 border-purple-500 text-purple-300 ring-2 ring-purple-500/20"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>PhonePe</span>
                    <span className="text-[10px] text-slate-500 font-normal">Fast UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentApp("paytm")}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      paymentApp === "paytm"
                        ? "bg-sky-950/60 border-sky-500 text-sky-300 ring-2 ring-sky-500/20"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Paytm</span>
                    <span className="text-[10px] text-slate-500 font-normal">Wallet / UPI</span>
                  </button>
                </div>
              </div>

              {/* Total Fare Breakdown & Checkout Button */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Calculated Fare:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400">₹{totalAmount}</span>
                    <span className="text-[10px] text-slate-500 block">₹{unitFare} × {passengerCount} passenger(s)</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayAndGenerateTicket}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing UPI Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{totalAmount} & Generate Digital QR Pass</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
