import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getBoucleTexture } from '../materials/proceduralTextures';
import type { ModelCustomizationProps } from './LeatherArmchairModel';

export const VelvetAccentChairModel: React.FC<ModelCustomizationProps> = ({
  colorHex = '#C8C2BA', // Beige/grey luxury woven texture
  metalHex = '#E0E0E0', // Polished silver legs
  dimensionsCm,
}) => {
  const w = (dimensionsCm?.w || 80) / 100;
  const d = (dimensionsCm?.d || 82) / 100;
  const h = (dimensionsCm?.h || 82) / 100;

  const fabricTexture = useMemo(() => getBoucleTexture(), []);

  const fabricMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorHex),
        bumpMap: fabricTexture,
        bumpScale: 0.003,
        roughness: 0.75,
        sheen: 0.45,
        sheenColor: new THREE.Color('#FFFFFF'),
        metalness: 0.04,
      }),
    [colorHex, fabricTexture]
  );

  // Distinctive vertical black arm accent material
  const blackAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#181716',
        roughness: 0.35,
        metalness: 0.1,
      }),
    []
  );

  // Polished silver metal legs
  const silverLegMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(metalHex),
        metalness: 0.96,
        roughness: 0.12,
      }),
    [metalHex]
  );

  const seatHeight = h * 0.44;
  const seatThickness = 0.15;
  const armWidth = 0.13;
  const backThickness = 0.14;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Seat Cushion */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, seatHeight, 0.02]}
        material={fabricMaterial}
        args={[w - armWidth * 2, seatThickness, d - backThickness * 1.1]}
        radius={0.035}
        smoothness={4}
      />

      {/* 2. Seat Under-Frame */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, seatHeight - seatThickness * 0.7, 0.02]}
        material={fabricMaterial}
        args={[w - armWidth * 1.8, seatThickness * 0.6, d - backThickness * 1.1]}
        radius={0.02}
        smoothness={3}
      />

      {/* 3. Curved Backrest */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, seatHeight + (h - seatHeight) * 0.48, -d * 0.36]}
        rotation={[-0.08, 0, 0]}
        material={fabricMaterial}
        args={[w - armWidth * 1.6, h - seatHeight, backThickness]}
        radius={0.045}
        smoothness={4}
      />

      {/* 4. Matching Loose Back Cushion */}
      <RoundedBox
        castShadow
        position={[0, seatHeight + 0.18, -d * 0.22]}
        rotation={[-0.14, 0, 0]}
        material={fabricMaterial}
        args={[w - armWidth * 2.1, (h - seatHeight) * 0.76, 0.11]}
        radius={0.04}
        smoothness={4}
      />

      {/* 5. Left Armrest with Front Black Vertical Stripe */}
      <group position={[-(w * 0.5 - armWidth * 0.5), seatHeight + 0.11, 0]}>
        <RoundedBox
          castShadow
          receiveShadow
          material={fabricMaterial}
          args={[armWidth, h * 0.52, d * 0.88]}
          radius={0.035}
          smoothness={4}
        />
        {/* Black Vertical Stripe on Front Face */}
        <mesh position={[0, -0.02, d * 0.44 + 0.001]} material={blackAccentMaterial}>
          <boxGeometry args={[armWidth * 0.5, h * 0.46, 0.004]} />
        </mesh>
      </group>

      {/* 6. Right Armrest with Front Black Vertical Stripe */}
      <group position={[w * 0.5 - armWidth * 0.5, seatHeight + 0.11, 0]}>
        <RoundedBox
          castShadow
          receiveShadow
          material={fabricMaterial}
          args={[armWidth, h * 0.52, d * 0.88]}
          radius={0.035}
          smoothness={4}
        />
        {/* Black Vertical Stripe on Front Face */}
        <mesh position={[0, -0.02, d * 0.44 + 0.001]} material={blackAccentMaterial}>
          <boxGeometry args={[armWidth * 0.5, h * 0.46, 0.004]} />
        </mesh>
      </group>

      {/* 7. Polished Silver Metal Legs */}
      {[
        [-w * 0.4, d * 0.36],
        [w * 0.4, d * 0.36],
        [-w * 0.4, -d * 0.36],
        [w * 0.4, -d * 0.36],
      ].map(([x, z], idx) => (
        <mesh
          key={`leg-${idx}`}
          castShadow
          position={[x, (seatHeight - seatThickness) * 0.5, z]}
          rotation={[z > 0 ? 0.08 : -0.08, 0, x > 0 ? 0.06 : -0.06]}
          material={silverLegMaterial}
        >
          <cylinderGeometry
            args={[0.015, 0.01, seatHeight - seatThickness, 16]}
          />
        </mesh>
      ))}
    </group>
  );
};
