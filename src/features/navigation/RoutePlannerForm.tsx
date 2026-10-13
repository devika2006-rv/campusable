import React, { useState } from 'react';
import { RouteNode, RoutePreferences } from '../../types/campus';
import {
  Navigation,
  ArrowUpDown,
  Accessibility,
  Footprints,
  Sliders,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface Props {
  nodes: RouteNode[];
  selectedStartId: string;
  selectedEndId: string;
  preferences: RoutePreferences;
  onStartChange: (id: string) => void;
  onEndChange: (id: string) => void;
  onPreferencesChange: (prefs: RoutePreferences) => void;
  onCalculate: () => void;
}

export const RoutePlannerForm: React.FC<Props> = ({
  nodes,
  selectedStartId,
  selectedEndId,
  preferences,
  onStartChange,
  onEndChange,
  onPreferencesChange,
  onCalculate,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const swapLocations = () => {
    const temp = selectedStartId;
    onStartChange(selectedEndId);
    onEndChange(temp);
  };

  const applyPreset = (preset: 'wheelchair' | 'fastest' | 'ramps') => {
    if (preset === 'wheelchair') {
      onPreferencesChange({
        avoidStairs: true,
        preferStepFree: true,
        preferRamps: true,
        preferLifts: true,
        avoidUnverified: false,
        minimizeDistance: false,
      });
    } else if (preset === 'fastest') {
      onPreferencesChange({
        avoidStairs: false,
        preferStepFree: false,
        preferRamps: false,
        preferLifts: false,
        avoidUnverified: false,
        minimizeDistance: true,
      });
    } else if (preset === 'ramps') {
      onPreferencesChange({
        avoidStairs: true,
        preferStepFree: true,
        preferRamps: true,
        preferLifts: false,
        avoidUnverified: false,
        minimizeDistance: false,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Form Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-teal-600" />
          <span>Plan Accessible Campus Route</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Select origin, destination, and accessibility preferences.
        </p>
      </div>

      {/* Quick Presets */}
      <div>
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Quick Mobility Presets
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('wheelchair')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              preferences.avoidStairs && preferences.preferStepFree
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Wheelchair (Strict No Stairs)</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('fastest')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !preferences.avoidStairs && preferences.minimizeDistance
                ? 'bg-purple-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Fastest Walking (Includes Stairs)</span>
          </button>
        </div>
      </div>

      {/* Origin and Destination pickers with swap */}
      <div className="space-y-4 relative">
        {/* Origin */}
        <div>
          <label
            htmlFor="route-origin"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Starting Point (Origin)
          </label>
          <select
            id="route-origin"
            value={selectedStartId}
            onChange={(e) => onStartChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name} ({node.type.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            type="button"
            onClick={swapLocations}
            title="Swap Origin and Destination"
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-full border border-slate-300 shadow-xs transition-transform hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Swap Start and Destination"
          >
            <ArrowUpDown className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* Destination */}
        <div>
          <label
            htmlFor="route-destination"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
          >
            Destination
          </label>
          <select
            id="route-destination"
            value={selectedEndId}
            onChange={(e) => onEndChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name} ({node.type.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Accessibility Preferences */}
      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Routing Preferences
          </span>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-purple-800 hover:text-purple-950 flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Advanced' : 'Configure Preferences'}</span>
          </button>
        </div>

        {/* Core Quick Toggle: Avoid Stairs */}
        <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Avoid Stairs & Flight Steps</span>
              {preferences.avoidStairs && (
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-teal-100 text-teal-800 rounded">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly excludes stairs. Will never silently route across stairs.
            </p>
          </div>
          <input
            type="checkbox"
            checked={preferences.avoidStairs}
            onChange={(e) =>
              onPreferencesChange({ ...preferences, avoidStairs: e.target.checked })
            }
            className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
          />
        </label>

        {/* Advanced Toggles */}
        {showAdvanced && (
          <div className="mt-3 space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <label className="flex items-center justify-between py-1 cursor-pointer">
              <span className="text-slate-700 font-medium">Prefer Step-Free Paved Paths</span>
              <input
                type="checkbox"
                checked={preferences.preferStepFree}
                onChange={(e) =>
                  onPreferencesChange({ ...preferences, preferStepFree: e.target.checked })
                }
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
              />
            </label>
            <label className="flex items-center justify-between py-1 cursor-pointer">
              <span className="text-slate-700 font-medium">Prefer Verified Accessible Ramps</span>
              <input
                type="checkbox"
                checked={preferences.preferRamps}
                onChange={(e) =>
                  onPreferencesChange({ ...preferences, preferRamps: e.target.checked })
                }
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
              />
            </label>
            <label className="flex items-center justify-between py-1 cursor-pointer">
              <span className="text-slate-700 font-medium">Avoid Unverified / Demo Route Segments</span>
              <input
                type="checkbox"
                checked={preferences.avoidUnverified}
                onChange={(e) =>
                  onPreferencesChange({ ...preferences, avoidUnverified: e.target.checked })
                }
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
              />
            </label>
            <label className="flex items-center justify-between py-1 cursor-pointer">
              <span className="text-slate-700 font-medium">Minimise Absolute Distance (Shortest Path)</span>
              <input
                type="checkbox"
                checked={preferences.minimizeDistance}
                onChange={(e) =>
                  onPreferencesChange({ ...preferences, minimizeDistance: e.target.checked })
                }
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
              />
            </label>
          </div>
        )}
      </div>

      {/* Calculate CTA */}
      <button
        type="button"
        onClick={onCalculate}
        className="w-full py-3.5 px-4 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <Navigation className="w-4 h-4 text-teal-300" />
        <span>Calculate Optimal Route</span>
      </button>
    </div>
  );
};
