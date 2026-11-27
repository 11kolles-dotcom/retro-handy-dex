// Erzeugt die App-Icons (PNG + SVG) aus einer 32x32-Pixel-Grafik. Aufruf: npm run icons
import { writeFileSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';

const N = 32;
const C = {
  navy: [26, 16, 51],
  ink: [13, 8, 32],
  pink: [255, 61, 119],
  purple: [122, 43, 214],
  yellow: [255, 210, 63],
  orange: [255, 140, 26],
  key: [196, 120, 18],
  screen: [125, 255, 90],
  screenDark: [40, 130, 40],
  cyan: [61, 224, 255],
  white: [255, 255, 255],
};

// Handy (12 x 21): k Kontur, # Gehäuse, h Glanz, o Display, d Display-Pixel, + Tasten, n Navi
const phone = [
  '........kk..',
  '.......k#hk.',
  '.......k##k.',
  '..kkkkkk##k.',
  '.k#hhhhh##k.',
  '.k#oooooo#k.',
  '.k#odoodo#k.',
  '.k#odoodo#k.',
  '.k#oooooo#k.',
  '.k#dooood#k.',
  '.k#oddddo#k.',
  '.k#oooooo#k.',
  '.k########k.',
  '.k#nn##nn#k.',
  '.k########k.',
  '.k++#++#++k.',
  '.k########k.',
  '.k++#++#++k.',
  '.k########k.',
  '.k++#++#++k.',
  '..kkkkkkkk..',
];

const sparkle = (g, x, y, col) => {
  for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) g[y + dy][x + dx] = col;
};

function build() {
  const g = Array.from({ length: N }, () => Array(N).fill(C.navy));
  const cx = 15.5, cy = 16.5;
  // Sonnenstrahlen-Hintergrund
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const a = Math.atan2(y - cy, x - cx);
      const seg = Math.floor(((a + Math.PI) / (2 * Math.PI)) * 16);
      g[y][x] = seg % 2 ? C.purple : C.pink;
      const r = Math.hypot(x - cx, y - cy);
      if (r < 11.5) g[y][x] = C.yellow; // Kreis hinter dem Handy
      if (r >= 11.5 && r < 13) g[y][x] = C.ink; // Ring
    }
  // Handy mit Schatten
  const ox = 10, oy = 6;
  phone.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== '.') g[oy + y + 1][ox + x + 1] = C.ink; // Schatten
    }),
  );
  const pal = { k: C.ink, '#': C.cyan, h: C.white, o: C.screen, d: C.screenDark, '+': [20, 120, 160], n: C.white };
  phone.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== '.') g[oy + y][ox + x] = pal[ch];
    }),
  );
  // Funkwellen an der Antenne
  const waves = [
    [21, 4], [22, 5], [22, 6], [21, 7],
    [23, 2], [24, 3], [25, 4], [25, 5], [25, 6], [24, 7], [23, 8],
  ];
  for (const [x, y] of waves) g[y][x] = C.white;
  // Funkeln
  sparkle(g, 5, 6, C.white);
  sparkle(g, 26, 25, C.white);
  sparkle(g, 4, 25, C.yellow);
  return g;
}

function png(grid, size) {
  const cell = size / N;
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) raw.set(grid[Math.floor(y / cell)][Math.floor(x / cell)], y * (size * 3 + 1) + 1 + x * 3);
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function svg(grid) {
  let r = '';
  grid.forEach((row, y) => row.forEach((c, x) => (r += `<rect x="${x}" y="${y}" width="1" height="1" fill="rgb(${c})"/>`)));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges">${r}</svg>`;
}

const icon = build();
writeFileSync('public/icon-192.png', png(icon, 192));
writeFileSync('public/icon-512.png', png(icon, 512));
writeFileSync('public/apple-touch-icon.png', png(icon, 192));
writeFileSync('public/icon-512-maskable.png', png(icon, 512));
writeFileSync('public/favicon.svg', svg(icon));
console.log('Icons erstellt.');
