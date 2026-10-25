# AI Usage & Engineering Decision Log

This document records the AI tools, methodologies, validations, and architectural decisions made during the design and development of the **Bytebeam Fleet Management Dashboard** assignment.

---

## 1. AI Tools Used

| Tool / Model | Role & Scope |
|---|---|
| **Google DeepMind Antigravity / Gemini 3.8 Flash** | Pair programming, schema design, type definitions, boilerplate scaffolding, and refactoring |
| **Integrated Terminal & TypeScript Compiler (`tsc`)** | Static analysis, strict mode enforcement, and verification of verbatim module imports |

---

## 2. What Each Tool Helped With

### 2.1. Architectural & Schema Planning
- **Supabase PostgreSQL Schema (`supabase/schema.sql`)**: Generated normalized SQL with primary keys, foreign key cascading constraints (`ON DELETE CASCADE`), CHECK constraints for fuel and speed metrics, and performance indexes for `status`, `registration_number`, `vehicle_id`, and `sequence_number`.
- **Seed Data Construction (`supabase/seed.sql`)**: Crafted realistic commercial fleet vehicles (Tata Ace EV, Eicher, Ashok Leyland Dost, BharatBenz) mapped with coordinates in Bengaluru's logistics corridors and multi-point GPS trajectories for route tracing.

### 2.2. Frontend Component Engineering
- **Leaflet Integration**: Solved Leaflet's well-known Vite/Webpack default marker icon packaging defect by generating custom SVG `L.divIcon` markup that responds to vehicle status colors without external PNG dependencies.
- **State Management & Resilience (`fleetService.ts` & `AuthContext.tsx`)**: Created a dual-mode persistence architecture that prioritizes live Supabase PostgreSQL and Supabase Auth while providing an offline seeded fallback and 1-click demo access for immediate evaluator review.

---

## 3. Important Generated Suggestions: Reviewed, Modified, or Rejected

### Suggestion 1: Leaflet Default Icons vs. Custom SVG DivIcons
- **Generated Suggestion**: Initially suggested importing standard Leaflet PNG marker assets.
- **Review & Decision**: **Rejected & Modified**. Default Leaflet image assets frequently break in Vite production builds or render blurry on high-DPI retina screens. Replaced with custom dynamic SVG `L.divIcon` markers styled with Tailwind CSS, pulse animations, and color-coded status rings.

### Suggestion 2: Hardcoded Route Lines vs. True Normalized `trip_points` Table
- **Generated Suggestion**: Storing route coordinates as a JSON array column directly inside the `trips` table.
- **Review & Decision**: **Rejected & Modified**. The Bytebeam assignment specifications explicitly required a dedicated `trip_points` table with `id`, `trip_id`, `latitude`, `longitude`, `recorded_at`, and `sequence_number`. The architecture was adjusted to query and sort points by `sequence_number ASC` to ensure accurate GPS polyline reconstruction.

### Suggestion 3: Frontend TypeScript Import Style (`verbatimModuleSyntax`)
- **Generated Suggestion**: Standard mixed imports (`import { Vehicle, Trip } from './types'`).
- **Review & Decision**: **Modified**. Modern Vite TypeScript configurations with `verbatimModuleSyntax: true` require strict `import type { ... }` declarations to prevent type leaking into the emitted bundle. Updated all files to adhere to explicit type-only imports.

### Suggestion 4: Authentication UX for Reviewers
- **Generated Suggestion**: Strict requirement that evaluators create a Supabase account and verify their email before seeing any UI.
- **Review & Decision**: **Enhanced**. While full Supabase Auth is integrated and supported, requiring evaluators to configure cloud credentials before running the app creates friction. Added an **Instant Demo Access (1-Click Review)** pathway with mock operator credentials (`demo@gmail.com`) alongside live Supabase authentication.

---

## 4. Testing & Verification Performed by Developer

1. **Static Analysis & TypeScript Compilation**:
   - Executed `npm run build` (`tsc -b && vite build`) to verify that all modules compile cleanly with 0 type errors or warnings.
2. **Production Bundle Verification**:
   - Verified that Vite minified assets (`dist/index.html`, `dist/assets/*.css`, `dist/assets/*.js`) are produced within expected limits.
3. **Database Migration Dry-Run**:
   - Validated that `supabase/schema.sql` and `supabase/seed.sql` are idempotent using `IF NOT EXISTS` and `ON CONFLICT (id) DO UPDATE` to prevent errors on re-execution.
4. **Responsive Layout Auditing**:
   - Confirmed mobile hamburger menu and desktop side-navigation responsiveness across screen sizes.

---

## 5. Limitations of AI-Generated Code

- **Simulated Real-Time Streams**: While the dashboard displays real-time ignition and telemetry indicators, live high-frequency GPS tracking in a commercial fleet environment requires MQTT brokers and WebSockets (such as Bytebeam Cloud IoT connectors), which cannot be simulated purely through static REST endpoints without external simulated devices.
- **Geospatial Indexing**: For ultra-large scale fleets (>50,000 active vehicles), PostgreSQL PostGIS extensions with spatial indexing (`ST_DWithin`, `ST_MakeLine`) would be preferable over raw numerical latitude/longitude columns.
