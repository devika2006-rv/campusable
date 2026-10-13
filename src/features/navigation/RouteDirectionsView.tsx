import React from 'react';
import { CalculatedRoute } from '../../types/campus';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  Footprints,
} from 'lucide-react';

interface Props {
  route: CalculatedRoute | null;
}

export const RouteDirectionsView: React.FC<Props> = ({ route }) => {
  if (!route) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 text-base">Select Your Route</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Choose a start point and destination above, then click Calculate Optimal Route to view turn-by-turn guidance and accessibility validation.
        </p>
      </div>
    );
  }

  // Honest failure state (No route satisfying constraints, e.g., stairs avoided)
  if (!route.found) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-rose-900 text-lg">No Step-Free Route Found</h3>
            <p className="text-xs text-slate-500 mt-0.5">Strict accessibility rules enforced</p>
          </div>
        </div>

        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-xs text-rose-800 leading-relaxed space-y-2">
          <p className="font-medium">{route.explanation}</p>
          <div className="pt-2 border-t border-rose-200 text-rose-700">
            <span className="font-semibold">Honesty Principle: </span>
            CampusAble refuses to silently route you over known staircases or unverified terrain.
            Please consult the central security reception or request on-campus mobility assistance.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Route Metrics Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-slate-900">
              {route.totalDistanceMeters} meters
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Clock className="w-4 h-4 text-purple-700" />
              ~{route.estimatedWalkingMinutes} min
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pace based on documented mobility speed (50m/min accessible, 75m/min standard).
          </p>
        </div>

        <div>
          {route.isCompletelyStepFree ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>100% Step-Free Route</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Contains Stairs (Not Wheelchair Accessible)</span>
            </span>
          )}
        </div>
      </div>

      {/* Warnings & Notices */}
      {route.warnings.length > 0 && (
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Route Advisory</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-amber-700">
            {route.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Turn-by-Turn Guidance Steps */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
          Turn-by-Turn Navigation Steps ({route.steps.length})
        </h4>

        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
          {route.steps.map((step) => {
            const isStairs = step.edge.stairsPresent;
            const isRamp = step.edge.rampVerified;

            return (
              <div key={step.stepIndex} className="relative flex items-start gap-3 text-xs pl-2">
                <div
                  className={`w-4 h-4 rounded-full mt-1 shrink-0 z-10 flex items-center justify-center font-bold text-[9px] ${
                    isStairs
                      ? 'bg-rose-500 text-white'
                      : isRamp
                      ? 'bg-teal-600 text-white'
                      : 'bg-purple-800 text-white'
                  }`}
                >
                  {step.stepIndex}
                </div>

                <div className="flex-1 p-3 bg-slate-50/80 rounded-2xl border border-slate-200">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-900 leading-snug">
                      {step.instruction}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px] shrink-0">
                      {step.distance}m
                    </span>
                  </div>

                  {step.warning && (
                    <div className="mt-1.5 text-rose-700 font-semibold text-[11px]">
                      {step.warning}
                    </div>
                  )}

                  {step.edge.notes && (
                    <p className="text-[11px] text-slate-500 mt-1">{step.edge.notes}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
