import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getWoodGrainTexture } from '../materials/proceduralTextures';
import type { ModelCustomizationProps } from './LeatherArmchairModel';

export const SideTableModel: React.FC<ModelCustomizationProps> = ({
  woodHex,
  colorHex,
  metalHex = '#D4AF37', // Polished gold medallion accents
  dimensionsCm,
}) => {
  const activeWood = woodHex || colorHex || '#4A3423';
  const w = (dimensionsCm?.w || 55) / 100;
  const h = (dimensionsCm?.h || 60) / 100;

  const radius = w * 0.5;
  const woodTexture = useMemo(() => getWoodGrainTexture(activeWood), [activeWood]);

  const woodMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(activeWood),
        map: woodTexture,
        roughness: 0.25,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
        metalness: 0.04,
      }),
    [activeWood, woodTexture]
  );

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(metalHex),
        metalness: 0.95,
        roughness: 0.22,
      }),
    [metalHex]
  );

  const topThickness = 0.03;
  const lowerTierRadius = radius * 0.65;
  const legCount = 3;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Round Beveled Table Top */}
      <mesh
        castShadow
        receiveShadow
        position={[0, h - topThickness * 0.5, 0]}
        material={woodMaterial}
      >
        <cylinderGeometry args={[radius, radius * 0.96, topThickness, 48]} />
      </mesh>

      {/* Gold Ring Trim on Edge of Top */}
      <mesh position={[0, h - topThickness * 0.5, 0]} material={goldMaterial}>
        <torusGeometry args={[radius * 0.98, 0.003, 16, 64]} />
      </mesh>

      {/* 2. Circular Lower Tier Shelf */}
      <mesh
        castShadow
        receiveShadow
        position={[0, h * 0.35, 0]}
        material={woodMaterial}
      >
        <cylinderGeometry args={[lowerTierRadius, lowerTierRadius * 0.94, 0.02, 36]} />
      </mesh>

      {/* 3. Tripod Curved Saber Legs with Gold Medallions */}
      {Array.from({ length: legCount }).map((_, idx) => {
        const angle = (idx * Math.PI * 2) / legCount;
        const legRadius = radius * 0.72;
        const x = Math.cos(angle) * legRadius;
        const z = Math.sin(angle) * legRadius;

        return (
          <group key={`leg-${idx}`} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Gold Medallion at Joint with Top */}
            <mesh position={[0, h - topThickness - 0.02, 0]} material={goldMaterial}>
              <sphereGeometry args={[0.016, 16, 16]} />
            </mesh>

            {/* Upper Leg Section */}
            <mesh
              castShadow
              position={[0, (h - topThickness) * 0.65, 0]}
              rotation={[0, 0, 0.08]}
              material={woodMaterial}
            >
              <cylinderGeometry args={[0.018, 0.014, (h - topThickness) * 0.6, 16]} />
            </mesh>

            {/* Lower Flared Saber Leg Section */}
            <mesh
              castShadow
              position={[0.02, (h - topThickness) * 0.2, 0]}
              rotation={[0, 0, -0.1]}
              material={woodMaterial}
            >
              <cylinderGeometry args={[0.014, 0.01, (h - topThickness) * 0.45, 16]} />
            </mesh>

            {/* Gold Foot Cap */}
            <mesh position={[0.04, 0.01, 0]} material={goldMaterial}>
              <cylinderGeometry args={[0.01, 0.008, 0.02, 16]} />
            </mesh>
          </group>
        );
      })}

      {/* Center Pedestal Post */}
      <mesh
        castShadow
        position={[0, (h - topThickness) * 0.5, 0]}
        material={woodMaterial}
      >
        <cylinderGeometry args={[0.035, 0.045, h - topThickness, 24]} />
      </mesh>
    </group>
  );
};
