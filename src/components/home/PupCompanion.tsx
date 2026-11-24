"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TEDDY_POSES } from "@/components/teddy/poses";

export type PupStopRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  pageY: number;
  pose: string;
  behind: boolean;
  facing: 1 | -1;
};

export type PupFrame = {
  x: number;
  y: number;
  scale: number;
  pose: string;
  behind: boolean;
  facing: 1 | -1;
  traveling: boolean;
};

const BUBBLES = ["woof!", "hi friend!", "belly rubs?", "let's play!", "pick me!"];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Pure scroll-stop interpolator: finds which two `.pup-stop` anchors bracket
 * `anchorPageY` and smoothly interpolates Teddy's viewport coordinates, scale,
 * facing direction, and pose.
 */
export function interpolatePupStops(stops: PupStopRect[], anchorPageY: number): PupFrame {
  const first = stops[0];
  if (stops.length === 1 || anchorPageY <= first.pageY) {
    return {
      x: first.x,
      y: first.y,
      scale: first.w / 300,
      pose: first.pose,
      behind: first.behind,
      facing: first.facing,
      traveling: false,
    };
  }

  const last = stops[stops.length - 1];
  if (anchorPageY >= last.pageY) {
    return {
      x: last.x,
      y: last.y,
      scale: last.w / 300,
      pose: last.pose,
      behind: last.behind,
      facing: last.facing,
      traveling: false,
    };
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (anchorPageY >= a.pageY && anchorPageY <= b.pageY) {
      const span = Math.max(1, b.pageY - a.pageY);
      const rawT = (anchorPageY - a.pageY) / span;
      // Smoothstep for gentle acceleration/deceleration between scenes
      const t = rawT * rawT * (3 - 2 * rawT);
      const x = lerp(a.x, b.x, t);
      const y = lerp(a.y, b.y, t);
      const w = lerp(a.w, b.w, t);
      const traveling = rawT > 0.08 && rawT < 0.92;
      const dx = b.x - a.x;
      const facing: 1 | -1 = traveling && Math.abs(dx) > 24 ? (dx >= 0 ? 1 : -1) : rawT < 0.5 ? a.facing : b.facing;
      const pose = traveling ? "walk" : rawT < 0.5 ? a.pose : b.pose;
      const behind = rawT < 0.12 ? a.behind : rawT > 0.88 ? b.behind : false;
      return { x, y, scale: w / 300, pose, behind, facing, traveling };
    }
  }

  return {
    x: last.x,
    y: last.y,
    scale: last.w / 300,
    pose: last.pose,
    behind: last.behind,
    facing: last.facing,
    traveling: false,
  };
}

