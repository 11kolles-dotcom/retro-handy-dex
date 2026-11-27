// Erzeugt die App-Icons (PNG) aus einer Pixel-Grafik. Aufruf: npm run icons
import { writeFileSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';

const sprite = [
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
];
const pal = { k: [26, 16, 51], '#': [255, 210, 63], o: [191, 247, 232], '+': [180, 120, 20] };
const bg = [255, 61, 119];

function png(size, pad) {
  // Gitter: Sprite zentriert auf quadratischem Raster
  const grid = Math.ceil(sprite.length / (1 - 2 * pad));
  const ox = Math.floor((grid - 12) / 2);
  const oy = Math.floor((grid - sprite.length) / 2);
  const cell = size / grid;
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const gx = Math.floor(x / cell) - ox;
      const gy = Math.floor(y / cell) - oy;
      const ch = sprite[gy]?.[gx];
      const c = ch && ch !== '.' ? pal[ch] : bg;
      raw.set(c, y * (size * 3 + 1) + 1 + x * 3);
    }
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
  ihdr[8] = 8; // Bit-Tiefe
  ihdr[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

writeFileSync('public/icon-192.png', png(192, 0.1));
writeFileSync('public/icon-512.png', png(512, 0.1));
writeFileSync('public/icon-512-maskable.png', png(512, 0.22));
writeFileSync('public/apple-touch-icon.png', png(180, 0.12));
console.log('Icons erstellt.');
