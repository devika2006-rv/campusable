import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Building, RouteEdge, RouteNode } from '../../types/campus';
import { BuildingMesh } from './BuildingMesh';
import { CompassRose } from './CompassRose';
import { SceneLegend } from './SceneLegend';
import { Campus2DView } from './Campus2DView';
import { VerificationBadge } from '../layout/VerificationBadge';
import { Link } from 'react-router-dom';
import {
  Maximize2,
  RotateCcw,
  Layers,
  Box,
  Navigation,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  buildings: Building[];
  routeNodes: RouteNode[];
  routeEdges: RouteEdge[];
  selectedBuilding: Building | null;
  onSelectBuilding: (b: Building | null) => void;
  activePathEdgeIds?: string[];
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

        let color = '#94a3b8'; // road/walkway
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
          color = '#7c3aed'; // active route purple
          radius = 0.6;
        }

        // Draw tube geometry between points
        const curve = new THREE.LineCurve3(p1, p2);
        const tubeGeom = new THREE.TubeGeometry(curve, 8, radius, 8, false);

        return (
          <mesh key={edge.id} geometry={tubeGeom}>
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.1}
              emissive={isActive ? '#6d28d9' : '#000000'}
              emissiveIntensity={isActive ? 0.4 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export const CampusCanvas: React.FC<Props> = ({
  buildings,
  routeNodes,
  routeEdges,
  selectedBuilding,
  onSelectBuilding,
  activePathEdgeIds = [],
}) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [webglError, setWebglError] = useState(false);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (viewMode === '2d' || webglError) {
    return (
      <div className="relative w-full h-full min-h-[500px]">
        {/* Toggle Mode Bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200">
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '3d'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Explorer</span>
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '2d'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
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
        />

        <SceneLegend />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[550px] bg-gradient-to-b from-sky-100 to-slate-200 overflow-hidden select-none">
      {/* View Switcher and Controls Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200">
        <button
          onClick={() => setViewMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === '3d'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Explorer</span>
        </button>
        <button
          onClick={() => setViewMode('2d')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-slate-600 hover:text-slate-900"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D Schematic</span>
        </button>
      </div>

      {/* Floating Action Controls */}
      <div className="absolute top-4 right-16 z-20 flex items-center gap-2">
        <button
          onClick={resetCamera}
          title="Reset Camera Angle"
          className="p-2.5 bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 hover:text-purple-800 rounded-xl shadow-md border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Reset Camera Angle"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <CompassRose onResetHeading={resetCamera} />
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
            minDistance={15}
            maxDistance={200}
            enableDamping
            dampingFactor={0.06}
          />

          {/* Lighting */}
          <ambientLight intensity={0.65} />
          <directionalLight
            position={[40, 70, 30]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={200}
            shadow-camera-left={-60}
            shadow-camera-right={60}
            shadow-camera-top={60}
            shadow-camera-bottom={-60}
            shadow-bias={-0.0001}
          />
          <hemisphereLight args={['#bae6fd', '#dcfce7', 0.5]} />

          {/* Campus Ground Plane & Landscaping */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#e2ebd8" roughness={0.9} metalness={0.05} />
          </mesh>

          {/* Ground Grid for spatial orientation */}
          <Grid
            args={[180, 180]}
            sectionSize={10}
            cellSize={2}
            cellColor="#cbd5e1"
            sectionColor="#94a3b8"
            fadeDistance={100}
            fadeStrength={1}
            position={[0, 0.01, 0]}
          />

          {/* Path Nodes & Edge Tubes */}
          <PathwaySegments3D
            edges={routeEdges}
            nodes={routeNodes}
            activeEdgeIds={activePathEdgeIds}
          />

          {/* Interactive Buildings */}
          {buildings.map((building) => (
            <BuildingMesh
              key={building.id}
              building={building}
              isSelected={selectedBuilding?.id === building.id}
              onSelect={(b) => onSelectBuilding(b)}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* Selected Building Details Overlay Card */}
      {selectedBuilding && (
        <div className="absolute bottom-4 right-4 z-20 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedBuilding.mapNumber && (
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] shadow-xs shrink-0" title={`Signboard Index #${selectedBuilding.mapNumber}`}>
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
                  <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px] text-slate-600 uppercase font-semibold">
                    {selectedBuilding.mapSection.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onSelectBuilding(null)}
              className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          <div className="mb-3">
            <VerificationBadge status={selectedBuilding.verificationStatus} size="sm" />
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {selectedBuilding.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              to={`/building/${selectedBuilding.id}`}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-800 hover:bg-purple-900 text-white font-medium rounded-xl transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Full Details</span>
            </Link>
            <Link
              to={`/navigate?to=${selectedBuilding.id}`}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route Here</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
