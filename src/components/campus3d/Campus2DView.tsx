import React, { useState } from 'react';
import { Building, RouteEdge, RouteNode } from '../../types/campus';
import { Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Props {
  buildings: Building[];
  routeNodes: RouteNode[];
  routeEdges: RouteEdge[];
  selectedBuilding: Building | null;
  onSelectBuilding: (b: Building) => void;
  activePathEdgeIds?: string[];
  startNode?: RouteNode | null;
  endNode?: RouteNode | null;
}

export const Campus2DView: React.FC<Props> = ({
  buildings,
  routeNodes,
  routeEdges,
  selectedBuilding,
  onSelectBuilding,
  activePathEdgeIds = [],
  startNode = null,
  endNode = null,
}) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Coordinate transform: map 3D units to SVG coordinate space
  // Campus range: X [-30..+30], Z [-50..+35]
  const toSvgX = (x: number) => 400 + x * 9.5;
  const toSvgY = (z: number) => 430 + z * 7.2;

  const handleZoomIn = () => setScale((s) => Math.min(2.2, s + 0.2));
  const handleZoomOut = () => setScale((s) => Math.max(0.6, s - 0.2));
  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full bg-slate-50 flex flex-col items-center justify-center overflow-hidden border border-slate-200 rounded-2xl select-none">
      {/* 2D Schematic Header Badge */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-700">
        <Layers className="w-4 h-4 text-teal-600" />
        <span>2D Schematic View</span>
      </div>

      {/* 2D Zoom Controls Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 text-slate-700 hover:text-purple-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 text-slate-700 hover:text-purple-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          title="Reset View"
          className="p-1.5 text-slate-700 hover:text-purple-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <svg
        viewBox="0 0 800 800"
        className="w-full h-full max-h-[750px] transition-transform duration-200"
        style={{
          transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
          background: '#f8fafc',
        }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Background Grid */}
        <rect width="800" height="800" fill="url(#grid)" />

        {/* Campus Outer Boundary Lawn Simulation */}
        <circle cx="400" cy="400" r="360" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />

        {/* Route Edges */}
        <g id="route-edges">
          {routeEdges.map((edge) => {
            const sourceNode = routeNodes.find((n) => n.id === edge.source);
            const targetNode = routeNodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const x1 = toSvgX(sourceNode.coordinates.x);
            const y1 = toSvgY(sourceNode.coordinates.z);
            const x2 = toSvgX(targetNode.coordinates.x);
            const y2 = toSvgY(targetNode.coordinates.z);

            const isRouteActive = activePathEdgeIds.includes(edge.id);

            let strokeColor = '#94a3b8'; // default road
            let strokeWidth = 3;
            let strokeDasharray = undefined;

            if (edge.stairsPresent) {
              strokeColor = '#f43f5e'; // red for stairs
              strokeDasharray = '5 3';
              strokeWidth = 3.5;
            } else if (edge.rampVerified) {
              strokeColor = '#0d9488'; // teal for ramp
              strokeWidth = 4;
            } else if (edge.stepFree) {
              strokeColor = '#14b8a6'; // teal-500
              strokeWidth = 3.5;
            }

            if (isRouteActive) {
              strokeColor = '#7c3aed'; // vibrant purple when part of active navigated route
              strokeWidth = 7;
              strokeDasharray = undefined;
            }

            return (
              <g key={edge.id} className="cursor-pointer group">
                {/* Glowing underlay for active route */}
                {isRouteActive && (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#c084fc"
                    strokeWidth="14"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                )}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>

        {/* Route Nodes */}
        <g id="route-nodes">
          {routeNodes.map((node) => {
            const cx = toSvgX(node.coordinates.x);
            const cy = toSvgY(node.coordinates.z);
            const isStair = node.type === 'stair';
            const isRamp = node.type === 'ramp';

            return (
              <circle
                key={node.id}
                cx={cx}
                cy={cy}
                r={isStair || isRamp ? 4.5 : 3.5}
                fill={isStair ? '#f43f5e' : isRamp ? '#0d9488' : '#64748b'}
                stroke="#ffffff"
                strokeWidth="1.5"
              >
                <title>{`${node.name} (${node.type})`}</title>
              </circle>
            );
          })}
        </g>

        {/* Buildings 2D Footprints */}
        <g id="buildings-footprints">
          {buildings.map((bldg) => {
            const cx = toSvgX(bldg.position.x);
            const cy = toSvgY(bldg.position.z);
            const w = bldg.dimensions.width * 9;
            const h = bldg.dimensions.depth * 9;
            const x = cx - w / 2;
            const y = cy - h / 2;

            const isSelected = selectedBuilding?.id === bldg.id;
            const fillColor = isSelected ? '#581c87' : bldg.color || '#6d28d9';

            return (
              <g
                key={bldg.id}
                onClick={() => onSelectBuilding(bldg)}
                className="cursor-pointer transition-transform hover:opacity-90"
              >
                {/* Building Footprint */}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="6"
                  fill={fillColor}
                  stroke={isSelected ? '#14b8a6' : '#334155'}
                  strokeWidth={isSelected ? 4 : 2}
                  className="filter drop-shadow-sm"
                />

                {/* Map Number Circle Indicator */}
                {bldg.mapNumber && (
                  <g>
                    <circle
                      cx={x + 10}
                      cy={y + 10}
                      r="7"
                      fill="#dc2626"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + 10}
                      y={y + 13}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="bold"
                      className="pointer-events-none select-none font-sans"
                    >
                      {bldg.mapNumber}
                    </text>
                  </g>
                )}

                {/* Building Code & Name Badge */}
                <text
                  x={cx}
                  y={cy - 2}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none select-none font-sans"
                >
                  {bldg.name.length > 18 ? `${bldg.name.substring(0, 16)}...` : bldg.name}
                </text>

                <text
                  x={cx}
                  y={cy + 10}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="7.5"
                  className="pointer-events-none select-none font-sans"
                >
                  #{bldg.mapNumber || bldg.code || bldg.id}
                </text>
              </g>
            );
          })}
        </g>

        {/* Start (A) Marker Overlay */}
        {startNode && (
          <g transform={`translate(${toSvgX(startNode.coordinates.x)}, ${toSvgY(startNode.coordinates.z)})`}>
            <circle cx="0" cy="0" r="14" fill="#059669" stroke="#ffffff" strokeWidth="2.5" className="filter drop-shadow-md" />
            <text x="0" y="4.5" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900" className="pointer-events-none select-none">
              A
            </text>
          </g>
        )}

        {/* Destination (B) Marker Overlay */}
        {endNode && (
          <g transform={`translate(${toSvgX(endNode.coordinates.x)}, ${toSvgY(endNode.coordinates.z)})`}>
            <circle cx="0" cy="0" r="14" fill="#6b21a8" stroke="#ffffff" strokeWidth="2.5" className="filter drop-shadow-md" />
            <text x="0" y="4.5" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900" className="pointer-events-none select-none">
              B
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
