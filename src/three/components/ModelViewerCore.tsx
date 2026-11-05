import React, { Suspense, useMemo } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import type { Product } from '../../types/product';
import { getProceduralModel } from '../procedural';

interface ModelViewerCoreProps {
  product: Product;
  colorHex?: string;
  metalHex?: string;
  woodHex?: string;
  dimensionsCm?: { w: number; d: number; h: number };
  glbUrl?: string | null;
}

/**
 * Component to load and display external or dropped GLB/GLTF models
 */
const GlbModel: React.FC<{ url: string }> = ({ url }) => {
  const gltf = useGLTF(url);

  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [gltf.scene]);

  return (
    <Center top>
      <primitive object={clonedScene} />
    </Center>
  );
};

export const ModelViewerCore: React.FC<ModelViewerCoreProps> = ({
  product,
  colorHex,
  metalHex,
  woodHex,
  dimensionsCm,
  glbUrl,
}) => {
  // If an external or drag-and-drop GLB URL is available
  if (glbUrl || product.glbUrl) {
    const targetUrl = glbUrl || product.glbUrl!;
    return (
      <Suspense fallback={null}>
        <GlbModel url={targetUrl} />
      </Suspense>
    );
  }

  // Otherwise, render the bespoke procedural model for this piece
  const ProceduralComponent = getProceduralModel(product.proceduralKey || product.id);

  return (
    <ProceduralComponent
      colorHex={colorHex || product.colorOptions[0]?.hex}
      metalHex={metalHex}
      woodHex={woodHex}
      dimensionsCm={dimensionsCm || product.dimensionsCm}
    />
  );
};
