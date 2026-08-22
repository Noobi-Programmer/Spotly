/**
 * Pure Web Audio API Synthesizer for instant zero-latency alert chimes.
 * Does not require external MP3 files or network downloads.
 */
export function playAlertChime() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First note: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.6);

    // Second note harmonic: G5 (783.99 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(783.99, now + 0.15); // G5
    osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3); // C6

    gain2.gain.setValueAtTime(0, now + 0.15);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.15);
    osc2.stop(now + 0.85);
  } catch (err) {
    console.warn('Audio chime playback failed:', err);
  }
}
