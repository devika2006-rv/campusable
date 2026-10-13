import React, { useState } from 'react';
import { getStoredCampusData } from '../utils/storage';
import { Building, BuildingCategory, VerificationStatus } from '../types/campus';
import { BuildingCard } from '../features/buildings/BuildingCard';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const dataset = getStoredCampusData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [hasAccessibleEntranceOnly, setHasAccessibleEntranceOnly] = useState(false);

  const handleLocate3D = (b: Building) => {
    navigate(`/explore?bldg=${b.id}`);
  };

  const filteredBuildings = dataset.buildings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.code && b.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || b.verificationStatus === selectedStatus;
    const matchesAccessibleEntrance =
      !hasAccessibleEntranceOnly || b.entrances.some((e) => e.isAccessible);

    return matchesSearch && matchesCategory && matchesStatus && matchesAccessibleEntrance;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Buildings & Facilities Directory
          </h1>
          <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
            {dataset.buildings.length} Registered Blocks
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Search campus facilities, inspect entrances, verify ramp availability, and navigate to your destination.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search text */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by building name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 focus:bg-white"
            />
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic Blocks</option>
              <option value="administrative">Administrative</option>
              <option value="library">Library</option>
              <option value="sports">Sports Complex</option>
              <option value="canteen">Canteen & Dining</option>
              <option value="auditorium">Auditorium</option>
              <option value="lab">Engineering Labs</option>
              <option value="hostel">Hostels</option>
              <option value="utility">Utility & Substation</option>
              <option value="outdoor">Gardens & Outdoor</option>
              <option value="bank_atm">Bank & ATM</option>
            </select>
          </div>

          {/* Verification Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Verified Audit Only</option>
              <option value="approximate">Approximate Survey</option>
              <option value="unverified">Unverified Only</option>
              <option value="demo">Demonstration Only</option>
            </select>
          </div>
        </div>

        {/* Accessibility Checkbox Filter */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2 text-xs">
          <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={hasAccessibleEntranceOnly}
              onChange={(e) => setHasAccessibleEntranceOnly(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 accent-teal-600"
            />
            <span>Show only buildings with verified step-free entrances</span>
          </label>

          <span className="text-slate-500">
            Showing {filteredBuildings.length} of {dataset.buildings.length} buildings
          </span>
        </div>
      </div>

      {/* Buildings Cards Grid */}
      {filteredBuildings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No matching buildings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or resetting the category selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => (
            <BuildingCard
              key={building.id}
              building={building}
              onLocate3D={handleLocate3D}
            />
          ))}
        </div>
      )}
    </div>
  );
};
