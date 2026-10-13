import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Navigation,
  Building2,
  AlertTriangle,
  Accessibility,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { CampusCanvas } from '../components/campus3d/CampusCanvas';
import { getStoredCampusData } from '../utils/storage';
import { CAMPUS_REFERENCE } from '../data/referenceCampus';
import { Building } from '../types/campus';

export const HomePage: React.FC = () => {
  const dataset = getStoredCampusData();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-10 bg-gradient-to-b from-purple-50/50 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Campus Reference Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>Reference Pilot: {CAMPUS_REFERENCE.institutionName}</span>
            </div>

            {/* Main Headline & Tagline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Your Campus. Your Route.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-teal-600">
                  Your Independence.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                CampusAble empowers students, faculty, visitors, and people with mobility needs to
                explore college buildings, locate certified step-free facilities, and navigate with confidence.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-2xl shadow-md transition-all hover:scale-102 focus-visible:ring-2 focus-visible:ring-purple-600"
              >
                <Compass className="w-5 h-5 text-teal-300" />
                <span>Explore Campus in 3D</span>
              </Link>
              <Link
                to="/navigate"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md transition-all hover:scale-102 focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <Navigation className="w-5 h-5" />
                <span>Plan Step-Free Route</span>
              </Link>
            </div>
          </div>

          {/* Interactive 3D Campus Preview Window */}
          <div className="mt-12 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white relative">
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span>Interactive 3D Campus Explorer Preview</span>
              </div>
              <Link
                to="/explore"
                className="text-teal-300 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <span>Open Fullscreen Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="h-[460px] sm:h-[520px] w-full">
              <CampusCanvas
                buildings={dataset.buildings}
                routeNodes={dataset.routeNodes}
                routeEdges={dataset.routeEdges}
                selectedBuilding={selectedBuilding}
                onSelectBuilding={setSelectedBuilding}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Engineered for Accessibility & Clarity
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every feature is developed with accessibility audits, verified spatial data, and honest pathfinding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: 3D Exploration */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-800">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Interactive 3D Explorer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Orbit, zoom, and inspect campus buildings, entrances, and elevation. Toggle to a 2D schematic blueprint anytime.
              </p>
            </div>
            <Link
              to="/explore"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 hover:text-purple-950"
            >
              <span>Explore 3D Scene</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Accessible Routing */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-800">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Step-Free Route Planning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dijkstra graph-powered routes strictly exclude stairs when requested. Honest fallback prevents misleading users.
              </p>
            </div>
            <Link
              to="/navigate"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              <span>Plan Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Facilities Search */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-800">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Directory & Facilities</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search academic blocks, ramps, accessible restrooms, lifts, drinking water, and parking with audit verification levels.
              </p>
            </div>
            <Link
              to="/directory"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900"
            >
              <span>Search Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Barrier Reporting */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Report Barriers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Report broken lifts, blocked ramps, or uneven pavers to assist in continuous audit maintenance and campus accessibility.
              </p>
            </div>
            <Link
              to="/report"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How CampusAble Works</h2>
            <p className="text-sm text-slate-600 mt-2">
              Three pillars ensuring reliable navigation for every student and visitor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-800 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Select Your Mobility Needs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specify wheelchair step-free constraints, ramp preferences, or elevator requirements. Our graph planner factors in slopes and surfaces.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Verified Route Calculation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We calculate optimal pathways using Dijkstra algorithms with penalty functions, clearly tagging unverified or approximate campus segments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Navigate & Arrive Confidently</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Follow turn-by-turn directions with verified door widths, zero-threshold entrances, and room-level indoor floor plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mandatory Verification & Integrity Disclaimer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purple-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-800 rounded-full text-xs font-semibold text-purple-200">
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>Ground Truth & Verification Notice</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Accessibility Integrity First
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
              We never claim that a route is wheelchair-accessible unless the relevant route segments
              and facilities have been physically audited and verified. All preliminary layouts are
              distinguished as <strong className="text-white">Approximate</strong> or{' '}
              <strong className="text-white">Demo</strong> until calibrated by on-site teams.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-white"
              >
                <span>Read our full Ground Truth Policy & References</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
