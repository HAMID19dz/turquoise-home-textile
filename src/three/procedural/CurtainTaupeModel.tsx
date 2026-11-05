import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getBoucleTexture } from '../materials/proceduralTextures';
import type { ModelCustomizationProps } from './LeatherArmchairModel';

export const CurtainTaupeModel: React.FC<ModelCustomizationProps> = ({
  colorHex = '#8E8278', // Deep geometric-pattern grey/taupe fabric
  metalHex = '#4A4846', // Matte bronze/dark titanium rod
  dimensionsCm,
}) => {
  const w = (dimensionsCm?.w || 240) / 100;
  const h = (dimensionsCm?.h || 280) / 100;

  const fabricTexture = useMemo(() => getBoucleTexture(), []);

  const curtainMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorHex),
        bumpMap: fabricTexture,
        bumpScale: 0.005,
        roughness: 0.78,
        sheen: 0.6,
        sheenColor: new THREE.Color('#D8D0C5'),
        side: THREE.DoubleSide,
      }),
    [colorHex, fabricTexture]
  );

  const sheerMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#FFFFFF',
        roughness: 0.35,
        transparent: true,
        opacity: 0.45,
        transmission: 0.4,
        side: THREE.DoubleSide,
      }),
    []
  );

  const pearlMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#FDFBF7',
        roughness: 0.12,
        clearcoat: 1.0,
        sheen: 1.0,
      }),
    []
  );

  const rodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(metalHex),
        metalness: 0.88,
        roughness: 0.28,
      }),
    [metalHex]
  );

  // Subdivided sinusoidal pleat geometry
  const panelGeometries = useMemo(() => {
    const createPleatedGeometry = (panelWidth: number, isLeft: boolean) => {
      const segX = 40;
      const segY = 50;
      const geom = new THREE.PlaneGeometry(panelWidth, h, segX, segY);
      const pos = geom.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const normY = (y + h * 0.5) / h;

        // Heavy, deep accordion sinusoidal folds
        const wave = Math.sin((x / panelWidth) * Math.PI * 14) * 0.065;
        pos.setZ(i, wave);

        // Gather at tieback height
        const tiebackHeight = 0.42;
        const distFromTieback = Math.abs(normY - tiebackHeight);
        const cinchFactor = Math.exp(-distFromTieback * 5) * 0.38;

        const pullDirection = isLeft ? -1 : 1;
        pos.setX(i, x + pullDirection * cinchFactor * panelWidth * 0.42);
      }

      geom.computeVertexNormals();
      return geom;
    };

    return {
      left: createPleatedGeometry(w * 0.46, true),
      right: createPleatedGeometry(w * 0.46, false),
    };
  }, [w, h]);

  const leftPanelRef = useRef<THREE.Mesh>(null);
  const rightPanelRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (leftPanelRef.current) {
      leftPanelRef.current.rotation.y = Math.sin(t * 0.7) * 0.012;
    }
    if (rightPanelRef.current) {
      rightPanelRef.current.rotation.y = Math.cos(t * 0.7) * 0.012;
    }
  });

  const halfH = h * 0.5;
  const panelSpread = w * 0.32;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Matte Titanium/Bronze Rod */}
      <group position={[0, h, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={rodMaterial}>
          <cylinderGeometry args={[0.02, 0.02, w * 1.15, 24]} />
        </mesh>
        <mesh position={[-w * 0.58, 0, 0]} material={rodMaterial}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
        </mesh>
        <mesh position={[w * 0.58, 0, 0]} material={rodMaterial}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
        </mesh>
      </group>

      {/* 2. Inner White Sheer Layer */}
      <mesh position={[0, halfH, -0.06]} material={sheerMaterial}>
        <planeGeometry args={[w * 0.95, h, 20, 20]} />
      </mesh>

      {/* 3. Left Taupe Panel */}
      <group position={[-panelSpread, halfH, 0]}>
        <mesh
          ref={leftPanelRef}
          castShadow
          receiveShadow
          geometry={panelGeometries.left}
          material={curtainMaterial}
        />

        {/* Pearl Tieback Loop */}
        <group position={[w * 0.18, -halfH * 0.18, 0.05]}>
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI;
            return (
              <mesh
                key={`pearl-tl-${i}`}
                position={[Math.cos(angle) * 0.12, Math.sin(angle) * 0.06, 0]}
                material={pearlMaterial}
              >
                <sphereGeometry args={[0.014, 16, 16]} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* 4. Right Taupe Panel */}
      <group position={[panelSpread, halfH, 0]}>
        <mesh
          ref={rightPanelRef}
          castShadow
          receiveShadow
          geometry={panelGeometries.right}
          material={curtainMaterial}
        />

        {/* Pearl Tieback Loop */}
        <group position={[-w * 0.18, -halfH * 0.18, 0.05]}>
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI;
            return (
              <mesh
                key={`pearl-tr-${i}`}
                position={[-Math.cos(angle) * 0.12, Math.sin(angle) * 0.06, 0]}
                material={pearlMaterial}
              >
                <sphereGeometry args={[0.014, 16, 16]} />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
};
