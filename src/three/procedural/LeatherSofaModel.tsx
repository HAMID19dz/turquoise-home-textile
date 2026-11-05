import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getLeatherGrainTexture } from '../materials/proceduralTextures';
import type { ModelCustomizationProps } from './LeatherArmchairModel';

export const LeatherSofaModel: React.FC<ModelCustomizationProps> = ({
  colorHex = '#B5ABA0',
  metalHex = '#222225',
  dimensionsCm,
}) => {
  const w = (dimensionsCm?.w || 210) / 100;
  const d = (dimensionsCm?.d || 95) / 100;
  const h = (dimensionsCm?.h || 85) / 100;

  const leatherTexture = useMemo(() => getLeatherGrainTexture(), []);

  const leatherMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorHex),
        bumpMap: leatherTexture,
        bumpScale: 0.003,
        roughness: 0.42,
        clearcoat: 0.18,
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

  const cushionFabricMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8E3DC',
        roughness: 0.85,
        bumpScale: 0.002,
      }),
    []
  );

  const seatHeight = h * 0.45;
  const seatThickness = 0.15;
  const armWidth = 0.18;
  const backThickness = 0.17;
  const cushionWidth = (w - armWidth * 2) / 3;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main 3-Seater Cushions */}
      {[-1, 0, 1].map((idx) => (
        <RoundedBox
          key={`seat-${idx}`}
          castShadow
          receiveShadow
          position={[idx * (cushionWidth - 0.01), seatHeight, 0.02]}
          material={leatherMaterial}
          args={[cushionWidth - 0.02, seatThickness, d - backThickness * 1.2]}
          radius={0.035}
          smoothness={4}
        />
      ))}

      {/* 2. Sofa Lower Base Frame */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, seatHeight - seatThickness * 0.7, 0.02]}
        material={leatherMaterial}
        args={[w - armWidth * 1.6, seatThickness * 0.65, d - backThickness * 1.2]}
        radius={0.025}
        smoothness={3}
      />

      {/* 3. Backrest with 3 Segmented Tufted Panels */}
      <group position={[0, seatHeight + (h - seatHeight) * 0.5, -d * 0.38]}>
        {[-1, 0, 1].map((idx) => (
          <group key={`back-${idx}`} position={[idx * cushionWidth, 0, 0]}>
            <RoundedBox
              castShadow
              receiveShadow
              rotation={[-0.08, 0, 0]}
              material={leatherMaterial}
              args={[cushionWidth - 0.02, h - seatHeight, backThickness]}
              radius={0.04}
              smoothness={4}
            />

            {/* Center stitch on each back panel */}
            <mesh position={[0, 0, backThickness * 0.42]} rotation={[-0.08, 0, 0]}>
              <boxGeometry args={[0.006, (h - seatHeight) * 0.88, 0.01]} />
              <meshBasicMaterial color="#3A3836" />
            </mesh>
          </group>
        ))}
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

      {/* 6. Dual Decorative Accent Cushions */}
      <RoundedBox
        castShadow
        position={[-(w * 0.28), seatHeight + 0.14, -d * 0.12]}
        rotation={[0.1, 0.25, -0.15]}
        material={cushionFabricMaterial}
        args={[0.38, 0.38, 0.12]}
        radius={0.04}
        smoothness={4}
      />
      <RoundedBox
        castShadow
        position={[w * 0.28, seatHeight + 0.14, -d * 0.12]}
        rotation={[0.1, -0.25, 0.15]}
        material={cushionFabricMaterial}
        args={[0.38, 0.38, 0.12]}
        radius={0.04}
        smoothness={4}
      />

      {/* 7. Angular Metal Side and Center Legs */}
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

      {/* Center Reinforcement Leg */}
      <mesh
        position={[0, (seatHeight - seatThickness) * 0.5, -0.1]}
        material={metalMaterial}
      >
        <cylinderGeometry args={[0.02, 0.02, seatHeight - seatThickness, 16]} />
      </mesh>
    </group>
  );
};
