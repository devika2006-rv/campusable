import React from 'react';
import { Link } from 'react-router-dom';
import { CAMPUS_REFERENCE } from '../../data/referenceCampus';
import { ShieldAlert, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900 font-bold">
                CA
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Campus<span className="text-teal-400">Able</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Your Campus. Your Route. Your Independence. An accessibility-first 3D navigation
              and indoor orientation platform designed for students, faculty, visitors, and
              individuals with mobility needs.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                Physical Ground Audit Disclaimer
              </div>
              <p className="text-slate-400">
                {CAMPUS_REFERENCE.rulesAndDisclaimers.groundTruthRule}
              </p>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform Features
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore" className="hover:text-teal-300 transition-colors">
                  Interactive 3D Explorer
                </Link>
              </li>
              <li>
                <Link to="/navigate" className="hover:text-teal-300 transition-colors">
                  Step-Free Route Planner
                </Link>
              </li>
              <li>
                <Link to="/directory" className="hover:text-teal-300 transition-colors">
                  Building & Facility Directory
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-teal-300 transition-colors">
                  Accessibility Center
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-teal-300 transition-colors">
                  Report Accessibility Barrier
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-teal-300 transition-colors">
                  Campus Data Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Reference Campus & Verification */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Reference Campus
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {CAMPUS_REFERENCE.institutionName}
              <br />
              {CAMPUS_REFERENCE.location.village}, {CAMPUS_REFERENCE.location.district},{' '}
              {CAMPUS_REFERENCE.location.state}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={CAMPUS_REFERENCE.officialReferences.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300"
                >
                  <span>Google Maps Campus Pin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={CAMPUS_REFERENCE.officialReferences.sitePlanPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300"
                >
                  <span>NAAC 4.1.1 Site-Plan PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={CAMPUS_REFERENCE.officialReferences.campusTour}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300"
                >
                  <span>Official Campus Tour</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusAble. Built with an accessibility-first methodology.</p>
          <div className="flex items-center gap-2">
            <span>Powered by React, Three.js, and Open Graph Algorithms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
