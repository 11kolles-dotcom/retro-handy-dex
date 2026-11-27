// Selbst gezeichnete Pixel-Silhouetten pro Bauform.
// k = Kontur, # = Gehäuse, o = Display, + = Tasten, . = transparent

import type { FormFactor } from './catalog';

const sprites: Record<FormFactor, string[]> = {
  bar: [
    '........kk..',
    '.......k##k.',
    '..kkkkkk##k.',
    '.k########k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k########k.',
    '.k#++##++#k.',
    '.k########k.',
    '.k++#++#++k.',
    '.k########k.',
    '.k++#++#++k.',
    '.k########k.',
    '.k++#++#++k.',
    '.k########k.',
    '.k++#++#++k.',
    '.k########k.',
    '..kkkkkkkk..',
  ],
  flip: [
    '..kkkkkkkk..',
    '.k########k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k########k.',
    '..kkkkkkkk..',
    '...k####k...',
    '..kkkkkkkk..',
    '.k########k.',
    '.k#++++++#k.',
    '.k########k.',
    '.k++#++#++k.',
    '.k########k.',
    '.k++#++#++k.',
    '.k########k.',
    '.k++#++#++k.',
    '.k########k.',
    '..kkkkkkkk..',
  ],
  slider: [
    '..kkkkkkkk..',
    '.k########k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k#oooooo#k.',
    '.k########k.',
    '.k#++##++#k.',
    '.k########k.',
    '.kkkkkkkkkk.',
    '.k++#++#++k.',
    '.k########k.',
    '.k++#++#++k.',
    '.k########k.',
    '.k++#++#++k.',
    '..kkkkkkkk..',
  ],
  qwerty: [
    '.kkkkkkkkkk.',
    'k##########k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k##########k',
    'k###++++###k',
    'k##########k',
    'k+#+#+#+#+#k',
    'k#+#+#+#+#+k',
    'k+#+#+#+#+#k',
    'k##########k',
    '.kkkkkkkkkk.',
  ],
  smart: [
    '.kkkkkkkkkk.',
    'k##########k',
    'k###kkkk###k',
    'k##########k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k#oooooooo#k',
    'k##########k',
    'k####++####k',
    'k##########k',
    '.kkkkkkkkkk.',
  ],
};

function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s: number) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)));
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}

/** Liefert ein SVG der Silhouette. `owned = false` zeigt nur den Schatten. */
export function phoneSprite(type: FormFactor, color: string, owned: boolean): string {
  const rows = sprites[type];
  const w = 12;
  const h = rows.length;
  const palette: Record<string, string> = owned
    ? { k: '#1a1033', '#': color, o: '#bff7e8', '+': shade(color, 0.6) }
    : { k: '#1a1033', '#': '#3b2f63', o: '#2c2350', '+': '#2c2350' };

  let rects = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === c) run++;
      if (c !== '.') rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${palette[c]}"/>`;
      x += run;
    }
  });
  // kleiner Glanzpunkt auf dem Display
  if (owned) {
    const sy = rows.findIndex((r) => r.includes('o'));
    const sx = rows[sy].indexOf('o');
    rects += `<rect x="${sx}" y="${sy}" width="2" height="1" fill="#ffffff"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" class="sprite">${rects}</svg>`;
}
