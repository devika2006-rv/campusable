import React from 'react';
import { Html } from '@react-three/drei';
import { RouteNode } from '../../types/campus';

interface Props {
  startNode: RouteNode | null;
  endNode: RouteNode | null;
  startLabel?: string;
  endLabel?: string;
}

export const StartEndMarkers3D: React.FC<Props> = ({
  startNode,
  endNode,
  startLabel,
  endLabel,
}) => {
  return (
    <group>
      {/* Starting Point Marker A */}
      {startNode && (
        <group position={[startNode.coordinates.x, 0.2, startNode.coordinates.z]}>
          {/* Ground Pulsing Target Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.8, 32]} />
            <meshBasicMaterial color="#059669" transparent opacity={0.7} />
          </mesh>

          {/* Vertical Pin Cylinder */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 16]} />
            <meshStandardMaterial color="#059669" roughness={0.3} />
          </mesh>

          {/* Floating Marker Sphere */}
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial
              color="#059669"
              emissive="#047857"
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Billboard HTML Pin Badge */}
          <Html position={[0, 4.4, 0]} center distanceFactor={50} occlude={false}>
            <div className="flex flex-col items-center pointer-events-none select-none">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-4 h-4 rounded-full bg-white text-emerald-800 flex items-center justify-center font-black text-[10px]">
                  A
                </span>
                <span>Start: {startLabel || startNode.name}</span>
              </div>
              <div className="w-2.5 h-2.5 bg-emerald-600 rotate-45 -mt-1.5 border-r-2 border-b-2 border-white shadow-sm" />
            </div>
          </Html>
        </group>
      )}

      {/* Destination Point Marker B */}
      {endNode && (
        <group position={[endNode.coordinates.x, 0.2, endNode.coordinates.z]}>
          {/* Ground Target Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.8, 32]} />
            <meshBasicMaterial color="#6b21a8" transparent opacity={0.7} />
          </mesh>

          {/* Vertical Pin Cylinder */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 16]} />
            <meshStandardMaterial color="#6b21a8" roughness={0.3} />
          </mesh>

          {/* Floating Marker Sphere */}
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial
              color="#7e22ce"
              emissive="#6b21a8"
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Billboard HTML Pin Badge */}
          <Html position={[0, 4.4, 0]} center distanceFactor={50} occlude={false}>
            <div className="flex flex-col items-center pointer-events-none select-none">
              <div className="px-3 py-1.5 rounded-xl bg-purple-900 text-white font-extrabold text-xs shadow-xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-4 h-4 rounded-full bg-white text-purple-950 flex items-center justify-center font-black text-[10px]">
                  B
                </span>
                <span>Destination: {endLabel || endNode.name}</span>
              </div>
              <div className="w-2.5 h-2.5 bg-purple-900 rotate-45 -mt-1.5 border-r-2 border-b-2 border-white shadow-sm" />
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};
