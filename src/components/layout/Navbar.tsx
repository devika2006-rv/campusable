import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Navigation,
  Building2,
  Accessibility,
  AlertTriangle,
  Settings,
  Info,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/explore', label: '3D Explorer', icon: Compass },
    { to: '/navigate', label: 'Plan Route', icon: Navigation },
    { to: '/directory', label: 'Directory', icon: Building2 },
    { to: '/accessibility', label: 'Accessibility', icon: Accessibility },
    { to: '/report', label: 'Report Barrier', icon: AlertTriangle },
    { to: '/admin', label: 'Campus Admin', icon: Settings },
    { to: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link
            to="/"
            className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 to-teal-500 flex items-center justify-center text-white shadow-sm font-bold text-xl">
              CA
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Campus<span className="text-teal-600">Able</span>
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] uppercase font-semibold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3 text-purple-700" />
                  VAST Reference
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Your Campus. Your Route. Your Independence.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-purple-50 text-purple-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-purple-700' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Direct CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/navigate"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-800 hover:bg-purple-900 rounded-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-purple-600"
            >
              <Navigation className="w-4 h-4 text-teal-300" />
              <span>Step-Free Route</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <div className="text-xs font-semibold uppercase text-slate-400 px-3 py-1">
            Navigation Menu
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-purple-50 text-purple-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-purple-700' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/navigate"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-purple-800 hover:bg-purple-900 rounded-lg shadow-sm"
            >
              <Navigation className="w-4 h-4 text-teal-300" />
              Plan Step-Free Route
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
