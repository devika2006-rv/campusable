import React, { useState } from 'react';
import { Building, CampusDataset, RouteEdge } from '../../types/campus';
import { VerificationBadge } from '../../components/layout/VerificationBadge';
import {
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Move,
  ShieldCheck,
  Filter,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  dataset: CampusDataset;
  onUpdateBuilding: (bldg: Building) => void;
  onSaveDataset: (updated: CampusDataset) => void;
}

export const MapAuditReviewView: React.FC<Props> = ({
  dataset,
  onUpdateBuilding,
  onSaveDataset,
}) => {
  const [selectedSection, setSelectedSection] = useState<'all' | 'north_side' | 'south_side'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editCategory, setEditCategory] = useState<any>('academic');
  const [editPosX, setEditPosX] = useState<number>(0);
  const [editPosY, setEditPosY] = useState<number>(0);
  const [editPosZ, setEditPosZ] = useState<number>(0);
  const [editDimW, setEditDimW] = useState<number>(10);
  const [editDimD, setEditDimD] = useState<number>(10);
  const [imageZoom, setImageZoom] = useState<number>(1);

  const startEdit = (bldg: Building) => {
    setEditingId(bldg.id);
    setEditName(bldg.name);
    setEditCategory(bldg.category);
    setEditPosX(bldg.position.x);
    setEditPosY(bldg.position.y);
    setEditPosZ(bldg.position.z);
    setEditDimW(bldg.dimensions.width);
    setEditDimD(bldg.dimensions.depth);
  };

  const saveEdit = (original: Building) => {
    const updated: Building = {
      ...original,
      name: editName.trim(),
      category: editCategory,
      position: { x: editPosX, y: editPosY, z: editPosZ },
      dimensions: { ...original.dimensions, width: editDimW, depth: editDimD },
      auditReviewStatus: 'modified',
    };
    onUpdateBuilding(updated);
    setEditingId(null);
  };

  const approveAsVerified = (bldg: Building) => {
    const updated: Building = {
      ...bldg,
      verificationStatus: 'verified',
      auditReviewStatus: 'approved',
      lastVerifiedAt: new Date().toISOString().split('T')[0],
      source: 'Human Audit Confirmed vs Map Board Photo',
    };
    onUpdateBuilding(updated);
  };

  const filteredBuildings = dataset.buildings
    .filter((b) => {
      if (selectedSection === 'all') return true;
      return b.mapSection === selectedSection;
    })
    .sort((a, b) => (a.mapNumber || 99) - (b.mapNumber || 99));

  return (
    <div className="space-y-6">
      {/* Header and Instructions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Campus Map Board Audit & Review
            </h2>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              26 Official Landmarks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Inspect extracted building names against the master signboard photograph. Move building footprints, correct spelling, and approve entries after human verification.
          </p>
        </div>

        {/* Section Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedSection('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSection === 'all'
                ? 'bg-purple-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All (26)
          </button>
          <button
            onClick={() => setSelectedSection('north_side')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSection === 'north_side'
                ? 'bg-purple-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            North Side (1-13)
          </button>
          <button
            onClick={() => setSelectedSection('south_side')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedSection === 'south_side'
                ? 'bg-purple-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            South Side (14-26)
          </button>
        </div>
      </div>

      {/* Split Screen Workspace: Photo Reference on Left, Editable Inventory on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Original Photograph Reference with Zoom */}
        <div className="lg:col-span-5 sticky top-20 bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <ImageIcon className="w-4 h-4 text-teal-600" />
              <span>Original Signboard Reference</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setImageZoom((prev) => Math.max(1, prev - 0.25))}
                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-semibold text-slate-600 w-10 text-center">
                {Math.round(imageZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setImageZoom((prev) => Math.min(2.5, prev + 0.25))}
                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-auto max-h-[580px] rounded-2xl border border-slate-200 bg-slate-900/5 flex items-center justify-center p-2">
            <img
              src="/campus-map-board.jpg"
              alt="Vidya Academy of Science and Technology campus signboard"
              className="rounded-xl object-contain transition-transform duration-150 origin-top"
              style={{ transform: `scale(${imageZoom})` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 italic text-center">
            Master Signboard: Vidya Academy of Science & Technology, Thalakkottukara, Thrissur.
          </p>
        </div>

        {/* Right: Extracted Records & Human Correction Table */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Extracted Landmarks ({filteredBuildings.length})</span>
            <span className="text-teal-700 font-semibold">Click edit to fine-tune positions</span>
          </div>

          <div className="space-y-3">
            {filteredBuildings.map((bldg) => {
              const isEditing = editingId === bldg.id;

              return (
                <div
                  key={bldg.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-purple-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {bldg.mapNumber && (
                        <span className="w-7 h-7 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                          {bldg.mapNumber}
                        </span>
                      )}
                      <div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="font-bold text-slate-900 text-sm px-2 py-1 rounded-lg border border-purple-400 w-full"
                          />
                        ) : (
                          <div className="font-bold text-slate-900 text-sm">{bldg.name}</div>
                        )}
                        <div className="text-[11px] text-slate-500 capitalize flex items-center gap-2 mt-0.5">
                          <span>{bldg.category.replace('_', ' ')}</span>
                          <span>•</span>
                          <span className="uppercase text-[10px] font-semibold text-slate-600">
                            {bldg.mapSection?.replace('_', ' ') || 'Central'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <VerificationBadge status={bldg.verificationStatus} size="sm" />
                      {!isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(bldg)}
                            className="p-1.5 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit building details & position"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {bldg.verificationStatus !== 'verified' && (
                            <button
                              type="button"
                              onClick={() => approveAsVerified(bldg)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                              title="Confirm and verify on-ground"
                            >
                              <Check className="w-3 h-3" />
                              <span>Verify</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => saveEdit(bldg)}
                          className="px-3 py-1 bg-purple-800 hover:bg-purple-900 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Coordinate & Footprint Editor */}
                  {isEditing ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-slate-500 text-[10px] font-bold uppercase">X (East/West)</label>
                          <div className="flex items-center gap-1 mt-0.5">
                            <button
                              type="button"
                              onClick={() => setEditPosX((prev) => prev - 1)}
                              className="px-1.5 py-0.5 bg-slate-200 rounded font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={editPosX}
                              onChange={(e) => setEditPosX(Number(e.target.value))}
                              className="w-full text-center py-0.5 border rounded font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setEditPosX((prev) => prev + 1)}
                              className="px-1.5 py-0.5 bg-slate-200 rounded font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-500 text-[10px] font-bold uppercase">Z (North/South)</label>
                          <div className="flex items-center gap-1 mt-0.5">
                            <button
                              type="button"
                              onClick={() => setEditPosZ((prev) => prev - 1)}
                              className="px-1.5 py-0.5 bg-slate-200 rounded font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={editPosZ}
                              onChange={(e) => setEditPosZ(Number(e.target.value))}
                              className="w-full text-center py-0.5 border rounded font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setEditPosZ((prev) => prev + 1)}
                              className="px-1.5 py-0.5 bg-slate-200 rounded font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-500 text-[10px] font-bold uppercase">Width (m)</label>
                          <input
                            type="number"
                            value={editDimW}
                            onChange={(e) => setEditDimW(Number(e.target.value))}
                            className="w-full text-center py-0.5 border rounded font-mono mt-0.5"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Category:</span>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="px-2 py-1 border rounded bg-white"
                        >
                          <option value="academic">Academic</option>
                          <option value="administrative">Administrative</option>
                          <option value="library">Library</option>
                          <option value="sports">Sports</option>
                          <option value="amenity">Amenity</option>
                          <option value="hostel">Hostel</option>
                          <option value="canteen">Canteen</option>
                          <option value="auditorium">Auditorium</option>
                          <option value="lab">Engineering Lab</option>
                          <option value="utility">Utility</option>
                          <option value="outdoor">Outdoor</option>
                          <option value="bank_atm">Bank & ATM</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 gap-2">
                      <span className="font-mono">
                        Coords: ({bldg.position.x}, {bldg.position.y}, {bldg.position.z}) • {bldg.dimensions.width}m × {bldg.dimensions.depth}m
                      </span>
                      <span className="text-teal-700 bg-teal-50 px-2 py-0.2 rounded font-semibold">
                        {bldg.confidenceLevel || 'High'} Confidence
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
