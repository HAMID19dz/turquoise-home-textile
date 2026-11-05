import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getWoodGrainTexture, getBoucleTexture } from '../materials/proceduralTextures';
import type { ModelCustomizationProps } from './LeatherArmchairModel';

export const OvalDiningSetModel: React.FC<ModelCustomizationProps> = ({
  woodHex = '#4A3423',   // Warm polished walnut
  colorHex = '#D2CCC4',  // Grey-beige fabric for chairs
  metalHex = '#D4AF37',  // 24k gold for candle holder
  dimensionsCm,
}) => {
  const w = (dimensionsCm?.w || 220) / 100;
  const d = (dimensionsCm?.d || 110) / 100;
  const h = (dimensionsCm?.h || 76) / 100;

  const woodTexture = useMemo(() => getWoodGrainTexture(woodHex), [woodHex]);
  const fabricTexture = useMemo(() => getBoucleTexture(), []);

  const glossyWoodMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(woodHex),
        map: woodTexture,
        roughness: 0.22,
        clearcoat: 0.85,
        clearcoatRoughness: 0.15,
        metalness: 0.05,
      }),
    [woodHex, woodTexture]
  );

  const chairWoodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(woodHex),
        map: woodTexture,
        roughness: 0.38,
        metalness: 0.04,
      }),
    [woodHex, woodTexture]
  );

  const chairFabricMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        bumpMap: fabricTexture,
        bumpScale: 0.003,
        roughness: 0.82,
      }),
    [colorHex, fabricTexture]
  );

  const goldCandleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(metalHex),
        metalness: 0.94,
        roughness: 0.24,
      }),
    [metalHex]
  );

  const runnerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#FCFBF9',
        roughness: 0.7,
      }),
    []
  );

  const topThickness = 0.045;
  const pedestalRadius = 0.24;

  return (
    <group position={[0, 0, 0]}>
      {/* ================= TABLE ================= */}
      <group position={[0, h - topThickness * 0.5, 0]}>
        {/* Oval Table Top (Cylinder scaled along X and Z) */}
        <mesh
          castShadow
          receiveShadow
          scale={[w * 0.5, 1, d * 0.5]}
          material={glossyWoodMaterial}
        >
          <cylinderGeometry args={[1, 1, topThickness, 64]} />
        </mesh>

        {/* White Luxury Fabric Center Runner */}
        <mesh
          position={[0, topThickness * 0.5 + 0.001, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={runnerMaterial}
        >
          <planeGeometry args={[w * 0.85, d * 0.3]} />
        </mesh>

        {/* Gold Candle Holder on Runner */}
        <group position={[0, topThickness * 0.5 + 0.002, 0]}>
          {/* Base */}
          <mesh material={goldCandleMaterial}>
            <cylinderGeometry args={[0.07, 0.09, 0.015, 32]} />
          </mesh>
          {/* Center Stem */}
          <mesh position={[0, 0.07, 0]} material={goldCandleMaterial}>
            <cylinderGeometry args={[0.012, 0.018, 0.13, 16]} />
          </mesh>
          {/* 3 Arms */}
          {[-0.08, 0, 0.08].map((offset, i) => (
            <group key={`candle-${i}`} position={[offset, 0.13, 0]}>
              <mesh material={goldCandleMaterial}>
                <cylinderGeometry args={[0.02, 0.015, 0.03, 16]} />
              </mesh>
              {/* White Candle Stick */}
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.1, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
              </mesh>
              {/* Golden Candle Flame Glow */}
              <mesh position={[0, 0.12, 0]}>
                <sphereGeometry args={[0.007, 12, 12]} />
                <meshBasicMaterial color="#FFB347" />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Wide Cylindrical Wooden Pedestal */}
      <mesh
        castShadow
        receiveShadow
        position={[0, (h - topThickness) * 0.5, 0]}
        material={glossyWoodMaterial}
      >
        <cylinderGeometry
          args={[pedestalRadius * 0.9, pedestalRadius * 1.15, h - topThickness, 36]}
        />
      </mesh>

      {/* Pedestal Bottom Base Plinth */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.03, 0]}
        material={glossyWoodMaterial}
      >
        <cylinderGeometry args={[pedestalRadius * 1.5, pedestalRadius * 1.6, 0.06, 48]} />
      </mesh>

      {/* ================= 6 DINING CHAIRS ================= */}
      {[
        // Front Long Side (2 chairs)
        { x: -w * 0.24, z: d * 0.68, rotY: 0 },
        { x: w * 0.24, z: d * 0.68, rotY: 0 },
        // Back Long Side (2 chairs)
        { x: -w * 0.24, z: -d * 0.68, rotY: Math.PI },
        { x: w * 0.24, z: -d * 0.68, rotY: Math.PI },
        // Left Head (1 chair)
        { x: -w * 0.58, z: 0, rotY: Math.PI / 2 },
        // Right Foot (1 chair)
        { x: w * 0.58, z: 0, rotY: -Math.PI / 2 },
      ].map((pos, idx) => (
        <group
          key={`chair-${idx}`}
          position={[pos.x, 0, pos.z]}
          rotation={[0, pos.rotY, 0]}
        >
          {/* Chair Seat Base */}
          <RoundedBox
            castShadow
            position={[0, 0.44, 0]}
            material={chairFabricMaterial}
            args={[0.46, 0.07, 0.44]}
            radius={0.03}
            smoothness={3}
          />

          {/* Curved Padded Backrest */}
          <RoundedBox
            castShadow
            position={[0, 0.72, -0.2]}
            rotation={[-0.06, 0, 0]}
            material={chairFabricMaterial}
            args={[0.44, 0.46, 0.06]}
            radius={0.04}
            smoothness={3}
          />

          {/* 4 Wooden Tapered Legs */}
          {[
            [-0.18, 0.16],
            [0.18, 0.16],
            [-0.18, -0.16],
            [0.18, -0.16],
          ].map(([lx, lz], legIdx) => (
            <mesh
              key={`leg-${legIdx}`}
              castShadow
              position={[lx, 0.2, lz]}
              rotation={[lz > 0 ? 0.05 : -0.05, 0, lx > 0 ? 0.05 : -0.05]}
              material={chairWoodMaterial}
            >
              <cylinderGeometry args={[0.016, 0.01, 0.4, 12]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};
