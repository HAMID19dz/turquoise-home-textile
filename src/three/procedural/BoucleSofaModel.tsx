import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getBoucleTexture, getWoodGrainTexture } from '../materials/proceduralTextures';
import type { ModelCustomizationProps } from './LeatherArmchairModel';

export const BoucleSofaModel: React.FC<ModelCustomizationProps> = ({
  colorHex = '#F4F0EA', // Cream ivory bouclé
  woodHex = '#5C4033',  // Warm walnut plinth base
  dimensionsCm,
}) => {
  const w = (dimensionsCm?.w || 230) / 100;
  const d = (dimensionsCm?.d || 100) / 100;
  const h = (dimensionsCm?.h || 78) / 100;

  const boucleTexture = useMemo(() => getBoucleTexture(), []);
  const woodTexture = useMemo(() => getWoodGrainTexture(woodHex), [woodHex]);

  const boucleMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorHex),
        bumpMap: boucleTexture,
        bumpScale: 0.005,
        roughness: 0.88,
        sheen: 0.65,
        sheenColor: new THREE.Color('#FFFFFF'),
        metalness: 0.02,
      }),
    [colorHex, boucleTexture]
  );

  const woodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(woodHex),
        map: woodTexture,
        roughness: 0.35,
        metalness: 0.05,
      }),
    [woodHex, woodTexture]
  );

  const plinthHeight = 0.06;
  const seatHeight = h * 0.44;
  const seatThickness = 0.22;
  const backHeight = h - seatHeight;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Warm Wooden Plinth Base */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, plinthHeight * 0.5, 0]}
        material={woodMaterial}
        args={[w * 0.94, plinthHeight, d * 0.82]}
        radius={0.025}
        smoothness={4}
      />

      {/* 2. Deep Rounded Bouclé Main Seat Cushion */}
      <RoundedBox
        castShadow
        receiveShadow
        position={[0, seatHeight - 0.02, 0.04]}
        material={boucleMaterial}
        args={[w * 0.95, seatThickness, d * 0.86]}
        radius={0.12}
        smoothness={5}
      />

      {/* 3. Curved Crescent Backrest (Formed by smoothly joined rounded curved segments) */}
      <group position={[0, seatHeight + backHeight * 0.48, -d * 0.26]}>
        {/* Center Backrest Curve */}
        <RoundedBox
          castShadow
          receiveShadow
          material={boucleMaterial}
          args={[w * 0.65, backHeight, 0.28]}
          radius={0.12}
          smoothness={5}
        />

        {/* Left Curved Shoulder & Arm */}
        <RoundedBox
          castShadow
          receiveShadow
          position={[-(w * 0.38), -0.04, 0.16]}
          rotation={[0, 0.32, 0]}
          material={boucleMaterial}
          args={[w * 0.28, backHeight * 0.92, 0.3]}
          radius={0.12}
          smoothness={5}
        />

        {/* Right Curved Shoulder & Arm */}
        <RoundedBox
          castShadow
          receiveShadow
          position={[w * 0.38, -0.04, 0.16]}
          rotation={[0, -0.32, 0]}
          material={boucleMaterial}
          args={[w * 0.28, backHeight * 0.92, 0.3]}
          radius={0.12}
          smoothness={5}
        />
      </group>

      {/* 4. Three Distinctive Cushions (2 Square Sides + 1 Center Rectangular Lumbar) */}
      {/* Left Square Cushion */}
      <RoundedBox
        castShadow
        position={[-(w * 0.26), seatHeight + 0.16, -d * 0.12]}
        rotation={[0.1, 0.2, -0.05]}
        material={boucleMaterial}
        args={[0.42, 0.42, 0.14]}
        radius={0.06}
        smoothness={4}
      />

      {/* Center Rectangular Lumbar Cushion */}
      <RoundedBox
        castShadow
        position={[0, seatHeight + 0.12, -d * 0.18]}
        rotation={[0.08, 0, 0]}
        material={boucleMaterial}
        args={[0.56, 0.32, 0.13]}
        radius={0.06}
        smoothness={4}
      />

      {/* Right Square Cushion */}
      <RoundedBox
        castShadow
        position={[w * 0.26, seatHeight + 0.16, -d * 0.12]}
        rotation={[0.1, -0.2, 0.05]}
        material={boucleMaterial}
        args={[0.42, 0.42, 0.14]}
        radius={0.06}
        smoothness={4}
      />
    </group>
  );
};
