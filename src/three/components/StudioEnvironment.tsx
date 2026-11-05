import React from 'react';
import { Environment, Lightformer } from '@react-three/drei';

export type LightingPreset = 'day' | 'evening';

interface StudioEnvironmentProps {
  preset?: LightingPreset;
}

export const StudioEnvironment: React.FC<StudioEnvironmentProps> = ({ preset = 'day' }) => {
  const isDay = preset === 'day';

  return (
    <>
      {/* Directional Key Light with smooth shadow casting */}
      <directionalLight
        position={isDay ? [4, 6, 5] : [3.5, 5, 4]}
        intensity={isDay ? 1.6 : 1.9}
        color={isDay ? '#ffffff' : '#FFE8C8'}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Soft Ambient Light */}
      <ambientLight
        intensity={isDay ? 0.65 : 0.85}
        color={isDay ? '#F7F6F2' : '#FFF0DB'}
      />

      {/* Fill Light for soft shadow lift */}
      <directionalLight
        position={[-4, 3, -3]}
        intensity={isDay ? 0.6 : 0.75}
        color={isDay ? '#EAF0F8' : '#FFE3BD'}
      />

      {/* Rim / Hair Light for golden luxury edge contouring */}
      <spotLight
        position={[0, 5, -4]}
        intensity={isDay ? 0.8 : 1.2}
        color={isDay ? '#FAF7F0' : '#FFD285'}
        angle={0.6}
        penumbra={0.8}
      />

      {/* Offline Environment Map synthesized purely with Lightformers */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          {/* Main overhead studio softbox */}
          <Lightformer
            form="rect"
            intensity={isDay ? 2.2 : 2.8}
            color={isDay ? '#FFFFFF' : '#FFE5B4'}
            position={[0, 8, 0]}
            scale={[8, 8, 1]}
            target={[0, 0, 0]}
          />

          {/* Left softbox bounce */}
          <Lightformer
            form="rect"
            intensity={isDay ? 1.4 : 1.8}
            color={isDay ? '#F5F7FA' : '#FFD9A0'}
            position={[-6, 2, 2]}
            scale={[6, 3, 1]}
            rotation={[0, Math.PI / 3, 0]}
          />

          {/* Right rim accent */}
          <Lightformer
            form="rect"
            intensity={isDay ? 1.2 : 1.6}
            color={isDay ? '#FAF5E8' : '#C5A059'}
            position={[6, 3, -2]}
            scale={[5, 4, 1]}
            rotation={[0, -Math.PI / 3, 0]}
          />

          {/* Golden floor glow ring */}
          <Lightformer
            form="ring"
            color={isDay ? '#F0E6D2' : '#D4AF37'}
            intensity={isDay ? 0.8 : 1.5}
            position={[0, -1, 0]}
            scale={[10, 10, 1]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </group>
      </Environment>
    </>
  );
};
