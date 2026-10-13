import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStoredCampusData } from '../utils/storage';
import { calculateAccessibleRoute } from '../utils/dijkstra';
import { CalculatedRoute, RoutePreferences, RouteNode } from '../types/campus';
import { getNavigableLocations, resolveToNodeId, getLocationDisplayName } from '../utils/locationHelper';
import { RoutePlannerCard } from '../features/navigation/RoutePlannerCard';
import { RouteSummaryPanel } from '../features/navigation/RouteSummaryPanel';
import { CampusCanvas } from '../components/campus3d/CampusCanvas';
import { Navigation, Compass } from 'lucide-react';

export const NavigatePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dataset = getStoredCampusData();

  // Unified list of 26 campus landmarks and gate points
  const navigableLocations = useMemo(
    () => getNavigableLocations(dataset.buildings, dataset.routeNodes),
    [dataset.buildings, dataset.routeNodes]
  );

  // Defaults: Main Gate -> Main Engineering Block
  const defaultStart = navigableLocations[0]?.id || 'node-main-gate-road';
  const defaultEnd =
    navigableLocations.find((l) => l.isBuilding && l.mapNumber === 1)?.id ||
    navigableLocations[1]?.id ||
    'bldg-1-main-engineering';

  const [startLocationId, setStartLocationId] = useState<string>(defaultStart);
  const [endLocationId, setEndLocationId] = useState<string>(defaultEnd);
  const [avoidStairs, setAvoidStairs] = useState<boolean>(true);
  const [calculatedRoute, setCalculatedRoute] = useState<CalculatedRoute | null>(null);

  // Support deep-linking via ?to=... and ?from=...
  useEffect(() => {
    const toParam = searchParams.get('to');
    const fromParam = searchParams.get('from');

    if (toParam) {
      const match = navigableLocations.find(
        (l) => l.id === toParam || l.buildingId === toParam || l.nodeId === toParam
      );
      if (match) {
        setEndLocationId(match.id);
      }
    }

    if (fromParam) {
      const match = navigableLocations.find(
        (l) => l.id === fromParam || l.buildingId === fromParam || l.nodeId === fromParam
      );
      if (match) {
        setStartLocationId(match.id);
      }
    }
  }, [searchParams, navigableLocations]);

  // Execute Dijkstra route calculation
  const handleCalculateRoute = () => {
    const startNodeId = resolveToNodeId(startLocationId, navigableLocations);
    const endNodeId = resolveToNodeId(endLocationId, navigableLocations);

    const prefs: RoutePreferences = {
      avoidStairs,
      preferStepFree: avoidStairs,
      preferRamps: true,
      preferLifts: true,
      avoidUnverified: false,
      minimizeDistance: false,
    };

    const result = calculateAccessibleRoute(
      startNodeId,
      endNodeId,
      dataset.routeNodes,
      dataset.routeEdges,
      prefs
    );

    setCalculatedRoute(result);
  };

  // Run initial calculation once mounted so users immediately see a clear default route
  useEffect(() => {
    handleCalculateRoute();
  }, [startLocationId, endLocationId, avoidStairs]);

  const handleClearRoute = () => {
    setCalculatedRoute(null);
  };

  const activePathEdgeIds = calculatedRoute?.found
    ? calculatedRoute.edges.map((e) => e.id)
    : [];

  // Identify Start and Destination Route Nodes for 3D/2D Marker rendering
  const startNodeId = resolveToNodeId(startLocationId, navigableLocations);
  const endNodeId = resolveToNodeId(endLocationId, navigableLocations);
  const startNode = dataset.routeNodes.find((n) => n.id === startNodeId) || null;
  const endNode = dataset.routeNodes.find((n) => n.id === endNodeId) || null;

  const startDisplayName = getLocationDisplayName(startLocationId, navigableLocations);
  const endDisplayName = getLocationDisplayName(endLocationId, navigableLocations);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Title & Clean Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Navigation className="w-7 h-7 text-teal-600" />
          <span>Plan Campus Route</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Get clear, step-free directions between campus buildings, amenities, and entrance gates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left column: Planner Form & Route Summary Panel */}
        <div className="lg:col-span-5 space-y-5">
          <RoutePlannerCard
            locations={navigableLocations}
            selectedStartId={startLocationId}
            selectedEndId={endLocationId}
            avoidStairs={avoidStairs}
            onStartChange={setStartLocationId}
            onEndChange={setEndLocationId}
            onAvoidStairsChange={setAvoidStairs}
            onCalculate={handleCalculateRoute}
            onClearRoute={handleClearRoute}
            isRouteActive={activePathEdgeIds.length > 0}
          />

          <RouteSummaryPanel
            route={calculatedRoute}
            locations={navigableLocations}
            startLocationId={startLocationId}
            endLocationId={endLocationId}
            isAccessiblePreference={avoidStairs}
          />
        </div>

        {/* Right column: Main Route Visualizer Map */}
        <div className="lg:col-span-7 sticky top-20">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Visualizer Status Header */}
            <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-300" />
                <span>Campus Route Visualizer</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {activePathEdgeIds.length > 0
                  ? `${activePathEdgeIds.length} segments highlighted`
                  : 'Ready for route'}
              </span>
            </div>

            {/* Visualizer Canvas Area */}
            <div className="h-[540px] sm:h-[600px] w-full relative">
              <CampusCanvas
                buildings={dataset.buildings}
                routeNodes={dataset.routeNodes}
                routeEdges={dataset.routeEdges}
                selectedBuilding={null}
                onSelectBuilding={(b) => {
                  if (b) {
                    setEndLocationId(b.id);
                  }
                }}
                activePathEdgeIds={activePathEdgeIds}
                startNode={startNode}
                endNode={endNode}
                startLabel={startDisplayName}
                endLabel={endDisplayName}
                onClearRoute={handleClearRoute}
                onSetStartBuilding={(b) => setStartLocationId(b.id)}
                onSetDestinationBuilding={(b) => setEndLocationId(b.id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
