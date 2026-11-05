import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getGoldEmbroideryTexture, getBoucleTexture } from '../materials/proceduralTextures';
import type { ModelCustomizationProps } from './LeatherArmchairModel';

export const CurtainCreamModel: React.FC<ModelCustomizationProps> = ({
  colorHex = '#FBF8F2', // Light cream luxury fabric
  metalHex = '#D4AF37', // Gold rod & embroidery accents
  dimensionsCm,
}) => {
  const w = (dimensionsCm?.w || 240) / 100;
  const h = (dimensionsCm?.h || 280) / 100;

  const fabricTexture = useMemo(() => getBoucleTexture(), []);
  const goldEmbroideryTexture = useMemo(() => getGoldEmbroideryTexture(), []);

  const curtainMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorHex),
        bumpMap: fabricTexture,
        bumpScale: 0.003,
        roughness: 0.82,
        sheen: 0.55,
        sheenColor: new THREE.Color('#FFF5E6'),
        side: THREE.DoubleSide,
      }),
    [colorHex, fabricTexture]
  );

  const sheerMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#FFFFFF',
        roughness: 0.4,
        transparent: true,
        opacity: 0.42,
        transmission: 0.4,
        side: THREE.DoubleSide,
      }),
    []
  );

  const embroideryMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: goldEmbroideryTexture,
        roughness: 0.3,
        metalness: 0.8,
        side: THREE.DoubleSide,
      }),
    [goldEmbroideryTexture]
  );

  const pearlMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#FFFDF9',
        roughness: 0.15,
        clearcoat: 1.0,
        sheen: 1.0,
        sheenColor: new THREE.Color('#FFECCC'),
      }),
    []
  );

  const rodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(metalHex),
        metalness: 0.92,
        roughness: 0.22,
      }),
    [metalHex]
  );

  // Generate pleated curtain panel geometry with sinusoidal folds
  const panelGeometries = useMemo(() => {
    const createPleatedGeometry = (panelWidth: number, isLeft: boolean) => {
      const segX = 40;
      const segY = 50;
      const geom = new THREE.PlaneGeometry(panelWidth, h, segX, segY);
      const pos = geom.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i); // Ranges from -h/2 to +h/2
        const normY = (y + h * 0.5) / h; // 0 (bottom) to 1 (top)

        // Sinusoidal pleat waves
        const wave = Math.sin((x / panelWidth) * Math.PI * 12) * 0.055;
        pos.setZ(i, wave);

        // Gather at tieback height (around normY = 0.4)
        const tiebackHeight = 0.4;
        const distFromTieback = Math.abs(normY - tiebackHeight);
        const cinchFactor = Math.exp(-distFromTieback * 5) * 0.35;
        
        // Pull towards side border
        const pullDirection = isLeft ? -1 : 1;
        pos.setX(i, x + pullDirection * cinchFactor * panelWidth * 0.4);
      }

      geom.computeVertexNormals();
      return geom;
    };

    return {
      left: createPleatedGeometry(w * 0.46, true),
      right: createPleatedGeometry(w * 0.46, false),
    };
  }, [w, h]);

  // Gentle subtle breeze sway animation on frame
  const leftPanelRef = useRef<THREE.Mesh>(null);
  const rightPanelRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (leftPanelRef.current) {
      leftPanelRef.current.rotation.y = Math.sin(t * 0.8) * 0.015;
    }
    if (rightPanelRef.current) {
      rightPanelRef.current.rotation.y = Math.cos(t * 0.8) * 0.015;
    }
  });

  const halfH = h * 0.5;
  const panelSpread = w * 0.32;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Top Luxury Gold Curtain Rod with Finials */}
      <group position={[0, h, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={rodMaterial}>
          <cylinderGeometry args={[0.02, 0.02, w * 1.15, 24]} />
        </mesh>
        {/* Left Finial */}
        <mesh position={[-w * 0.58, 0, 0]} material={rodMaterial}>
          <sphereGeometry args={[0.045, 24, 24]} />
        </mesh>
        {/* Right Finial */}
        <mesh position={[w * 0.58, 0, 0]} material={rodMaterial}>
          <sphereGeometry args={[0.045, 24, 24]} />
        </mesh>
        {/* Wall Mounting Brackets */}
        {[-w * 0.48, 0, w * 0.48].map((bx, idx) => (
          <mesh key={`bracket-${idx}`} position={[bx, 0, -0.05]} material={rodMaterial}>
            <boxGeometry args={[0.02, 0.04, 0.1]} />
          </mesh>
        ))}
      </group>

      {/* 2. Inner Transparent White Sheer Layer */}
      <mesh position={[0, halfH, -0.06]} material={sheerMaterial}>
        <planeGeometry args={[w * 0.95, h, 20, 20]} />
      </mesh>

      {/* 3. Left Pleated Panel */}
      <group position={[-panelSpread, halfH, 0]}>
        <mesh
          ref={leftPanelRef}
          castShadow
          receiveShadow
          geometry={panelGeometries.left}
          material={curtainMaterial}
        />
        {/* Gold Embroidery Band along lower third */}
        <mesh position={[0, -halfH * 0.55, 0.03]} material={embroideryMaterial}>
          <planeGeometry args={[w * 0.44, 0.28]} />
        </mesh>

        {/* Left Pearl Tieback Loop */}
        <group position={[w * 0.18, -halfH * 0.2, 0.05]}>
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI;
            return (
              <mesh
                key={`pearl-l-${i}`}
                position={[Math.cos(angle) * 0.12, Math.sin(angle) * 0.06, 0]}
                material={pearlMaterial}
              >
                <sphereGeometry args={[0.014, 16, 16]} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* 4. Right Pleated Panel */}
      <group position={[panelSpread, halfH, 0]}>
        <mesh
          ref={rightPanelRef}
          castShadow
          receiveShadow
          geometry={panelGeometries.right}
          material={curtainMaterial}
        />
        {/* Gold Embroidery Band along lower third */}
        <mesh position={[0, -halfH * 0.55, 0.03]} material={embroideryMaterial}>
          <planeGeometry args={[w * 0.44, 0.28]} />
        </mesh>

        {/* Right Pearl Tieback Loop */}
        <group position={[-w * 0.18, -halfH * 0.2, 0.05]}>
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI;
            return (
              <mesh
                key={`pearl-r-${i}`}
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
