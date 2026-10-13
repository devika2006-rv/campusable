import React, { useState } from 'react';
import { NavigableLocation } from '../../utils/locationHelper';
import { SearchableLocationSelect } from '../../components/forms/SearchableLocationSelect';
import { ArrowUpDown, Navigation, X, AlertCircle, ShieldCheck } from 'lucide-react';

interface Props {
  locations: NavigableLocation[];
  selectedStartId: string;
  selectedEndId: string;
  avoidStairs: boolean;
  onStartChange: (id: string) => void;
  onEndChange: (id: string) => void;
  onAvoidStairsChange: (avoid: boolean) => void;
  onCalculate: () => void;
  onClearRoute: () => void;
  isRouteActive: boolean;
}

export const RoutePlannerCard: React.FC<Props> = ({
  locations,
  selectedStartId,
  selectedEndId,
  avoidStairs,
  onStartChange,
  onEndChange,
  onAvoidStairsChange,
  onCalculate,
  onClearRoute,
  isRouteActive,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSwap = () => {
    const temp = selectedStartId;
    onStartChange(selectedEndId);
    onEndChange(temp);
    setValidationError(null);
  };

  const handleCalculateClick = () => {
    if (!selectedStartId) {
      setValidationError('Please select a starting point.');
      return;
    }
    if (!selectedEndId) {
      setValidationError('Please select a destination.');
      return;
    }
    if (selectedStartId === selectedEndId) {
      setValidationError('Starting point and destination cannot be the same.');
      return;
    }

    setValidationError(null);
    onCalculate();
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-teal-600" />
            <span>Plan Campus Route</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select origin and destination to find the best walking path.
          </p>
        </div>

        {isRouteActive && (
          <button
            type="button"
            onClick={onClearRoute}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Starting point & Destination Fields */}
      <div className="space-y-3 relative">
        <SearchableLocationSelect
          id="route-start"
          label="Starting Point"
          locations={locations}
          selectedLocationId={selectedStartId}
          onSelect={(id) => {
            onStartChange(id);
            setValidationError(null);
          }}
          markerType="origin"
          placeholder="Where are you starting from?"
          hasError={validationError?.includes('starting point') ?? false}
        />

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Starting Point and Destination"
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-teal-700 rounded-full border border-slate-300 shadow-xs transition-all hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Swap Start and Destination"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        <SearchableLocationSelect
          id="route-destination"
          label="Destination"
          locations={locations}
          selectedLocationId={selectedEndId}
          onSelect={(id) => {
            onEndChange(id);
            setValidationError(null);
          }}
          markerType="destination"
          placeholder="Where do you want to go?"
          hasError={validationError?.includes('destination') ?? false}
        />
      </div>

      {/* Optional Accessible Route Toggle */}
      <div className="pt-3 border-t border-slate-100">
        <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition-colors cursor-pointer">
          <div className="pr-3">
            <span className="text-xs font-bold text-slate-800 block">
              Accessible route (Avoid stairs)
            </span>
            <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
              Strictly uses step-free paths, level corridors, and verified ramps.
            </span>
          </div>
          <input
            type="checkbox"
            checked={avoidStairs}
            onChange={(e) => onAvoidStairsChange(e.target.checked)}
            className="w-5 h-5 text-teal-600 rounded-lg focus:ring-teal-500 accent-teal-600 shrink-0 cursor-pointer"
          />
        </label>
      </div>

      {/* Validation Message */}
      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Action CTA */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={handleCalculateClick}
          className="w-full py-3 px-5 bg-purple-800 hover:bg-purple-900 active:bg-purple-950 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <Navigation className="w-4 h-4 text-teal-300" />
          <span>Plan Route</span>
        </button>
      </div>
    </div>
  );
};
