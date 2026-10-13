import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { Building } from '../../types/campus';

interface Props {
  building: Building;
  isSelected: boolean;
  showAllLabels?: boolean;
  onSelect: (b: Building) => void;
}

export const BuildingMesh: React.FC<Props> = ({
  building,
  isSelected,
  showAllLabels = false,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const { x, y, z } = building.position;
  const { width, height, depth } = building.dimensions;

  // Base color handling
  const baseColor = building.color || '#6d28d9';
  const displayColor = isSelected ? '#0d9488' : hovered ? '#9333ea' : baseColor;

  const shouldShowFullLabel = isSelected || hovered || showAllLabels;

  return (
    <group position={[x, y, z]}>
      {/* Selection indicator halo */}
      {isSelected && (
        <>
          <mesh position={[0, -y + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[
                Math.max(width, depth) * 0.65,
                Math.max(width, depth) * 0.85,
                32,
              ]}
            />
            <meshBasicMaterial
              color="#0d9488"
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Subtle vertical selection beacon pillar */}
          <mesh position={[0, height / 2 + 1, 0]}>
            <cylinderGeometry args={[0.08, 0.08, height + 2, 8]} />
            <meshBasicMaterial color="#14b8a6" transparent opacity={0.5} />
          </mesh>
        </>
      )}

      {/* Main Building Body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect(building);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={displayColor}
          roughness={0.3}
          metalness={0.1}
          emissive={isSelected ? '#0f766e' : hovered ? '#581c87' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Stylized Roof Trim (Only for physical building structures, not ground/court areas) */}
      {height > 1.5 && (
        <>
          <mesh position={[0, height / 2 + 0.15, 0]} castShadow>
            <boxGeometry args={[width + 0.6, 0.3, depth + 0.6]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>

          {/* Glass Windows simulation band */}
          <mesh position={[0, 0, depth / 2 + 0.05]}>
            <boxGeometry args={[width * 0.8, height * 0.5, 0.1]} />
            <meshStandardMaterial
              color="#93c5fd"
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </>
      )}

      {/* 3D Billboard Label: Clean & Uncluttered */}
      <Html
        position={[0, height / 2 + 1.8, 0]}
        center
        distanceFactor={55}
        occlude={false}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(building);
          }}
          className="cursor-pointer select-none transition-transform"
        >
          {shouldShowFullLabel ? (
            /* Full readable label badge */
            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-teal-700 text-white border-teal-300 scale-110 ring-4 ring-teal-200/60 shadow-teal-900/30'
                  : hovered
                  ? 'bg-purple-900 text-white border-purple-400 scale-105 shadow-purple-950/30'
                  : 'bg-white/95 text-slate-800 border-slate-300 shadow-slate-400/30'
              }`}
            >
              {building.mapNumber && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[9px] shadow-xs shrink-0">
                  {building.mapNumber}
                </span>
              )}
              <span>{building.name}</span>
            </div>
          ) : (
            /* Compact minimal badge when not selected/hovered to avoid visual congestion */
            <div
              className="w-5 h-5 rounded-full bg-white/90 border border-slate-300 shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-700 hover:scale-125 transition-transform"
              title={building.name}
            >
              {building.mapNumber ? (
                <span className="text-red-600 font-extrabold">
                  {building.mapNumber}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-purple-700" />
              )}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
