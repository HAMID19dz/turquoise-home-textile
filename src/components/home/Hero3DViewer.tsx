import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { StudioEnvironment } from '../../three/components/StudioEnvironment';
import { StudioFloor } from '../../three/components/StudioFloor';
import { LeatherArmchairModel } from '../../three/procedural/LeatherArmchairModel';
import { ViewerErrorBoundary } from '../../three/components/ViewerErrorBoundary';

export const Hero3DViewer: React.FC<{ className?: string }> = ({
  className = 'w-full h-[380px] sm:h-[450px] lg:h-[520px]',
}) => {
  return (
    <div className={`relative ${className} select-none`}>
      {/* Golden Stage Glow Halo */}
      <div className="absolute inset-0 bg-gradient-radial from-gold/15 via-gold-light/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <ViewerErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [2.5, 1.6, 2.9], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
          dpr={[1, 1.75]}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <StudioEnvironment preset="day" />
          <StudioFloor radius={3.2} />

          <Suspense fallback={null}>
            <LeatherArmchairModel colorHex="#B8AEA3" />
          </Suspense>

          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            minDistance={1.8}
            maxDistance={4.8}
            maxPolarAngle={Math.PI / 2.08}
            minPolarAngle={0.2}
            autoRotate
            autoRotateSpeed={1.2}
            enablePan={false}
            target={[0, 0.42, 0]}
          />
        </Canvas>
      </ViewerErrorBoundary>

      {/* Floating 3D Badge on Stage */}
      <div className="absolute bottom-3 start-1/2 -translate-x-1/2 pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-marble-50/80 backdrop-blur-md border border-gold/40 text-[11px] font-semibold text-gold-dark shadow-sm">
          360° Interactive Showroom
        </span>
      </div>
    </div>
  );
};
