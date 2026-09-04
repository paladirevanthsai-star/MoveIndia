import React from "react";
import { X, Bus, Users, ShieldAlert, CheckCircle2, Heart } from "lucide-react";

export default function SeatLayoutModal({ isOpen, onClose, bus }) {
  if (!isOpen || !bus) return null;

  const isCrowded = bus.occupancyLevel === "crowded" || bus.occupancyLevel === "full";
  const isMedium = bus.occupancyLevel === "medium";

  // Generate 8 rows of 2x2 seats
  // Row 1 & 2: Reserved for Women (Pink)
  // Row 3: Senior Citizen / Differently Abled (Yellow)
  // Row 4 to 8: General Public (Teal)
  const rows = [
    { row: 1, label: "Row 1 (Women Reserved)", type: "women", seats: [false, true, false, false] },
    { row: 2, label: "Row 2 (Women Reserved)", type: "women", seats: [true, false, false, true] },
    { row: 3, label: "Row 3 (Senior Citizen)", type: "senior", seats: [false, false, true, false] },
    { row: 4, label: "Row 4 (General)", type: "general", seats: [isCrowded, isMedium, false, isCrowded] },
    { row: 5, label: "Row 5 (General)", type: "general", seats: [isMedium, false, isCrowded, isCrowded] },
    { row: 6, label: "Row 6 (General)", type: "general", seats: [false, isCrowded, isMedium, false] },
    { row: 7, label: "Row 7 (General)", type: "general", seats: [isCrowded, isCrowded, false, isMedium] },
    { row: 8, label: "Row 8 (Back 5-Bench)", type: "general", seats: [isCrowded, isMedium, false, false, isCrowded], isBench: true }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">{bus.busNumber}</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  Route {bus.routeId}
                </span>
              </div>
              <p className="text-xs text-slate-400">Visual Seating Blueprint & Reserved Sections</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around p-2.5 bg-slate-950/60 border-b border-slate-800 text-[10px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-500/30 border border-rose-500"></span>
            <span className="text-rose-300">Women Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500/30 border border-amber-500"></span>
            <span className="text-amber-300">Senior Citizen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-500"></span>
            <span className="text-emerald-300">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-700 border border-slate-600"></span>
            <span className="text-slate-400">Occupied</span>
          </div>
        </div>

        {/* Bus Chassis Layout Container */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          <div className="w-full max-w-[320px] mx-auto bg-slate-950 border-4 border-slate-800 rounded-t-[40px] rounded-b-2xl p-4 relative shadow-2xl">
            
            {/* Front Windshield Graphic */}
            <div className="w-full h-8 bg-gradient-to-b from-sky-500/20 to-transparent rounded-t-[30px] border-b border-slate-800 mb-4 flex items-center justify-between px-6 text-[10px] text-slate-400 font-bold">
              <span>Front Windshield</span>
              <div className="flex items-center gap-1 text-slate-500">
                <span className="w-3 h-3 rounded-full border border-slate-600 inline-block"></span>
                <span>Driver</span>
              </div>
            </div>

            {/* Seating Rows */}
            <div className="space-y-2.5">
              {rows.map((r, idx) => {
                const isWomen = r.type === "women";
                const isSenior = r.type === "senior";

                return (
                  <div key={idx} className="flex items-center justify-between gap-1">
                    {/* Left 2 Seats */}
                    <div className="flex items-center gap-1.5">
                      {r.seats.slice(0, 2).map((occupied, sIdx) => (
                        <div
                          key={sIdx}
                          title={occupied ? "Occupied" : isWomen ? "Women Reserved" : "Available"}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[9px] font-bold transition-all ${
                            occupied
                              ? "bg-slate-800 border-slate-700 text-slate-500"
                              : isWomen
                              ? "bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-sm shadow-rose-500/20"
                              : isSenior
                              ? "bg-amber-950/80 border-amber-500/80 text-amber-300"
                              : "bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-sm shadow-emerald-500/20"
                          }`}
                        >
                          {occupied ? "✕" : "✓"}
                        </div>
                      ))}
                    </div>

                    {/* Gangway Aisle */}
                    <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest px-1">
                      {idx === 3 && <span className="text-[7px] text-slate-500">AISLE</span>}
                    </div>

                    {/* Right 2 (or 3) Seats */}
                    <div className="flex items-center gap-1.5">
                      {r.seats.slice(2).map((occupied, sIdx) => (
                        <div
                          key={sIdx}
                          title={occupied ? "Occupied" : isWomen ? "Women Reserved" : "Available"}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[9px] font-bold transition-all ${
                            occupied
                              ? "bg-slate-800 border-slate-700 text-slate-500"
                              : isWomen
                              ? "bg-rose-950/80 border-rose-500/80 text-rose-300"
                              : "bg-emerald-950/80 border-emerald-500/80 text-emerald-300"
                          }`}
                        >
                          {occupied ? "✕" : "✓"}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rear Exit Door Indicator */}
            <div className="w-full text-center mt-4 pt-2 border-t border-slate-800 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              Rear Entrance & Emergency Exit
            </div>

          </div>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Total Capacity: <strong className="text-white">35 Seated • 20 Standing</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all"
          >
            Close Blueprint
          </button>
        </div>

      </div>
    </div>
  );
}
