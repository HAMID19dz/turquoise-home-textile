import * as THREE from 'three';

// Cache canvas textures so we never create duplicates
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Generate procedural bouclé fabric bump/normal texture
 */
export function getBoucleTexture(): THREE.CanvasTexture {
  const key = 'boucle_texture';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    // Draw thousands of micro loops and curly nubs
    ctx.fillStyle = 'rgba(210, 205, 195, 0.4)';
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 1 + Math.random() * 2.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(180, 175, 165, 0.25)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.beginPath();
      ctx.arc(x, y, 2 + Math.random() * 3, Math.random() * Math.PI, Math.random() * Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Generate procedural leather grain bump texture
 */
export function getLeatherGrainTexture(): THREE.CanvasTexture {
  const key = 'leather_grain_texture';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#e8e6e2';
    ctx.fillRect(0, 0, 512, 512);

    // Voronoi-like cellular pebble grain
    ctx.fillStyle = 'rgba(120, 115, 105, 0.18)';
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 1 + Math.random() * 1.8;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(100, 95, 85, 0.12)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 8, y + (Math.random() - 0.5) * 8);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Generate procedural luxury wood grain texture
 */
export function getWoodGrainTexture(woodColorHex: string = '#4A3423'): THREE.CanvasTexture {
  const key = `wood_grain_${woodColorHex}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Base wood tone
    ctx.fillStyle = woodColorHex;
    ctx.fillRect(0, 0, 1024, 512);

    // Horizontal grain lines with undulating waviness
    for (let y = 0; y < 512; y += 2) {
      const alpha = 0.08 + Math.random() * 0.15;
      ctx.strokeStyle = `rgba(30, 20, 10, ${alpha})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);

      let currentY = y;
      for (let x = 0; x < 1024; x += 30) {
        currentY += (Math.random() - 0.5) * 1.8;
        ctx.lineTo(x, currentY);
      }
      ctx.stroke();
    }

    // Add subtle rings / knothole swirls
    ctx.strokeStyle = 'rgba(25, 15, 8, 0.15)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const cx = 200 + i * 320;
      const cy = 200 + (Math.random() - 0.5) * 150;
      for (let r = 10; r < 60; r += 8) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 2.5, r, 0.1, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Generate gold embroidery meander / neoclassical band texture for curtains
 */
export function getGoldEmbroideryTexture(): THREE.CanvasTexture {
  const key = 'gold_embroidery_band';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich dark gold background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 256);
    bgGradient.addColorStop(0, '#B8860B');
    bgGradient.addColorStop(0.5, '#D4AF37');
    bgGradient.addColorStop(1, '#996515');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1024, 256);

    // Border hairlines
    ctx.strokeStyle = '#FFF8DC';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 12, 1016, 232);
    ctx.strokeRect(12, 20, 1000, 216);

    // Greek Key (Meander) repeating pattern
    ctx.strokeStyle = '#FAF0BE';
    ctx.lineWidth = 6;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';

    const unit = 32;
    for (let startX = 24; startX < 1000; startX += unit * 3) {
      ctx.beginPath();
      ctx.moveTo(startX, 128 - unit);
      ctx.lineTo(startX + unit * 2, 128 - unit);
      ctx.lineTo(startX + unit * 2, 128 + unit);
      ctx.lineTo(startX + unit, 128 + unit);
      ctx.lineTo(startX + unit, 128);
      ctx.lineTo(startX + unit * 1.5, 128);
      ctx.stroke();
    }

    // Gold sparkle flecks
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 256;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Generate Carrara marble floor texture with golden veins
 */
export function getMarbleFloorTexture(): THREE.CanvasTexture {
  const key = 'marble_floor_texture';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Pure ivory-white Carrara marble base
    ctx.fillStyle = '#FDFCFA';
    ctx.fillRect(0, 0, 1024, 1024);

    // Soft grey undertone patches
    ctx.fillStyle = 'rgba(235, 230, 222, 0.4)';
    for (let i = 0; i < 15; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 1024;
      const r = 100 + Math.random() * 250;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Meandering marble veins
    const veinColors = [
      'rgba(180, 172, 160, 0.25)',
      'rgba(150, 140, 130, 0.18)',
      'rgba(197, 160, 89, 0.22)', // Subtle metallic gold vein
      'rgba(212, 175, 55, 0.18)',  // Shimmering gold leaf branch
    ];

    veinColors.forEach((color, idx) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5 + (idx % 2);
      ctx.beginPath();
      let x = (idx * 260) % 1024;
      let y = 0;
      ctx.moveTo(x, y);

      while (y < 1024) {
        x += (Math.random() - 0.48) * 40;
        y += 20 + Math.random() * 30;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.set(key, texture);
  return texture;
}
