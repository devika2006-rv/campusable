import React from 'react';
import { CAMPUS_REFERENCE } from '../data/referenceCampus';
import {
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Code2,
  MapPin,
  FileText,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          About Campus<span className="text-teal-600">Able</span>
        </h1>
        <p className="text-lg font-medium text-purple-900">
          Your Campus. Your Route. Your Independence.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Project Mission & Philosophy</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Higher education environments can be challenging to navigate for students, faculty, and
          visitors with mobility impairments or temporary physical injuries. Traditional maps
          rarely detail step thresholds, door widths, ramp slopes, elevator operating states, or
          accessible restrooms.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          CampusAble was conceived to bridge this barrier through an accessibility-first methodology,
          combining intuitive 3D spatial exploration, topological graph routing with honest
          stair-avoidance, and strict verification protocols.
        </p>
      </div>

      {/* Reference Campus Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Initial Reference Campus</h2>
            <p className="text-xs text-slate-500">
              {CAMPUS_REFERENCE.institutionName} ({CAMPUS_REFERENCE.shortName})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="font-bold">Location: </span>
            <span>
              {CAMPUS_REFERENCE.location.village}, {CAMPUS_REFERENCE.location.district},{' '}
              {CAMPUS_REFERENCE.location.state}, {CAMPUS_REFERENCE.location.country} -{' '}
              {CAMPUS_REFERENCE.location.pinCode}
            </span>
          </div>
          <div>
            <span className="font-bold">Coordinates: </span>
            <span className="font-mono">
              {CAMPUS_REFERENCE.location.coordinates.latitude}° N,{' '}
              {CAMPUS_REFERENCE.location.coordinates.longitude}° E
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-sm">Official Primary Documentation</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href={CAMPUS_REFERENCE.officialReferences.sitePlanPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-800 hover:text-purple-950 font-semibold"
              >
                <FileText className="w-4 h-4 text-teal-600" />
                <span>NAAC Criterion 4.1.1 Physical Facilities Site Plan (PDF)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </li>
            <li>
              <a
                href={CAMPUS_REFERENCE.officialReferences.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-800 hover:text-purple-950 font-semibold"
              >
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Google Maps Campus Geographic Reference</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </li>
            <li>
              <a
                href={CAMPUS_REFERENCE.officialReferences.campusTour}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-800 hover:text-purple-950 font-semibold"
              >
                <Compass className="w-4 h-4 text-teal-600" />
                <span>Official Institutional Virtual Tour</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Accuracy & Ground Truth Rules */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Ground Truth & Verification Integrity Rules
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-800">1. Geographic Pin vs 3D Reality: </strong>
            The Google Maps reference locates the campus geographic footprint. It does not provide indoor layouts or accessible route topology.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-800">2. No Invented Real-World Coordinates: </strong>
            We do not fabricate actual building heights, room numbers, or entrance widths.
            All current geometries represent an editable preliminary model calibrated against public site-plans.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-800">3. Honest Stair Avoidance: </strong>
            A route requesting "Avoid stairs" will never silently traverse stairs.
            If no verified step-free route exists, the platform honestly declares that constraint rather than inventing a path.
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-purple-800" />
          <h2 className="text-xl font-bold text-slate-900">Technology Architecture</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">React + Vite</div>
            <div className="text-slate-500">Fast TypeScript SPA</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">Three.js + R3F</div>
            <div className="text-slate-500">Interactive 3D WebGL</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">Tailwind CSS</div>
            <div className="text-slate-500">Accessible Design System</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900">Dijkstra Engine</div>
            <div className="text-slate-500">Accessible Graph Routing</div>
          </div>
        </div>
      </div>
    </div>
  );
};
