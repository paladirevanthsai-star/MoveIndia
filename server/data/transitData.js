export const routes = [
  {
    id: "101",
    routeNumber: "101-H",
    routeName: "Secunderabad Station → Hitec City Cyber Towers",
    city: "Hyderabad (TSRTC)",
    source: "Secunderabad Station",
    destination: "Hitec City Cyber Towers",
    durationMinutes: 45,
    fare: 35,
    active: true,
    stopsCount: 7,
    createdAt: new Date().toISOString(),
    stops: [
      { id: "s101_1", routeId: "101", stopName: "Secunderabad Station", latitude: 17.4344, longitude: 78.5015, sequenceNumber: 1, landmark: "Platform 1 Gate" },
      { id: "s101_2", routeId: "101", stopName: "Paradise Circle", latitude: 17.4428, longitude: 78.4872, sequenceNumber: 2, landmark: "Paradise Hotel" },
      { id: "s101_3", routeId: "101", stopName: "Begumpet Flyover", latitude: 17.4447, longitude: 78.4664, sequenceNumber: 3, landmark: "Metro Station" },
      { id: "s101_4", routeId: "101", stopName: "Punjagutta Central", latitude: 17.4278, longitude: 78.4522, sequenceNumber: 4, landmark: "Hyderabad Central Mall" },
      { id: "s101_5", routeId: "101", stopName: "Banjara Hills Rd 1", latitude: 17.4206, longitude: 78.4419, sequenceNumber: 5, landmark: "Care Hospital" },
      { id: "s101_6", routeId: "101", stopName: "Jubilee Hills Checkpost", latitude: 17.4294, longitude: 78.4093, sequenceNumber: 6, landmark: "Checkpost Metro" },
      { id: "s101_7", routeId: "101", stopName: "Hitec City Cyber Towers", latitude: 17.4504, longitude: 78.3808, sequenceNumber: 7, landmark: "Cyber Gateway" }
    ],
    roadWaypoints: [
      [17.4344, 78.5015], // Secunderabad Station
      [17.4368, 78.4975], // Station Road
      [17.4392, 78.4935], // SP Road Junction
      [17.4428, 78.4872], // Paradise Circle
      [17.4435, 78.4795], // Rasoolpura Metro
      [17.4442, 78.4720], // Prakash Nagar Flyover
      [17.4447, 78.4664], // Begumpet Flyover
      [17.4415, 78.4600], // Greenlands Junction
      [17.4350, 78.4560], // Somajiguda
      [17.4278, 78.4522], // Punjagutta Central
      [17.4240, 78.4480], // Nagarjuna Circle
      [17.4206, 78.4419], // Taj Krishna / Care Hospital
      [17.4225, 78.4320], // Road No 10 Banjara Hills
      [17.4255, 78.4210], // Road No 36 Entrance
      [17.4294, 78.4093], // Jubilee Hills Checkpost
      [17.4330, 78.4010], // Peddamma Gudi
      [17.4385, 78.3930], // Madhapur Main Road
      [17.4440, 78.3875], // Cyber Towers Flyover Underpass
      [17.4504, 78.3808]  // Hitec City Cyber Towers
    ]
  },
  {
    id: "216",
    routeNumber: "216-W",
    routeName: "Mehdipatnam → Financial District (WaveRock)",
    city: "Hyderabad (TSRTC)",
    source: "Mehdipatnam Depot",
    destination: "Financial District (WaveRock)",
    durationMinutes: 38,
    fare: 30,
    active: true,
    stopsCount: 6,
    createdAt: new Date().toISOString(),
    stops: [
      { id: "s216_1", routeId: "216", stopName: "Mehdipatnam Depot", latitude: 17.3916, longitude: 78.4398, sequenceNumber: 1, landmark: "Rythu Bazar" },
      { id: "s216_2", routeId: "216", stopName: "Tolichowki Cross Road", latitude: 17.3995, longitude: 78.4124, sequenceNumber: 2, landmark: "Galaxy Theatre" },
      { id: "s216_3", routeId: "216", stopName: "Shaikpet Nala", latitude: 17.4082, longitude: 78.3931, sequenceNumber: 3, landmark: "Passport Office" },
      { id: "s216_4", routeId: "216", stopName: "Biodiversity Park", latitude: 17.4285, longitude: 78.3752, sequenceNumber: 4, landmark: "Gachibowli Junction" },
      { id: "s216_5", routeId: "216", stopName: "Gachibowli Stadium", latitude: 17.4411, longitude: 78.3585, sequenceNumber: 5, landmark: "Sports Complex" },
      { id: "s216_6", routeId: "216", stopName: "WaveRock SEZ", latitude: 17.4194, longitude: 78.3421, sequenceNumber: 6, landmark: "Financial District" }
    ],
    roadWaypoints: [
      [17.3916, 78.4398], // Mehdipatnam Depot
      [17.3945, 78.4280], // Rethi Bowli
      [17.3995, 78.4124], // Tolichowki Flyover
      [17.4040, 78.4020], // Shaikpet Flyover
      [17.4082, 78.3931], // Shaikpet Nala
      [17.4140, 78.3850], // Narayanamma College Road
      [17.4210, 78.3790], // Dargah Junction
      [17.4285, 78.3752], // Biodiversity Park
      [17.4350, 78.3680], // Gachibowli Flyover
      [17.4411, 78.3585], // Gachibowli Stadium
      [17.4370, 78.3490], // IIIT Hyderabad Circle
      [17.4270, 78.3440], // Wipro Circle
      [17.4194, 78.3421]  // WaveRock SEZ
    ]
  },
  {
    id: "335",
    routeNumber: "335-E",
    routeName: "Kempegowda Bus Station (Majestic) → ITPL Whitefield",
    city: "Bengaluru (BMTC)",
    source: "Majestic KBS",
    destination: "ITPL Main Gate",
    durationMinutes: 55,
    fare: 45,
    active: true,
    stopsCount: 7,
    createdAt: new Date().toISOString(),
    stops: [
      { id: "s335_1", routeId: "335", stopName: "Majestic KBS", latitude: 12.9772, longitude: 77.5729, sequenceNumber: 1, landmark: "Sangam Cinema" },
      { id: "s335_2", routeId: "335", stopName: "Corporation Circle", latitude: 12.9667, longitude: 77.5873, sequenceNumber: 2, landmark: "BBMP HQ" },
      { id: "s335_3", routeId: "335", stopName: "Richmond Circle", latitude: 12.9625, longitude: 77.5982, sequenceNumber: 3, landmark: "Flyover Entry" },
      { id: "s335_4", routeId: "335", stopName: "Domlur TTMC", latitude: 12.9609, longitude: 77.6387, sequenceNumber: 4, landmark: "EGL Tech Park" },
      { id: "s335_5", routeId: "335", stopName: "HAL Main Gate", latitude: 12.9553, longitude: 77.6685, sequenceNumber: 5, landmark: "Heritage Centre" },
      { id: "s335_6", routeId: "335", stopName: "Marathahalli Bridge", latitude: 12.9562, longitude: 77.7011, sequenceNumber: 6, landmark: "Kalamandir Junction" },
      { id: "s335_7", routeId: "335", stopName: "ITPL Main Gate", latitude: 12.9863, longitude: 77.7381, sequenceNumber: 7, landmark: "Tech Park Gate 1" }
    ],
    roadWaypoints: [
      [12.9772, 77.5729], // Majestic KBS
      [12.9720, 77.5810], // Mysore Bank Circle
      [12.9667, 77.5873], // Corporation Circle
      [12.9625, 77.5982], // Richmond Circle
      [12.9615, 77.6180], // Austin Town / Old Airport Rd
      [12.9609, 77.6387], // Domlur TTMC
      [12.9585, 77.6520], // Kodihalli / Leela Palace
      [12.9553, 77.6685], // HAL Main Gate
      [12.9562, 77.7011], // Marathahalli Bridge
      [12.9680, 77.7180], // Kundalahalli Gate
      [12.9780, 77.7280], // Graphite India Circle
      [12.9863, 77.7381]  // ITPL Main Gate
    ]
  },
  {
    id: "505",
    routeNumber: "505-AC",
    routeName: "New Delhi Railway Station → Mehrauli Terminal",
    city: "Delhi (DTC)",
    source: "NDLS Connaught Place",
    destination: "Mehrauli Terminal",
    durationMinutes: 50,
    fare: 25,
    active: true,
    stopsCount: 6,
    createdAt: new Date().toISOString(),
    stops: [
      { id: "s505_1", routeId: "505", stopName: "NDLS Connaught Place", latitude: 28.6328, longitude: 77.2197, sequenceNumber: 1, landmark: "Shivaji Stadium" },
      { id: "s505_2", routeId: "505", stopName: "Patel Chowk Metro", latitude: 28.6231, longitude: 77.2136, sequenceNumber: 2, landmark: "Metro Gate 2" },
      { id: "s505_3", routeId: "505", stopName: "India Gate Circle", latitude: 28.6129, longitude: 77.2295, sequenceNumber: 3, landmark: "National War Memorial" },
      { id: "s505_4", routeId: "505", stopName: "AIIMS Flyover", latitude: 28.5672, longitude: 77.21, sequenceNumber: 4, landmark: "Safdarjung Hospital" },
      { id: "s505_5", routeId: "505", stopName: "Saket Select Citywalk", latitude: 28.5283, longitude: 77.2185, sequenceNumber: 5, landmark: "Press Enclave Marg" },
      { id: "s505_6", routeId: "505", stopName: "Mehrauli Terminal", latitude: 28.5245, longitude: 77.1855, sequenceNumber: 6, landmark: "Qutub Minar Entry" }
    ],
    roadWaypoints: [
      [28.6328, 77.2197], // NDLS Connaught Place
      [28.6270, 77.2185], // Janpath Radial
      [28.6231, 77.2136], // Patel Chowk
      [28.6175, 77.2210], // Ashoka Road
      [28.6129, 77.2295], // India Gate C-Hexagon
      [28.6040, 77.2260], // Shahjahan Road
      [28.5880, 77.2210], // Lodhi Road
      [28.5672, 77.2100], // AIIMS Flyover
      [28.5530, 77.2060], // Green Park
      [28.5410, 77.1980], // IIT Flyover / Aurobindo Marg
      [28.5283, 77.2185], // Saket Select Citywalk
      [28.5245, 77.1855]  // Mehrauli Terminal
    ]
  }
];

