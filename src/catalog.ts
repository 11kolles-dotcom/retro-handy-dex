// Katalog der sammelbaren Handys (1995–2020).
// Neue Modelle einfach unten ergänzen. Die ID wird aus Marke + Modell gebildet
// und darf sich danach nicht mehr ändern, weil die Sammlung daran hängt.

export type FormFactor = 'bar' | 'flip' | 'slider' | 'qwerty' | 'smart';

/** 1 = häufig, 2 = selten, 3 = legendär */
export type Rarity = 1 | 2 | 3;

export interface Phone {
  id: string;
  no: number;
  brand: string;
  model: string;
  year: number;
  type: FormFactor;
  rarity: Rarity;
}

type Row = [brand: string, model: string, year: number, type: FormFactor, rarity?: Rarity];

const rows: Row[] = [
  // Nokia
  ['Nokia', '8110', 1996, 'slider', 3],
  ['Nokia', '9000 Communicator', 1996, 'qwerty', 3],
  ['Nokia', '6110', 1997, 'bar', 2],
  ['Nokia', '5110', 1998, 'bar'],
  ['Nokia', '6150', 1998, 'bar'],
  ['Nokia', '3210', 1999, 'bar'],
  ['Nokia', '8210', 1999, 'bar'],
  ['Nokia', '7110', 1999, 'slider', 2],
  ['Nokia', '8850', 1999, 'slider', 2],
  ['Nokia', '3310', 2000, 'bar'],
  ['Nokia', '6210', 2000, 'bar'],
  ['Nokia', '3330', 2001, 'bar'],
  ['Nokia', '8310', 2001, 'bar', 2],
  ['Nokia', '6310i', 2002, 'bar'],
  ['Nokia', '3410', 2002, 'bar'],
  ['Nokia', '3510i', 2002, 'bar'],
  ['Nokia', '7210', 2002, 'bar'],
  ['Nokia', '7650', 2002, 'slider', 2],
  ['Nokia', '1100', 2003, 'bar'],
  ['Nokia', '3100', 2003, 'bar'],
  ['Nokia', '6600', 2003, 'bar'],
  ['Nokia', 'N-Gage', 2003, 'qwerty', 3],
  ['Nokia', '7610', 2004, 'bar', 2],
  ['Nokia', '6230i', 2005, 'bar'],
  ['Nokia', 'N70', 2005, 'bar'],
  ['Nokia', '6300', 2007, 'bar'],
  ['Nokia', 'N95', 2007, 'slider', 2],
  ['Nokia', 'E71', 2008, 'qwerty'],
  ['Nokia', '5800 XpressMusic', 2008, 'smart'],
  ['Nokia', 'N97', 2009, 'slider'],
  ['Nokia', 'N8', 2010, 'smart'],
  ['Nokia', 'Lumia 800', 2011, 'smart'],
  ['Nokia', 'Lumia 920', 2012, 'smart'],
  ['Nokia', 'Lumia 1020', 2013, 'smart', 2],
  ['Nokia', '3310 (2017)', 2017, 'bar'],

  // Motorola
  ['Motorola', 'StarTAC', 1996, 'flip', 3],
  ['Motorola', 'V3688', 1998, 'flip', 2],
  ['Motorola', 'Timeport L7089', 1999, 'flip'],
  ['Motorola', 'T720', 2002, 'flip'],
  ['Motorola', 'RAZR V3', 2004, 'flip'],
  ['Motorola', 'ROKR E1', 2005, 'bar'],
  ['Motorola', 'PEBL U6', 2005, 'flip'],
  ['Motorola', 'SLVR L7', 2005, 'bar'],
  ['Motorola', 'KRZR K1', 2006, 'flip'],
  ['Motorola', 'RIZR Z3', 2006, 'slider'],
  ['Motorola', 'Milestone', 2009, 'slider'],
  ['Motorola', 'Moto X', 2013, 'smart'],
  ['Motorola', 'Moto G', 2013, 'smart'],
  ['Motorola', 'Moto G5', 2017, 'smart'],
  ['Motorola', 'RAZR (2019)', 2019, 'flip', 2],

  // Siemens
  ['Siemens', 'S25', 1999, 'bar', 2],
  ['Siemens', 'C35i', 2000, 'bar'],
  ['Siemens', 'S35i', 2000, 'bar'],
  ['Siemens', 'ME45', 2001, 'bar'],
  ['Siemens', 'S45', 2001, 'bar'],
  ['Siemens', 'SL45', 2001, 'bar', 2],
  ['Siemens', 'C55', 2002, 'bar'],
  ['Siemens', 'S55', 2002, 'bar'],
  ['Siemens', 'M55', 2003, 'bar'],
  ['Siemens', 'SL55', 2003, 'slider', 2],
  ['Siemens', 'C65', 2004, 'bar'],
  ['Siemens', 'CX65', 2004, 'bar'],
  ['Siemens', 'S65', 2004, 'bar'],
  ['Siemens', 'SX1', 2004, 'bar', 3],

  // Ericsson / Sony Ericsson / Sony
  ['Ericsson', 'GA628', 1996, 'bar', 2],
  ['Ericsson', 'T10s', 1998, 'flip'],
  ['Ericsson', 'T28s', 1999, 'flip', 2],
  ['Ericsson', 'R310s', 1999, 'bar', 2],
  ['Ericsson', 'R380', 2000, 'flip', 3],
  ['Ericsson', 'T39m', 2001, 'flip'],
  ['Sony Ericsson', 'T68i', 2002, 'bar'],
  ['Sony Ericsson', 'P800', 2002, 'smart', 2],
  ['Sony Ericsson', 'T610', 2003, 'bar'],
  ['Sony Ericsson', 'K700i', 2004, 'bar'],
  ['Sony Ericsson', 'K750i', 2005, 'bar'],
  ['Sony Ericsson', 'W800i', 2005, 'bar'],
  ['Sony Ericsson', 'W810i', 2006, 'bar'],
  ['Sony Ericsson', 'K800i', 2006, 'bar'],
  ['Sony Ericsson', 'W910i', 2007, 'slider'],
  ['Sony Ericsson', 'C905', 2008, 'slider'],
  ['Sony Ericsson', 'Xperia X10', 2010, 'smart'],
  ['Sony', 'Xperia Z', 2013, 'smart'],
  ['Sony', 'Xperia Z3', 2014, 'smart'],
  ['Sony', 'Xperia XZ', 2016, 'smart'],

  // Samsung
  ['Samsung', 'SGH-A800', 2000, 'flip', 2],
  ['Samsung', 'SGH-T100', 2002, 'flip'],
  ['Samsung', 'SGH-E700', 2003, 'flip'],
  ['Samsung', 'SGH-D500', 2004, 'slider'],
  ['Samsung', 'SGH-E900', 2006, 'slider'],
  ['Samsung', 'SGH-E250', 2006, 'slider'],
  ['Samsung', 'SGH-X820', 2006, 'bar'],
  ['Samsung', 'SGH-U600', 2007, 'slider'],
  ['Samsung', 'F480 Tocco', 2008, 'smart'],
  ['Samsung', 'Galaxy S', 2010, 'smart'],
  ['Samsung', 'Galaxy S II', 2011, 'smart'],
  ['Samsung', 'Galaxy Note', 2011, 'smart'],
  ['Samsung', 'Galaxy S III', 2012, 'smart'],
  ['Samsung', 'Galaxy S4', 2013, 'smart'],
  ['Samsung', 'Galaxy S5', 2014, 'smart'],
  ['Samsung', 'Galaxy S6', 2015, 'smart'],
  ['Samsung', 'Galaxy S7 Edge', 2016, 'smart'],
  ['Samsung', 'Galaxy Note 7', 2016, 'smart', 3],
  ['Samsung', 'Galaxy S8', 2017, 'smart'],
  ['Samsung', 'Galaxy S10', 2019, 'smart'],
  ['Samsung', 'Galaxy Fold', 2019, 'smart', 3],
  ['Samsung', 'Galaxy Z Flip', 2020, 'flip', 2],

  // Apple
  ['Apple', 'iPhone', 2007, 'smart', 3],
  ['Apple', 'iPhone 3G', 2008, 'smart', 2],
  ['Apple', 'iPhone 3GS', 2009, 'smart'],
  ['Apple', 'iPhone 4', 2010, 'smart'],
  ['Apple', 'iPhone 4S', 2011, 'smart'],
  ['Apple', 'iPhone 5', 2012, 'smart'],
  ['Apple', 'iPhone 5s', 2013, 'smart'],
  ['Apple', 'iPhone 6', 2014, 'smart'],
  ['Apple', 'iPhone 6s', 2015, 'smart'],
  ['Apple', 'iPhone SE', 2016, 'smart'],
  ['Apple', 'iPhone 7', 2016, 'smart'],
  ['Apple', 'iPhone X', 2017, 'smart'],
  ['Apple', 'iPhone XR', 2018, 'smart'],
  ['Apple', 'iPhone 11', 2019, 'smart'],
  ['Apple', 'iPhone 12', 2020, 'smart'],

  // BlackBerry
  ['BlackBerry', '5810', 2002, 'qwerty', 2],
  ['BlackBerry', '7230', 2003, 'qwerty'],
  ['BlackBerry', 'Pearl 8100', 2006, 'bar'],
  ['BlackBerry', 'Curve 8300', 2007, 'qwerty'],
  ['BlackBerry', 'Bold 9000', 2008, 'qwerty'],
  ['BlackBerry', 'Bold 9700', 2009, 'qwerty'],
  ['BlackBerry', 'Torch 9800', 2010, 'slider'],
  ['BlackBerry', 'Q10', 2013, 'qwerty'],
  ['BlackBerry', 'Passport', 2014, 'qwerty', 2],
  ['BlackBerry', 'KEYone', 2017, 'qwerty'],

  // HTC
  ['HTC', 'Touch', 2007, 'smart'],
  ['HTC', 'Dream (T-Mobile G1)', 2008, 'slider', 2],
  ['HTC', 'HD2', 2009, 'smart'],
  ['HTC', 'Desire', 2010, 'smart'],
  ['HTC', 'One (M7)', 2013, 'smart'],
  ['HTC', 'One (M8)', 2014, 'smart'],

  // LG
  ['LG', 'KG800 Chocolate', 2006, 'slider'],
  ['LG', 'KE850 Prada', 2007, 'smart', 2],
  ['LG', 'KP500 Cookie', 2008, 'smart'],
  ['LG', 'Optimus 2X', 2011, 'smart'],
  ['LG', 'Nexus 4', 2012, 'smart'],
  ['LG', 'G2', 2013, 'smart'],
  ['LG', 'Nexus 5', 2013, 'smart'],
  ['LG', 'G3', 2014, 'smart'],

  // Palm
  ['Palm', 'Treo 650', 2004, 'qwerty', 2],
  ['Palm', 'Pre', 2009, 'slider', 2],

  // Google
  ['Google', 'Pixel', 2016, 'smart'],
  ['Google', 'Pixel 3', 2018, 'smart'],

  // Huawei
  ['Huawei', 'P9', 2016, 'smart'],
  ['Huawei', 'P20 Pro', 2018, 'smart'],
  ['Huawei', 'Mate 20 Pro', 2018, 'smart'],

  // Xiaomi
  ['Xiaomi', 'Mi 1', 2011, 'smart', 2],
  ['Xiaomi', 'Mi Mix', 2016, 'smart', 2],

  // OnePlus
  ['OnePlus', 'One', 2014, 'smart'],
  ['OnePlus', '3T', 2016, 'smart'],

  // Weitere Marken
  ['Hagenuk', 'GlobalHandy', 1996, 'bar', 3],
  ['Philips', 'Genie', 1997, 'bar', 2],
  ['Bosch', '909', 1997, 'bar', 2],
  ['Alcatel', 'One Touch Easy', 1998, 'bar', 2],
  ['Panasonic', 'GD55', 2002, 'bar', 2],
  ['Sharp', 'GX10', 2002, 'flip', 2],
];

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Nummeriert nach Erscheinungsjahr, dann Marke, dann Modell.
export const phones: Phone[] = rows
  .map(([brand, model, year, type, rarity]) => ({
    id: slug(`${brand}-${model}`),
    no: 0,
    brand,
    model,
    year,
    type,
    rarity: rarity ?? 1,
  }))
  .sort((a, b) => a.year - b.year || a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model))
  .map((p, i) => ({ ...p, no: i + 1 }));

