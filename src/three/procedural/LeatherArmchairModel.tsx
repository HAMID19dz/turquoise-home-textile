import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getLeatherGrainTexture } from '../materials/proceduralTextures';

export interface ModelCustomizationProps {
  colorHex?: string;
  metalHex?: string;
  woodHex?: string;
  scaleFactors?: { x: number; y: number; z: number }; // Relative scale
  dimensionsCm?: { w: number; d: number; h: number };
}

export const LeatherArmchairModel: React.FC<ModelCustomizationProps> = ({
  colorHex = '#B5ABA0', // Default light taupe leather from showroom photo
  metalHex = '#222225', // Dark angular gunmetal legs
  dimensionsCm,
}) => {
  // Convert cm to meters (default 90 x 85 x 80)
  const w = (dimensionsCm?.w || 90) / 100;
  const d = (dimensionsCm?.d || 85) / 100;
  const h = (dimensionsCm?.h || 80) / 100;

  const leatherTexture = useMemo(() => getLeatherGrainTexture(), []);

  const leatherMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorHex),
        bumpMap: leatherTexture,
        bumpScale: 0.003,
        roughness: 0.42,
        clearcoat: 0.18,
        clearcoatRoughness: 0.4,
        metalness: 0.04,
      }),
    [colorHex, leatherTexture]
  );

  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(metalHex),
        metalness: 0.92,
        roughness: 0.22,
      }),
    [metalHex]
  );

  const seatHeight = h * 0.45;
  const seatThickness = 0.14;
  const armWidth = 0.16;
  const backThickness = 0.16;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Seat Base Cushion */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, seatHeight, 0.02]}
        material={leatherMaterial}
        args={[w - armWidth * 1.8, seatThickness, d - backThickness * 1.2]}
        radius={0.035}
        smoothness={4}
      />

      {/* 2. Seat Lower Frame */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, seatHeight - seatThickness * 0.7, 0.02]}
        material={leatherMaterial}
        args={[w - armWidth * 1.8, seatThickness * 0.6, d - backThickness * 1.2]}
        radius={0.02}
        smoothness={3}
      />

      {/* 3. Backrest with Center Vertical Tufting/Stitch */}
      <group position={[0, seatHeight + (h - seatHeight) * 0.5, -d * 0.38]}>
        {/* Left half of backrest */}
        <RoundedBox
          castShadow
          receiveShadow
          position={[-((w - armWidth * 2) * 0.25 + 0.005), 0, 0]}
          rotation={[-0.08, 0, 0]}
          material={leatherMaterial}
          args={[(w - armWidth * 2) * 0.5 - 0.01, h - seatHeight, backThickness]}
          radius={0.04}
          smoothness={4}
        />

        {/* Right half of backrest */}
        <RoundedBox
          castShadow
          receiveShadow
          position={[((w - armWidth * 2) * 0.25 + 0.005), 0, 0]}
          rotation={[-0.08, 0, 0]}
          material={leatherMaterial}
          args={[(w - armWidth * 2) * 0.5 - 0.01, h - seatHeight, backThickness]}
          radius={0.04}
          smoothness={4}
        />

        {/* Center Tufting Stitch Line (Dark accent seam) */}
        <mesh position={[0, 0, backThickness * 0.42]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.006, (h - seatHeight) * 0.88, 0.01]} />
          <meshBasicMaterial color="#3A3836" />
        </mesh>
      </group>

      {/* 4. Left Flared Armrest */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[-(w * 0.5 - armWidth * 0.45), seatHeight + 0.12, 0]}
        rotation={[0, 0, -0.06]}
        material={leatherMaterial}
        args={[armWidth, h * 0.55, d * 0.9]}
        radius={0.045}
        smoothness={4}
      />

      {/* 5. Right Flared Armrest */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[w * 0.5 - armWidth * 0.45, seatHeight + 0.12, 0]}
        rotation={[0, 0, 0.06]}
        material={leatherMaterial}
        args={[armWidth, h * 0.55, d * 0.9]}
        radius={0.045}
        smoothness={4}
      />

      {/* 6. Dark Angular Metal Side Legs */}
      {/* Left Front Leg */}
      <mesh
        castShadow
        position={[-(w * 0.5 - 0.04), (seatHeight - seatThickness) * 0.5, d * 0.38]}
        rotation={[0.12, 0, -0.08]}
        material={metalMaterial}
      >
        <boxGeometry args={[0.035, seatHeight - seatThickness, 0.035]} />
      </mesh>

      {/* Left Back Leg */}
      <mesh
        castShadow
        position={[-(w * 0.5 - 0.04), (seatHeight - seatThickness) * 0.5, -d * 0.38]}
        rotation={[-0.14, 0, -0.08]}
        material={metalMaterial}
      >
        <boxGeometry args={[0.035, seatHeight - seatThickness, 0.035]} />
      </mesh>

      {/* Left Side Connecting Bar */}
      <mesh
        position={[-(w * 0.5 - 0.035), 0.06, 0]}
        material={metalMaterial}
      >
        <boxGeometry args={[0.025, 0.02, d * 0.72]} />
      </mesh>

      {/* Right Front Leg */}
      <mesh
        castShadow
        position={[w * 0.5 - 0.04, (seatHeight - seatThickness) * 0.5, d * 0.38]}
        rotation={[0.12, 0, 0.08]}
        material={metalMaterial}
      >
        <boxGeometry args={[0.035, seatHeight - seatThickness, 0.035]} />
      </mesh>

      {/* Right Back Leg */}
      <mesh
        castShadow
        position={[w * 0.5 - 0.04, (seatHeight - seatThickness) * 0.5, -d * 0.38]}
        rotation={[-0.14, 0, 0.08]}
        material={metalMaterial}
      >
        <boxGeometry args={[0.035, seatHeight - seatThickness, 0.035]} />
      </mesh>

      {/* Right Side Connecting Bar */}
      <mesh
        position={[w * 0.5 - 0.035, 0.06, 0]}
        material={metalMaterial}
      >
        <boxGeometry args={[0.025, 0.02, d * 0.72]} />
      </mesh>
    </group>
  );
};
