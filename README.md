# 🇮🇳 Move India — Live GPS & Crowd Intelligence Platform

A fullstack real-time bus tracking and crowdsourcing transit intelligence system for Indian metropolitan corridors, covering **TSRTC (Hyderabad)**, **BMTC (Bengaluru)**, and **DTC (Delhi)**.

---

## ⚡ Quick Start

### 1. Install Dependencies (Done automatically)
If needed in the future:
```bash
npm run install:all
```

### 2. Launch the Application
Run both backend and frontend together with a single command:
```bash
npm start
```
Or:
```bash
npm run dev
```

- **Frontend Commuter App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🚀 Key Features

### 1. 🗺️ Real-Time GPS Tracking Map
- High-contrast dark transit basemap powered by Leaflet.
- Live moving bus icons with heading direction, speed in km/h, remaining ETA, and battery levels.
- Interactive glowing route polylines and stop sequence checkpoints.

### 2. 👥 Commuter Crowdsourcing Engine
- Commuters report live bus crowd levels (Seats Available, Medium Rush, Full) and delays.
- Real-time community incident feed showing verified updates from fellow passengers.

### 3. 🤖 AI & Statistical Congestion Predictor
- Analyzes peak traffic windows (morning and evening office rush) combined with verified community reports.
- Computes crowding probabilities (0–100%) and delay estimates for each route.

### 4. 🛠️ Driver & Fleet Operator Command Deck
- Drivers and depot managers can override bus status (On Time, Delayed, In Maintenance).
- Dynamic occupancy bar adjustment and checkpoint verification.

### 5. 🛡️ Transit Authority Moderation Hub
- Administrators can review incoming passenger reports in real-time.
- One-click **Approve** or **Reject** to maintain high data accuracy on commuter dashboards.
- Network punctuality and fleet delay analytics.

### 6. ⚡ 1-Click Role Login
- Instantly switch between **Passenger**, **Operator/Driver**, and **Admin/Authority** with 1 click in the top navigation bar without typing passwords.

---

## 🚏 Active Transit Corridors Included

| Route | Agency | Origin ➔ Destination | Stops | Avg Fare |
|---|---|---|---|---|
| **101-H** | **TSRTC** (Hyderabad) | Secunderabad Station ➔ Hitec City Cyber Towers | 7 Stops | ₹35 |
| **216-W** | **TSRTC** (Hyderabad) | Mehdipatnam Depot ➔ Financial District (WaveRock) | 6 Stops | ₹30 |
| **335-E** | **BMTC** (Bengaluru) | Majestic KBS ➔ ITPL Whitefield | 7 Stops | ₹45 |
| **505-AC** | **DTC** (Delhi) | NDLS Connaught Place ➔ Mehrauli Terminal | 6 Stops | ₹25 |

---

## 🏗️ Architecture

```
move-india/
├── client/                     # Vite + React 18 Commuter Frontend
│   ├── src/
│   │   ├── components/         # LiveMap, BusCards, StopTimeline, AdminHub, etc.
│   │   ├── context/            # AuthContext with 1-click role switcher
│   │   ├── App.jsx             # Main dashboard controller
│   │   └── index.css           # Tailwind styling + custom Leaflet theme
│   ├── vite.config.js          # Reverse proxy to backend (:5000)
│   └── package.json
├── server/                     # Express.js High-Performance REST API
│   ├── data/transitData.js     # Indian bus routes, stops, and fleet data
│   ├── simulation/gpsEngine.js # Physics engine simulating live moving buses
│   ├── index.js                # API routes and moderation endpoints
│   └── package.json
├── dev.js                      # Dual-service orchestrator
├── package.json                # Root automation scripts
└── README.md
```
