import * as THREE from 'three';

/**
 * Generates a high-quality bioluminescent radial glow particle texture dynamically.
 */
export function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const center = 64;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 64);

    // Inner bright bioluminescent core
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.15, 'rgba(255, 220, 180, 0.95)');
    gradient.addColorStop(0.35, 'rgba(255, 91, 36, 0.75)');
    gradient.addColorStop(0.65, 'rgba(230, 60, 20, 0.25)');
    gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
