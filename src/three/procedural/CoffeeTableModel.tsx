import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getWoodGrainTexture } from '../materials/proceduralTextures';
import type { ModelCustomizationProps } from './LeatherArmchairModel';

export const CoffeeTableModel: React.FC<ModelCustomizationProps> = ({
  woodHex,
  colorHex,
  dimensionsCm,
}) => {
  const activeWood = woodHex || colorHex || '#5A3E28';
  const w = (dimensionsCm?.w || 120) / 100;
  const d = (dimensionsCm?.d || 65) / 100;
  const h = (dimensionsCm?.h || 45) / 100;

  const woodTexture = useMemo(() => getWoodGrainTexture(activeWood), [activeWood]);

  const woodMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(activeWood),
        map: woodTexture,
        roughness: 0.28,
        clearcoat: 0.7,
        clearcoatRoughness: 0.2,
        metalness: 0.03,
      }),
    [activeWood, woodTexture]
  );

  // Recessed accent shadow material for top reveal groove
  const grooveMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#24170E',
      }),
    []
  );

  const topThickness = 0.035;
  const shelfThickness = 0.025;
  const legThickness = 0.045;
  const legInsetX = w * 0.5 - legThickness * 0.5 - 0.04;
  const legInsetZ = d * 0.5 - legThickness * 0.5 - 0.04;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Table Top */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, h - topThickness * 0.5, 0]}
        material={woodMaterial}
        args={[w, topThickness, d]}
        radius={0.012}
        smoothness={4}
      />

      {/* 2. Recessed Top Frame Line / Reveal Groove */}
      <mesh position={[0, h - topThickness * 0.5 - 0.002, 0]} material={grooveMaterial}>
        <boxGeometry args={[w - 0.02, 0.005, d - 0.02]} />
      </mesh>

      {/* 3. Open Lower Storage Shelf */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, h * 0.32, 0]}
        material={woodMaterial}
        args={[w - legThickness * 2 - 0.06, shelfThickness, d - legThickness * 2 - 0.06]}
        radius={0.008}
        smoothness={3}
      />

      {/* 4. Four Squared Sturdy Wooden Legs */}
      {[
        [-legInsetX, legInsetZ],
        [legInsetX, legInsetZ],
        [-legInsetX, -legInsetZ],
        [legInsetX, -legInsetZ],
      ].map(([x, z], idx) => (
        <RoundedBox
          key={`leg-${idx}`}
          castShadow
          position={[x, (h - topThickness) * 0.5, z]}
          material={woodMaterial}
          args={[legThickness, h - topThickness, legThickness]}
          radius={0.006}
          smoothness={2}
        />
      ))}
    </group>
  );
};