export const phoneById = new Map(phones.map((p) => [p.id, p]));

export const brands = [...new Set(phones.map((p) => p.brand))].sort((a, b) => a.localeCompare(b));

export const typeLabel: Record<FormFactor, string> = {
  bar: 'Barren',
  flip: 'Klapphandy',
  slider: 'Slider',
  qwerty: 'Tastatur',
  smart: 'Smartphone',
};

export const rarityLabel: Record<Rarity, string> = {
  1: 'Häufig',
  2: 'Selten',
  3: 'Legendär',
};

// Kräftige Pixel-Farben pro Marke
const brandColors: Record<string, string> = {
  Nokia: '#3b6cff',
  Motorola: '#ff7a1a',
  Siemens: '#19c3b4',
  Ericsson: '#36d16b',
  'Sony Ericsson': '#9bd700',
  Sony: '#8a7dff',
  Samsung: '#2f8cff',
  Apple: '#c9c9d6',
  BlackBerry: '#5a5a74',
  HTC: '#7bd33a',
  LG: '#ff3d77',
  Palm: '#b05cff',
  Google: '#ffc21a',
  Huawei: '#ff4b3a',
  Xiaomi: '#ff8c3a',
  OnePlus: '#ff2e4d',
};

export function brandColor(brand: string): string {
  return brandColors[brand] ?? '#ffd23f';
}
