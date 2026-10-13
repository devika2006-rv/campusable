import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CampusCanvas } from '../components/campus3d/CampusCanvas';
import { getStoredCampusData } from '../utils/storage';
import { Building } from '../types/campus';
import { VerificationBadge } from '../components/layout/VerificationBadge';
import {
  Search,
  Filter,
  Navigation,
  Info,
  MapPin,
  X,
  RotateCcw,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dataset = getStoredCampusData();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const bldgId = searchParams.get('bldg');
    if (bldgId) {
      const found = dataset.buildings.find((b) => b.id === bldgId);
      if (found) {
        setSelectedBuilding(found);
      }
    }
  }, [searchParams, dataset.buildings]);

  const filteredBuildings = dataset.buildings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      (b.code && b.code.toLowerCase().includes(q)) ||
      (b.mapNumber && b.mapNumber.toString() === q) ||
      b.category.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === 'all' || b.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleStartRouteHere = (bldg: Building) => {
    navigate(`/navigate?from=${bldg.id}`);
  };

  const handleRouteToHere = (bldg: Building) => {
    navigate(`/navigate?to=${bldg.id}`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setSelectedBuilding(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] relative overflow-hidden bg-slate-100">
      {/* Compact Top Navigation & Search Toolbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 z-30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-sm sm:max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search buildings or map # (e.g. Library, #14)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/70 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories ({dataset.buildings.length})</option>
            <option value="academic">Academic Blocks</option>
            <option value="administrative">Administrative</option>
            <option value="library">Library</option>
            <option value="sports">Sports & Playground</option>
            <option value="canteen">Canteen & Cafeteria</option>
            <option value="auditorium">Auditorium</option>
            <option value="lab">Engineering Labs</option>
            <option value="hostel">Hostels</option>
            <option value="utility">Utility & Power</option>
            <option value="outdoor">Gardens & Grounds</option>
            <option value="bank_atm">Bank & ATM</option>
          </select>

          {(searchQuery || categoryFilter !== 'all' || selectedBuilding) && (
            <button
              type="button"
              onClick={resetFilters}
              title="Reset Search and Selection"
              className="px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-purple-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Quick building selection chips */}
        <div className="hidden xl:flex items-center gap-1.5 overflow-x-auto max-w-lg">
          {filteredBuildings.slice(0, 6).map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBuilding(b)}
              className={`px-2.5 py-1 text-xs rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedBuilding?.id === b.id
                  ? 'bg-purple-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {b.mapNumber && (
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {b.mapNumber}
                </span>
              )}
              <span>
                {b.name.length > 12 ? `${b.name.substring(0, 11)}...` : b.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D / 2D Canvas Area (Maximized Screen Space) */}
      <div className="flex-1 w-full h-full relative">
        <CampusCanvas
          buildings={filteredBuildings}
          routeNodes={dataset.routeNodes}
          routeEdges={dataset.routeEdges}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={setSelectedBuilding}
          onSetStartBuilding={handleStartRouteHere}
          onSetDestinationBuilding={handleRouteToHere}
        />
      </div>
    </div>
  );
};
