import React, { useState } from 'react';
import { CalculatedRoute } from '../../types/campus';
import { NavigableLocation, getLocationDisplayName } from '../../utils/locationHelper';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Footprints,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

interface Props {
  route: CalculatedRoute | null;
  locations: NavigableLocation[];
  startLocationId: string;
  endLocationId: string;
  isAccessiblePreference: boolean;
}

export const RouteSummaryPanel: React.FC<Props> = ({
  route,
  locations,
  startLocationId,
  endLocationId,
  isAccessiblePreference,
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const startName = getLocationDisplayName(startLocationId, locations);
  const endName = getLocationDisplayName(endLocationId, locations);

  // Initial empty state
  if (!route) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm text-center space-y-2">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Compass className="w-5 h-5 text-teal-600" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm">Select Your Route</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Choose a start point and destination above, then click <strong>Plan Route</strong> to view the path on the campus map.
        </p>
      </div>
    );
  }

  // Route not found state (honest failure)
  if (!route.found) {
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-200 shadow-sm space-y-3 animate-in fade-in duration-200">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-rose-900 text-base">No Route Available</h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {route.explanation}
            </p>
          </div>
        </div>

        {isAccessiblePreference && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
            <p className="font-semibold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Accessibility Note</span>
            </p>
            <p className="mt-1 text-[11px] text-amber-700">
              CampusAble strictly refuses to silently route you over stairways when "Avoid stairs" is selected. Try unchecking the option to check if a standard pedestrian route connects these locations.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Build high-level readable waypoints
  const waypoints = route.nodes;
  const intermediateWaypoints =
    waypoints.length > 2 ? waypoints.slice(1, waypoints.length - 1) : [];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5 animate-in fade-in duration-200">
      {/* Route Quick Metrics */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Total Distance
          </div>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
            <span>{route.totalDistanceMeters} m</span>
            <span className="text-slate-300 text-base font-normal">•</span>
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-700" />
              ~{route.estimatedWalkingMinutes} min
            </span>
          </div>
        </div>

        <div>
          {route.isCompletelyStepFree ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Step-Free Path</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Contains Stairs</span>
            </span>
          )}
        </div>
      </div>

      {/* Primary Route Directions ("Show the way, not just the distance") */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Your Route
        </h4>

        <div className="space-y-2 text-xs">
          {/* Start Point */}
          <div className="flex items-start gap-2.5 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              A
            </div>
            <div>
              <span className="font-bold text-emerald-950 block">Start</span>
              <span className="text-slate-700 text-xs font-medium">{startName}</span>
            </div>
          </div>

          {/* Path Direction Guidance */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-start gap-2 text-slate-700">
              <ArrowRight className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">
                  Follow the highlighted campus pathway
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  The route follows paved pedestrian ways across {route.steps.length} mapped path segment{route.steps.length === 1 ? '' : 's'}.
                </p>
              </div>
            </div>

            {/* Intermediate Waypoints (if any exist) */}
            {intermediateWaypoints.length > 0 && (
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-semibold text-slate-700 block">
                  Intermediate landmarks on path:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {intermediateWaypoints.slice(0, 4).map((wp, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-slate-700 font-medium"
                    >
                      {wp.name}
                    </span>
                  ))}
                  {intermediateWaypoints.length > 4 && (
                    <span className="px-2 py-0.5 text-slate-500">
                      +{intermediateWaypoints.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Destination Point */}
          <div className="flex items-start gap-2.5 p-2.5 bg-purple-50/70 border border-purple-200 rounded-xl">
            <div className="w-5 h-5 rounded-full bg-purple-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              B
            </div>
            <div>
              <span className="font-bold text-purple-950 block">Destination</span>
              <span className="text-slate-700 text-xs font-medium">{endName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      {route.containsUnverifiedSegments && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Portions of this route are based on campus site-plan map interpretation and have not yet undergone physical on-site accessibility verification.
          </span>
        </div>
      )}

      {/* Expandable Turn-by-Turn Segment Details */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
        >
          <span>View Detailed Segment Breakdown ({route.steps.length})</span>
          {isDetailsExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {isDetailsExpanded && (
          <div className="mt-3 space-y-2 pt-2 border-t border-slate-100 text-xs divide-y divide-slate-100">
            {route.steps.map((step) => (
              <div key={step.stepIndex} className="pt-2 first:pt-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-slate-800">
                    {step.stepIndex}. {step.instruction}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px] shrink-0">
                    {step.distance}m
                  </span>
                </div>
                {step.warning && (
                  <div className="text-rose-700 text-[11px] font-semibold mt-0.5">
                    {step.warning}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
