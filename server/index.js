import express from "express";
import cors from "cors";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { routes, initialReports, demoUsers } from "./data/transitData.js";
import { gpsEngine } from "./simulation/gpsEngine.js";
import { 
  roadDefects, 
  trafficIncidents, 
  municipalWorkOrders, 
  edgeTelemetry 
} from "./data/sihUrbanData.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Security PIN configurations
export const ADMIN_SECURITY_PINS = ["9988", "ADMIN@MOVEINDIA", "ADMIN2026"];
export const OPERATOR_SECURITY_PINS = ["1234", "DRV-TSRTC-101", "OP1234"];

// In-memory state for reports and registered users
let reports = [...initialReports];
let users = { ...demoUsers };
let sessions = new Map(); // token -> user

// Helper to get user from Bearer header
function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  return sessions.get(token) || null;
}

// Security Middleware: Require Admin
function requireAdmin(req, res, next) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({
      detail: "Security Alert: Admin priority clearance required. Please verify Admin PIN."
    });
  }
  next();
}

// Security Middleware: Require Operator or Admin
function requireOperatorOrAdmin(req, res, next) {
  const user = getAuthenticatedUser(req);
  if (!user || (user.role !== "operator" && user.role !== "admin")) {
    return res.status(403).json({
      detail: "Security Alert: Operator Depot Badge or Admin PIN required to alter fleet status."
    });
  }
  next();
}

// -------------------------------------------------------------
// 1. Transit Routes & Stops
// -------------------------------------------------------------
app.get("/api/routes", (req, res) => {
  res.json(routes);
});

// -------------------------------------------------------------
// 2. Live GPS Buses
// -------------------------------------------------------------
app.get("/api/buses/live", (req, res) => {
  res.json(gpsEngine.getLiveBuses());
});

// Update Bus Status (Protected: Only Operator or Admin)
app.patch("/api/buses/:busId/status", requireOperatorOrAdmin, (req, res) => {
  const { busId } = req.params;
  const updatedBus = gpsEngine.updateBusStatus(busId, req.body);
  if (!updatedBus) {
    return res.status(404).json({ detail: "Bus not found" });
  }
  res.json({ success: true, bus: updatedBus });
});

// Driver Real Phone GPS Beacon Stream (from smartphone GPS)
app.post("/api/buses/:busId/beacon", (req, res) => {
  const { busId } = req.params;
  const { latitude, longitude, speedKmph, heading, accuracyMeters, active } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ detail: "latitude and longitude required" });
  }

  const updatedBus = gpsEngine.updateBusStatus(busId, {
    currentLatitude: parseFloat(latitude),
    currentLongitude: parseFloat(longitude),
    speedKmph: speedKmph ? Math.round(Number(speedKmph)) : 28,
    bearing: heading !== null && heading !== undefined ? parseFloat(heading) : undefined,
    isRealGpsBeacon: active !== false,
    lastBeaconTime: new Date().toISOString(),
    beaconAccuracy: accuracyMeters || 5
  });

  if (!updatedBus) {
    return res.status(404).json({ detail: "Bus not found" });
  }

  res.json({ success: true, bus: updatedBus, message: "Real phone GPS beacon stream synchronized." });
});

