// SIH 2024 Project: Urban AI Sensing Platform Dataset
// Realistic road defects, traffic incidents, ANPR detections, and municipal work orders
// for Hyderabad (TSRTC), Bengaluru (BMTC), and Delhi (DTC) corridors.

const roadDefects = [
  {
    id: "def_001",
    city: "Hyderabad",
    routeId: "101-H",
    busId: "b101_1",
    type: "pothole",
    title: "Deep Road Pothole (Critical)",
    severity: "critical", // critical, high, moderate, low
    depthCm: 14,
    diameterCm: 48,
    latitude: 17.4435,
    longitude: 78.4712,
    locationName: "Begumpet Flyover Descent, Near Shoppers Stop",
    confidence: 0.94,
    detectedByBusesCount: 4,
    detectedAt: "2026-09-03T10:15:20Z",
    status: "verified", // verified, work_order_created, repaired
    cameraFeed: "front_windshield",
    snapshotUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
    hazardLevel: "Severe tire puncture & two-wheeler skid risk"
  },
  {
    id: "def_002",
    city: "Hyderabad",
    routeId: "101-H",
    busId: "b101_2",
    type: "missing_zebra_crossing",
    title: "Faded / Missing Zebra Crossing",
    severity: "high",
    latitude: 17.4372,
    longitude: 78.4485,
    locationName: "Punjagutta Central Junction, Near Metro Pillar 1042",
    confidence: 0.89,
    detectedByBusesCount: 7,
    detectedAt: "2026-09-03T09:42:10Z",
    status: "verified",
    cameraFeed: "front_windshield",
    snapshotUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
    hazardLevel: "High pedestrian collision risk near busy transit junction"
  },
  {
    id: "def_003",
    city: "Hyderabad",
    routeId: "101-H",
    busId: "b101_1",
    type: "damaged_signboard",
    title: "Damaged / Obstructed Speed Limit Sign (40 km/h)",
    severity: "moderate",
    latitude: 17.4332,
    longitude: 78.4112,
    locationName: "Jubilee Hills Checkpost, Road No. 36",
    confidence: 0.92,
    detectedByBusesCount: 3,
    detectedAt: "2026-09-03T11:05:00Z",
    status: "verified",
    cameraFeed: "front_windshield",
    snapshotUrl: "https://images.unsplash.com/photo-1572932454045-817865207797?w=600&auto=format&fit=crop&q=80",
    hazardLevel: "Vehicle speeding through blind commercial turn"
  },
  {
    id: "def_004",
    city: "Hyderabad",
    routeId: "216-W",
    busId: "b216_1",
    type: "missing_road_divider",
    title: "Broken Concrete Median / Missing Road Divider",
    severity: "critical",
    latitude: 17.4042,
    longitude: 78.4195,
    locationName: "Tolichowki Flyover Approach, Seven Tombs Road",
    confidence: 0.95,
    detectedByBusesCount: 5,
    detectedAt: "2026-09-03T08:30:15Z",
    status: "work_order_created",
    cameraFeed: "front_windshield",
    snapshotUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80",
    hazardLevel: "Head-on collision risk due to illegal U-turns across broken median"
  },
  {
    id: "def_005",
    city: "Hyderabad",
    routeId: "216-W",
    busId: "b216_2",
    type: "waterlogging",
    title: "Stormwater Logging / Choked Drainage",
    severity: "high",
    depthCm: 22,
    latitude: 17.4265,
    longitude: 78.3775,
    locationName: "Gachibowli Junction Underpass, Near Bio-Diversity",
    confidence: 0.91,
    detectedByBusesCount: 6,
    detectedAt: "2026-09-03T12:10:45Z",
    status: "verified",
    cameraFeed: "front_windshield",
    snapshotUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80",
    hazardLevel: "Bus engine stalling risk & 20 min traffic bottleneck"
  },
  {
    id: "def_006",
    city: "Bengaluru",
    routeId: "335-E",
    busId: "b335_1",
    type: "pothole",
    title: "Cluster Potholes / Asphalt Erosion",
    severity: "critical",
    depthCm: 18,
    diameterCm: 72,
    latitude: 12.9555,
    longitude: 77.6885,
    locationName: "Marathahalli Bridge Service Road, HAL Old Airport Rd",
    confidence: 0.96,
    detectedByBusesCount: 8,
    detectedAt: "2026-09-03T07:50:00Z",
    status: "work_order_created",
    cameraFeed: "front_windshield",
    snapshotUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
    hazardLevel: "Critical two-wheeler accident blackspot during night hours"
  },
  {
    id: "def_007",
    city: "Delhi",
    routeId: "505-AC",
    busId: "b505_1",
    type: "missing_zebra_crossing",
    title: "Faded Pedestrian Crossing near School Zone",
    severity: "high",
    latitude: 28.5355,
    longitude: 77.1985,
    locationName: "Sri Aurobindo Marg, Near Kendriya Vidyalaya Mehrauli",
    confidence: 0.93,
    detectedByBusesCount: 6,
    detectedAt: "2026-09-03T08:15:30Z",
    status: "verified",
    cameraFeed: "left_curb",
    snapshotUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
    hazardLevel: "School children vulnerable crossing during peak morning hours"
  }
];

