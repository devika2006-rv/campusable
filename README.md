# CampusAble: Accessibility-First 3D Campus Navigation Platform

> **Tagline:** *Your Campus. Your Route. Your Independence.*  
> **Initial Reference Campus:** Vidya Academy of Science and Technology (VAST), Thalakkottukara, Thrissur, Kerala, India (PIN: 680501)

CampusAble is a full-featured web application designed to help students, visitors, and people with mobility or physical accessibility needs explore college campuses, discover certified step-free facilities, and plan routes tailored to their physical requirements.

---

## 🌟 Key Features

1. **Interactive 3D Campus Explorer (`/explore`)**:
   - Orbit, pan, zoom, and select campus buildings in real-time WebGL using Three.js and React Three Fiber.
   - 3D spatial labels, dynamic highlights, and building inspection cards.
   - One-click toggle between 3D scene and 2D schematic blueprint view (`Campus2DView`).
   - Compass rose north-orientation indicator and interactive map legend.

2. **Graph-Based Accessible Route Planner (`/navigate`)**:
   - Dijkstra shortest-path engine with accessibility penalty weighting.
   - **Strict Stair Avoidance:** Segment-level exclusion prevents routing across stairs when *Avoid Stairs* is selected.
   - **Ground-Truth Honesty:** If no step-free route exists between two points, the system states that fact clearly rather than silently routing through stairs.
   - Turn-by-turn guidance, distance calculation, and speed-adjusted walking times (50m/min for mobility devices, 75m/min standard pedestrian).
   - Real-time 3D path visualization highlighting active route segments.

3. **Building & Facility Directory (`/directory`)**:
   - Search by building name, code, or facility.
   - Filter by building category, verification status, and step-free entrance availability.
   - One-click "Locate in 3D" and "Plan Step-Free Route Here".

4. **Building Details & Indoor Navigation (`/building/:id`)**:
   - Building dimensions, 3D coordinates, and audit verification sources.
   - Entrance details with door width clearance, ramp presence, and wheelchair accessibility tags.
   - Interactive indoor floor navigation viewer with empty-state handling (*"Floor plan not added yet"*) preventing fabricated room layouts.

5. **Accessibility Centre (`/accessibility`)**:
   - Specialized search and filtering for verified ramps, passenger elevators, accessible restrooms, and zero-threshold entrances.
   - Direct link to carry selected accessibility facilities into the route planner.

6. **Accessibility Barrier Reporting (`/report`)**:
   - Functional issue reporting form with client-side validation.
   - Photo attachment simulation and contact detail support.
   - LocalStorage demo persistence and historical report management.
   - Clear disclaimer: *"Demo mode: reports are stored in this browser only. They are not sent to college authorities."*

7. **Campus Data Management & Admin (`/admin`)**:
   - Full CRUD operations for campus buildings, coordinates (X, Y, Z), and dimensions.
   - JSON export and schema-validated JSON import with relational integrity checks.
   - One-click dataset reset to baseline default.
   - Live 3D preview tab of dataset changes.

8. **Campus Map Board Image Import & AI Interpretation Preparation**:
   - Upload PNG, JPG, or WebP campus map boards with image preview and replacement.
   - Metadata capture: orientation notes, known landmarks, and target building labels.
   - AI interpretation pipeline producing candidate spatial footprints with confidence levels.
   - Strict human-review checklist ensuring no unverified AI hallucinations enter production.
   - Zero API key exposure in frontend code.

---

## 🛠️ Technology Stack

- **Frontend Core:** React 18, TypeScript, Vite
- **Routing:** React Router v6
- **3D Graphics:** Three.js, React Three Fiber (R3F), Drei
- **Styling:** Tailwind CSS (accessible high-contrast palette: Deep Purple `#6d28d9`, Teal `#0d9488`, Charcoal `#1e293b`)
- **Icons:** Lucide React
- **Storage:** LocalStorage client persistence (with modular architecture ready for REST/GraphQL database API)
- **Testing:** Vitest

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher; tested on v22.19.0)
- npm or pnpm

### Installation

```bash
# Navigate to project directory
cd "C:\Users\devika r\.gemini\antigravity\scratch\campusable"

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` (or the terminal port indicated).

### Running Automated Tests

```bash
npm test
```

Runs the Vitest suite covering Dijkstra pathfinding, stair avoidance, and relational schema validation.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📐 Ground-Truth & Verification Architecture

CampusAble enforces a strict four-tier verification taxonomy across all data structures:

| Verification Status | Definition | Visual Indicator |
| :--- | :--- | :--- |
| **`verified`** | Physically audited on-site with ground measurements and photographic proof. | Emerald Badge |
| **`approximate`** | Derived from preliminary site plans (e.g. NAAC 4.1.1 Site-Plan PDF) or virtual tours. Coordinates are spatial approximations. | Amber Badge |
| **`unverified`** | Preliminary or user-reported item awaiting physical inspection. | Rose Badge |
| **`demo`** | Demonstration data illustrating functionality. | Purple Badge |

### Reference Campus Baseline Details

- **College:** Vidya Academy of Science and Technology (VAST), Thalakkottukara, Thrissur, Kerala, India - 680501.
- **Official References:**
  - [Google Maps Location Reference](https://maps.app.goo.gl/DzYSTPM9RViqH8Ph9?g_st=ac)
  - [NAAC Physical Facilities Site-Plan (Criterion 4.1.1 PDF)](https://www.vidyaacademy.ac.in/naac/4/4.1/4.1.1/4.1.1.pdf)
  - [Official Campus Tour](https://www.vidyaacademy.ac.in/campus_tour.php)

---

## 🧭 How to Calibrate & Replace Demo Data

1. **Replace 3D Coordinates with Verified Map Board Data:**
   - Go to `/admin` -> **Campus Map Board Import & AI Interpretation**.
   - Upload high-resolution photo of campus master boards.
   - Run AI interpretation to generate candidate bounds.
   - Review through the human audit checklist, adjust coordinates in the **Building Records** tab, and click **Save Building Record**.
2. **Add Real Floor Plans:**
   - In `/admin`, edit a building, add new floor levels, and specify door widths, elevator locations, and ramp slopes.
3. **Export and Version Control:**
   - Click **Import / Export JSON** in `/admin` to backup the validated campus graph as a `.json` file for deployment.

---

## 🔒 Security & Backend Integration Roadmap

- **Current State:** Fully functional client-side MVP utilizing LocalStorage for persistence. No external paid APIs or API keys are required.
- **Future Production Backend:**
  - Create a Node.js/Python microservice with PostgreSQL + PostGIS for spatial graph queries.
  - Connect Gemini API on the **backend server only** to process uploaded map images without exposing secrets to frontend bundles.
  - Implement role-based institutional authentication (SSO / OAuth2) for campus administrators.