export function PupCompanion() {
  const layerRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const bodyWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [bubble, setBubble] = useState<string | null>(null);
  const bubbleIdxRef = useRef(0);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const petTeddy = () => {
    const text = BUBBLES[bubbleIdxRef.current % BUBBLES.length];
    bubbleIdxRef.current += 1;
    setBubble(text);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => setBubble(null), 1600);
  };

  useEffect(() => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    document.documentElement.setAttribute("data-pup", "true");
    if (layerRef.current) layerRef.current.hidden = false;

    let raf = 0;
    let curX = 0;
    let curY = 0;
    let curScale = 1;
    let initialized = false;
    let walkPhase = 0;
    let lastScrollY = window.scrollY;
    let lastPrintX = -999;
    let lastPrintY = -999;
    let printCursor = 0;
    let lastFront = true;

    const readStops = (): PupStopRect[] => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-pup-stop="true"]'));
      const sy = window.scrollY;
      const out: PupStopRect[] = [];
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.width < 10 || r.height < 10) continue;
        out.push({
          x: r.left,
          y: r.top,
          w: r.width,
          h: r.height,
          pageY: r.top + sy + r.height * 0.5,
          pose: el.getAttribute("data-pose") || "sit",
          behind: el.getAttribute("data-behind") === "true",
          facing: el.getAttribute("data-facing") === "left" ? -1 : 1,
        });
      }
      return out.sort((a, b) => a.pageY - b.pageY);
    };

    const tick = (now: number) => {
      const stops = readStops();
      if (stops.length > 0 && actorRef.current && bodyWrapRef.current && svgRef.current) {
        const sy = window.scrollY;
        const scrollVel = Math.abs(sy - lastScrollY);
        lastScrollY = sy;

        const anchorPageY = sy + window.innerHeight * 0.54;
        const target = interpolatePupStops(stops, anchorPageY);

        if (!initialized) {
          curX = target.x;
          curY = target.y;
          curScale = target.scale;
          initialized = true;
        } else {
          curX = lerp(curX, target.x, 0.22);
          curY = lerp(curY, target.y, 0.22);
          curScale = lerp(curScale, target.scale, 0.2);
        }

        const nextFront = !target.behind;
        if (nextFront !== lastFront) {
          lastFront = nextFront;
          if (layerRef.current) layerRef.current.setAttribute("data-front", nextFront ? "true" : "false");
        }

        const moving = target.traveling || (target.pose === "walk" && scrollVel > 0.5) || Math.hypot(target.x - curX, target.y - curY) > 4;
        if (moving) {
          walkPhase += 0.22 + Math.min(scrollVel * 0.015, 0.25);
        }

        const bob = moving ? Math.abs(Math.sin(walkPhase)) * -8 : Math.sin(now * 0.0026) * 1.4;
        actorRef.current.style.transform = `translate3d(${curX.toFixed(1)}px, ${(curY + bob).toFixed(1)}px, 0px)`;
        bodyWrapRef.current.style.transform = `scale(${curScale.toFixed(4)})`;

        // Animate articulated SVG rig parts
        const svg = svgRef.current;
        const root = svg.querySelector<SVGGElement>('[data-p="root"]');
        const body = svg.querySelector<SVGGElement>('[data-p="body"]');
        const shadow = svg.querySelector<SVGElement>('[data-p="shadow"]');
        const paws = svg.querySelector<SVGGElement>('[data-p="paws"]');
        const bf = svg.querySelector<SVGGElement>('[data-p="bf"]');
        const ff = svg.querySelector<SVGGElement>('[data-p="ff"]');
        const bn = svg.querySelector<SVGGElement>('[data-p="bn"]');
        const fn = svg.querySelector<SVGGElement>('[data-p="fn"]');
        const tail = svg.querySelector<SVGGElement>('[data-p="tail"]');
        const openEyes = svg.querySelector<SVGGElement>('[data-p="open"]');
        const shutEyes = svg.querySelector<SVGGElement>('[data-p="shut"]');

        const isPeek = target.pose === "peek" && !moving;
        if (root) {
          root.setAttribute("transform", `translate(150 0) scale(${target.facing} 1) translate(-150 0)`);
        }
        if (body) body.setAttribute("opacity", isPeek ? "0" : "1");
        if (shadow) shadow.setAttribute("opacity", isPeek ? "0" : "0.14");
        if (paws) paws.setAttribute("opacity", isPeek ? "1" : "0");

        const stride = moving ? Math.sin(walkPhase) * 24 : 0;
        if (bf) bf.setAttribute("transform", `translate(94 192) rotate(${stride.toFixed(1)})`);
        if (ff) ff.setAttribute("transform", `translate(168 192) rotate(${(-stride).toFixed(1)})`);
        if (bn) bn.setAttribute("transform", `translate(110 194) rotate(${(-stride).toFixed(1)})`);
        if (fn) fn.setAttribute("transform", `translate(184 194) rotate(${stride.toFixed(1)})`);

        const wag = moving ? Math.sin(walkPhase * 1.4) * 22 : Math.sin(now * 0.006) * 8 - 16;
        if (tail) tail.setAttribute("transform", `rotate(${wag.toFixed(1)} 84 150)`);

        // Periodic natural blink every ~4.2 seconds
        const blink = now % 4200 > 4060;
        if (openEyes) openEyes.setAttribute("opacity", blink ? "0" : "1");
        if (shutEyes) shutEyes.setAttribute("opacity", blink ? "1" : "0");

        // Stamp paw prints along Teddy's path in page coordinates when traveling
        if (moving && !isPeek) {
          const px = curX + 150 * curScale;
          const py = curY + sy + 218 * curScale;
          if (Math.hypot(px - lastPrintX, py - lastPrintY) > 68) {
            const printsContainer = document.querySelector(".pup-prints");
            const printEl = printsContainer?.children[printCursor % (printsContainer.children.length || 1)] as SVGElement | undefined;
            if (printEl) {
              const angle = (Math.atan2(py - lastPrintY, px - lastPrintX) * 180) / Math.PI + 90;
              printEl.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) rotate(${angle.toFixed(0)}deg)`;
              printEl.style.opacity = "0.28";
              printCursor += 1;
            }
            lastPrintX = px;
            lastPrintY = py;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      document.documentElement.removeAttribute("data-pup");
    };
  }, []);

  return (
    <div ref={layerRef} aria-hidden="true" className="pup-layer" hidden data-front="true" data-anchor="top">
      <div ref={actorRef} className="pup-actor" onClick={petTeddy}>
        <div ref={bodyWrapRef} className="pup-actor__body">
          <svg ref={svgRef} viewBox="0 0 300 240" style={{ overflow: "visible" } as CSSProperties} aria-hidden="true" focusable="false">
            {TEDDY_POSES.actor}
          </svg>
        </div>
        <span className="pup-bubble-at">
          <span className="pup-bubble font-scrawl" data-show={bubble ? "true" : "false"}>
            {bubble ?? ""}
          </span>
        </span>
      </div>
    </div>
  );
}
