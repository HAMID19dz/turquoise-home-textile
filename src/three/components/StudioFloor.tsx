import React, { useMemo } from 'react';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { getMarbleFloorTexture } from '../materials/proceduralTextures';

interface StudioFloorProps {
  radius?: number;
}

export const StudioFloor: React.FC<StudioFloorProps> = ({ radius = 3.2 }) => {
  const marbleTexture = useMemo(() => getMarbleFloorTexture(), []);

  return (
    <group position={[0, -0.005, 0]}>
      {/* Contact Shadows grounding the 3D furniture */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.65}
        scale={6.5}
        blur={1.8}
        far={3.5}
        resolution={512}
        color="#1E1E1E"
      />

      {/* Luxury Carrara Marble Round Stage Disk */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial
          map={marbleTexture}
          roughness={0.25}
          metalness={0.08}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* 24k Gold Beveled Rim Border around the stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <ringGeometry args={[radius - 0.04, radius, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.3}
          metalness={0.9}
          envMapIntensity={1.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle outer gold hairline */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0008, 0]}>
        <ringGeometry args={[radius + 0.02, radius + 0.03, 64]} />
        <meshStandardMaterial
          color="#C5A059"
          roughness={0.4}
          metalness={0.8}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
