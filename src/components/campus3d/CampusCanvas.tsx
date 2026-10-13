import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Building, RouteEdge, RouteNode } from '../../types/campus';
import { BuildingMesh } from './BuildingMesh';
import { CompassRose } from './CompassRose';
import { SceneLegend } from './SceneLegend';
import { Campus2DView } from './Campus2DView';
import { StartEndMarkers3D } from './StartEndMarkers3D';
import { VerificationBadge } from '../layout/VerificationBadge';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  Layers,
  Box,
  Navigation,
  Info,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Tag,
  X,
  MapPin,
} from 'lucide-react';

interface Props {
  buildings: Building[];
  routeNodes: RouteNode[];
  routeEdges: RouteEdge[];
  selectedBuilding: Building | null;
  onSelectBuilding: (b: Building | null) => void;
  activePathEdgeIds?: string[];
  startNode?: RouteNode | null;
  endNode?: RouteNode | null;
  startLabel?: string;
  endLabel?: string;
  onClearRoute?: () => void;
  onSetStartBuilding?: (b: Building) => void;
  onSetDestinationBuilding?: (b: Building) => void;
}

// 3D Path representation connecting nodes
const PathwaySegments3D: React.FC<{
  edges: RouteEdge[];
  nodes: RouteNode[];
  activeEdgeIds: string[];
}> = ({ edges, nodes, activeEdgeIds }) => {
  const nodeMap = new Map<string, RouteNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  return (
    <group>
      {edges.map((edge) => {
        const n1 = nodeMap.get(edge.source);
        const n2 = nodeMap.get(edge.target);
        if (!n1 || !n2) return null;

        const p1 = new THREE.Vector3(n1.coordinates.x, 0.08, n1.coordinates.z);
        const p2 = new THREE.Vector3(n2.coordinates.x, 0.08, n2.coordinates.z);

        const isActive = activeEdgeIds.includes(edge.id);
        const isStairs = edge.stairsPresent;
        const isRamp = edge.rampVerified;

        let color = '#94a3b8'; // standard walkway
        let radius = 0.35;

        if (isStairs) {
          color = '#f43f5e'; // red
          radius = 0.3;
        } else if (isRamp) {
          color = '#0d9488'; // teal
          radius = 0.45;
        } else if (edge.stepFree) {
          color = '#14b8a6'; // teal
          radius = 0.35;
        }

        if (isActive) {
          color = '#7c3aed'; // vibrant active purple
          radius = 0.7; // thicker for visibility
        }

        const curve = new THREE.LineCurve3(p1, p2);
        const tubeGeom = new THREE.TubeGeometry(curve, 8, radius, 8, false);

        return (
          <group key={edge.id}>
            {/* Glowing outer halo for active route */}
            {isActive && (
              <mesh geometry={tubeGeom} scale={[1.4, 1.4, 1.4]}>
                <meshBasicMaterial
                  color="#c084fc"
                  transparent
                  opacity={0.35}
                  wireframe={false}
                />
              </mesh>
            )}

            <mesh geometry={tubeGeom}>
              <meshStandardMaterial
                color={color}
                roughness={0.3}
                metalness={0.2}
                emissive={isActive ? '#6d28d9' : '#000000'}
                emissiveIntensity={isActive ? 0.6 : 0}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Internal 3D camera supervisor for framing routes and smooth resets
const CameraDirector: React.FC<{
  activeNodes: RouteNode[];
  fitTrigger: number;
  resetTrigger: number;
  controlsRef: React.RefObject<any>;
}> = ({ activeNodes, fitTrigger, resetTrigger, controlsRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (activeNodes.length > 0 && controlsRef.current) {
      let minX = Infinity, maxX = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;
      activeNodes.forEach((n) => {
        if (n.coordinates.x < minX) minX = n.coordinates.x;
        if (n.coordinates.x > maxX) maxX = n.coordinates.x;
        if (n.coordinates.z < minZ) minZ = n.coordinates.z;
        if (n.coordinates.z > maxZ) maxZ = n.coordinates.z;
      });

      const centerX = (minX + maxX) / 2;
      const centerZ = (minZ + maxZ) / 2;
      const span = Math.max(maxX - minX, maxZ - minZ, 25);

      controlsRef.current.target.set(centerX, 0, centerZ);
      camera.position.set(
        centerX,
        Math.max(38, span * 1.4),
        centerZ + Math.max(38, span * 1.4)
      );
      controlsRef.current.update();
    }
  }, [fitTrigger, activeNodes.length]);

  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      camera.position.set(0, 60, 75);
      controlsRef.current.update();
    }
  }, [resetTrigger]);

  return null;
};

export const CampusCanvas: React.FC<Props> = ({
  buildings,
  routeNodes,
  routeEdges,
  selectedBuilding,
  onSelectBuilding,
  activePathEdgeIds = [],
  startNode = null,
  endNode = null,
  startLabel,
  endLabel,
  onClearRoute,
  onSetStartBuilding,
  onSetDestinationBuilding,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [fitTrigger, setFitTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const controlsRef = useRef<any>(null);

  // Identify nodes in the active route for camera framing
  const activeEdges = routeEdges.filter((e) => activePathEdgeIds.includes(e.id));
  const activeNodeIds = new Set<string>();
  activeEdges.forEach((e) => {
    activeNodeIds.add(e.source);
    activeNodeIds.add(e.target);
  });
  if (startNode) activeNodeIds.add(startNode.id);
  if (endNode) activeNodeIds.add(endNode.id);
  const activeNodes = routeNodes.filter((n) => activeNodeIds.has(n.id));

  // Trigger camera framing automatically whenever a new active route appears
  useEffect(() => {
    if (activePathEdgeIds.length > 0) {
      setFitTrigger((c) => c + 1);
    }
  }, [activePathEdgeIds.length]);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const cam = controlsRef.current.object;
      cam.position.multiplyScalar(0.85);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const cam = controlsRef.current.object;
      cam.position.multiplyScalar(1.15);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    setResetTrigger((c) => c + 1);
  };

  const handleFitRoute = () => {
    setFitTrigger((c) => c + 1);
  };

  if (viewMode === '2d' || webglError) {
    return (
      <div className="relative w-full h-full min-h-[500px]">
        {/* Toggle Mode Bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-md border border-slate-200">
          <button
            onClick={() => setViewMode('3d')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:text-slate-900"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D View</span>
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all bg-purple-800 text-white shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Schematic</span>
          </button>
        </div>

        <Campus2DView
          buildings={buildings}
          routeNodes={routeNodes}
          routeEdges={routeEdges}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={onSelectBuilding}
          activePathEdgeIds={activePathEdgeIds}
          startNode={startNode}
          endNode={endNode}
        />

        <SceneLegend />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[520px] bg-gradient-to-b from-sky-100 to-slate-200 overflow-hidden select-none">
      {/* View Switcher: Center Top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-md border border-slate-200">
        <button
          onClick={() => setViewMode('3d')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all bg-purple-800 text-white shadow-xs"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D View</span>
        </button>
        <button
          onClick={() => setViewMode('2d')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:text-slate-900"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D Schematic</span>
        </button>
      </div>

      {/* Floating Canvas Controls: Top Right Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 text-slate-700 hover:text-purple-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-700 hover:text-purple-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {activePathEdgeIds.length > 0 && (
          <button
            onClick={handleFitRoute}
            title="Fit Route to Screen"
            className="p-2 text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-xl transition-colors font-semibold"
            aria-label="Fit Route to Screen"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleResetCamera}
          title="Reset Camera"
          className="p-2 text-slate-700 hover:text-purple-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowAllLabels(!showAllLabels)}
          title={showAllLabels ? 'Switch to Clean Labels' : 'Show All Building Labels'}
          className={`p-2 rounded-xl transition-colors ${
            showAllLabels
              ? 'bg-teal-100 text-teal-800'
              : 'text-slate-700 hover:text-purple-800 hover:bg-slate-100'
          }`}
          aria-label="Toggle Labels"
        >
          <Tag className="w-4 h-4" />
        </button>

        {activePathEdgeIds.length > 0 && onClearRoute && (
          <button
            onClick={onClearRoute}
            title="Clear Route"
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            aria-label="Clear Route"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <CompassRose onResetHeading={handleResetCamera} />
      <SceneLegend />

      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 60, 75], fov: 44 }}
        onCreated={() => setWebglError(false)}
        onError={() => setWebglError(true)}
      >
        <Suspense fallback={null}>
          <OrbitControls
            ref={controlsRef}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={12}
            maxDistance={220}
            enableDamping
            dampingFactor={0.06}
          />

          <CameraDirector
            activeNodes={activeNodes}
            fitTrigger={fitTrigger}
            resetTrigger={resetTrigger}
            controlsRef={controlsRef}
          />

          {/* Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[40, 75, 30]}
            intensity={1.25}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={220}
            shadow-camera-left={-70}
            shadow-camera-right={70}
            shadow-camera-top={70}
            shadow-camera-bottom={-70}
            shadow-bias={-0.0001}
          />
          <hemisphereLight args={['#bae6fd', '#dcfce7', 0.5]} />

          {/* Campus Ground Plane & Landscaping */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
            <planeGeometry args={[220, 220]} />
            <meshStandardMaterial color="#e2ebd8" roughness={0.9} metalness={0.05} />
          </mesh>

          {/* Subtle Ground Grid for spatial orientation */}
          <Grid
            args={[200, 200]}
            sectionSize={10}
            cellSize={2}
            cellColor="#cbd5e1"
            sectionColor="#94a3b8"
            fadeDistance={110}
            fadeStrength={1}
            position={[0, 0.01, 0]}
          />

          {/* Path Nodes & Edge Tubes */}
          <PathwaySegments3D
            edges={routeEdges}
            nodes={routeNodes}
            activeEdgeIds={activePathEdgeIds}
          />

          {/* Distinct 3D Start & End Markers (A & B) */}
          <StartEndMarkers3D
            startNode={startNode}
            endNode={endNode}
            startLabel={startLabel}
            endLabel={endLabel}
          />

          {/* Interactive Buildings with clean label rendering */}
          {buildings.map((building) => (
            <BuildingMesh
              key={building.id}
              building={building}
              isSelected={selectedBuilding?.id === building.id}
              showAllLabels={showAllLabels}
              onSelect={(b) => onSelectBuilding(b)}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* Selected Building Details Card (Bottom Right Floating Sheet) */}
      {selectedBuilding && (
        <div className="absolute bottom-4 right-4 z-20 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedBuilding.mapNumber && (
                  <span
                    className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] shadow-xs shrink-0"
                    title={`Signboard Index #${selectedBuilding.mapNumber}`}
                  >
                    {selectedBuilding.mapNumber}
                  </span>
                )}
                <span className="font-bold text-slate-900 text-base leading-tight">
                  {selectedBuilding.name}
                </span>
              </div>
              <div className="text-xs text-slate-500 capitalize mt-1 flex items-center gap-2">
                <span>{selectedBuilding.category.replace('_', ' ')}</span>
                {selectedBuilding.mapSection && (
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 uppercase font-semibold">
                    {selectedBuilding.mapSection.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onSelectBuilding(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-sm font-bold"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          <div className="mb-2.5">
            <VerificationBadge status={selectedBuilding.verificationStatus} size="sm" />
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {selectedBuilding.description}
          </p>

          {/* Quick Route Actions */}
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              {onSetStartBuilding ? (
                <button
                  type="button"
                  onClick={() => onSetStartBuilding(selectedBuilding)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl border border-emerald-200 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Start Here</span>
                </button>
              ) : (
                <Link
                  to={`/navigate?from=${selectedBuilding.id}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl border border-emerald-200 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Start Here</span>
                </Link>
              )}

              {onSetDestinationBuilding ? (
                <button
                  type="button"
                  onClick={() => onSetDestinationBuilding(selectedBuilding)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Route Here</span>
                </button>
              ) : (
                <Link
                  to={`/navigate?to=${selectedBuilding.id}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Route Here</span>
                </Link>
              )}
            </div>

            <Link
              to={`/building/${selectedBuilding.id}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>View Building Directory Profile</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
