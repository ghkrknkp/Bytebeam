# Bytebeam Fleet Operations & Telematics Platform
> **Bytebeam Frontend Engineer Intern Assignment** — Built with React 19, TypeScript, Vite, Tailwind CSS, Leaflet (OpenStreetMap), Recharts, and Supabase (PostgreSQL + Auth).

---

## 1. Project Overview

### 1.1. What Was Built
The **Bytebeam Fleet Operations Platform** is a production-grade commercial fleet telematics dashboard engineered for logistics controllers, dispatch supervisors, and operations leads. It provides real-time GPS tracking across Bengaluru logistics corridors, electric vehicle (EV) battery diagnostics, multi-point trip route polyline reconstruction, telemetry threshold alerts, and instant operational status updates.

### 1.2. Main Product Decisions
- **Pure White & Light-Grey SaaS Theme**: Engineered with high-contrast slate typography (`#0f172a`), pure white cards (`#ffffff`), and soft light-grey fill boxes (`#f8fafc` / `#f1f5f9`), optimizing readability for daytime control rooms.
- **Dual-Mode Architectural Resilience**: Prioritizes live Supabase PostgreSQL via `@supabase/supabase-js` while automatically providing an instant, offline-seeded dataset with zero setup needed for evaluators.
- **Dedicated Waypoint Route Architecture (`trip_points`)**: Stores discrete GPS points with `sequence_number` to accurately trace multi-point route trajectories and waypoints rather than relying on approximated coordinates.
- **Custom Dynamic Leaflet SVG Markers**: Replaced standard raster PNG marker icons with dynamic, color-coded SVG `L.divIcon` markers with live pulse animations and EV badges, eliminating Vite bundling icon 404 bugs.
- **1-Click Reviewer Access**: Added an **Instant Demo Access** button directly on the authentication card, allowing reviewers to immediately evaluate all interactive features with zero friction.

### 1.3. Intended Operations-User Workflow
1. **Authentication & Access**: Operator accesses the console using operator credentials or uses the **1-Click Demo Login** button.
2. **Executive Fleet Review**: Operator inspects top-level KPI cards (Active moving units, Idling vehicles, Maintenance flags, Fleet Average Fuel Level, EV Fleet ratio).
3. **Live GPS Map Tracking**: Operator navigates the Leaflet interactive map, views color-coded vehicles (`active`, `idle`, `maintenance`, `offline`), clicks markers to open telematics popups, or focuses on specific vehicles.
4. **Vehicle Diagnostic Drawer**: Clicking any vehicle opens a full slide-over modal showing live ignition state, EV battery percentage, fuel reserve, assigned driver, GPS coordinates, and historical trip logs.
5. **Live Dispatch Status Updates**: Changing vehicle operational status (`active`, `idle`, `maintenance`, `offline`) writes directly to the PostgreSQL database in real time.
6. **GPS Route Polyline Tracing**: Clicking "Plot GPS Route" on any trip renders the multi-point waypoint route path on the map with origin and destination pins.
7. **Operational Alert Triage**: Operator reviews automated alerts for critical fuel (<20%), excessive idling, or maintenance warnings and clicks through to locate the affected vehicle.

---

## 2. Live Demo & Credentials

| Resource | Details |
|---|---|
| **Live Deployed URL** | [https://bytebeam-fleet.vercel.app](https://bytebeam-fleet.vercel.app) *(or your deployed Vercel URL)* |
| **1-Click Instant Demo** | Click the **"Enter Console as Demo Dispatcher (1-Click)"** button on the login screen |
| **Demo Operator Email** | `demo@gmail.com` |
| **Demo Password** | `12345678` |
| **Self-Registration** | Fully supported via the "Create Fleet Account" tab |

---

## 3. Local Setup & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher (verified on Node `v24.19.0`)
- **npm**: `v9.0.0` or higher (verified on npm `11.17.0`)

### Step 3.1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/ghkrknkp/Bytebeam.git
cd Bytebeam
npm install
```

### Step 3.2: Configure Environment Variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
VITE_SUPABASE_URL=https://qjepfsmuggtmvmwylqej.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_wtUWSeZ2ylU6y2II4BSziw_VIai7Luc
```
*(If no credentials are provided, the application runs seamlessly in offline demo mode).*

### Step 3.3: Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Step 3.4: Verify Production Build
```bash
npm run build
```
Builds the bundle into `dist/` with 0 TypeScript errors and 0 lint warnings.

---

## 4. Backend Setup Notes

### 4.1. Remote Supabase Setup (Live Instance)
The application connects to a live Supabase PostgreSQL database:
- **API Endpoint**: `https://qjepfsmuggtmvmwylqej.supabase.co`
- **Database Schema**: [`supabase/schema.sql`](supabase/schema.sql)
- **Seed Data**: [`supabase/seed.sql`](supabase/seed.sql)
- **Complete Self-Contained Setup Script**: [`supabase/complete_setup.sql`](supabase/complete_setup.sql)

To execute on your own Supabase project:
1. Open your project's **SQL Editor** in the Supabase Dashboard.
2. Copy the contents of [`supabase/complete_setup.sql`](supabase/complete_setup.sql) and click **Run**.
3. All tables (`vehicles`, `trips`, `trip_points`), foreign key relationships, performance indexes, and seed vehicles will be provisioned.

### 4.2. Render Deployment (Alternative Backend / Database)
If hosting on **Render**:
1. Create a **PostgreSQL Database** on [Render.com](https://render.com).
2. Connect with `psql` or DBeaver and execute [`supabase/complete_setup.sql`](supabase/complete_setup.sql).
3. If hosting a Node.js Express API service on Render, point your Vercel frontend's `VITE_API_URL` to your Render service URL (`https://your-api.onrender.com`).

---

## 5. Deployment Guide (Vercel Frontend)

The project includes pre-configured single-page application routing in [`vercel.json`](vercel.json):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Steps to Deploy on Vercel:
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New…** → **Project**.
3. Import your GitHub repository (`Bytebeam`).
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://qjepfsmuggtmvmwylqej.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_wtUWSeZ2ylU6y2II4BSziw_VIai7Luc`
5. Click **Deploy**.

---

## 6. AI Usage, Chat Logs & Engineering Decisions

As required by the assignment guidelines, all AI interactions, architectural prompts, suggestions reviewed/rejected, and engineering validations are documented in detail:
- **AI Methodology & Decisions**: See [`AI_USAGE.md`](AI_USAGE.md)
- **Exported AI Chat Logs**: See [`docs/AI_CHAT_LOGS.md`](docs/AI_CHAT_LOGS.md)

---

## 7. Submission ZIP Package Preparation

Per the submission guidelines, a clean submission ZIP must be under **100 MB** and exclude bulky folders (`node_modules`, `dist`, `.git`).

Run this command in PowerShell to create the submission ZIP:
```powershell
# Create clean submission ZIP excluding node_modules, build artifacts, and git
tar --exclude='node_modules' --exclude='dist' --exclude='.git' -a -c -f Bytebeam_Submission.zip *
```
The resulting ZIP file is approximately **~2 MB**, well within the 100 MB limit.
