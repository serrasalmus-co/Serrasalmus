import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createParticleTexture } from '../utils/particleTexture';

interface FishCanvasProps {
  scrollProgress: number;
}

export const FishCanvas: React.FC<FishCanvasProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<{
    uTime: { value: number };
    uMouse: { value: THREE.Vector3 };
    uMouseHover: { value: number };
    uScrollProgress: { value: number };
    uTexture: { value: THREE.CanvasTexture };
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Camera position responsive
    camera.position.z = window.innerWidth < 768 ? 14 : 9.5;

    // 2. Geometry & Particles Setup
    const particleCount = 18000;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const layers = new Float32Array(particleCount); // 0: Body, 1: Fins/Tail, 2: Eyes, 3: Aura, 4: Teeth/Jaw, 5: Dragon Scales

    // Color Palette Definitions - Pure Luminous White
    const colorPureWhite = new THREE.Color(0xffffff);
    const colorSilverWhite = new THREE.Color(0xe2e8f0);

    const bodyParticles = 15200;

    // Helper: Exact Silhouette Sampling based on Serrasalmus outline image
    const sampleSilhouettePoint = () => {
      while (true) {
        const x = (Math.random() * 7.0) - 3.5; // -3.5 (tail) to +3.5 (snout)

        let yUpper = 0;
        let yLower = 0;
        let isFin = false;
        let isTail = false;
        let isEye = false;
        let isJaw = false;

        if (x > 2.8) {
          // Snout & Mouth (+2.8 to +3.5)
          const t = (3.5 - x) / 0.7; // 0 at snout (+3.5), 1 at +2.8
          yUpper = -0.1 + t * 1.3;  // rises to +1.2
          yLower = -0.1 - t * 1.1;  // drops to -1.2
          if (x > 3.2 && Math.random() > 0.35) isJaw = true;
        } else if (x >= 0.0) {
          // Forehead & Deep Piranha Belly (0.0 to +2.8)
          const norm = (2.8 - x) / 2.8; // 0 at +2.8, 1 at 0.0
          const arch = Math.sin(norm * Math.PI * 0.85);
          yUpper = 1.2 + arch * 1.25;  // Peak back ~ +2.45
          yLower = -1.2 - arch * 1.05; // Peak belly ~ -2.25

          // Eye placement at head (x = +2.3, y = +0.42)
          if (Math.abs(x - 2.3) < 0.28 && Math.random() > 0.35) {
            isEye = true;
          }
        } else if (x >= -1.2) {
          // Dorsal Fin & Anal Fin Bounded Area (-1.2 to 0.0)
          const norm = (0.0 - x) / 1.2; // 0 at 0, 1 at -1.2
          
          const dorsalPeak = Math.sin(norm * Math.PI) * 0.65;
          yUpper = (2.45 * (1 - norm) + 1.0 * norm) + dorsalPeak;

          const analPeak = Math.sin(norm * Math.PI) * 0.42;
          yLower = (-2.25 * (1 - norm) - 0.9 * norm) - analPeak;

          if (dorsalPeak > 0.15 || analPeak > 0.15) isFin = true;
        } else if (x >= -2.2) {
          // Tail Peduncle Waist (-2.2 to -1.2)
          const norm = (-1.2 - x) / 1.0;
          yUpper = 1.0 * (1 - norm) + 0.55 * norm;
          yLower = -0.9 * (1 - norm) - 0.55 * norm;
        } else {
          // Caudal Tail Fin (-3.5 to -2.2)
          const norm = (-2.2 - x) / 1.3; // 0 at -2.2, 1 at -3.5
          isTail = true;

          yUpper = 0.55 + norm * 1.55;  // Expands up to +2.1
          yLower = -0.55 - norm * 1.45; // Expands down to -2.0
        }

        const y = yLower + Math.random() * (yUpper - yLower);

        // Filter center V-notch for tail
        if (x < -3.0 && Math.abs(y) < (0.55 * (-3.0 - x) / 0.5)) {
          continue; // Re-sample!
        }

        // Calculate 3D lenticular body thickness (Z)
        let maxZ = 0.8;
        if (isTail || isFin || x < -2.2) {
          maxZ = 0.14 + Math.random() * 0.08;
        } else {
          const yNorm = (y - (yUpper + yLower) / 2) / Math.max(0.1, (yUpper - yLower) / 2);
          const bodyProfile = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
          const lengthProfile = Math.sin(Math.PI * Math.min(1, Math.max(0, (x + 2.2) / 5.2)));
          maxZ = 0.85 * bodyProfile * Math.max(0.2, lengthProfile);
        }

        const z = (Math.random() * 2 - 1) * maxZ;

        return { x, y, z, yUpper, yLower, isFin, isTail, isEye, isJaw };
      }
    };

    for (let i = 0; i < particleCount; i++) {
      let x = 0;
      let y = 0;
      let z = 0;
      let layer = 0;
      let particleSize = Math.random() * 0.18 + 0.12;
      let pColor = colorPureWhite.clone();

      if (i < bodyParticles) {
        const pt = sampleSilhouettePoint();
        x = pt.x;
        y = pt.y;
        z = pt.z;

        if (pt.isEye) {
          layer = 2; // Eye
          z = (Math.random() > 0.5 ? 0.55 : -0.55) + (Math.random() * 0.08 - 0.04);
          y = 0.42 + (Math.random() * 0.2 - 0.1);
          x = 2.3 + (Math.random() * 0.2 - 0.1);
          pColor = colorPureWhite;
          particleSize = 0.35;
        } else if (pt.isJaw) {
          layer = 4; // Jaw / Teeth
          pColor = colorPureWhite;
          particleSize = 0.28;
        } else if (pt.isTail) {
          layer = 1;
          pColor = colorPureWhite.clone().lerp(colorSilverWhite, Math.random() * 0.3);
          particleSize *= 1.2;
        } else if (pt.isFin) {
          layer = 1;
          pColor = colorPureWhite.clone().lerp(colorSilverWhite, Math.random() * 0.2);
          particleSize *= 0.9;
        } else {
          // Disc Body: Pure Luminous White with silver highlights
          pColor = colorPureWhite.clone().lerp(colorSilverWhite, Math.random() * 0.25);
          if (y < -0.2) {
            particleSize *= 1.2;
          }

          // Shimmering scales
          if (Math.abs(z) > 0.35 && Math.random() > 0.75) {
            layer = 5;
            pColor = colorPureWhite;
            particleSize *= 1.35;
          }
        }
      } else {
        // --- AMBIENT BIOLUMINESCENT AURA ---
        layer = 3;
        const radius = 4.0 + Math.random() * 5.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi) * 0.6;

        pColor = colorPureWhite.clone().lerp(colorSilverWhite, Math.random() * 0.4);
        particleSize = Math.random() * 0.15 + 0.08;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;

      sizes[i] = particleSize;
      phases[i] = Math.random() * Math.PI * 2;
      layers[i] = layer;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aOriginalPos', new THREE.BufferAttribute(originalPositions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aLayer', new THREE.BufferAttribute(layers, 1));

    // 3. Custom Bioluminescent Shader Material
    const particleTexture = createParticleTexture();

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uMouseHover: { value: 0 },
      uScrollProgress: { value: 0 },
      uTexture: { value: particleTexture },
    };
    uniformsRef.current = uniforms;

    const vertexShader = `
      attribute float aSize;
      attribute vec3 aColor;
      attribute float aPhase;
      attribute float aLayer;
      attribute vec3 aOriginalPos;

      uniform float uTime;
      uniform vec3 uMouse;
      uniform float uMouseHover;
      uniform float uScrollProgress;

      varying vec3 vColor;
      varying float vGlow;
      varying float vLayer;

      void main() {
        vec3 pos = position;
        float ox = aOriginalPos.x;

        // --- ORGANIC FLUID WAVE SWIMMING MOTION ---
        // Disc body & head remain solid & recognizable; only tail flexes smoothly
        float flexFactor = pow(clamp((0.2 - ox) / 3.7, 0.0, 1.0), 1.5);
        
        // Harmonic multi-frequency water resistance waves along the caudal region
        float waveZ = sin(ox * 1.35 - uTime * 3.6 + aPhase * 0.15) * flexFactor * 0.40
                    + sin(ox * 2.8 - uTime * 5.2) * flexFactor * 0.10;
        float waveY = cos(ox * 0.95 - uTime * 2.8) * flexFactor * 0.08;

        if (aLayer == 1.0) { // Fin & tail fluttering
          waveZ += sin(uTime * 6.2 + ox * 3.5) * 0.12;
          waveY += cos(uTime * 5.0 + aOriginalPos.z * 4.0) * 0.10;
        }

        if (aLayer == 4.0) { // Arowana Barbels & Serrasalmus Jaw
          pos.x += sin(uTime * 4.2 + aPhase * 2.0) * 0.08;
          pos.y += cos(uTime * 3.8 + aPhase * 2.0) * 0.06;
          pos.z += sin(uTime * 5.0 + aPhase) * 0.08;
        }

        if (aLayer == 3.0) { // Ambient Swarm Drifting
          pos.x += sin(uTime * 0.7 + aPhase) * 0.45;
          pos.y += cos(uTime * 0.9 + aPhase * 1.4) * 0.35;
          pos.z += sin(uTime * 0.8 + aPhase * 0.7) * 0.45;
        } else {
          pos.z += waveZ;
          pos.y += waveY;
        }

        // --- MAGNETIC MOUSE REACTION (DISPERSAL & SPARKLE) ---
        vec3 distVec = pos - uMouse;
        float dist = length(distVec);
        float interactionRadius = 3.2;

        float glowIntensity = 1.0;

        if (aLayer == 5.0) { // Arowana Dragon Scale Shimmer
          glowIntensity *= (1.0 + 0.65 * sin(ox * 3.5 + uTime * 5.5 + aPhase));
        }

        if (dist < interactionRadius) {
          float influence = pow(1.0 - dist / interactionRadius, 2.0);
          vec3 pushDir = normalize(distVec + vec3(0.0, 0.15, 0.1));
          pos += pushDir * influence * 1.5 * uMouseHover;
          
          // Bioluminescent sparkle reaction on mouse proximity!
          glowIntensity += influence * 2.8 * (0.8 + 0.4 * sin(uTime * 16.0 + aPhase * 10.0));
        }

        // Subtle ambient bioluminescent shimmer
        glowIntensity *= (0.85 + 0.3 * sin(uTime * 2.5 + aPhase * 6.28));

        vColor = aColor;
        vGlow = glowIntensity;
        vLayer = aLayer;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        float baseSize = aSize;
        if (aLayer == 2.0) baseSize *= 1.8; // Eyes glow larger
        if (aLayer == 4.0) baseSize *= 1.3; // Jaw & Barbels
        if (aLayer == 5.0) baseSize *= 1.4; // Dragon Scales
        
        gl_PointSize = baseSize * (260.0 / -mvPosition.z) * glowIntensity;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      varying vec3 vColor;
      varying float vGlow;
      varying float vLayer;

      void main() {
        vec4 texColor = texture2D(uTexture, gl_PointCoord);
        if (texColor.a < 0.01) discard;

        vec3 finalColor = vColor * vGlow;

        // Incandescent core boost when glowing brightly
        if (vGlow > 1.2) {
          finalColor += vec3(0.35) * (vGlow - 1.2);
        }

        float alpha = texColor.a * min(1.0, vGlow * 0.85);
        if (vLayer == 3.0) alpha *= 0.55; // Ambient aura softness

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const fishMesh = new THREE.Points(geometry, material);
    fishMesh.scale.set(1.4, 1.4, 1.4);
    fishMesh.rotation.set(0, 0, 0); // Pure side-profile view
    scene.add(fishMesh);

    // 4. Mouse Tracking & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouseNormalized = new THREE.Vector2(-999, -999);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouse3DTarget = new THREE.Vector3(999, 999, 0);

    let mouseActiveTimeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = (event: MouseEvent) => {
      mouseNormalized.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseNormalized.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseNormalized, camera);
      raycaster.ray.intersectPlane(plane, mouse3DTarget);

      uniforms.uMouseHover.value = 1.0;

      clearTimeout(mouseActiveTimeout);
      mouseActiveTimeout = setTimeout(() => {
        uniforms.uMouseHover.value = 0.3;
      }, 2500);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop
    const clock = new THREE.Clock();

    let currentRotY = 0;
    let currentRotX = 0;
    let currentPosY = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      // Smoothly update mouse position uniform
      uniforms.uMouse.value.lerp(mouse3DTarget, 0.12);

      // Scroll Progress driven rotation & placement - Maintain side profile orientation
      const progress = uniforms.uScrollProgress.value;
      
      const baseRotY = -progress * 0.2; // Subtle side turn on scroll
      const targetRotY = baseRotY + mouseNormalized.x * 0.12; // Gentle profile pitch
      const targetRotX = -mouseNormalized.y * 0.10 + progress * 0.10;

      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;

      fishMesh.rotation.y = currentRotY;
      fishMesh.rotation.x = currentRotX;

      // Gentle aquatic float bobbing
      const floatY = Math.sin(elapsedTime * 0.9) * 0.35 - progress * 1.2;
      currentPosY += (floatY - currentPosY) * 0.05;
      fishMesh.position.y = currentPosY;

      // Render
      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize Handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      camera.position.z = window.innerWidth < 768 ? 14 : 9.5;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(mouseActiveTimeout);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Update uniforms when scrollProgress prop changes
  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uScrollProgress.value = scrollProgress;
    }
  }, [scrollProgress]);

  return <div id="canvas-container" ref={containerRef} />;
};
