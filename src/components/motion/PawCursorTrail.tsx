"use client";

import { useEffect, useRef } from "react";

export type PawPrint = {
  x: number;
  y: number;
  angle: number;
  born: number;
  size: number;
};

const STRIDE_PX = 42;
const SIDE_OFFSET_PX = 7;
const LIFETIME_MS = 900;
const MAX_PRINTS = 40;

/**
 * Pure stride helper: if the pointer has moved at least `STRIDE_PX` from `last`,
 * appends a new paw print offset to alternating sides of the travel vector.
 */
export function stepPawTrail(
  prints: PawPrint[],
  last: { x: number; y: number },
  next: { x: number; y: number },
  step: number,
  now: number,
): { spawned: boolean; step: number; anchor: { x: number; y: number } } {
  const dx = next.x - last.x;
  const dy = next.y - last.y;
  const dist = Math.hypot(dx, dy);
  if (dist < STRIDE_PX) return { spawned: false, step, anchor: last };

  const heading = Math.atan2(dy, dx);
  const side = step % 2 === 0 ? 1 : -1;
  const perpX = -Math.sin(heading) * SIDE_OFFSET_PX * side;
  const perpY = Math.cos(heading) * SIDE_OFFSET_PX * side;

  prints.push({
    x: next.x + perpX,
    y: next.y + perpY,
    angle: heading + Math.PI / 2,
    born: now,
    size: 14,
  });
  if (prints.length > MAX_PRINTS) prints.splice(0, prints.length - MAX_PRINTS);
  return { spawned: true, step: step + 1, anchor: next };
}

function drawPaw(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const s = size / 64;
  ctx.scale(s, s);
  ctx.translate(-32, -32);
  ctx.fillStyle = `rgba(162, 74, 26, ${alpha.toFixed(3)})`;

  // Main pad
  ctx.beginPath();
  ctx.ellipse(32, 41, 14, 11.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Four toes
  const toes: [number, number, number, number, number][] = [
    [14.5, 29, 5.2, 7.2, -0.45],
    [24, 16.5, 5.4, 7.5, -0.15],
    [40, 16.5, 5.4, 7.5, 0.15],
    [49.5, 29, 5.2, 7.2, 0.45],
  ];
  for (const [cx, cy, rx, ry, rot] of toes) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Full-viewport overlay canvas that stamps soft fading puppy paw prints
 * as a fine-pointer visitor moves across the page.
 */
export function PawCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof window.matchMedia === "function") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prints: PawPrint[] = [];
    let anchor: { x: number; y: number } | null = null;
    let step = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (now: number) => {
      raf = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = prints.length - 1; i >= 0; i--) {
        const p = prints[i];
        const age = now - p.born;
        if (age >= LIFETIME_MS) {
          prints.splice(i, 1);
          continue;
        }
        const t = age / LIFETIME_MS;
        const alpha = (1 - t) * (1 - t) * 0.42;
        const scale = 0.85 + Math.min(t * 4, 1) * 0.2;
        drawPaw(ctx, p.x, p.y, p.angle, p.size * scale, alpha);
      }
      if (prints.length > 0) raf = requestAnimationFrame(draw);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const pt = { x: e.clientX, y: e.clientY };
      if (!anchor) {
        anchor = pt;
        return;
      }
      const res = stepPawTrail(prints, anchor, pt, step, performance.now());
      if (res.spawned) {
        step = res.step;
        anchor = res.anchor;
        kick();
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      prints.push({ x: e.clientX, y: e.clientY, angle: (Math.random() - 0.5) * 0.4, born: performance.now(), size: 17 });
      if (prints.length > MAX_PRINTS) prints.shift();
      kick();
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] size-full" />;
}
