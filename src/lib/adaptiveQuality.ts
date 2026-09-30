'use client';

export type QualityTier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DeviceProfile {
  tier: QualityTier;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  maxDpr: number;
  particlesMultiplier: number;
  enableVideoScrubbing: boolean;
}

export function detectDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined') {
    return {
      tier: 'HIGH',
      isMobile: false,
      prefersReducedMotion: false,
      maxDpr: 2,
      particlesMultiplier: 1,
      enableVideoScrubbing: true,
    };
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

  let tier: QualityTier = 'HIGH';

  if (prefersReducedMotion || hardwareConcurrency <= 2 || deviceMemory <= 2) {
    tier = 'LOW';
  } else if (isMobile || hardwareConcurrency <= 4 || deviceMemory <= 4) {
    tier = 'MEDIUM';
  }

  return {
    tier,
    isMobile,
    prefersReducedMotion,
    maxDpr: tier === 'HIGH' ? 2 : tier === 'MEDIUM' ? 1.5 : 1,
    particlesMultiplier: tier === 'HIGH' ? 1 : tier === 'MEDIUM' ? 0.5 : 0.2,
    enableVideoScrubbing: tier !== 'LOW',
  };
}