export const initialBuses = [
  {
    id: "b101_1",
    busNumber: "TS-09-UA-4421",
    routeId: "101",
    routeName: "Secunderabad Station → Hitec City Cyber Towers",
    operatorId: "op_suresh",
    operatorName: "Suresh Kumar",
    status: "on_time",
    delayMinutes: 0,
    occupancyLevel: "seats_available",
    occupancyPercent: 35,
    currentStopId: "s101_2",
    currentStopName: "Paradise Circle",
    nextStopName: "Begumpet Flyover",
    currentLatitude: 17.4428,
    currentLongitude: 78.4872,
    bearing: 95.5,
    speedKmph: 24.0,
    busType: "TSRTC Metro Super Luxury AC",
    batteryLevel: 84,
    stepProgress: 1.2,
    direction: 1,
    lastUpdated: new Date().toISOString(),
    calculatedRemainingEtaMinutes: 32
  },
  {
    id: "b101_2",
    busNumber: "TS-10-UB-8890",
    routeId: "101",
    routeName: "Secunderabad Station → Hitec City Cyber Towers",
    operatorId: "op_ramesh",
    operatorName: "Ramesh Rao",
    status: "delayed",
    delayMinutes: 12,
    occupancyLevel: "crowded",
    occupancyPercent: 88,
    currentStopId: "s101_4",
    currentStopName: "Punjagutta Central",
    nextStopName: "Banjara Hills Rd 1",
    currentLatitude: 17.4278,
    currentLongitude: 78.4522,
    bearing: 218.7,
    speedKmph: 18.0,
    busType: "TSRTC Metro Express",
    batteryLevel: 62,
    stepProgress: 3.4,
    direction: 1,
    lastUpdated: new Date().toISOString(),
    calculatedRemainingEtaMinutes: 20
  },
  {
    id: "b216_1",
    busNumber: "TS-11-FA-1204",
    routeId: "216",
    routeName: "Mehdipatnam → Financial District (WaveRock)",
    operatorId: "op_vijay",
    operatorName: "Vijay Goud",
    status: "delayed",
    delayMinutes: 7,
    occupancyLevel: "medium",
    occupancyPercent: 68,
    currentStopId: "s216_3",
    currentStopName: "Shaikpet Nala",
    nextStopName: "Biodiversity Park",
    currentLatitude: 17.4082,
    currentLongitude: 78.3931,
    bearing: 35.8,
    speedKmph: 26.0,
    busType: "TSRTC Electric Vajra",
    batteryLevel: 91,
    stepProgress: 2.5,
    direction: 1,
    lastUpdated: new Date().toISOString(),
    calculatedRemainingEtaMinutes: 18
  },
  {
    id: "b335_1",
    busNumber: "KA-01-FA-9912",
    routeId: "335",
    routeName: "Kempegowda Bus Station (Majestic) → ITPL Whitefield",
    operatorId: "op_manju",
    operatorName: "Manjunath Gowda",
    status: "on_time",
    delayMinutes: 4,
    occupancyLevel: "seats_available",
    occupancyPercent: 42,
    currentStopId: "s335_2",
    currentStopName: "Corporation Circle",
    nextStopName: "Richmond Circle",
    currentLatitude: 12.9667,
    currentLongitude: 77.5873,
    bearing: 120.4,
    speedKmph: 28.0,
    busType: "BMTC Vajra Volvo AC",
    batteryLevel: 78,
    stepProgress: 1.6,
    direction: 1,
    lastUpdated: new Date().toISOString(),
    calculatedRemainingEtaMinutes: 42
  },
  {
    id: "b505_1",
    busNumber: "DL-1P-D-6721",
    routeId: "505",
    routeName: "New Delhi Railway Station → Mehrauli Terminal",
    operatorId: "op_kuldeep",
    operatorName: "Kuldeep Singh",
    status: "delayed",
    delayMinutes: 15,
    occupancyLevel: "medium",
    occupancyPercent: 74,
    currentStopId: "s505_3",
    currentStopName: "India Gate Circle",
    nextStopName: "AIIMS Flyover",
    currentLatitude: 28.6129,
    currentLongitude: 77.2295,
    bearing: 195.0,
    speedKmph: 20.0,
    busType: "DTC Green AC Low Floor",
    batteryLevel: 55,
    stepProgress: 2.3,
    direction: 1,
    lastUpdated: new Date().toISOString(),
    calculatedRemainingEtaMinutes: 28
  }
];

