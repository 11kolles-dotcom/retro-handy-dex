// Kleine 8-Bit-Töne über die Web Audio API (eigene Melodien).

let ctx: AudioContext | null = null;
let muted = localStorageGet('muted') === '1';

function localStorageGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}

export function isMuted() {
  return muted;
}

export function setMuted(m: boolean) {
  muted = m;
  try {
    localStorage.setItem('muted', m ? '1' : '0');
  } catch {
    /* egal */
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'square', vol = 0.06) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur + 0.02);
}

function ready(): boolean {
  if (muted) return false;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return true;
}

export function blip() {
  if (ready()) tone(880, 0, 0.05);
}

export function caught() {
  if (!ready()) return;
  const notes = [523, 659, 784, 1047, 784, 1047];
  notes.forEach((f, i) => tone(f, i * 0.09, 0.12));
}

export function error() {
  if (!ready()) return;
  tone(220, 0, 0.12);
  tone(165, 0.12, 0.2);
}
