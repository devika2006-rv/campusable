import React, { useState } from 'react';
import {
  getStoredCampusData,
  saveCampusData,
  resetCampusDataToDefault,
  updateBuilding,
  deleteBuilding,
} from '../utils/storage';
import { Building, CampusDataset } from '../types/campus';
import { VerificationBadge } from '../components/layout/VerificationBadge';
import { AdminBuildingModal } from '../features/admin/AdminBuildingModal';
import { DataExportImportModal } from '../features/admin/DataExportImportModal';
import { ImageImportForm } from '../components/forms/ImageImportForm';
import { CampusCanvas } from '../components/campus3d/CampusCanvas';
import { MapAuditReviewView } from '../features/admin/MapAuditReviewView';
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  Building2,
  Image as ImageIcon,
  Compass,
  CheckSquare,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [dataset, setDataset] = useState<CampusDataset>(getStoredCampusData());
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'review' | 'buildings' | 'images' | 'preview'>('review');

  const handleAddNewBuilding = () => {
    setEditingBuilding(null);
    setIsBuildingModalOpen(true);
  };

  const handleEditBuilding = (b: Building) => {
    setEditingBuilding(b);
    setIsBuildingModalOpen(true);
  };

  const handleDeleteBuilding = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete building record "${name}"?`)) {
      const updated = deleteBuilding(id);
      setDataset({ ...updated });
    }
  };

  const handleSaveBuilding = (saved: Building) => {
    const updated = updateBuilding(saved);
    setDataset({ ...updated });
  };

  const handleResetDefault = () => {
    if (
      window.confirm(
        'Reset campus data to the default baseline dataset? All custom local modifications will be overwritten.'
      )
    ) {
      const reset = resetCampusDataToDefault();
      setDataset({ ...reset });
    }
  };

  const handleImportValidDataset = (imported: CampusDataset) => {
    saveCampusData(imported);
    setDataset({ ...imported });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="w-8 h-8 text-purple-800" />
              <span>Campus Data Management</span>
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
              Local Prototype
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Manage buildings, spatial coordinates, floor plans, and audit verification states.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExportImportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Import / Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>
        </div>
      </div>

      {/* Security & Prototype Disclaimer Notice (Section 15) */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Prototype Integrity Notice: </span>
          This administrative interface is a local prototype demonstrating spatial data management,
          not a secure multi-user administrative system. Changes persist in this browser's LocalStorage.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'review'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-teal-300" />
          <span>Signboard Audit Review (26 Landmarks)</span>
        </button>

        <button
          onClick={() => setActiveTab('buildings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'buildings'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Building Table ({dataset.buildings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'images'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image Import & AI</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'preview'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Live 3D Scene</span>
        </button>
      </div>

      {/* Tab 0: Signboard Audit & Human Review Workflow */}
      {activeTab === 'review' && (
        <MapAuditReviewView
          dataset={dataset}
          onUpdateBuilding={handleSaveBuilding}
          onSaveDataset={(updated) => {
            saveCampusData(updated);
            setDataset({ ...updated });
          }}
        />
      )}

      {/* Tab 1: Building Records */}
      {activeTab === 'buildings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Registered Campus Buildings</h2>
            <button
              onClick={handleAddNewBuilding}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Building</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Building</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">3D Coordinates (X, Y, Z)</th>
                    <th className="px-4 py-3.5">Dimensions (W, H, D)</th>
                    <th className="px-4 py-3.5">Verification</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataset.buildings.map((bldg) => (
                    <tr key={bldg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{bldg.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          ID: {bldg.id} {bldg.code ? `• Code: ${bldg.code}` : ''}
                        </div>
                      </td>
                      <td className="px-4 py-4 capitalize">{bldg.category}</td>
                      <td className="px-4 py-4 font-mono text-[11px] text-slate-600">
                        ({bldg.position.x}, {bldg.position.y}, {bldg.position.z})
                      </td>
                      <td className="px-4 py-4 font-mono text-[11px] text-slate-600">
                        {bldg.dimensions.width}m × {bldg.dimensions.height}m × {bldg.dimensions.depth}m
                      </td>
                      <td className="px-4 py-4">
                        <VerificationBadge status={bldg.verificationStatus} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleEditBuilding(bldg)}
                          className="p-1.5 text-purple-700 hover:bg-purple-50 rounded-lg"
                          title="Edit building"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBuilding(bldg.id, bldg.name)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete building"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Map Board Image Upload & AI Interpretation */}
      {activeTab === 'images' && (
        <div className="max-w-4xl mx-auto">
          <ImageImportForm />
        </div>
      )}

      {/* Tab 3: Live 3D Preview */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-[600px] relative">
          <CampusCanvas
            buildings={dataset.buildings}
            routeNodes={dataset.routeNodes}
            routeEdges={dataset.routeEdges}
            selectedBuilding={null}
            onSelectBuilding={() => {}}
          />
        </div>
      )}

      {/* Building Edit Modal */}
      <AdminBuildingModal
        building={editingBuilding}
        isOpen={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        onSave={handleSaveBuilding}
      />

      {/* Export / Import Modal */}
      <DataExportImportModal
        dataset={dataset}
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        onImportValidDataset={handleImportValidDataset}
      />
    </div>
  );
};