const trafficIncidents = [
  {
    id: "inc_101",
    city: "Hyderabad",
    routeId: "101-H",
    detectingBusId: "b101_1",
    type: "rash_driving",
    severity: "critical",
    title: "Excessive Speeding & Zig-Zag Overtake in Bus Bay",
    offendingVehicle: {
      plateNumber: "TS 09 EA 3112",
      plateConfidence: 0.972,
      vehicleClass: "SUV (White Creta)",
      speedKmph: 86,
      speedLimitKmph: 40,
      direction: "North-Westbound towards Jubilee Hills"
    },
    latitude: 17.4385,
    longitude: 78.4350,
    locationName: "Banjara Hills Road No. 12 Intersection",
    timestamp: "2026-09-03T14:22:15Z",
    cameraFeed: "right_traffic",
    status: "dispatched_to_police", // pending_dispatch, dispatched_to_police, under_investigation, challan_issued
    policeDispatchId: "HYD-TP-2026-9812",
    evidenceClipUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
    notes: "Nearly sideswiped pedestrian waiting at bus shelter. ANPR OCR verified with 97.2% confidence."
  },
  {
    id: "inc_102",
    city: "Hyderabad",
    routeId: "216-W",
    detectingBusId: "b216_1",
    type: "hit_and_run",
    severity: "critical",
    title: "Hit-and-Run on 2-Wheeler • Offending Vehicle Fled",
    offendingVehicle: {
      plateNumber: "TS 08 UB 7749",
      plateConfidence: 0.948,
      vehicleClass: "Commercial LCV (Tata Ace)",
      speedKmph: 62,
      speedLimitKmph: 40,
      direction: "Southbound towards Mehdipatnam"
    },
    latitude: 17.4085,
    longitude: 78.4010,
    locationName: "Shaikpet Dargah Junction",
    timestamp: "2026-09-03T13:45:00Z",
    cameraFeed: "left_curb",
    status: "dispatched_to_police",
    policeDispatchId: "HYD-TP-2026-9804",
    evidenceClipUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
    notes: "Offending vehicle struck Honda Activa rear, did not stop. Auto-alert sent to Cyberabad Traffic Control."
  },
  {
    id: "inc_103",
    city: "Bengaluru",
    routeId: "335-E",
    detectingBusId: "b335_1",
    type: "bus_lane_encroachment",
    severity: "moderate",
    title: "Illegal Bus Rapid Transit (BRT) Lane Encroachment",
    offendingVehicle: {
      plateNumber: "KA 01 MG 5521",
      plateConfidence: 0.965,
      vehicleClass: "Private Sedan",
      speedKmph: 45,
      speedLimitKmph: 40,
      direction: "Eastbound towards ITPL"
    },
    latitude: 12.9610,
    longitude: 77.7120,
    locationName: "Kundalahalli Gate Dedicated Bus Lane",
    timestamp: "2026-09-03T14:05:10Z",
    cameraFeed: "front_windshield",
    status: "pending_dispatch",
    policeDispatchId: null,
    evidenceClipUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80",
    notes: "Blocked BMTC Volvo bus for 3.2 minutes in priority transit lane."
  }
];

const municipalWorkOrders = [
  {
    id: "WO-GHMC-2026-041",
    defectId: "def_001",
    city: "Hyderabad",
    title: "Pothole Patching & Asphalt Resurfacing",
    division: "GHMC Khairatabad Circle • PWD Division 4",
    location: "Begumpet Flyover Descent, Shoppers Stop",
    priority: "Urgent (P1)",
    estimatedCost: 18500,
    contractorAssigned: "Shree Balaji Infrastructure & Roadworks",
    assignedDate: "2026-09-03T11:30:00Z",
    targetCompletion: "2026-09-05",
    status: "assigned", // assigned, in_progress, completed, verified_by_bus
    verificationSource: "TSRTC Bus 101-H Edge Camera"
  },
  {
    id: "WO-GHMC-2026-042",
    defectId: "def_004",
    city: "Hyderabad",
    title: "Median Divider Concrete Barrier Replacement",
    division: "GHMC Golconda Circle • PWD Road Safety Cell",
    location: "Tolichowki Flyover Approach, Seven Tombs Road",
    priority: "Critical (P0)",
    estimatedCost: 32000,
    contractorAssigned: "Deccan Urban Civil Contractors",
    assignedDate: "2026-09-03T09:00:00Z",
    targetCompletion: "2026-09-04",
    status: "in_progress",
    verificationSource: "TSRTC Bus 216-W Edge Camera"
  },
  {
    id: "WO-BBMP-2026-119",
    defectId: "def_006",
    city: "Bengaluru",
    title: "Marathahalli Service Road Reconstruction & Milling",
    division: "BBMP Mahadevapura Zone • Road Infrastructure",
    location: "Marathahalli Bridge Service Road, HAL Old Airport Rd",
    priority: "Critical (P0)",
    estimatedCost: 75000,
    contractorAssigned: "Karnataka Urban Highway Corp",
    assignedDate: "2026-09-03T08:30:00Z",
    targetCompletion: "2026-09-06",
    status: "assigned",
    verificationSource: "BMTC 335-E Edge Camera"
  }
];

const edgeTelemetry = {
  activeBusesEdgeUnits: 4,
  totalFramesAnalyzed: 142850,
  rawVideoBandwidthEquivalentGb: 84.6, // If raw 1080p 30fps was streamed
  edgeMetadataTransmittedMb: 112.4,   // Actual JSON + thumbnails sent
  bandwidthSavingsPercent: 99.87,
  avgInferenceLatencyMs: 24,          // 24ms per frame on Jetson / Mobile Edge GPU
  activeDetectionsToday: {
    potholes: 38,
    missingSignboards: 14,
    missingZebraCrossings: 9,
    trafficBottlenecks: 12,
    vehiclesClassified: 26410,
    anprPlatesRead: 4190,
    policeIncidentsFlagged: 6
  }
};

export {
  roadDefects,
  trafficIncidents,
  municipalWorkOrders,
  edgeTelemetry
};
