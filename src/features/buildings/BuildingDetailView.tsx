import React, { useState } from 'react';
import { Building, Floor } from '../../types/campus';
import { VerificationBadge } from '../../components/layout/VerificationBadge';
import { Link } from 'react-router-dom';
import {
  Building2,
  Navigation,
  Compass,
  DoorOpen,
  Layers,
  Accessibility,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileQuestion,
  PlusCircle,
  Info,
} from 'lucide-react';

interface Props {
  building: Building;
}

export const BuildingDetailView: React.FC<Props> = ({ building }) => {
  const [selectedFloorIndex, setSelectedFloorIndex] = useState<number>(0);

  const currentFloor: Floor | undefined = building.floors[selectedFloorIndex];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/directory"
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-800 hover:text-purple-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campus Directory</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={`/explore`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
          >
            <Compass className="w-4 h-4 text-purple-700" />
            <span>View in 3D Explorer</span>
          </Link>
          <Link
            to={`/navigate?to=${building.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-xs"
          >
            <Navigation className="w-4 h-4" />
            <span>Plan Step-Free Route Here</span>
          </Link>
        </div>
      </div>

      {/* Building Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold text-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {building.mapNumber && (
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0" title={`Signboard Index #${building.mapNumber}`}>
                    {building.mapNumber}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {building.name}
                </h1>
              </div>
              <p className="text-xs text-slate-500 capitalize mt-1 flex items-center gap-2 flex-wrap">
                <span>Category: <strong className="font-medium text-slate-700">{building.category.replace('_', ' ')}</strong></span>
                {building.mapSection && (
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700 font-semibold uppercase">
                    {building.mapSection.replace('_', ' ')}
                  </span>
                )}
                {building.confidenceLevel && (
                  <span className="px-2 py-0.5 bg-teal-50 border border-teal-200 text-teal-800 rounded text-[10px] font-semibold">
                    {building.confidenceLevel} map confidence
                  </span>
                )}
              </p>
            </div>
          </div>

          <VerificationBadge status={building.verificationStatus} size="md" />
        </div>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          {building.description}
        </p>

        {/* Source metadata alert */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="font-semibold text-slate-700">Verification Source: </span>
            <span>{building.source || 'NAAC Preliminary Documentation'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Last Audited / Updated: </span>
            <span>{building.lastVerifiedAt || 'Pending physical audit'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">3D Position (X, Y, Z): </span>
            <span className="font-mono">{building.position.x}, {building.position.y}, {building.position.z}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Footprint Dimensions (W, H, D): </span>
            <span className="font-mono">{building.dimensions.width}m x {building.dimensions.height}m x {building.dimensions.depth}m</span>
          </div>
        </div>
      </div>

      {/* Entrances and Accessibility Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entrances */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-teal-600" />
              <span>Entrances & Access Points</span>
            </h2>
            <span className="text-xs text-slate-500">{building.entrances.length} mapped</span>
          </div>

          {building.entrances.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4">No specific entrances recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {building.entrances.map((ent) => (
                <div
                  key={ent.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ent.name}</span>
                    <VerificationBadge status={ent.verificationStatus} size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                        ent.isAccessible
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ent.isAccessible ? '✓ Step-Free Accessible' : '✗ Inaccessible for wheelchairs'}
                    </span>
                    {ent.hasRamp && (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                        Ramp Present
                      </span>
                    )}
                    {ent.hasStairs && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-medium">
                        Stairs Present
                      </span>
                    )}
                    {ent.doorWidthCm && (
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                        Clear Width: {ent.doorWidthCm}cm
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accessibility Features */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-purple-700" />
              <span>Accessibility Features</span>
            </h2>
            <span className="text-xs text-slate-500">{building.accessibilityFeatures.length} verified/approximate</span>
          </div>

          {building.accessibilityFeatures.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4">No specific accessibility features registered.</p>
          ) : (
            <div className="space-y-3">
              {building.accessibilityFeatures.map((feat) => (
                <div
                  key={feat.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{feat.label}</span>
                    <VerificationBadge status={feat.verificationStatus} size="sm" />
                  </div>
                  <p className="text-slate-600">{feat.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Facilities Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Facilities & Services in this Building</h2>
        {building.facilities.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No specific facilities registered for this building.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {building.facilities.map((fac) => (
              <div
                key={fac.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-900 text-sm">{fac.name}</h4>
                    <VerificationBadge status={fac.verificationStatus} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mb-2 capitalize">
                    {fac.category.replace('_', ' ')} • {fac.location || 'Location details pending'}
                  </p>
                  {fac.notes && <p className="text-xs text-slate-600 mb-3">{fac.notes}</p>}
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-semibold ${
                      fac.accessibilityStatus === 'fully_accessible'
                        ? 'text-teal-700'
                        : fac.accessibilityStatus === 'partially_accessible'
                        ? 'text-amber-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {fac.accessibilityStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 12: Indoor Navigation & Floor Plans */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>Indoor Floor Navigation (Future-Ready)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Building floor plans, accessible corridors, elevators, and room-level orientation.
            </p>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-800 hover:text-purple-950 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manage Floors in Admin</span>
          </Link>
        </div>

        {building.floors.length === 0 ? (
          /* "Floor plan not added yet" state - strictly complying with Section 12 */
          <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-3 bg-slate-50/50">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto text-slate-500">
              <FileQuestion className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Floor plan not added yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We do not fabricate indoor layouts or room coordinates. Once verified CAD blueprints
              or scanned floor boards are approved, campus administrators can attach them here.
            </p>
          </div>
        ) : (
          <div>
            {/* Floor Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
              {building.floors.map((fl, idx) => (
                <button
                  key={fl.id}
                  onClick={() => setSelectedFloorIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedFloorIndex === idx
                      ? 'bg-purple-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {fl.displayName} (Level {fl.floorNumber})
                </button>
              ))}
            </div>

            {/* Current Selected Floor Details */}
            {currentFloor && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">
                    {currentFloor.displayName} Layout
                  </h3>
                  <VerificationBadge status={currentFloor.verificationStatus} size="sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Rooms List */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
                      Rooms & Labs ({currentFloor.rooms.length})
                    </h4>
                    {currentFloor.rooms.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No rooms mapped on this level.</p>
                    ) : (
                      <div className="space-y-2">
                        {currentFloor.rooms.map((rm) => (
                          <div
                            key={rm.id}
                            className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900">{rm.name}</span>
                              <span className="font-mono text-[10px] text-slate-500">{rm.number}</span>
                            </div>
                            {rm.notes && <p className="text-[11px] text-slate-500 mt-1">{rm.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Lifts & Vertical Mobility */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
                      Lifts & Vertical Transit ({currentFloor.lifts.length})
                    </h4>
                    {currentFloor.lifts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No elevators on this floor.</p>
                    ) : (
                      <div className="space-y-2">
                        {currentFloor.lifts.map((lift) => (
                          <div
                            key={lift.id}
                            className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                          >
                            <div className="font-semibold text-slate-900">{lift.location}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Serves floors: {lift.servesFloors.join(', ')} • Status: {lift.operationalStatus}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ramps & Corridors */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
                      Ramps & Corridors
                    </h4>
                    <div className="space-y-2 text-xs">
                      {currentFloor.ramps.map((rmp) => (
                        <div key={rmp.id} className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="font-semibold text-slate-900">{rmp.location}</span>
                          <p className="text-[11px] text-teal-700 mt-0.5">Slope: {rmp.slope}</p>
                        </div>
                      ))}
                      {currentFloor.corridors.map((cor) => (
                        <div key={cor.id} className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="font-semibold text-slate-900">{cor.name}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {cor.isStepFree ? '✓ Step-Free Corridor' : 'Has floor step'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
