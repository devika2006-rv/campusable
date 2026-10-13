import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CampusCanvas } from '../components/campus3d/CampusCanvas';
import { getStoredCampusData } from '../utils/storage';
import { Building } from '../types/campus';
import { VerificationBadge } from '../components/layout/VerificationBadge';
import { Search, Compass, Navigation, Info, Layers, Filter } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
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
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.code && b.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] relative overflow-hidden bg-slate-100">
      {/* Top Search & Filter Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 z-30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search buildings (e.g. Admin, Computer Science, Library)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories (26)</option>
            <option value="academic">Academic Blocks</option>
            <option value="administrative">Administrative</option>
            <option value="library">Library</option>
            <option value="sports">Sports & Playground</option>
            <option value="canteen">Canteen & Cafeteria</option>
            <option value="auditorium">Auditorium</option>
            <option value="lab">Engineering Labs</option>
            <option value="hostel">Hostels</option>
            <option value="utility">Utility & Substation</option>
            <option value="outdoor">Gardens & Grounds</option>
            <option value="bank_atm">Bank & ATM</option>
          </select>
        </div>

        {/* Quick building selection chips with map number */}
        <div className="hidden xl:flex items-center gap-1.5 overflow-x-auto max-w-lg">
          {filteredBuildings.slice(0, 6).map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBuilding(b)}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                selectedBuilding?.id === b.id
                  ? 'bg-purple-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {b.mapNumber && (
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {b.mapNumber}
                </span>
              )}
              <span>{b.name.length > 12 ? `${b.name.substring(0, 11)}...` : b.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D / 2D Canvas Area */}
      <div className="flex-1 w-full h-full relative">
        <CampusCanvas
          buildings={filteredBuildings}
          routeNodes={dataset.routeNodes}
          routeEdges={dataset.routeEdges}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={setSelectedBuilding}
        />
      </div>
    </div>
  );
};
