import { describe, it, expect } from 'vitest';
import products from '../src/data/products.json';
import { PROCEDURAL_MODELS, getProceduralModel } from '../src/three/procedural';
import { isWebGLAvailable } from '../src/three/components/ViewerErrorBoundary';

describe('Milestone M3: 3D Stage & Procedural Builders Registry', () => {
  it('has a procedural builder registered for every product in products.json', () => {
    expect(products.length).toBe(9);

    for (const prod of products) {
      const model = getProceduralModel(prod.proceduralKey || prod.id);
      expect(model, `Expected model for ${prod.id}`).toBeDefined();
      expect(typeof model).toBe('function');
    }
  });

  it('contains all 9 specific procedural builders in PROCEDURAL_MODELS', () => {
    const expectedKeys = [
      'leather-armchair',
      'leather-sofa',
      'boucle-sofa',
      'velvet-accent-chair',
      'oval-dining-set',
      'coffee-table',
      'side-table',
      'curtain-cream',
      'curtain-taupe',
    ];

    for (const key of expectedKeys) {
      expect(PROCEDURAL_MODELS[key], `Expected key ${key} in PROCEDURAL_MODELS`).toBeDefined();
    }
  });

  it('safe WebGL detection function behaves without crashing in Node/JSDOM environment', () => {
    // In JSDOM without real WebGL, isWebGLAvailable returns boolean without throwing
    const result = isWebGLAvailable();
    expect(typeof result).toBe('boolean');
  });
});
