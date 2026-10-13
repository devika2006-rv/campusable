import React, { useState } from 'react';
import { Building, BuildingCategory, VerificationStatus } from '../../types/campus';
import { X, Save, AlertCircle } from 'lucide-react';

interface Props {
  building: Building | null; // null if adding new
  isOpen: boolean;
  onClose: () => void;
  onSave: (saved: Building) => void;
}

export const AdminBuildingModal: React.FC<Props> = ({
  building,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const isEditing = !!building;

  const [id, setId] = useState(building?.id || `bldg-${Date.now().toString().slice(-4)}`);
  const [name, setName] = useState(building?.name || '');
  const [code, setCode] = useState(building?.code || '');
  const [category, setCategory] = useState<BuildingCategory>(building?.category || 'academic');
  const [description, setDescription] = useState(building?.description || '');
  const [posX, setPosX] = useState(building?.position.x ?? 0);
  const [posY, setPosY] = useState(building?.position.y ?? 2.5);
  const [posZ, setPosZ] = useState(building?.position.z ?? 0);
  const [dimW, setDimW] = useState(building?.dimensions.width ?? 12);
  const [dimH, setDimH] = useState(building?.dimensions.height ?? 5);
  const [dimD, setDimD] = useState(building?.dimensions.depth ?? 10);
  const [color, setColor] = useState(building?.color || '#6d28d9');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    building?.verificationStatus || 'approximate'
  );
  const [mapNumber, setMapNumber] = useState<number | ''>(building?.mapNumber ?? '');
  const [confidenceLevel, setConfidenceLevel] = useState<'high' | 'medium' | 'low' | 'uncertain'>(
    building?.confidenceLevel || 'high'
  );
  const [mapSection, setMapSection] = useState<'north_side' | 'south_side' | 'central' | 'outdoor'>(
    building?.mapSection || 'central'
  );
  const [auditReviewStatus, setAuditReviewStatus] = useState<'pending_review' | 'approved' | 'modified' | 'rejected'>(
    building?.auditReviewStatus || 'approved'
  );
  const [source, setSource] = useState(building?.source || 'Administrative Ground Audit');
  const [lastVerifiedAt, setLastVerifiedAt] = useState(
    building?.lastVerifiedAt || new Date().toISOString().split('T')[0]
  );

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Building name is required.');
      return;
    }

    const saved: Building = {
      id: id.trim(),
      name: name.trim(),
      code: code.trim() || undefined,
      category,
      description: description.trim(),
      position: { x: Number(posX), y: Number(posY), z: Number(posZ) },
      dimensions: { width: Math.max(1, Number(dimW)), height: Math.max(1, Number(dimH)), depth: Math.max(1, Number(dimD)) },
      rotation: building?.rotation || { x: 0, y: 0, z: 0 },
      color,
      floors: building?.floors || [],
      entrances: building?.entrances || [],
      facilities: building?.facilities || [],
      accessibilityFeatures: building?.accessibilityFeatures || [],
      verificationStatus,
      mapNumber: mapNumber === '' ? undefined : Number(mapNumber),
      confidenceLevel,
      mapSection,
      auditReviewStatus,
      source: source.trim(),
      lastVerifiedAt: lastVerifiedAt || new Date().toISOString().split('T')[0],
    };

    onSave(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? `Edit Building: ${building.name}` : 'Add New Campus Building'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Building ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isEditing}
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Code (e.g. ADM, CSE)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Building Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BuildingCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
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
                <option value="utility">Utility / Substation</option>
                <option value="outdoor">Outdoor / Garden</option>
                <option value="bank_atm">Bank & ATM</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Map Board # (1-26)
              </label>
              <input
                type="number"
                min="1"
                max="26"
                value={mapNumber}
                onChange={(e) => setMapNumber(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 1"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Map Section
              </label>
              <select
                value={mapSection}
                onChange={(e) => setMapSection(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="central">Central Sector</option>
                <option value="north_side">North Side (West Wing)</option>
                <option value="south_side">South Side (East Wing)</option>
                <option value="outdoor">Outdoor / Summit</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Extraction Confidence
              </label>
              <select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="high">High Confidence</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="uncertain">Uncertain / Unclear</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Audit Review
              </label>
              <select
                value={auditReviewStatus}
                onChange={(e) => setAuditReviewStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
              >
                <option value="approved">Approved</option>
                <option value="pending_review">Pending Review</option>
                <option value="modified">Modified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          {/* 3D Coordinates */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              3D Spatial Coordinates & Dimensions
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-600">Position X (East/West)</label>
                <input
                  type="number"
                  step="0.5"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="text-slate-600">Position Y (Elevation)</label>
                <input
                  type="number"
                  step="0.5"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="text-slate-600">Position Z (North/South)</label>
                <input
                  type="number"
                  step="0.5"
                  value={posZ}
                  onChange={(e) => setPosZ(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-600">Width (m)</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={dimW}
                  onChange={(e) => setDimW(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="text-slate-600">Height (m)</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={dimH}
                  onChange={(e) => setDimH(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="text-slate-600">Depth (m)</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={dimD}
                  onChange={(e) => setDimD(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Verification & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Verification Status
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="verified">Verified Audit</option>
                <option value="approximate">Approximate Survey</option>
                <option value="unverified">Unverified</option>
                <option value="demo">Demonstration</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                3D Theme Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-300 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Verification Date
              </label>
              <input
                type="date"
                value={lastVerifiedAt}
                onChange={(e) => setLastVerifiedAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Data Source / Auditor Notes
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Building Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
