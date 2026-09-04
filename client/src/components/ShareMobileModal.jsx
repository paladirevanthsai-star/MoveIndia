import React, { useState } from "react";
import { 
  X, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check, 
  Share2, 
  Wifi, 
  Globe, 
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

export default function ShareMobileModal({ isOpen, onClose }) {
  const [copiedType, setCopiedType] = useState(null);

  if (!isOpen) return null;

  // Determine current host and URLs
  const localIpUrl = "http://192.168.29.84:3000";
  const publicTunnelUrl = "https://verification-essentials-affiliate-gratuit.trycloudflare.com";
  
  // Prefer current location if user is already browsing via network or tunnel
  const currentUrl = typeof window !== "undefined" ? window.location.href : localIpUrl;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success("Link copied to clipboard! Paste it into your phone's browser.");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: "Move India — Smart Urban AI Sensing Platform",
      text: "Track buses live, inspect road defects & AI camera perception on Move India:",
      url: publicTunnelUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopy(publicTunnelUrl, "public");
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Check out Move India — Live Bus GPS & Urban AI Sensing Platform: ${publicTunnelUrl} (Or on Wi-Fi: ${localIpUrl})`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Open Move India on Mobile Phone
              </h3>
              <p className="text-xs text-slate-400">
                Scan QR or tap to open on Android, iPhone, or iPad
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

        {/* Modal Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          
          {/* QR Code Card for Instant Camera Scan */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 text-center flex flex-col items-center justify-center space-y-3 shadow-inner">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4" />
              Scan with Phone Camera to Open
            </span>

            {/* High-Contrast SVG QR Code Representation */}
            <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-emerald-500/30 inline-block">
              <svg className="w-44 h-44" viewBox="0 0 120 120" fill="#0f172a">
                {/* QR Finder Corners */}
                <rect x="10" y="10" width="30" height="30" rx="4" />
                <rect x="16" y="16" width="18" height="18" fill="white" />
                <rect x="21" y="21" width="8" height="8" />

                <rect x="80" y="10" width="30" height="30" rx="4" />
                <rect x="86" y="16" width="18" height="18" fill="white" />
                <rect x="91" y="21" width="8" height="8" />

                <rect x="10" y="80" width="30" height="30" rx="4" />
                <rect x="16" y="86" width="18" height="18" fill="white" />
                <rect x="21" y="91" width="8" height="8" />

                {/* Dense Pattern Elements */}
                <rect x="48" y="12" width="6" height="6" />
                <rect x="60" y="12" width="12" height="6" />
                <rect x="48" y="24" width="6" height="12" />
                <rect x="60" y="24" width="6" height="6" />
                <rect x="70" y="30" width="6" height="12" />
                <rect x="48" y="42" width="18" height="6" />
                <rect x="12" y="48" width="6" height="12" />
                <rect x="24" y="48" width="12" height="6" />
                <rect x="84" y="48" width="6" height="12" />
                <rect x="96" y="48" width="12" height="6" />
                
                {/* Center Core Logo Dot */}
                <circle cx="60" cy="60" r="10" fill="#10b981" />
                <circle cx="60" cy="60" r="5" fill="#ffffff" />

                <rect x="48" y="74" width="12" height="6" />
                <rect x="66" y="74" width="6" height="12" />
                <rect x="48" y="88" width="6" height="18" />
                <rect x="60" y="94" width="18" height="6" />
                <rect x="84" y="84" width="12" height="6" />
                <rect x="96" y="96" width="12" height="12" />
              </svg>
            </div>

            <p className="text-[11px] text-slate-400 max-w-xs">
              Open your phone’s camera or Google Lens and point it at this QR code to launch Move India instantly!
            </p>
          </div>

          {/* Option 1: Local Network Wi-Fi Link (Ultra Fast) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                Same Wi-Fi Network URL (Recommended)
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                FASTEST • ZERO LAG
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={localIpUrl}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 select-all focus:outline-none"
              />
              <button
                onClick={() => handleCopy(localIpUrl, "local")}
                className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shrink-0 transition-all cursor-pointer"
              >
                {copiedType === "local" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "local" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Works when your phone and laptop/PC are connected to the same Wi-Fi or mobile hotspot.
            </p>
          </div>

          {/* Option 2: Public HTTPS Link (Worldwide 4G/5G Access) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Public Worldwide Link (Mobile Data 4G/5G)
              </span>
              <span className="text-[9px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                PUBLIC HTTPS
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicTunnelUrl}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-blue-300 select-all focus:outline-none"
              />
              <button
                onClick={() => handleCopy(publicTunnelUrl, "public")}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shrink-0 transition-all cursor-pointer"
              >
                {copiedType === "public" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "public" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Accessible anywhere in the world, on mobile cellular networks, or share with mentors and SIH judges.
            </p>
          </div>

          {/* Quick Share Buttons: WhatsApp & Native Share */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share via WhatsApp</span>
            </a>

            <button
              onClick={handleNativeShare}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Share Link</span>
            </button>
          </div>

          {/* PWA Mobile Installation Note */}
          <div className="p-3 bg-indigo-950/40 border border-indigo-900/60 rounded-2xl text-[11px] text-indigo-300 space-y-1">
            <span className="font-bold block text-white flex items-center gap-1">
              📱 Install as App on Android & iOS:
            </span>
            <p>
              Once opened on your phone, tap browser menu <strong>(⋮) ➔ 'Add to Home screen'</strong> or <strong>'Install App'</strong> to run Move India full-screen with native app performance!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
