import { routes, initialBuses } from "../data/transitData.js";

// Helper to calculate bearing between two coordinates (lat, lon in degrees)
function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return (toDeg(θ) + 360) % 360;
}

class GpsEngine {
  constructor() {
    this.routesMap = new Map(routes.map((r) => [r.id, r]));
    // Deep clone initial buses
    this.buses = JSON.parse(JSON.stringify(initialBuses));
    this.startSimulation();
  }

  startSimulation() {
    // Tick every 2000ms
    setInterval(() => {
      this.tick();
    }, 2000);
  }

  tick() {
    for (const bus of this.buses) {
      if (bus.status === "maintenance") continue;
      // If bus is actively receiving real phone GPS beacon, let real coordinates control it!
      if (bus.isRealGpsBeacon) continue;

      const route = this.routesMap.get(bus.routeId);
      if (!route || !route.stops || route.stops.length < 2) continue;

      const stops = route.stops;
      const waypoints = (route.roadWaypoints && route.roadWaypoints.length >= 2)
        ? route.roadWaypoints
        : route.stops.map(s => [s.latitude, s.longitude]);
      const totalPoints = waypoints.length;

      // Ensure direction is set (+1 forward, -1 backward)
      if (!bus.direction) bus.direction = 1;

      // Speed with slight realistic road variation
      const baseSpeed = bus.speedKmph || 24;
      const speedJitter = (Math.random() - 0.5) * 2;
      const effectiveSpeed = Math.max(12, Math.min(50, baseSpeed + speedJitter));

      // Advance roadProgress along real road waypoints
      const progressDelta = 0.055 * (effectiveSpeed / 25) * bus.direction;
      bus.roadProgress = (bus.roadProgress !== undefined ? bus.roadProgress : (bus.stepProgress || 0)) + progressDelta;

      // Handle endpoints turnaround
      if (bus.roadProgress >= totalPoints - 1) {
        bus.roadProgress = totalPoints - 1;
        bus.direction = -1;
      } else if (bus.roadProgress <= 0) {
        bus.roadProgress = 0;
        bus.direction = 1;
      }

      // Compute current and next road waypoint
      const pIdx = Math.floor(bus.roadProgress);
      const nextPIdx = bus.direction === 1
        ? Math.min(pIdx + 1, totalPoints - 1)
        : Math.max(0, pIdx - 1);

      const p1 = waypoints[pIdx];
      const p2 = waypoints[nextPIdx] || p1;

      const frac = bus.roadProgress - pIdx;

      // Linear interpolation of coordinates along road segment
      const lat = p1[0] + (p2[0] - p1[0]) * frac;
      const lng = p1[1] + (p2[1] - p1[1]) * frac;

      bus.currentLatitude = parseFloat(lat.toFixed(6));
      bus.currentLongitude = parseFloat(lng.toFixed(6));

      // Bearing calculated from exact road heading
      if (p1[0] !== p2[0] || p1[1] !== p2[1]) {
        const fromLat = bus.direction === 1 ? p1[0] : p2[0];
        const fromLng = bus.direction === 1 ? p1[1] : p2[1];
        const toLat = bus.direction === 1 ? p2[0] : p1[0];
        const toLng = bus.direction === 1 ? p2[1] : p1[1];
        bus.bearing = parseFloat(calculateBearing(fromLat, fromLng, toLat, toLng).toFixed(1));
      }

      // Find nearest station/stop checkpoint along the road
      let nearestStopIdx = 0;
      let minDistance = Infinity;
      stops.forEach((s, idx) => {
        const d = Math.hypot(s.latitude - lat, s.longitude - lng);
        if (d < minDistance) {
          minDistance = d;
          nearestStopIdx = idx;
        }
      });

      const nextStopIdx = bus.direction === 1
        ? Math.min(nearestStopIdx + 1, stops.length - 1)
        : Math.max(0, nearestStopIdx - 1);

      const s1 = stops[nearestStopIdx];
      const s2 = stops[nextStopIdx] || s1;

      // Stop references
      bus.currentStopId = s1.id;
      bus.currentStopName = s1.stopName;
      bus.nextStopName = s2.stopName;

      // Remaining ETA calculation
      const overallFrac = bus.direction === 1
        ? (1 - (bus.roadProgress / (totalPoints - 1)))
        : (bus.roadProgress / (totalPoints - 1));
      bus.calculatedRemainingEtaMinutes = Math.max(
        1,
        Math.round(overallFrac * (route.durationMinutes || 40) + (bus.delayMinutes || 0))
      );

      // Battery depletion simulation
      if (bus.batteryLevel && bus.batteryLevel > 15) {
        bus.batteryLevel = Math.max(10, +(bus.batteryLevel - 0.005).toFixed(2));
      }

      bus.lastUpdated = new Date().toISOString();
    }
  }

  getLiveBuses() {
    return {
      buses: this.buses,
      timestamp: new Date().toISOString()
    };
  }

  updateBusStatus(busId, updates) {
    const bus = this.buses.find((b) => b.id === busId);
    if (!bus) return null;

    if (updates.status !== undefined) bus.status = updates.status;
    if (updates.delayMinutes !== undefined) bus.delayMinutes = Number(updates.delayMinutes);
    if (updates.occupancyLevel !== undefined) {
      bus.occupancyLevel = updates.occupancyLevel;
      if (updates.occupancyLevel === "seats_available") bus.occupancyPercent = 35;
      else if (updates.occupancyLevel === "medium") bus.occupancyPercent = 65;
      else if (updates.occupancyLevel === "crowded" || updates.occupancyLevel === "full") bus.occupancyPercent = 90;
    }
    if (updates.speedKmph !== undefined) bus.speedKmph = Number(updates.speedKmph);
    if (updates.currentLatitude !== undefined) bus.currentLatitude = updates.currentLatitude;
    if (updates.currentLongitude !== undefined) bus.currentLongitude = updates.currentLongitude;
    if (updates.bearing !== undefined) bus.bearing = updates.bearing;
    if (updates.isRealGpsBeacon !== undefined) bus.isRealGpsBeacon = updates.isRealGpsBeacon;
    if (updates.lastBeaconTime !== undefined) bus.lastBeaconTime = updates.lastBeaconTime;
    if (updates.currentStopId) {
      bus.currentStopId = updates.currentStopId;
      const route = this.routesMap.get(bus.routeId);
      const st = route?.stops?.find((s) => s.id === updates.currentStopId);
      if (st) {
        bus.currentStopName = st.stopName;
        bus.stepProgress = st.sequenceNumber - 1;
        bus.currentLatitude = st.latitude;
        bus.currentLongitude = st.longitude;
      }
    }
    bus.lastUpdated = new Date().toISOString();
    return bus;
  }
}

export const gpsEngine = new GpsEngine();
