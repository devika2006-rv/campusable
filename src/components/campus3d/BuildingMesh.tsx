import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { Building } from '../../types/campus';

interface Props {
  building: Building;
  isSelected: boolean;
  onSelect: (b: Building) => void;
}

export const BuildingMesh: React.FC<Props> = ({ building, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const { x, y, z } = building.position;
  const { width, height, depth } = building.dimensions;

  // Base color handling
  const baseColor = building.color || '#6d28d9';
  const displayColor = isSelected ? '#0d9488' : hovered ? '#9333ea' : baseColor;

  return (
    <group position={[x, y, z]}>
      {/* Selection indicator halo */}
      {isSelected && (
        <mesh position={[0, -y + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(width, depth) * 0.65, Math.max(width, depth) * 0.8, 32]} />
          <meshBasicMaterial color="#0d9488" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
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
            <meshStandardMaterial color="#93c5fd" roughness={0.1} metalness={0.8} />
          </mesh>
        </>
      )}

      {/* 3D Billboard Label */}
      <Html
        position={[0, height / 2 + 2, 0]}
        center
        distanceFactor={60}
        occlude={false}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(building);
          }}
          className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold shadow-md transition-all whitespace-nowrap select-none border ${
            isSelected
              ? 'bg-teal-600 text-white border-teal-400 scale-110 ring-2 ring-teal-300'
              : hovered
              ? 'bg-purple-800 text-white border-purple-500 scale-105'
              : 'bg-white/95 text-slate-800 border-slate-300 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {building.mapNumber && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[9px] shadow-xs shrink-0">
                {building.mapNumber}
              </span>
            )}
            {building.code && !building.mapNumber && (
              <span className="px-1 py-0.2 bg-slate-200/80 text-slate-700 rounded text-[10px] font-mono">
                {building.code}
              </span>
            )}
            <span>{building.name}</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
