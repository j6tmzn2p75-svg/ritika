'use client';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlayingBgm: boolean = false;
  private bgmInterval: NodeJS.Timeout | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private currentStep: number = 0;

  // Tangled-inspired fairytale pentatonic/diatonic chords (F# / D major dreamy cadence)
  // Notes in Hz: D4, F#4, A4, B4, C#5, D5, E5, F#5, A5
  private scale = [
    293.66, // D4
    369.99, // F#4
    440.00, // A4
    493.88, // B4
    554.37, // C#5
    587.33, // D5
    659.25, // E5
    739.99, // F#5
    880.00, // A5
    987.77, // B5
    1108.73 // C#6
  ];

  // Romantic arpeggio sequence
  private melodyPattern = [
    0, 2, 4, 5, 4, 2, 7, 5, 4, 3, 2, 1,
    0, 2, 5, 7, 8, 7, 5, 4, 2, 0, 3, 2,
    1, 3, 5, 6, 5, 3, 8, 6, 5, 4, 2, 1,
    0, 4, 7, 9, 8, 7, 5, 4, 2, 0, 2, 0
  ];

  constructor() {
    // Initialized lazily on first user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.customAudio) {
      this.customAudio.muted = muted;
    }
    if (muted && this.isPlayingBgm) {
      this.stopBGM();
    } else if (!muted && !this.isPlayingBgm) {
      this.startBGM();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public startBGM(customUrl?: string) {
    if (this.isMuted) return;
    this.initContext();

    if (customUrl) {
      try {
        if (!this.customAudio) {
          this.customAudio = new Audio(customUrl);
          this.customAudio.loop = true;
        } else {
          this.customAudio.src = customUrl;
        }
        this.customAudio.play().catch(() => {
          this.startProceduralBGM();
        });
        this.isPlayingBgm = true;
        return;
      } catch (e) {
        console.warn('Failed custom audio, falling back to procedural:', e);
      }
    }

    this.startProceduralBGM();
  }

  private startProceduralBGM() {
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;

    // Play a note every 450ms for a gentle, dreamy harp arpeggio
    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const noteIndex = this.melodyPattern[this.currentStep % this.melodyPattern.length];
      const freq = this.scale[noteIndex % this.scale.length];
      this.playHarpPluck(freq, 0.08);

      // Play soft warm bass drone every 12 steps
      if (this.currentStep % 12 === 0) {
        const bassFreq = this.scale[0] / 2; // D3
        this.playWarmPad(bassFreq, 0.05, 4.0);
      }

      this.currentStep++;
    }, 480);
  }

  public stopBGM() {
    this.isPlayingBgm = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  private playHarpPluck(freq: number, volume: number = 0.1) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Dreamy triangle/sine mix
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Lowpass filter for warm acoustic harp warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3, now);
      filter.frequency.exponentialRampToValueAtTime(freq, now + 1.2);

      // Bell/harp envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch {
      // AudioContext unavailable or error
    }
  }

  private playWarmPad(freq: number, volume: number, duration: number) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Subtle detune for shimmer
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.002, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.1);
      osc2.stop(now + duration + 0.1);
    } catch {
      // Ignore audio error
    }
  }

  // SOUND EFFECTS

  public playKeypadClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playMagicChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6
      notes.forEach((freq, i) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.65);
        }, i * 65);
      });
    } catch {}
  }

  public playWrongSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playBirthdayFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      // Grand celebratory chime chord
      const chords = [
        [293.66, 440, 587.33, 739.99],
        [369.99, 554.37, 739.99, 987.77],
        [440, 659.25, 880, 1174.66],
        [587.33, 880, 1174.66, 1479.98, 1760]
      ];
      chords.forEach((chord, step) => {
        setTimeout(() => {
          if (!this.ctx) return;
          chord.forEach(f => {
            const now = this.ctx!.currentTime;
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = step === 3 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(f, now);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(now);
            osc.stop(now + 1.3);
          });
        }, step * 240);
      });
    } catch {}
  }

  public playCameraShutter() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // White noise burst for shutter click
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start(now);
    } catch {}
  }

  public playGiftOpening() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      freqs.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.85);
        }, idx * 50);
      });
    } catch {}
  }

  public playLetterSave() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      // Starry flourish
      const notes = [659.25, 880.00, 1174.66, 1760.00];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.55);
        }, i * 70);
      });
    } catch {}
  }
}

// Global singleton instance
export const soundManager = new AudioEngine();
