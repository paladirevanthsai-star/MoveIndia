import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import LiveMap from "./components/LiveMap";
import RouteSelector from "./components/RouteSelector";
import BusCards from "./components/BusCards";
import StopTimeline from "./components/StopTimeline";
import PredictionCard from "./components/PredictionCard";
import ReportModal from "./components/ReportModal";
import OperatorDashboard from "./components/OperatorDashboard";
import AdminHub from "./components/AdminHub";
import ReportsFeed from "./components/ReportsFeed";
import AuthModal from "./components/AuthModal";
import SearchBar from "./components/SearchBar";
import FavoritesBar from "./components/FavoritesBar";
import TicketModal from "./components/TicketModal";
import SeatLayoutModal from "./components/SeatLayoutModal";
import EcoImpactCard from "./components/EcoImpactCard";
import OnboardEdgeAiVision from "./components/sih/OnboardEdgeAiVision";
import GisDefectMap from "./components/sih/GisDefectMap";
import AnprIncidentConsole from "./components/sih/AnprIncidentConsole";
import MunicipalWorkOrders from "./components/sih/MunicipalWorkOrders";
import ShareMobileModal from "./components/ShareMobileModal";
import NotificationDemoModal from "./components/NotificationDemoModal";
import { 
  playBusApproachingChime, 
  sendProximityNotification, 
  requestNotificationPermission 
} from "./utils/audioAlarm";
import { Toaster, toast } from "sonner";
import { 
  Bus, 
  MapPin, 
  Radio, 
  Sparkles, 
  AlertCircle, 
  Info,
  ChevronRight,
  TrendingUp,
  Activity,
  Heart,
  QrCode,
  BellRing
} from "lucide-react";

const API = "/api";

