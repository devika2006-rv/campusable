import React from 'react';
import { Building } from '../../types/campus';
import { VerificationBadge } from '../../components/layout/VerificationBadge';
import { Link } from 'react-router-dom';
import {
  Compass,
  Navigation,
  Layers,
  DoorOpen,
  ArrowRight,
  Accessibility,
} from 'lucide-react';

interface Props {
  building: Building;
  onLocate3D?: (b: Building) => void;
}

export const BuildingCard: React.FC<Props> = ({ building, onLocate3D }) => {
  const accessibleEntrancesCount = building.entrances.filter((e) => e.isAccessible).length;
  const rampFeaturesCount = building.accessibilityFeatures.filter((f) => f.type === 'ramp').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Header: Name and Badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {building.mapNumber && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] shadow-xs shrink-0" title={`Map Board # ${building.mapNumber}`}>
                  {building.mapNumber}
                </span>
              )}
              <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-900 transition-colors">
                {building.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 capitalize mt-1 flex-wrap">
              <span className="font-medium text-slate-700">{building.category.replace('_', ' ')}</span>
              {building.mapSection && (
                <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px] text-slate-600 uppercase font-semibold">
                  {building.mapSection.replace('_', ' ')}
                </span>
              )}
              {building.confidenceLevel && (
                <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-medium border border-teal-200">
                  {building.confidenceLevel} map confidence
                </span>
              )}
            </div>
          </div>
          <VerificationBadge status={building.verificationStatus} size="sm" />
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {building.description}
        </p>

        {/* Accessibility features summary */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 mb-4">
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Accessibility className="w-3.5 h-3.5 text-teal-600" />
            <span>Accessibility Profile</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium ${
                accessibleEntrancesCount > 0
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <DoorOpen className="w-3 h-3" />
              {accessibleEntrancesCount > 0
                ? `${accessibleEntrancesCount} Step-Free Entrance${accessibleEntrancesCount > 1 ? 's' : ''}`
                : 'No Verified Step-Free Entrance'}
            </span>

            {building.facilities.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                {building.facilities.length} Facilities Listed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/building/${building.id}`}
          className="text-xs font-semibold text-purple-800 hover:text-purple-950 inline-flex items-center gap-1 transition-colors"
        >
          <span>View Details & Floors</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-1.5">
          {onLocate3D && (
            <button
              onClick={() => onLocate3D(building)}
              title="Locate in 3D Explorer"
              className="p-2 text-slate-600 hover:text-purple-800 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
              aria-label={`Locate ${building.name} in 3D`}
            >
              <Compass className="w-4 h-4" />
            </button>
          )}

          <Link
            to={`/navigate?to=${building.id}`}
            title="Plan Step-Free Route"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-2xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
