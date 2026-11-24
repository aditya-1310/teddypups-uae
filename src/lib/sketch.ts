/**
 * Procedural "sketchbook" decoration for puppy cards: a watercolour wash, a wobbly
 * photo mask, an ink outline and a few doodles. Seeded by the puppy slug so every
 * render (server or client) draws the same picture.
 */

const WASHES = ["#f2be6b", "#bfddf5", "#fbe3b4", "#e8c39a", "#f9cdbf"] as const;
export const DOODLES = ["swirl", "paw", "whoosh", "dots", "star", "heart"] as const;
export type Doodle = { kind: (typeof DOODLES)[number]; transform: string };

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** mulberry32: tiny, fast, deterministic PRNG. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(2);

/** A closed, gently wobbling loop centred in a 100x100 box. */
export function blobPath(rand: () => number, radius: number, wobble: number, points = 36) {
  const phase = rand() * Math.PI * 2;
  const k1 = 2 + Math.floor(rand() * 2);
  const k2 = 3 + Math.floor(rand() * 3);
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const r = radius * (1 + wobble * Math.sin(k1 * a + phase) + wobble * 0.6 * Math.cos(k2 * a - phase));
    pts.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]);
  }
  // Catmull-Rom through the points, expressed as cubic Béziers.
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < points; i++) {
    const p0 = pts[(i - 1 + points) % points];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % points];
    const p3 = pts[(i + 2) % points];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}

/** An open arc that partly retraces the outline, like a second pencil pass. */
function retracePath(rand: () => number) {
  const start = Math.PI * (0.45 + rand() * 0.3);
  const sweep = Math.PI * (1.1 + rand() * 0.4);
  const r = 47 + rand() * 3;
  let d = "";
  for (let i = 0; i <= 24; i++) {
    const a = start + (sweep * i) / 24;
    const rr = r * (1 + 0.03 * Math.sin(i * 0.9));
    d += `${i ? "L" : "M"}${f(50 + rr * Math.cos(a))} ${f(50 + rr * Math.sin(a))}`;
  }
  return d;
}

// Spots around the frame where doodles sit (left edge, right edge, top-left).
const SPOTS: [number, number][] = [
  [-6, 58],
  [105, 55],
  [20, 2],
];

export function sketchDecor(slug: string, index: number) {
  const rand = rng(hash(slug));
  const tilt = Number(((rand() * 2 - 1) * 2.4).toFixed(2));
  const wash = WASHES[Math.floor(rand() * WASHES.length)];
  const washShift = `${f((rand() * 2 - 1) * 4.5)}% ${f(3 + rand() * 4)}%`;
  const washPath = blobPath(rand, 46, 0.035);
  const mask = blobPath(rand, 45, 0.03);
  const ink = blobPath(rand, 48, 0.03);
  const retrace = retracePath(rand);

  const count = 1 + Math.floor(rand() * 3);
  const spots = [...SPOTS].sort(() => rand() - 0.5).slice(0, count);
  const doodles: Doodle[] = spots.map(([x, y]) => ({
    kind: DOODLES[Math.floor(rand() * DOODLES.length)],
    transform: `translate(${(x + (rand() * 2 - 1) * 2).toFixed(1)} ${(y + (rand() * 2 - 1) * 12).toFixed(1)}) rotate(${Math.round((rand() * 2 - 1) * 25)}) scale(${(0.85 + rand() * 0.35).toFixed(2)})`,
  }));

  return { tilt, delay: `${(index % 8) * 70}ms`, wash, washShift, washPath, mask, ink, retrace, doodles };
}

/** CSS mask-image value that clips a photo to `path`. */
export function maskUrl(path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${path}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
