import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface DimensionOverlayProps {
  dimensionsCm: { w: number; d: number; h: number };
}

export const DimensionOverlay: React.FC<DimensionOverlayProps> = ({ dimensionsCm }) => {
  const w = dimensionsCm.w / 100;
  const d = dimensionsCm.d / 100;
  const h = dimensionsCm.h / 100;

  const halfW = w * 0.5;
  const halfD = d * 0.5;

  return (
    <group>
      {/* 1. Subtle Bounding Box Edges */}
      <lineSegments position={[0, h * 0.5, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w + 0.04, h + 0.02, d + 0.04)]} />
        <lineBasicMaterial color="#C5A059" transparent opacity={0.35} />
      </lineSegments>

      {/* 2. Width Label (Front X Axis) */}
      <Html position={[0, -0.04, halfD + 0.12]} center distanceFactor={5}>
        <div className="px-2 py-0.5 rounded-full bg-marble-50/90 text-charcoal-dark font-mono text-[11px] font-bold border border-gold/40 shadow-sm whitespace-nowrap">
          W: {dimensionsCm.w} cm
        </div>
      </Html>

      {/* 3. Depth Label (Side Z Axis) */}
      <Html position={[halfW + 0.12, -0.04, 0]} center distanceFactor={5}>
        <div className="px-2 py-0.5 rounded-full bg-marble-50/90 text-charcoal-dark font-mono text-[11px] font-bold border border-gold/40 shadow-sm whitespace-nowrap">
          D: {dimensionsCm.d} cm
        </div>
      </Html>

      {/* 4. Height Label (Top Y Axis) */}
      <Html position={[-halfW - 0.12, h * 0.5, 0]} center distanceFactor={5}>
        <div className="px-2 py-0.5 rounded-full bg-marble-50/90 text-charcoal-dark font-mono text-[11px] font-bold border border-gold/40 shadow-sm whitespace-nowrap">
          H: {dimensionsCm.h} cm
        </div>
      </Html>
    </group>
  );
};
