import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { 
  Bus, 
  ShieldCheck, 
  Radio, 
  User, 
  Wrench, 
  LogIn, 
  LogOut,
  Sparkles,
  Lock,
  KeyRound,
  ShieldAlert,
  Globe,
  Download,
  Smartphone,
  Camera,
  AlertTriangle,
  Building2,
  Share2,
  Bell
} from "lucide-react";
import { toast } from "sonner";

export default function Navbar({ onOpenAuthModal, activeTab, setActiveTab, onOpenMobileModal, onOpenNotificationModal }) {
  const { user, demoLogin, logout, verifyAdminPin, verifyOperatorPin } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();

  const handleOperatorSwitch = async () => {
    if (user?.role === "operator" || user?.role === "admin") {
      setActiveTab("operator");
      return;
    }
    const pin = window.prompt("Security Check: Enter Driver / Operator Depot PIN (Default: 1234):", "1234");
    if (pin) {
      const res = await verifyOperatorPin(pin);
      if (res.success) setActiveTab("operator");
    }
  };

  const handleAdminSwitch = async () => {
    if (user?.role === "admin") {
      setActiveTab("admin");
      return;
    }
    const pin = window.prompt("Authority Privacy Clearance: Enter Master Admin PIN (Default: 9988):", "9988");
    if (pin) {
      const res = await verifyAdminPin(pin);
      if (res.success) setActiveTab("admin");
    }
  };

  const handleInstallPwa = () => {
    toast.success("Tap browser menu (⋮) -> 'Install App' / 'Add to Home screen' to install Move India as native app!");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Indian National Transit Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-500 opacity-90"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Bus className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Move <span className="text-emerald-400">India</span>
                </span>
                <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  SIH 2024 AI SENSING
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Mobile Urban Sensing • Road Defects, ANPR, Traffic & PWD Intelligence
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs: SIH Modes */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-lg">
            
            {/* 1. Transit & Fleet */}
            <button
              onClick={() => setActiveTab("live-map")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "live-map"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Transit & Map</span>
            </button>

            {/* 2. Onboard Edge-AI Vision (SIH Core) */}
            <button
              onClick={() => setActiveTab("edge-vision")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "edge-vision"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20 font-black"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-indigo-300" />
              <span>Edge-AI Vision</span>
            </button>

            {/* 3. GIS Defect Map (SIH Core) */}
            <button
              onClick={() => setActiveTab("defect-map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "defect-map"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20 font-black"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
              <span>GIS Defects</span>
            </button>

            {/* 4. Police & ANPR (SIH Core) */}
            <button
              onClick={() => setActiveTab("police-anpr")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "police-anpr"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20 font-black"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-300" />
              <span>Police & ANPR</span>
            </button>

            {/* 5. Municipal PWD (SIH Core) */}
            <button
              onClick={() => setActiveTab("municipal-pwd")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "municipal-pwd"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-950" />
              <span>Municipal PWD</span>
            </button>

            {/* Subtle Divider */}
            <div className="w-[1px] h-4 bg-slate-800 mx-1"></div>

            {/* Operator Deck */}
            <button
              onClick={handleOperatorSwitch}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === "operator"
                  ? "bg-slate-800 text-amber-400 border border-amber-600/80 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Wrench className="w-3 h-3 text-amber-400" />
              <span>Driver</span>
            </button>

            {/* Admin */}
            <button
              onClick={handleAdminSwitch}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-slate-800 text-indigo-400 border border-indigo-600/80 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            
            {/* Open on Mobile / Share Button */}
            <button
              type="button"
              onClick={onOpenMobileModal}
              title="Open on Mobile Phone (QR Code & Share Link)"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone URL</span>
              <Share2 className="w-3 h-3 text-slate-400" />
            </button>

            {/* Notification Demo Button */}
            <button
              type="button"
              onClick={onOpenNotificationModal}
              title="Test Bus Audio Chimes & Emergency Notifications"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Alerts Demo</span>
            </button>

            {/* Regional Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
                title="Change Regional Language"
              >
                <option value="en" className="bg-slate-900 text-white">EN</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు</option>
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ</option>
              </select>
            </div>

            {/* User status or Login Button */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 pl-3 pr-2 py-1 rounded-xl">
                <span className="text-xs font-semibold text-white leading-tight">
                  {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto gap-1 text-[11px] font-bold">
          <button
            onClick={() => setActiveTab("live-map")}
            className={`px-2 py-1 rounded ${activeTab === "live-map" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}
          >
            Transit
          </button>
          <button
            onClick={() => setActiveTab("edge-vision")}
            className={`px-2 py-1 rounded ${activeTab === "edge-vision" ? "bg-indigo-500 text-white" : "text-slate-400"}`}
          >
            Edge AI
          </button>
          <button
            onClick={() => setActiveTab("defect-map")}
            className={`px-2 py-1 rounded ${activeTab === "defect-map" ? "bg-rose-600 text-white" : "text-slate-400"}`}
          >
            Defects
          </button>
          <button
            onClick={() => setActiveTab("police-anpr")}
            className={`px-2 py-1 rounded ${activeTab === "police-anpr" ? "bg-red-600 text-white" : "text-slate-400"}`}
          >
            Police
          </button>
          <button
            onClick={() => setActiveTab("municipal-pwd")}
            className={`px-2 py-1 rounded ${activeTab === "municipal-pwd" ? "bg-amber-500 text-slate-950" : "text-slate-400"}`}
          >
            PWD
          </button>
        </div>
      </div>
    </header>
  );
}
