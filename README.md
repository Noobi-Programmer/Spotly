# Spotly 🎓

> **Don't wait. Don't wander. Just know.**  
> *Transforming campus navigation from "Where is this place?" to "Where should I go right now?"*

Built for an overnight hackathon — **₹0 Cost / Free-First Stack** with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

---

## ⚡ Core Features

1. **Campus Pulse & Real-time Space Telemetry:** Live occupancy percentages, available seats, noise meters, and facility badges (Power Outlets, Gigabit Wi-Fi, Quiet Zones).
2. **Deterministic "Find My Space" Engine:** Multi-criteria weighted matching algorithm that runs locally in $< 2\text{ ms}$ with 100% explainable scoring reasons.
3. **Threshold-Based "Notify Me" Alerting:** Set target occupancy thresholds (e.g. *alert when Study Room B drops $\le 50\%$*) and receive instant in-app toasts with Web Audio API chime.
4. **Interactive Architectural SVG Campus Map:** 2D floorplan with real-time heat coloring (Spacious, Moderate, Crowded) and pulsing radar beacons on top matches.
5. **Live Occupancy Simulator (Admin/Demo Mode):** Discreet demo control tray with $+/-5\%$ step buttons, sliders, and 1-click demo presets (*"Trigger Hero Alert"*, *"Midday Peak"*, *"Quiet Night"*).

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The application works 100% out-of-the-box in local development with automatic multi-tab broadcast synchronization. No API keys or paid services are required!

---

## 🗄️ Optional Supabase Production Deployment

1. Create a free project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in Supabase and run the script in [`supabase/schema.sql`](file:///c:/Users/abini/Downloads/Campus_flow/supabase/schema.sql).
3. Add your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
4. Deploy to Vercel with zero extra configuration!

---

## 🔒 Privacy & Architecture Principles

- **Zero-PII:** No device tracking, packet sniffing, or student MAC addresses.
- **Aggregate Zone Telemetry:** Works with aggregate Wi-Fi Access Point association counts, crowdsourced check-ins, or simulated feeds.
- **Zero Paid AI Dependencies:** 100% reliable local TypeScript recommendation engine.
