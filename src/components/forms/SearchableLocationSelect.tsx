import React, { useState, useRef, useEffect } from 'react';
import { NavigableLocation } from '../../utils/locationHelper';
import { Search, ChevronDown, Check, X, MapPin } from 'lucide-react';

interface Props {
  id: string;
  label: string;
  locations: NavigableLocation[];
  selectedLocationId: string;
  onSelect: (locationId: string) => void;
  markerType: 'origin' | 'destination';
  placeholder?: string;
  hasError?: boolean;
}

export const SearchableLocationSelect: React.FC<Props> = ({
  id,
  label,
  locations,
  selectedLocationId,
  onSelect,
  markerType,
  placeholder = 'Select campus location...',
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedLocation = locations.find(
    (l) => l.id === selectedLocationId || l.nodeId === selectedLocationId
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredLocations = locations.filter((loc) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.category.toLowerCase().includes(q) ||
      (loc.mapNumber && loc.mapNumber.toString() === q)
    );
  });

  const isOrigin = markerType === 'origin';

  return (
    <div className="relative" ref={containerRef}>
      <label
        htmlFor={id}
        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
      >
        {label}
      </label>

      {/* Main trigger button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[50px] px-3.5 py-2.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
          hasError
            ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-200'
            : isOpen
            ? 'border-teal-500 bg-white ring-2 ring-teal-100 shadow-sm'
            : 'border-slate-300 bg-slate-50/70 hover:bg-white hover:border-slate-400'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Distinct Marker Icon (A for Origin, B for Destination) */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
              isOrigin
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-800 text-white'
            }`}
            aria-hidden="true"
          >
            {isOrigin ? 'A' : 'B'}
          </div>

          {selectedLocation ? (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {selectedLocation.mapNumber && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {selectedLocation.mapNumber}
                  </span>
                )}
                <span className="font-semibold text-slate-900 text-sm truncate">
                  {selectedLocation.name}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 capitalize block truncate">
                {selectedLocation.category}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 text-sm">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
            isOpen ? 'rotate-180 text-teal-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input Box */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by building name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Location Options List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-1">
            {filteredLocations.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No matching campus locations found.
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected =
                  loc.id === selectedLocationId || loc.nodeId === selectedLocationId;

                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      onSelect(loc.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 text-xs transition-colors ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {loc.mapNumber ? (
                        <span className="w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                          {loc.mapNumber}
                        </span>
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <div className="min-w-0 truncate">
                        <div className="truncate font-medium">{loc.name}</div>
                        <div className="text-[10px] text-slate-500 capitalize">
                          {loc.category}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-teal-600 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
