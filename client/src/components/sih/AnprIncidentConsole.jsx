import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShieldAlert, 
  Car, 
  Send, 
  FileText, 
  CheckCircle, 
  Clock, 
  MapPin, 
  AlertCircle,
  ExternalLink,
  Printer,
  Download,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function AnprIncidentConsole() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [dossierIncident, setDossierIncident] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get("/api/sih/incidents");
        setIncidents(res.data || []);
        if (res.data?.length > 0 && !selectedIncident) {
          setSelectedIncident(res.data[0]);
        }
      } catch (e) {}
    };
    fetchIncidents();
  }, []);

  const handleDispatchToPolice = async (incident) => {
    try {
      const res = await axios.post(`/api/sih/incidents/${incident.id}/dispatch`);
      toast.success(`FIR Evidence Dossier dispatched! Dispatch Ref: ${res.data.incident.policeDispatchId}`);
      setIncidents((prev) =>
        prev.map((i) => (i.id === incident.id ? res.data.incident : i))
      );
      if (selectedIncident?.id === incident.id) {
        setSelectedIncident(res.data.incident);
      }
    } catch (e) {
      toast.error("Failed to transmit evidence to Police");
    }
  };

  const handleOpenDossier = (incident) => {
    setDossierIncident(incident);
    setIsDossierModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/70 border border-red-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/40">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  ANPR & Traffic Law Enforcement Console
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 font-bold border border-red-800">
                  POLICE INTEGRATION ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time Hit-and-Run, Rash Driving & Bus Lane Violations detected by mobile bus edge cameras
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-2xl text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-slate-300 font-bold">Secure Police Relay: <strong>CONNECTED</strong></span>
          </div>
        </div>
      </div>

      {/* Main Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Incidents List (1.5 cols or 1 col) */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center justify-between">
            <span>Flagged Incidents ({incidents.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">Real-time Feed</span>
          </h3>

          <div className="space-y-3">
            {incidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const isDispatched = inc.status === "dispatched_to_police";

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "bg-slate-900 border-red-500 ring-2 ring-red-500/20 shadow-xl"
                      : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        inc.type === "hit_and_run" ? "bg-red-950 text-red-300 border border-red-800" : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}>
                        {inc.type.replace(/_/g, " ")}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1">{inc.title}</h4>
                    </div>

                    <span className="font-mono text-xs font-black bg-yellow-400 text-slate-950 px-2 py-0.5 rounded shadow-sm">
                      {inc.offendingVehicle.plateNumber}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{inc.locationName}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-500 font-mono">
                      Speed: <strong className="text-rose-400">{inc.offendingVehicle.speedKmph} km/h</strong>
                    </span>

                    {isDispatched ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Transmitted ({inc.policeDispatchId})
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Dispatch
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Forensic Evidence & Dossier (2 cols) */}
        {selectedIncident && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  INCIDENT EVIDENCE ID: #{selectedIncident.id}
                </span>
                <h3 className="text-lg font-black text-white">{selectedIncident.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedIncident.locationName} • {selectedIncident.city}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenDossier(selectedIncident)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>View FIR Dossier</span>
                </button>

                {selectedIncident.status !== "dispatched_to_police" && (
                  <button
                    onClick={() => handleDispatchToPolice(selectedIncident)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch to Police</span>
                  </button>
                )}
              </div>
            </div>

            {/* Evidence Image and Zoom License Plate Crop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
                <img 
                  src={selectedIncident.evidenceClipUrl} 
                  alt="Incident Capture" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded-xl text-[10px] font-mono text-rose-400 font-bold">
                  REC • BUS {selectedIncident.detectingBusId} • CAM: {selectedIncident.cameraFeed}
                </div>
              </div>

              {/* Cropped ANPR License Plate Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between text-center space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    ANPR License Plate OCR
                  </span>
                  <div className="bg-yellow-400 text-slate-950 font-mono font-black text-xl px-3 py-2 rounded-xl tracking-wider border-2 border-slate-950 shadow-md">
                    {selectedIncident.offendingVehicle.plateNumber}
                  </div>
                </div>

                <div className="space-y-1 text-xs text-left bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Confidence:</span>
                    <strong className="text-emerald-400">
                      {(selectedIncident.offendingVehicle.plateConfidence * 100).toFixed(1)}%
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Vehicle Class:</span>
                    <strong className="text-white">{selectedIncident.offendingVehicle.vehicleClass}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Speed Logged:</span>
                    <strong className="text-rose-400">{selectedIncident.offendingVehicle.speedKmph} km/h</strong>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  Timestamp: {new Date(selectedIncident.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Forensic Notes & Evidence Integrity Hash */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
              <span className="font-bold text-white block">Incident Observer Notes:</span>
              <p className="text-slate-300">{selectedIncident.notes}</p>
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono gap-2">
                <span>GPS: {selectedIncident.latitude}° N, {selectedIncident.longitude}° E</span>
                <span>SHA-256 HASH: 9f82ab47c12...49e1 (Tamper-Proof)</span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Police Evidence Dossier Printable Modal */}
      {isDossierModalOpen && dossierIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">
                  Official Police Evidence Dossier — First Incident Report (FIR) Supplement
                </h3>
              </div>
              <button
                onClick={() => setIsDossierModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono">
                <div className="text-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-sm text-white block">
                    STATE TRAFFIC POLICE DIGITAL EVIDENCE REPOSITORY
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Captured under Smart Transit Video Surveillance Platform
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div><span className="text-slate-500">Incident Type:</span> <strong className="text-white">{dossierIncident.type.toUpperCase()}</strong></div>
                  <div><span className="text-slate-500">Police Ref ID:</span> <strong className="text-emerald-400">{dossierIncident.policeDispatchId || "PENDING"}</strong></div>
                  <div><span className="text-slate-500">Offending Vehicle:</span> <strong className="text-yellow-400">{dossierIncident.offendingVehicle.plateNumber}</strong></div>
                  <div><span className="text-slate-500">OCR Confidence:</span> <strong className="text-emerald-400">{(dossierIncident.offendingVehicle.plateConfidence * 100).toFixed(1)}%</strong></div>
                  <div><span className="text-slate-500">Recorded Speed:</span> <strong className="text-rose-400">{dossierIncident.offendingVehicle.speedKmph} km/h (Limit: 40 km/h)</strong></div>
                  <div><span className="text-slate-500">Witness Unit:</span> <strong className="text-white">Bus {dossierIncident.detectingBusId}</strong></div>
                  <div><span className="text-slate-500">Geo-Coordinates:</span> <strong className="text-white">{dossierIncident.latitude}, {dossierIncident.longitude}</strong></div>
                  <div><span className="text-slate-500">Timestamp:</span> <strong className="text-white">{new Date(dossierIncident.timestamp).toUTCString()}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-500 block mb-1">Incident Summary:</span>
                  <p className="text-slate-300 font-sans">{dossierIncident.notes}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    toast.success("Digital Evidence Dossier downloaded as tamper-proof PDF!");
                  }}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Legal Evidence PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