// -------------------------------------------------------------
// 3. Commuter Crowdsourcing Reports
// -------------------------------------------------------------
app.get("/api/reports", (req, res) => {
  const sorted = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

app.post("/api/reports", (req, res) => {
  const { routeId, busId, stopId, type, crowdingLevel, delayMinutes, description } = req.body;
  const user = getAuthenticatedUser(req) || demoUsers.passenger;

  const isAuthority = user.role === "admin" || user.role === "operator";
  const newReport = {
    id: `rep_${crypto.randomBytes(4).toString("hex")}`,
    routeId: routeId || "101",
    busId: busId || null,
    stopId: stopId || null,
    userId: user.id || "usr_passenger",
    userName: user.name || "Commuter",
    userRole: user.role || "passenger",
    type: type || "crowding",
    crowdingLevel: crowdingLevel || "medium",
    delayMinutes: Number(delayMinutes) || 0,
    description: description || "Reported via Move India Commuter App",
    status: isAuthority ? "approved" : "pending",
    createdAt: new Date().toISOString()
  };

  reports.unshift(newReport);
  res.status(201).json({ success: true, report: newReport });
});

// Moderate Report Status (Protected: Admin Priority Only)
app.patch("/api/reports/:reportId/status", requireAdmin, (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;

  const report = reports.find((r) => r.id === reportId);
  if (!report) {
    return res.status(404).json({ detail: "Report not found" });
  }

  report.status = status || "approved";
  res.json({ success: true, report });
});

// -------------------------------------------------------------
// 4. AI Congestion & Delay Prediction Engine
// -------------------------------------------------------------
app.get("/api/predictions/:routeId", (req, res) => {
  const { routeId } = req.params;
  const route = routes.find((r) => r.id === routeId) || routes[0];

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const isMorningPeak = currentHour >= 8.5 && currentHour <= 11.5;
  const isEveningPeak = currentHour >= 17.5 && currentHour <= 20.5;
  const isPeakHour = isMorningPeak || isEveningPeak;

  const routeReports = reports.filter((r) => r.routeId === routeId && r.status === "approved");
  const recentReportsCount = routeReports.length;

  let totalDelay = 0;
  let crowdCount = 0;
  routeReports.forEach((r) => {
    if (r.delayMinutes) totalDelay += r.delayMinutes;
    if (r.crowdingLevel === "high" || r.crowdingLevel === "crowded" || r.crowdingLevel === "full") crowdCount += 2;
    else if (r.crowdingLevel === "medium") crowdCount += 1;
  });

  const avgDelay = recentReportsCount > 0 ? +(totalDelay / recentReportsCount).toFixed(1) : (isPeakHour ? 8.0 : 3.0);
  
  let score = isPeakHour ? 0.72 : 0.38;
  if (recentReportsCount > 0) {
    score = Math.min(0.95, Math.max(0.2, score + (crowdCount / (recentReportsCount * 2) - 0.5) * 0.3));
  }

  let label = "Low Rush / Light Traffic";
  let category = "low";
  if (score > 0.7) {
    label = "Heavy Congestion / Standing Only";
    category = "high";
  } else if (score > 0.4) {
    label = "Medium / Moderate Rush";
    category = "medium";
  }

  res.json({
    routeId: route.id,
    routeName: route.routeName,
    routeNumber: route.routeNumber,
    crowdingScore: parseFloat(score.toFixed(2)),
    crowdingLabel: label,
    crowdingCategory: category,
    averageDelayMinutes: avgDelay,
    confidence: recentReportsCount > 2 ? "high" : recentReportsCount > 0 ? "moderate" : "heuristic",
    recentReportsAnalyzed: recentReportsCount,
    isPeakHour,
    updatedAt: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// 5. Analytics & Fleet Intelligence
// -------------------------------------------------------------
app.get("/api/analytics", (req, res) => {
  const live = gpsEngine.getLiveBuses();
  const busesList = live.buses || [];

  const totalBuses = busesList.length;
  const activeBuses = busesList.filter((b) => b.status !== "maintenance").length;
  const delayedBuses = busesList.filter((b) => b.status === "delayed" || (b.delayMinutes && b.delayMinutes > 5)).length;
  const onTimePercentage = totalBuses > 0 ? Math.round(((totalBuses - delayedBuses) / totalBuses) * 100) : 100;

  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const approvedReports = reports.filter((r) => r.status === "approved").length;

  const routeCounts = {};
  reports.forEach((r) => {
    routeCounts[r.routeId] = (routeCounts[r.routeId] || 0) + 1;
  });
  const reportsByRoute = Object.entries(routeCounts).map(([_id, count]) => ({ _id, count }));

  res.json({
    totalRoutes: routes.length,
    totalBuses,
    activeBuses,
    delayedBuses,
    onTimePercentage,
    totalReports: reports.length,
    pendingReports,
    approvedReports,
    reportsByRoute,
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// 6. Security & PIN Verification Endpoints
// -------------------------------------------------------------

// Verify Admin Master PIN (Priority Access)
app.post("/api/auth/verify-admin-pin", (req, res) => {
  const { pin } = req.body;
  if (pin && ADMIN_SECURITY_PINS.includes(String(pin).trim())) {
    const user = demoUsers.admin;
    const token = `admin_sec_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    sessions.set(token, user);
    return res.json({ success: true, token, user, message: "Admin clearance granted." });
  }
  return res.status(401).json({
    success: false,
    detail: "Invalid Admin Security PIN. Admin priority access denied. (Default PIN: 9988)"
  });
});

// Verify Operator / Driver Badge PIN
app.post("/api/auth/verify-operator-pin", (req, res) => {
  const { pin } = req.body;
  const p = String(pin || "").trim();
  if (p && (OPERATOR_SECURITY_PINS.includes(p) || ADMIN_SECURITY_PINS.includes(p))) {
    const user = demoUsers.operator;
    const token = `op_sec_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    sessions.set(token, user);
    return res.json({ success: true, token, user, message: "Operator command deck unlocked." });
  }
  return res.status(401).json({
    success: false,
    detail: "Invalid Driver Badge PIN. Access denied. (Default PIN: 1234)"
  });
});

// Demo Login (With Security Check for Admin / Operator)
app.post("/api/auth/demo-login", (req, res) => {
  const { role, pin } = req.body;

  if (role === "admin") {
    const p = String(pin || "").trim();
    if (!p || !ADMIN_SECURITY_PINS.includes(p)) {
      return res.status(401).json({
        requiresPin: true,
        detail: "Security Protection: Admin PIN required to unlock Authority priority. (Default: 9988)"
      });
    }
  } else if (role === "operator") {
    const p = String(pin || "").trim();
    if (!p || (!OPERATOR_SECURITY_PINS.includes(p) && !ADMIN_SECURITY_PINS.includes(p))) {
      return res.status(401).json({
        requiresPin: true,
        detail: "Security Protection: Driver Badge PIN required to unlock Operator deck. (Default: 1234)"
      });
    }
  }

  const selectedRole = role && demoUsers[role] ? role : "passenger";
  const user = demoUsers[selectedRole];
  const token = `tok_${selectedRole}_${Date.now()}`;
  sessions.set(token, user);

  res.json({ token, user });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const foundUser = Object.values(users).find((u) => u.email === email);
  if (!foundUser) {
    const user = {
      id: `usr_${crypto.randomBytes(3).toString("hex")}`,
      name: email.split("@")[0],
      email,
      role: "passenger",
      phone: "+91 98000 00000"
    };
    users[user.id] = user;
    const token = `tok_${user.id}_${Date.now()}`;
    sessions.set(token, user);
    return res.json({ token, user });
  }

  const token = `tok_${foundUser.id}_${Date.now()}`;
  sessions.set(token, foundUser);
  res.json({ token, user: foundUser });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, role } = req.body;
  // Non-admins cannot self-register as admin without Master PIN
  const safeRole = (role === "admin" || role === "operator") ? "passenger" : (role || "passenger");
  const id = `usr_${crypto.randomBytes(4).toString("hex")}`;
  const user = {
    id,
    name: name || "Commuter",
    email: email || `${id}@example.com`,
    role: safeRole,
    phone: phone || "+91 90000 00000"
  };

  users[id] = user;
  const token = `tok_${id}_${Date.now()}`;
  sessions.set(token, user);

  res.status(201).json({ token, user });
});

app.get("/api/auth/me", (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.json({ user: null });
  }
  res.json({ user });
});

app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "").trim();
    sessions.delete(token);
  }
  res.json({ message: "Logged out successfully" });
});

// =============================================================
// SIH 2024: URBAN AI SENSING & EDGE PLATFORM ENDPOINTS
// =============================================================
let activeDefects = [...roadDefects];
let activeIncidents = [...trafficIncidents];
let activeWorkOrders = [...municipalWorkOrders];

// 1. Road Defects & Missing Infrastructure
app.get("/api/sih/defects", (req, res) => {
  const { city, severity, type } = req.query;
  let list = [...activeDefects];
  if (city) list = list.filter((d) => d.city.toLowerCase() === city.toLowerCase());
  if (severity) list = list.filter((d) => d.severity.toLowerCase() === severity.toLowerCase());
  if (type) list = list.filter((d) => d.type.toLowerCase() === type.toLowerCase());
  res.json(list);
});

// Create Municipal Work Order from Defect
app.post("/api/sih/defects/:id/work-order", (req, res) => {
  const { id } = req.params;
  const def = activeDefects.find((d) => d.id === id);
  if (!def) return res.status(404).json({ detail: "Defect not found" });

  def.status = "work_order_created";

  const newOrder = {
    id: `WO-${def.city === "Hyderabad" ? "GHMC" : def.city === "Bengaluru" ? "BBMP" : "MCD"}-2026-${Math.floor(100 + Math.random() * 900)}`,
    defectId: def.id,
    city: def.city,
    title: `Repair ${def.title}`,
    division: `${def.city} Central PWD Division`,
    location: def.locationName,
    priority: def.severity === "critical" ? "Critical (P0)" : "Urgent (P1)",
    estimatedCost: def.severity === "critical" ? 28000 : 14000,
    contractorAssigned: "Municipal Rapid Road Repair Unit",
    assignedDate: new Date().toISOString(),
    targetCompletion: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split("T")[0],
    status: "assigned",
    verificationSource: `Edge Camera Bus ${def.busId}`
  };

  activeWorkOrders.unshift(newOrder);
  res.json({ success: true, workOrder: newOrder, defect: def });
});

// 2. ANPR & Police Incident Console
app.get("/api/sih/incidents", (req, res) => {
  const { city, type } = req.query;
  let list = [...activeIncidents];
  if (city) list = list.filter((i) => i.city.toLowerCase() === city.toLowerCase());
  if (type) list = list.filter((i) => i.type.toLowerCase() === type.toLowerCase());
  res.json(list);
});

// Dispatch Evidence Dossier to Traffic Police
app.post("/api/sih/incidents/:id/dispatch", (req, res) => {
  const { id } = req.params;
  const incident = activeIncidents.find((i) => i.id === id);
  if (!incident) return res.status(404).json({ detail: "Incident not found" });

  incident.status = "dispatched_to_police";
  incident.policeDispatchId = `${incident.city.substring(0, 3).toUpperCase()}-TP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({ 
    success: true, 
    incident, 
    message: `Digital Evidence Dossier securely transmitted to ${incident.city} Traffic Police Headquarters.` 
  });
});

// 3. Municipal PWD Work Orders
app.get("/api/sih/work-orders", (req, res) => {
  res.json(activeWorkOrders);
});

app.patch("/api/sih/work-orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const wo = activeWorkOrders.find((w) => w.id === id);
  if (!wo) return res.status(404).json({ detail: "Work order not found" });

  wo.status = status;
  res.json({ success: true, workOrder: wo });
});

// 4. Edge Bandwidth & Telemetry Metrics
app.get("/api/sih/edge-telemetry", (req, res) => {
  // Live dynamic frame increment simulation
  edgeTelemetry.totalFramesAnalyzed += Math.floor(Math.random() * 15 + 5);
  edgeTelemetry.rawVideoBandwidthEquivalentGb = +(edgeTelemetry.rawVideoBandwidthEquivalentGb + 0.008).toFixed(2);
  edgeTelemetry.edgeMetadataTransmittedMb = +(edgeTelemetry.edgeMetadataTransmittedMb + 0.005).toFixed(2);
  res.json(edgeTelemetry);
});

// 5. Onboard Camera Feed Detections Stream
app.get("/api/sih/camera-feed/:busId", (req, res) => {
  const { busId } = req.params;
  res.json({
    busId,
    timestamp: new Date().toISOString(),
    cameras: [
      {
        id: "front_windshield",
        name: "Front Windshield Road Scanner (Wide 120°)",
        fps: 28.5,
        resolution: "1920x1080 @ Edge",
        detections: [
          { label: "Pothole (Depth ~12cm)", confidence: 0.94, bbox: [120, 240, 220, 310], type: "defect", severity: "critical" },
          { label: "Vehicle: Maruti Swift", confidence: 0.98, bbox: [280, 140, 420, 260], type: "vehicle" },
          { label: "Missing Zebra Crossing", confidence: 0.88, bbox: [40, 310, 460, 350], type: "deficiency" }
        ]
      },
      {
        id: "left_curb",
        name: "Left Curb & Pedestrian Safety Cam",
        fps: 29.0,
        resolution: "1920x1080 @ Edge",
        detections: [
          { label: "Vulnerable Pedestrian (School Child)", confidence: 0.95, bbox: [60, 160, 140, 310], type: "pedestrian_safety" },
          { label: "Bus Shelter Curb Zone", confidence: 0.91, bbox: [150, 180, 340, 320], type: "infrastructure" }
        ]
      },
      {
        id: "right_traffic",
        name: "Right Traffic & Vehicle Density Cam",
        fps: 27.8,
        resolution: "1920x1080 @ Edge",
        detections: [
          { label: "Two-Wheeler: Honda Activa", confidence: 0.96, bbox: [70, 170, 150, 280], type: "vehicle" },
          { label: "Auto-Rickshaw: Bajaj RE", confidence: 0.93, bbox: [170, 140, 280, 270], type: "vehicle" },
          { label: "Traffic Density: High (24 veh/100m)", confidence: 0.90, bbox: [10, 30, 440, 120], type: "density" }
        ]
      },
      {
        id: "anpr_zoom",
        name: "High-Speed ANPR Telephoto Zoom",
        fps: 30.0,
        resolution: "2560x1440 @ Edge",
        detections: [
          { label: "ANPR OCR: TS 09 EA 3112 (97.4%)", confidence: 0.974, plate: "TS 09 EA 3112", bbox: [110, 190, 360, 260], type: "anpr", vehicleSpeed: 86 }
        ]
      }
    ]
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, "../client/dist");

// Serve compiled React frontend in production / standalone
app.use(express.static(clientDist));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ detail: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Move India Backend running on port ${PORT}`);
});
