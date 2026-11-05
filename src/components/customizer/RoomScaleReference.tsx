import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface RoomScaleReferenceProps {
  roomDimensionsCm?: { length: number; width: number; height: number };
  position?: [number, number, number];
}

export const RoomScaleReference: React.FC<RoomScaleReferenceProps> = ({
  roomDimensionsCm = { length: 500, width: 400, height: 300 },
  position = [1.3, 0, 0.4],
}) => {
  // Convert cm to meters
  const roomL = roomDimensionsCm.length / 100;
  const roomW = roomDimensionsCm.width / 100;
  const roomH = roomDimensionsCm.height / 100;

  return (
    <group>
      {/* 1. Stylized 1.75m Human Silhouette Scale Reference */}
      <group position={position}>
        {/* Head */}
        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#C5A059" roughness={0.4} metalness={0.6} transparent opacity={0.85} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.52, 0]}>
          <cylinderGeometry args={[0.045, 0.05, 0.06, 12]} />
          <meshStandardMaterial color="#C5A059" roughness={0.4} metalness={0.6} transparent opacity={0.85} />
        </mesh>

        {/* Torso & Shoulders */}
        <mesh position={[0, 1.22, 0]}>
          <boxGeometry args={[0.34, 0.54, 0.18]} />
          <meshStandardMaterial color="#A48037" roughness={0.4} metalness={0.5} transparent opacity={0.8} />
        </mesh>

        {/* Left Arm */}
        <mesh position={[-0.21, 1.15, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.58, 10]} />
          <meshStandardMaterial color="#C5A059" roughness={0.4} metalness={0.6} transparent opacity={0.8} />
        </mesh>

        {/* Right Arm */}
        <mesh position={[0.21, 1.15, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.58, 10]} />
          <meshStandardMaterial color="#C5A059" roughness={0.4} metalness={0.6} transparent opacity={0.8} />
        </mesh>

        {/* Hips & Legs */}
        <mesh position={[-0.09, 0.48, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.95, 12]} />
          <meshStandardMaterial color="#886828" roughness={0.4} metalness={0.5} transparent opacity={0.8} />
        </mesh>
        <mesh position={[0.09, 0.48, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.95, 12]} />
          <meshStandardMaterial color="#886828" roughness={0.4} metalness={0.5} transparent opacity={0.8} />
        </mesh>

        {/* Floating Scale Badge */}
        <Html position={[0, 1.88, 0]} center distanceFactor={6}>
          <div className="px-2 py-0.5 rounded bg-charcoal-dark/90 text-gold text-[10px] font-mono whitespace-nowrap shadow border border-gold/40">
            1.75 m (Human Scale)
          </div>
        </Html>
      </group>

      {/* 2. Room Box Perimeter Wireframe */}
      <group position={[0, roomH * 0.5, 0]}>
        {/* Floor boundary border */}
        <lineSegments position={[0, -roomH * 0.5 + 0.005, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(roomL, 0.001, roomW)]} />
          <lineBasicMaterial color="#C5A059" transparent opacity={0.4} />
        </lineSegments>

        {/* Room dimensions wireframe */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(roomL, roomH, roomW)]} />
          <lineBasicMaterial color="#D4AF37" transparent opacity={0.15} />
        </lineSegments>
      </group>
    </group>
  );
};
