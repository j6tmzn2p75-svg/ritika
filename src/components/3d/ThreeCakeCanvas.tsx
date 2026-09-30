'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCakeCanvasProps {
  scrollProgress: number; // 0 to 1
  cakeText?: string;
  onEnterMessage?: () => void;
}

export default function ThreeCakeCanvas({
  scrollProgress,
  cakeText = 'HAPPY BIRTHDAY RITIKA',
  onEnterMessage,
}: ThreeCakeCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0310, 0.015);

    const isMobile = container.clientWidth < 768;
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 55 : 45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile, // Disable AA on mobile for performance
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Cake Group
    const cakeGroup = new THREE.Group();
    const initialCakeX = isMobile ? 0 : 2.5;
    cakeGroup.position.x = initialCakeX;
    scene.add(cakeGroup);

    // --- PREMIUM 3-TIER WEDDING-STYLE BIRTHDAY CAKE ---

    // 1. CRYSTAL CAKE STAND - Polished Gold Pedestal with Detailed Rim
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      metalness: 0.92,
      roughness: 0.12,
      envMapIntensity: 1.5,
    });

    // Base plate
    const baseGeo = new THREE.CylinderGeometry(2.6, 2.9, 0.25, 64);
    const baseMesh = new THREE.Mesh(baseGeo, pedestalMat);
    baseMesh.position.y = -1.7;
    baseMesh.receiveShadow = true;
    cakeGroup.add(baseMesh);

    // Decorative rim on base
    const rimGeo = new THREE.TorusGeometry(2.75, 0.06, 16, 64);
    const rimMesh = new THREE.Mesh(rimGeo, pedestalMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -1.55;
    cakeGroup.add(rimMesh);

    // Stem with elegant profile
    const stemGeo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(1.2, 0),
        new THREE.Vector2(0.7, 0.25),
        new THREE.Vector2(0.55, 0.5),
        new THREE.Vector2(0.7, 0.75),
        new THREE.Vector2(1.0, 0.9),
      ].map((v) => new THREE.Vector2(v.x, v.y)),
      48
    );
    const stemMesh = new THREE.Mesh(stemGeo, pedestalMat);
    stemMesh.position.y = -1.55;
    cakeGroup.add(stemMesh);

    // Top plate
    const topPlateGeo = new THREE.CylinderGeometry(3.4, 3.4, 0.18, 64);
    const topPlateMesh = new THREE.Mesh(topPlateGeo, pedestalMat);
    topPlateMesh.position.y = -0.55;
    topPlateMesh.receiveShadow = true;
    cakeGroup.add(topPlateMesh);

    // 2. BOTTOM TIER - Rose Pink with sculpted frosting swirls
    const pinkFrostingMat = new THREE.MeshStandardMaterial({
      color: 0xff6b9d,
      roughness: 0.38,
      metalness: 0.04,
    });

    // Main cylinder with slightly rounded edges via Lathe
    const bottomTierProfile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(2.85, 0),
      new THREE.Vector2(2.9, 0.05),
      new THREE.Vector2(2.9, 1.35),
      new THREE.Vector2(2.85, 1.4),
      new THREE.Vector2(0, 1.4),
    ];
    const bottomTierGeo = new THREE.LatheGeometry(bottomTierProfile, 64);
    const bottomTier = new THREE.Mesh(bottomTierGeo, pinkFrostingMat);
    bottomTier.position.y = -0.45;
    bottomTier.castShadow = true;
    bottomTier.receiveShadow = true;
    cakeGroup.add(bottomTier);

    // Drip frosting effect on bottom tier (organic drips)
    const dripMat = new THREE.MeshStandardMaterial({
      color: 0xff2e93,
      roughness: 0.3,
      metalness: 0.05,
      transparent: true,
      opacity: 0.85,
    });
    const dripCount = 14;
    for (let i = 0; i < dripCount; i++) {
      const angle = (i / dripCount) * Math.PI * 2;
      const dripLen = 0.3 + Math.random() * 0.5;
      const dripGeo = new THREE.CylinderGeometry(0.08, 0.04, dripLen, 8);
      const dripMesh = new THREE.Mesh(dripGeo, dripMat);
      dripMesh.position.set(
        Math.cos(angle) * 2.88,
        0.95 - dripLen / 2 - 0.45,
        Math.sin(angle) * 2.88
      );
      cakeGroup.add(dripMesh);

      // Small sphere at drip tip
      const tipGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const tipMesh = new THREE.Mesh(tipGeo, dripMat);
      tipMesh.position.set(
        Math.cos(angle) * 2.88,
        0.95 - dripLen - 0.45,
        Math.sin(angle) * 2.88
      );
      cakeGroup.add(tipMesh);
    }

    // Cream pearl border on bottom tier
    const pearlMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.35,
    });
    const pearlCount = 40;
    for (let i = 0; i < pearlCount; i++) {
      const angle = (i / pearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), pearlMat);
      pearl.position.set(Math.cos(angle) * 2.9, -0.45, Math.sin(angle) * 2.9);
      cakeGroup.add(pearl);
    }

    // 3. MIDDLE TIER - Pearl White Fondant with gold accent band
    const whiteFrostingMat = new THREE.MeshStandardMaterial({
      color: 0xfffafc,
      roughness: 0.35,
      metalness: 0.03,
    });

    const middleTierProfile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(2.15, 0),
      new THREE.Vector2(2.2, 0.05),
      new THREE.Vector2(2.2, 1.1),
      new THREE.Vector2(2.15, 1.15),
      new THREE.Vector2(0, 1.15),
    ];
    const middleTierGeo = new THREE.LatheGeometry(middleTierProfile, 64);
    const middleTier = new THREE.Mesh(middleTierGeo, whiteFrostingMat);
    middleTier.position.y = 0.95;
    middleTier.castShadow = true;
    middleTier.receiveShadow = true;
    cakeGroup.add(middleTier);

    // Gold accent ribbon band on middle tier
    const goldRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ribbonGeo = new THREE.TorusGeometry(2.21, 0.08, 8, 64);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, goldRibbonMat);
    ribbonMesh.rotation.x = Math.PI / 2;
    ribbonMesh.position.y = 1.5;
    cakeGroup.add(ribbonMesh);

    // Middle tier pearls
    const midPearlCount = 32;
    for (let i = 0; i < midPearlCount; i++) {
      const angle = (i / midPearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), pearlMat);
      pearl.position.set(Math.cos(angle) * 2.2, 0.95, Math.sin(angle) * 2.2);
      cakeGroup.add(pearl);
    }

    // 4. TOP TIER - Soft Rose with intricate piping
    const topTierProfile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1.5, 0),
      new THREE.Vector2(1.55, 0.05),
      new THREE.Vector2(1.55, 0.95),
      new THREE.Vector2(1.5, 1.0),
      new THREE.Vector2(0, 1.0),
    ];
    const topTierGeo = new THREE.LatheGeometry(topTierProfile, 64);
    const topTierMat = new THREE.MeshStandardMaterial({
      color: 0xffc0d0,
      roughness: 0.35,
      metalness: 0.04,
    });
    const topTier = new THREE.Mesh(topTierGeo, topTierMat);
    topTier.position.y = 2.1;
    topTier.castShadow = true;
    topTier.receiveShadow = true;
    cakeGroup.add(topTier);

    // Top tier pearls
    const topPearlCount = 24;
    for (let i = 0; i < topPearlCount; i++) {
      const angle = (i / topPearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), pearlMat);
      pearl.position.set(Math.cos(angle) * 1.55, 2.1, Math.sin(angle) * 1.55);
      cakeGroup.add(pearl);
    }

    // 5. SUGAR ROSES - Detailed 3D roses around top
    const roseMat = new THREE.MeshStandardMaterial({
      color: 0xff1493,
      roughness: 0.28,
      metalness: 0.12,
    });
    const roseHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
      roughness: 0.3,
      metalness: 0.1,
    });
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      roughness: 0.4,
      metalness: 0.05,
    });

    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + 0.15;
      const roseGroup = new THREE.Group();

      // Rose center bud
      const budGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const bud = new THREE.Mesh(budGeo, roseMat);
      roseGroup.add(bud);

      // Petal layers (3 layers of increasing size)
      for (let layer = 0; layer < 3; layer++) {
        const petalCount = 4 + layer * 2;
        const petalSize = 0.08 + layer * 0.04;
        for (let p = 0; p < petalCount; p++) {
          const pa = (p / petalCount) * Math.PI * 2;
          const petalGeo = new THREE.SphereGeometry(petalSize, 8, 6);
          petalGeo.scale(1, 0.5, 1.3);
          const petal = new THREE.Mesh(petalGeo, layer === 2 ? roseHighlightMat : roseMat);
          const rad = 0.08 + layer * 0.06;
          petal.position.set(Math.cos(pa) * rad, layer * 0.03, Math.sin(pa) * rad);
          petal.rotation.set(0, pa, Math.PI * 0.15);
          roseGroup.add(petal);
        }
      }

      // Small leaves
      const leafGeo = new THREE.SphereGeometry(0.08, 6, 6);
      leafGeo.scale(1, 0.3, 2);
      const leaf1 = new THREE.Mesh(leafGeo, leafMat);
      leaf1.position.set(0.2, -0.05, 0);
      leaf1.rotation.z = 0.3;
      roseGroup.add(leaf1);
      const leaf2 = new THREE.Mesh(leafGeo.clone(), leafMat);
      leaf2.position.set(-0.2, -0.05, 0);
      leaf2.rotation.z = -0.3;
      roseGroup.add(leaf2);

      // Position rose on cake
      const roseRadius = i < 5 ? 1.4 : 2.05;
      const roseY = i < 5 ? 3.15 : 2.1;
      roseGroup.position.set(
        Math.cos(angle) * roseRadius,
        roseY,
        Math.sin(angle) * roseRadius
      );
      roseGroup.scale.setScalar(i < 5 ? 0.9 : 0.75);
      cakeGroup.add(roseGroup);
    }

    // 6. GOLDEN CROWN TOPPER
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.1,
    });

    // Crown base ring
    const crownBaseGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 32);
    const crownBase = new THREE.Mesh(crownBaseGeo, crownMat);
    crownBase.rotation.x = Math.PI / 2;
    crownBase.position.y = 3.3;
    cakeGroup.add(crownBase);

    // Crown points
    const crownPointCount = 5;
    for (let i = 0; i < crownPointCount; i++) {
      const angle = (i / crownPointCount) * Math.PI * 2;
      const pointGeo = new THREE.ConeGeometry(0.06, 0.35, 6);
      const point = new THREE.Mesh(pointGeo, crownMat);
      point.position.set(
        Math.cos(angle) * 0.35,
        3.5,
        Math.sin(angle) * 0.35
      );
      cakeGroup.add(point);

      // Tiny gem on each point
      const gemGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const gemMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xff2e93 : 0x00bfff,
        metalness: 0.6,
        roughness: 0.1,
        emissive: i % 2 === 0 ? 0xff2e93 : 0x00bfff,
        emissiveIntensity: 0.3,
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.set(
        Math.cos(angle) * 0.35,
        3.68,
        Math.sin(angle) * 0.35
      );
      cakeGroup.add(gem);
    }

    // 7. TOP LETTERING PLAQUE
    const topTextCanvas = document.createElement('canvas');
    topTextCanvas.width = 1024;
    topTextCanvas.height = 1024;
    const tCtx = topTextCanvas.getContext('2d');
    if (tCtx) {
      tCtx.beginPath();
      tCtx.arc(512, 512, 500, 0, Math.PI * 2);
      tCtx.fillStyle = '#fffdf7';
      tCtx.fill();

      tCtx.lineWidth = 28;
      tCtx.strokeStyle = '#c2410c';
      tCtx.stroke();

      tCtx.beginPath();
      tCtx.arc(512, 512, 455, 0, Math.PI * 2);
      tCtx.lineWidth = 12;
      tCtx.strokeStyle = '#d97706';
      tCtx.stroke();

      for (let a = 0; a < 44; a++) {
        const rad = (a / 44) * Math.PI * 2;
        const x = 512 + Math.cos(rad) * 478;
        const y = 512 + Math.sin(rad) * 478;
        tCtx.beginPath();
        tCtx.arc(x, y, 7, 0, Math.PI * 2);
        tCtx.fillStyle = '#f59e0b';
        tCtx.fill();
      }

      tCtx.font = 'bold 36px Georgia, serif';
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      tCtx.fillStyle = '#9a3412';
      tCtx.fillText('✦   ROYAL FAIRYTALE CELEBRATION   ✦', 512, 230);

      tCtx.font = '900 100px "Playfair Display", Georgia, serif';
      tCtx.fillStyle = '#4c0519';
      tCtx.fillText('HAPPY BIRTHDAY', 512, 345);

      tCtx.font = '86px Georgia, serif';
      tCtx.fillStyle = '#b45309';
      tCtx.fillText('👑    ✦    💖    ✦    👑', 512, 512);

      tCtx.font = '900 130px "Playfair Display", Georgia, serif';
      tCtx.fillStyle = '#831843';
      const recipientOnPlaque = cakeText.replace(/HAPPY BIRTHDAY\s*/i, '').trim() || 'RITIKA';
      tCtx.fillText(recipientOnPlaque.toUpperCase(), 512, 670);

      tCtx.font = 'italic 38px Georgia, serif';
      tCtx.fillStyle = '#9a3412';
      tCtx.fillText('Fairytale Coronation • Eternal Wonder', 512, 790);
    }

    const topTextTexture = new THREE.CanvasTexture(topTextCanvas);
    topTextTexture.generateMipmaps = true;
    topTextTexture.minFilter = THREE.LinearMipmapLinearFilter;
    topTextTexture.colorSpace = THREE.SRGBColorSpace;
    const topPlaqueMat = new THREE.MeshBasicMaterial({
      map: topTextTexture,
      toneMapped: false,
    });
    const topPlaque = new THREE.Mesh(new THREE.CircleGeometry(1.2, 48), topPlaqueMat);
    topPlaque.rotation.x = -Math.PI / 2;
    topPlaque.position.set(0, 3.11, 0);
    cakeGroup.add(topPlaque);

    // 8. BIRTHDAY CANDLES with realistic flames
    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });
    const candleCount = 6;
    const flames: { mesh: THREE.Mesh; light: THREE.PointLight; baseIntensity: number }[] = [];

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2 + Math.PI / 6;
      const candleRadius = 1.38;
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 12), candleMat);
      candle.position.set(Math.cos(angle) * candleRadius, 3.4, Math.sin(angle) * candleRadius);
      cakeGroup.add(candle);

      // Striped candy effect
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0xff69b4, roughness: 0.4 });
      const stripeGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.08, 12);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.copy(candle.position);
      stripe.position.y += 0.1;
      cakeGroup.add(stripe);

      // Wick
      const wick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.1, 6),
        new THREE.MeshBasicMaterial({ color: 0x222222 })
      );
      wick.position.set(candle.position.x, 3.72, candle.position.z);
      cakeGroup.add(wick);

      // Flame - teardrop shape using cone + sphere composite
      const flameGroup = new THREE.Group();

      const flameInner = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.18, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
      );
      flameInner.position.y = 0.06;
      flameGroup.add(flameInner);

      const flameOuter = new THREE.Mesh(
        new THREE.ConeGeometry(0.065, 0.22, 8),
        new THREE.MeshBasicMaterial({ color: 0xffe600, transparent: true, opacity: 0.7 })
      );
      flameOuter.position.y = 0.05;
      flameGroup.add(flameOuter);

      const flameGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.4 })
      );
      flameGlow.position.y = -0.02;
      flameGroup.add(flameGlow);

      flameGroup.position.set(candle.position.x, 3.8, candle.position.z);
      cakeGroup.add(flameGroup);

      // Point Light for realistic flickering
      const candleLight = new THREE.PointLight(0xff9900, 0.8, 3.5);
      candleLight.position.set(candle.position.x, 3.85, candle.position.z);
      cakeGroup.add(candleLight);

      flames.push({ mesh: flameGroup as unknown as THREE.Mesh, light: candleLight, baseIntensity: 0.8 });
    }

    // 9. SPARKLE PARTICLES (reduced count for performance)
    const sparkleCount = isMobile ? 50 : 80;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount * 3; i += 3) {
      sparklePositions[i] = (Math.random() - 0.5) * 8;
      sparklePositions[i + 1] = Math.random() * 5 - 1;
      sparklePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xffd166,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparkles);

    // STUDIO LIGHTING - Optimized with fewer lights
    const ambientLight = new THREE.AmbientLight(0xfff0f5, 1.0);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xfff5e6, 2.8);
    mainSpot.position.set(4, 8, 5);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.8;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.set(512, 512); // Lower shadow map for perf
    scene.add(mainSpot);

    const rimLight = new THREE.DirectionalLight(0xff2e93, 1.6);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Fill light from below for dramatic uplight
    const fillLight = new THREE.DirectionalLight(0xffd166, 0.5);
    fillLight.position.set(0, -3, 2);
    scene.add(fillLight);

    // BUTTERY SMOOTH ANIMATION LOOP - Frame-rate independent
    const clock = new THREE.Clock();
    let animId: number;
    let smoothP = 0;
    let lastTime = 0;

    const animate = (timestamp: number) => {
      animId = requestAnimationFrame(animate);

      // Throttle to ~60fps on high refresh rate displays
      const deltaMs = timestamp - lastTime;
      if (deltaMs < 14) return; // Skip if less than ~14ms
      lastTime = timestamp;

      const delta = Math.min(clock.getDelta(), 0.05); // Cap delta to prevent jumps
      const elapsedTime = clock.getElapsedTime();

      // Ultra-smooth exponential interpolation
      const targetP = scrollRef.current;
      const lerpFactor = 1 - Math.exp(-6 * delta);
      smoothP += (targetP - smoothP) * lerpFactor;

      // Candle flame flicker (simplified for performance)
      for (let idx = 0; idx < flames.length; idx++) {
        const f = flames[idx];
        const flicker = Math.sin(elapsedTime * 12 + idx * 2.5) * 0.15 + Math.cos(elapsedTime * 18 + idx) * 0.1;
        f.light.intensity = f.baseIntensity + flicker;
        f.mesh.scale.y = 1 + flicker * 0.4;
      }

      // Keep rotation fixed
      cakeGroup.rotation.y = 0;

      // Sparkles rise gently (batch update)
      const positions = sparkleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < sparkleCount * 3; i += 3) {
        positions[i] += 0.008;
        if (positions[i] > 4.5) positions[i] = -1;
      }
      sparkleGeo.attributes.position.needsUpdate = true;

      // SCROLL-DRIVEN CAMERA CHOREOGRAPHY with smoothstep easing
      const isMobileScreen = container.clientWidth < 768;
      const frontCamZ = isMobileScreen ? 10.5 : 8.0;

      if (smoothP <= 0.20) {
        const t1 = smoothP / 0.20;
        const easedT1 = t1 * t1 * (3 - 2 * t1); // smoothstep
        cakeGroup.position.x = THREE.MathUtils.lerp(initialCakeX, 0, easedT1);
        cakeGroup.rotation.x = 0;
        camera.up.set(0, 1, 0);
        camera.position.set(0, 3.2, frontCamZ);
        camera.lookAt(cakeGroup.position.x, 1.5, 0);
      } else if (smoothP <= 0.60) {
        cakeGroup.position.x = 0;
        cakeGroup.rotation.x = 0;

        const t2 = (smoothP - 0.20) / 0.40;
        const easedT2 = t2 * t2 * (3 - 2 * t2); // smoothstep

        const droneY = THREE.MathUtils.lerp(3.2, 5.8, easedT2);
        const droneZ = THREE.MathUtils.lerp(frontCamZ, 0.45, easedT2);

        const upY = THREE.MathUtils.lerp(1, 0.01, easedT2);
        const upZ = THREE.MathUtils.lerp(0, -1, easedT2);
        camera.up.set(0, upY, upZ);

        camera.position.set(0, droneY, droneZ);

        const lookTargetY = THREE.MathUtils.lerp(1.5, 3.11, easedT2);
        camera.lookAt(0, lookTargetY, 0);
      } else {
        cakeGroup.position.x = 0;
        cakeGroup.rotation.x = 0;

        const t3 = Math.min(1, (smoothP - 0.60) / 0.36);
        const easedT3 = t3 * t3 * (3 - 2 * t3);

        const startDroneY = 5.8;
        const targetMacroY = 3.25;
        const startDroneZ = 0.45;
        const targetMacroZ = 0.02;

        camera.up.set(0, 0, -1);
        camera.position.x = 0;
        camera.position.y = THREE.MathUtils.lerp(startDroneY, targetMacroY, easedT3);
        camera.position.z = THREE.MathUtils.lerp(startDroneZ, targetMacroZ, easedT3);

        camera.lookAt(0, 3.11, 0);

        if (smoothP >= 0.95 && onEnterMessage) {
          onEnterMessage();
        }
      }

      renderer.render(scene, camera);
    };

    animate(0);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose geometries and materials
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, [cakeText, onEnterMessage]);

  return <div ref={mountRef} className="w-full h-full relative" />;
}