export const initialReports = [
  {
    id: "rep_101",
    routeId: "101",
    busId: "b101_2",
    stopId: "s101_5",
    userId: "usr_passenger",
    userName: "Ananya Verma",
    userRole: "passenger",
    type: "crowding",
    crowdingLevel: "high",
    delayMinutes: 12,
    description: "Heavy rush near Banjara Hills Rd 1. Standing room only, but AC is functioning well.",
    status: "approved",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    id: "rep_102",
    routeId: "101",
    busId: "b101_1",
    stopId: "s101_2",
    userId: "usr_operator",
    userName: "Suresh Kumar",
    userRole: "operator",
    type: "delay",
    crowdingLevel: "seats_available",
    delayMinutes: 5,
    description: "Minor congestion at Paradise flyover signal. Resuming top speed now.",
    status: "approved",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: "rep_103",
    routeId: "216",
    busId: "b216_1",
    stopId: "s216_2",
    userId: "usr_passenger",
    userName: "Rahul Sharma",
    userRole: "passenger",
    type: "crowding",
    crowdingLevel: "medium",
    delayMinutes: 0,
    description: "Window seats available at Tolichowki Cross Road.",
    status: "approved",
    createdAt: new Date(Date.now() - 20 * 60000).toISOString()
  },
  {
    id: "rep_104",
    routeId: "505",
    busId: "b505_1",
    stopId: "s505_3",
    userId: "usr_passenger",
    userName: "Amit Patel",
    userRole: "passenger",
    type: "delay",
    crowdingLevel: "high",
    delayMinutes: 15,
    description: "Traffic diversion near India Gate hex. Delay expected for 15 mins.",
    status: "approved",
    createdAt: new Date(Date.now() - 10 * 60000).toISOString()
  }
];

export const demoUsers = {
  passenger: {
    id: "usr_passenger",
    name: "Ananya Verma",
    email: "ananya.verma@example.com",
    role: "passenger",
    phone: "+91 98765 43210"
  },
  operator: {
    id: "usr_operator",
    name: "Suresh Kumar (Driver)",
    email: "suresh.kumar@tsrtc.gov.in",
    role: "operator",
    phone: "+91 91234 56789"
  },
  admin: {
    id: "usr_admin",
    name: "Rajeshwar Rao (Chief Controller)",
    email: "controller@tsrtc.telangana.gov.in",
    role: "admin",
    phone: "+91 99887 76655"
  }
};