function MainApp() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [routes, setRoutes] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  // Commuter Favorite Buses: Persisted in LocalStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("move_india_fav_buses");
      return stored ? JSON.parse(stored) : ["b101_1"];
    } catch {
      return ["b101_1"];
    }
  });

  // Modal States
  const [activeTab, setActiveTab] = useState("live-map"); // live-map, reports, operator, admin
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [preselectedReportBus, setPreselectedReportBus] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // New Feature Modals
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketBus, setTicketBus] = useState(null);
  const [isSeatsModalOpen, setIsSeatsModalOpen] = useState(false);
  const [seatsBus, setSeatsBus] = useState(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Proximity Chime Alarms (Bus IDs)
  const [proximityAlarms, setProximityAlarms] = useState([]);

  // Toggle Favorite Bus
  const handleToggleFavorite = (bus) => {
    setFavorites((prev) => {
      let next;
      if (prev.includes(bus.id)) {
        next = prev.filter((id) => id !== bus.id);
        toast.info(`Removed ${bus.busNumber} from Favorites`);
      } else {
        next = [...prev, bus.id];
        toast.success(`Saved ${bus.busNumber} to Favorite Commutes! ❤️`);
      }
      try {
        localStorage.setItem("move_india_fav_buses", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Toggle Proximity Chime Alert
  const handleToggleProximityAlarm = async (bus) => {
    await requestNotificationPermission();
    setProximityAlarms((prev) => {
      if (prev.includes(bus.id)) {
        toast.info(`Disabled proximity chime for ${bus.busNumber}`);
        return prev.filter((id) => id !== bus.id);
      } else {
        playBusApproachingChime();
        toast.success(`🔔 Chime Alarm active for ${bus.busNumber}! You will hear an alert chime when ~5 min / 2 stops away.`);
        return [...prev, bus.id];
      }
    });
  };

  // Initial Data Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [routesRes, busesRes] = await Promise.all([
          axios.get(`${API}/routes`),
          axios.get(`${API}/buses/live`)
        ]);

        const fetchedRoutes = routesRes.data || [];
        setRoutes(fetchedRoutes);

        const liveBuses = busesRes.data?.buses || [];
        setBuses(liveBuses);

        // When commuter opens the app, immediately access their favorite bus if present!
        if (liveBuses.length > 0) {
          const favBus = liveBuses.find((b) => favorites.includes(b.id));
          const primaryBus = favBus || liveBuses[0];
          setSelectedBus(primaryBus);

          const matchedRoute = fetchedRoutes.find((r) => r.id === primaryBus.routeId) || fetchedRoutes[0];
          if (matchedRoute) {
            setActiveRoute(matchedRoute);
            setStops(matchedRoute.stops || []);
          }
        } else if (fetchedRoutes.length > 0) {
          setActiveRoute(fetchedRoutes[0]);
          setStops(fetchedRoutes[0].stops || []);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };

    fetchInitialData();
  }, []);

  // Poll Live Bus GPS Coordinates every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API}/buses/live`);
        const updatedBuses = res.data?.buses || [];
        setBuses(updatedBuses);

        // Check active proximity alarms
        if (proximityAlarms.length > 0) {
          updatedBuses.forEach((b) => {
            if (proximityAlarms.includes(b.id)) {
              if (b.calculatedRemainingEtaMinutes <= 5 && !b._alarmTriggered) {
                b._alarmTriggered = true;
                sendProximityNotification(b.busNumber, b.nextStopName, b.calculatedRemainingEtaMinutes);
                toast.warning(`🔔 Bus Approaching! ${b.busNumber} is ~${b.calculatedRemainingEtaMinutes} mins away near ${b.nextStopName}!`, {
                  duration: 8000
                });
              }
            }
          });
        }

        // Update selectedBus reference if exists
        if (selectedBus) {
          const updatedSelected = updatedBuses.find((b) => b.id === selectedBus.id);
          if (updatedSelected) {
            setSelectedBus(updatedSelected);
          }
        }
      } catch (err) {
        // Silent catch for background polling
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedBus, proximityAlarms]);

  // Handle Route Selection
  const handleSelectRoute = (route) => {
    setActiveRoute(route);
    setStops(route.stops || []);
    const firstBus = buses.find((b) => b.routeId === route.id);
    if (firstBus) {
      setSelectedBus(firstBus);
    }
  };

  const handleOpenReportModal = (bus = null) => {
    setPreselectedReportBus(bus || selectedBus);
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors theme="dark" />

      {/* Top Navigation Bar with Role Switcher, Language & Branding */}
      <Navbar
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMobileModal={() => setIsMobileModalOpen(true)}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Live Tab: Map & Commuter Tracking */}
        {activeTab === "live-map" && (
          <div className="space-y-6">
            
            {/* 1. Quick Access: Pinned Favorite Commute Fleet */}
            <FavoritesBar
              favorites={favorites}
              buses={buses}
              routes={routes}
              selectedBus={selectedBus}
              onSelectBus={(bus) => {
                setSelectedBus(bus);
                toast.success(`Tracking Favorite Bus ${bus.busNumber}`);
              }}
              onSelectRoute={handleSelectRoute}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* 2. Instant Omni Bus & Route Search Engine */}
            <SearchBar
              buses={buses}
              routes={routes}
              activeRoute={activeRoute}
              onSelectBus={(bus) => {
                setSelectedBus(bus);
                toast.success(`Selected Bus ${bus.busNumber} (${bus.speedKmph || 25} km/h)`);
              }}
              onSelectRoute={handleSelectRoute}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* 3. Indian City Route Switcher */}
            <RouteSelector
              routes={routes}
              activeRoute={activeRoute}
              onSelectRoute={handleSelectRoute}
            />

            {/* 4. Quick Live Route Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-base">
                      {activeRoute?.routeName || "Select Route"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                      {activeRoute?.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeRoute?.stopsCount || 0} stops • Approx ₹{activeRoute?.fare || 30} fare • Real-Road GPS Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* 1-Click Buy Digital Ticket */}
                <button
                  type="button"
                  onClick={() => {
                    setTicketBus(selectedBus);
                    setIsTicketModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{t("digital_ticket")}</span>
                </button>

                {/* Report Delay / Crowding */}
                <button
                  data-testid="report-crowding-button"
                  onClick={() => handleOpenReportModal()}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t("report_action")}</span>
                </button>
              </div>
            </div>

            {/* 5. Green Transit Eco & Money Savings Meter */}
            {activeRoute && (
              <EcoImpactCard activeRoute={activeRoute} />
            )}

            {/* 6. AI Congestion Prediction Card */}
            {activeRoute && (
              <PredictionCard routeId={activeRoute.id} />
            )}

            {/* Two Column Grid: Left Real-Road Map (2 spans), Right Timeline (1 span) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Interactive Leaflet Map with Google Maps & Monsoon Alerts */}
              <div className="lg:col-span-2">
                <LiveMap
                  buses={buses}
                  stops={stops}
                  activeRoute={activeRoute}
                  selectedBus={selectedBus}
                  onSelectBus={(bus) => setSelectedBus(bus)}
                />
              </div>

              {/* Stops & Live Route Sequence Column (1 span) */}
              <div className="space-y-6">
                <StopTimeline
                  stops={stops}
                  activeRoute={activeRoute}
                  buses={buses}
                  selectedBus={selectedBus}
                />
              </div>
            </div>

            {/* Live Buses Cards on Route with Seats, Ticket, Alarm, and Google Maps */}
            <BusCards
              buses={buses}
              selectedBus={selectedBus}
              onSelectBus={(bus) => setSelectedBus(bus)}
              activeRoute={activeRoute}
              onOpenReportModal={(bus) => handleOpenReportModal(bus)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onOpenSeatsModal={(bus) => {
                setSeatsBus(bus);
                setIsSeatsModalOpen(true);
              }}
              onOpenTicketModal={(bus) => {
                setTicketBus(bus);
                setIsTicketModalOpen(true);
              }}
              proximityAlarms={proximityAlarms}
              onToggleProximityAlarm={handleToggleProximityAlarm}
            />
          </div>
        )}

        {/* SIH MODULE 1: Onboard Edge-AI Multi-Camera Perception Engine */}
        {activeTab === "edge-vision" && (
          <OnboardEdgeAiVision
            buses={buses}
            selectedBus={selectedBus}
            onSelectBus={(bus) => setSelectedBus(bus)}
          />
        )}

        {/* SIH MODULE 2: GIS Road Defect & Infrastructure Deficiency Map */}
        {activeTab === "defect-map" && (
          <GisDefectMap
            activeRoute={activeRoute}
          />
        )}

        {/* SIH MODULE 3: ANPR Law Enforcement & Police Incident Console */}
        {activeTab === "police-anpr" && (
          <AnprIncidentConsole />
        )}

        {/* SIH MODULE 4: Municipal PWD Maintenance Work Order Dispatcher */}
        {activeTab === "municipal-pwd" && (
          <MunicipalWorkOrders />
        )}

        {/* Community Reports Feed Tab */}
        {activeTab === "reports" && (
          <ReportsFeed
            activeRoute={activeRoute}
            onOpenReportModal={() => handleOpenReportModal()}
          />
        )}

        {/* Operator Dashboard Tab with Phone GPS Beacon */}
        {activeTab === "operator" && (
          <OperatorDashboard
            buses={buses}
            stops={stops}
            onRefresh={() => {
              // trigger refresh
            }}
          />
        )}

        {/* Admin Moderation & Intelligence Tab */}
        {activeTab === "admin" && (
          <AdminHub />
        )}

      </main>

      {/* Floating Crowdsource Incident Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        activeRoute={activeRoute}
        selectedBus={preselectedReportBus}
        stops={stops}
      />

      {/* UPI Digital Ticket & QR Pass Modal */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        activeRoute={activeRoute}
        stops={stops}
      />

      {/* Visual Bus Seat Blueprint Modal */}
      <SeatLayoutModal
        isOpen={isSeatsModalOpen}
        onClose={() => setIsSeatsModalOpen(false)}
        bus={seatsBus}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Share / Mobile Access QR Modal */}
      <ShareMobileModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
      />

      {/* Interactive Notification Demo Modal */}
      <NotificationDemoModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          Move India • Next-Gen Real-time Bus GPS & Community Crowding Platform
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Built for Indian Urban Corridors • TSRTC, BMTC, DTC
        </p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
