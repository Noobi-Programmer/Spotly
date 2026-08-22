# Spotly — Real-Time Campus Space Decision Engine 🌿

> **"Google Maps tells you where a place is. Spotly tells you if it's worth going there right now."**  
> *Don't wait. Don't wander. Just know.*

Built for **Gradient Rush Hackathon 2026** at **Scaler School of Technology (SST), Bangalore**.  
**Live GitHub Repo:** [https://github.com/Noobi-Programmer/Spotly](https://github.com/Noobi-Programmer/Spotly)

---

## 🎯 1. Problem → Solution

### The Friction (The Visibility Gap)
University students waste **20–40 minutes every day** walking between campus floors searching for an empty desk, a quiet room, or a functional power outlet. Traditional campus maps treat physical buildings like static 2D blueprints—they are completely blind to real-time space availability, acoustic environment, and crowd density.

### The Solution (Spotly)
Spotly is the **real-time decision layer for physical campus navigation**. It aggregates live room occupancy telemetry, noise meters, and power outlet availability into a sub-2ms deterministic recommendation engine that tells students exactly where to go right now.

---

## ⚡ 2. Core Functional Highlights (25% Scoring Weight)

| Feature | Description | Engineering Highlights |
| :--- | :--- | :--- |
| **🎯 "Find My Space" Engine** | Multi-criteria study space matching in $< 2\text{ ms}$. | 100% explainable weighted scoring; zero cloud latency; safety-clamped availability (full rooms automatically deprioritized). |
| **🔔 "Watch This Space" Alerts** | Set target thresholds (e.g. *alert when Coding Pod B drops $\le 50\%$*). | Dual-guarantee pipeline (Postgres triggers + client WebSockets + Web Audio API harmonic chime + browser push). |
| **🏢 Vertical Campus Radar** | Live floor-by-floor density maps (Basement to Rooftop). | Scalable architectural SVG with live status tiers (**LOW** 0–40%, **MODERATE** 41–70%, **HIGH/FULL** 71–100%+). |
| **📍 Ephemeral Geolocation** | Computes true walking minutes to rooms. | Privacy-preserving one-shot browser session GPS via the Haversine formula; zero movement history stored. |
| **🧪 Protected Demo Simulator** | Step occupancy down and trigger instant demo alerts. | Multi-tab `BroadcastChannel` synchronization + Supabase Realtime synchronization. |
| **🚀 20-Acre Campus Expansion** | Multi-campus multi-tenant architecture. | Seamlessly scales from SST Bangalore Electronic City to the upcoming 20-Acre Scaler campus. |

---

## 🛡️ 3. Privacy & Security Pledge (Zero-PII)

Spotly answers *"How busy is this room?"*, **never** *"Who is in this room?"*.
* 🚫 **No Device Sniffing / MAC Tracking:** Zero packet inspection or Bluetooth beacons tracking students.
* 📍 **No Movement Tracking:** Location is requested once to calculate proximity in memory and is **never stored permanently in databases**.
* 📊 **Aggregate Zone Telemetry:** All occupancy counts operate on physical zone capacity metrics.

---

## 🏗️ 4. Architecture & Technical Stack

```
[ Student Browser Client (Next.js 14 App Router + Tailwind CSS) ]
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
[ Local Deterministic Engine ]       [ Reactive Pub/Sub Layer ]
• Haversine GPS Proximity Math       • Multi-Tab BroadcastChannel
• Multi-Factor Intent Scoring (<2ms) • Synthesized Web Audio API ($520Hz -> $659Hz)
• Safety Clamping & Fallbacks        • Web Notification API
       │                                       │
       └───────────────────┬───────────────────┘
                           ▼
            [ Supabase Backend (Free Tier) ]
            • PostgreSQL `locations`, `alerts`, `occupancy_logs`
            • Server-Side Trigger (`trg_on_occupancy_change`)
            • Supabase Realtime WebSocket Replication
```

* **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
* **Audio Synthesis:** Pure Web Audio API (zero audio file downloads required).
* **Backend / Realtime:** Supabase PostgreSQL + Row Level Security (RLS) + Database Triggers.
* **Cost:** **₹0 / Month** (100% Free-Tier Serverless Stack).

---

## 🚀 5. Quickstart & Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/Noobi-Programmer/Spotly.git
cd Spotly
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> **Zero Setup Requirement:** Spotly runs 100% out of the box locally with instant multi-tab broadcast synchronization. Supabase credentials are purely optional for cloud replication!

---

## 🎬 6. Step-by-Step 2-Minute Demo Flow

1. **Step 1: Open Spotly** → Notice the real-time **SST Campus Pulse** and optional one-shot **Location Permission**.
2. **Step 2: Find Ideal Space** → Click **"Find My Space"** → Select *Quiet + Outlets + Low Crowd* → Notice the **94% match** recommendation with transparent explainability bullets in $<2\text{ms}$.
3. **Step 3: Watch a Crowded Room** → Scroll to **Coding Pod B (Floor 2)** (currently 83% full) → Tap **"Watch Space"** → Select **"Below 50%"** → Saved to **"My Watches"**.
4. **Step 4: Simulate Occupancy Change** → Open **"Demo Mode"** tray $\rightarrow$ Click **`🔥 Trigger Coding Pod B Alert (≤46%)`**.
5. **Step 5: Watch the Instant Ping** → Tab instantly chimes with harmonic Web Audio, fires celebratory confetti, and displays the banner:  
   *🔔 "Coding Pod B is ready! Occupancy dropped to 46% (below your 50% target)."*

---

## 👥 7. Team & Credits
* **Project Name:** Spotly
* **Hackathon:** Gradient Rush 2026 (Overnight Hackathon)
* **Campus:** Scaler School of Technology (SST), Electronic City, Bangalore
