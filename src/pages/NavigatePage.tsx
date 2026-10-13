import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStoredCampusData } from '../utils/storage';
import { calculateAccessibleRoute } from '../utils/dijkstra';
import { CalculatedRoute, RoutePreferences } from '../types/campus';
import { RoutePlannerForm } from '../features/navigation/RoutePlannerForm';
import { RouteDirectionsView } from '../features/navigation/RouteDirectionsView';
import { CampusCanvas } from '../components/campus3d/CampusCanvas';
import { Navigation, MapPin, Compass } from 'lucide-react';

export const NavigatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dataset = getStoredCampusData();

  const [startNodeId, setStartNodeId] = useState<string>(
    dataset.routeNodes[0]?.id || 'node-main-gate'
  );
  const [endNodeId, setEndNodeId] = useState<string>(
    dataset.routeNodes[4]?.id || 'node-admin-front'
  );

  const [preferences, setPreferences] = useState<RoutePreferences>({
    avoidStairs: true,
    preferStepFree: true,
    preferRamps: true,
    preferLifts: true,
    avoidUnverified: false,
    minimizeDistance: false,
  });

  const [calculatedRoute, setCalculatedRoute] = useState<CalculatedRoute | null>(null);

  // If navigated with "?to=b-library" or similar query params
  useEffect(() => {
    const toParam = searchParams.get('to');
    if (toParam) {
      // Find a node corresponding to this building or building entrance
      const targetNode = dataset.routeNodes.find(
        (n) => n.buildingId === toParam || n.id.includes(toParam)
      );
      if (targetNode) {
        setEndNodeId(targetNode.id);
      }
    }
  }, [searchParams, dataset.routeNodes]);

  const handleCalculate = () => {
    const result = calculateAccessibleRoute(
      startNodeId,
      endNodeId,
      dataset.routeNodes,
      dataset.routeEdges,
      preferences
    );
    setCalculatedRoute(result);
  };

  // Run initial calculation once mounted so users immediately see a working demo route
  useEffect(() => {
    handleCalculate();
  }, [startNodeId, endNodeId, preferences]);

  const activePathEdgeIds = calculatedRoute?.found ? calculatedRoute.edges.map((e) => e.id) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Navigation className="w-8 h-8 text-teal-600" />
          <span>Campus Step-Free Route Planner</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Powered by graph algorithms with strict stair avoidance. Never compromises on physical accessibility honesty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Planner Form & Directions */}
        <div className="lg:col-span-5 space-y-6">
          <RoutePlannerForm
            nodes={dataset.routeNodes}
            selectedStartId={startNodeId}
            selectedEndId={endNodeId}
            preferences={preferences}
            onStartChange={setStartNodeId}
            onEndChange={setEndNodeId}
            onPreferencesChange={setPreferences}
            onCalculate={handleCalculate}
          />

          <RouteDirectionsView route={calculatedRoute} />
        </div>

        {/* Right column: Interactive 3D / 2D Route Visualizer */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-300" />
                <span>Active Route Visualizer</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {activePathEdgeIds.length > 0
                  ? `${activePathEdgeIds.length} segments highlighted`
                  : 'Awaiting route'}
              </span>
            </div>

            <div className="h-[520px] w-full">
              <CampusCanvas
                buildings={dataset.buildings}
                routeNodes={dataset.routeNodes}
                routeEdges={dataset.routeEdges}
                selectedBuilding={null}
                onSelectBuilding={() => {}}
                activePathEdgeIds={activePathEdgeIds}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
