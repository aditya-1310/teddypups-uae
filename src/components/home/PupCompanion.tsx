"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { TEDDY_POSES } from "@/components/teddy/poses";
import {
  pickNextTrick,
  POSES,
  PupRig,
  RIG_W,
  spawnHearts,
  TRICKS,
  type PoseName,
  type PupCueDetail,
  type TrickContext,
  type TrickStep,
} from "@/lib/pupRig";

export type SafeBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type StopTrack =
  | { kind: "page"; top: number }
  | { kind: "screen"; top: number }
  | { kind: "pin"; top: number; from: number; to: number };

export type MeasuredStop = {
  x: number;
  s: number;
  behind: boolean;
  sink: number;
  box: [number, number, number, number];
  track: StopTrack;
};

type StopMeta = {
  scene: HTMLElement | null;
  pose: PoseName;
  facing: 1 | -1;
  act: string;
  looks: Element[];
  track: HTMLElement | null;
};

type MeasuredJourney = {
  lane: boolean;
  stops: MeasuredStop[];
  meta: StopMeta[];
  holds: [number, number][];
  blend: number;
  mainTop: number;
};

export type EvalPupResult = {
  x: number;
  y: number;
  s: number;
  front: boolean;
  airborne: boolean;
  k: number;
  t: number;
  walked: number;
};

const FOOT = { x: 150, y: 228 } as const;
const DEFAULT_BOX: [number, number, number, number] = [48, 30, 288, 236];
const POSE_BOXES: Partial<Record<PoseName, [number, number, number, number]>> = {
  sit: [50, 26, 284, 234],
  peek: [148, 34, 280, 163],
  snug: [148, 40, 280, 163],
  bow: [58, 56, 292, 236],
};
const SINK_PEEK = FOOT.y - 159;
const BAND_DESKTOP: readonly [number, number] = [0.42, 0.78];
const BAND_MOBILE: readonly [number, number] = [0.6, 0.86];
const TRAVEL_TRICKS = ["jump", "woof", "love", "sneeze"] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const smoothRange = (a: number, b: number, x: number) => (b === a ? (x >= b ? 1 : 0) : smoothstep(clamp01((x - a) / (b - a))));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const getPoseBox = (pose: string): [number, number, number, number] =>
  POSE_BOXES[pose as PoseName] ?? DEFAULT_BOX;

function stopScreenFoot(stop: MeasuredStop, sy: number): { x: number; y: number } {
  const tr = stop.track;
  const topY =
    tr.kind === "page"
      ? tr.top - sy
      : tr.kind === "screen"
        ? tr.top
        : sy < tr.from
          ? tr.top - (sy - tr.from)
          : sy > tr.to
            ? tr.top - (sy - tr.to)
            : tr.top;
  return {
    x: stop.x + FOOT.x * stop.s,
    y: topY + FOOT.y * stop.s,
  };
}

export function findHoldSegment(holds: [number, number][], sy: number): { k: number; t: number } {
  if (!holds.length || sy <= holds[0][1]) return { k: 0, t: 0 };
  for (let i = 0; i < holds.length - 1; i++) {
    const endA = holds[i][1];
    const startB = holds[i + 1][0];
    if (sy < startB) {
      return { k: i, t: clamp01((sy - endA) / Math.max(1, startB - endA)) };
    }
    if (sy <= holds[i + 1][1]) {
      return { k: i + 1, t: 0 };
    }
  }
  return { k: holds.length - 1, t: 0 };
}

const softMax = (x: number, lo: number, k: number) => {
  const u = (x - lo) / k;
  return u > 20 ? x : lo + k * Math.log1p(Math.exp(u));
};
const softMin = (x: number, hi: number, k: number) => -softMax(-x, -hi, k);

function clampFootToSafe(
  x: number,
  y: number,
  s: number,
  box: [number, number, number, number],
  safe: SafeBox,
  softness = 8,
): { x: number; y: number } {
  const padL = (FOOT.x - box[0]) * s;
  const padR = (box[2] - FOOT.x) * s;
  const padT = (FOOT.y - box[1]) * s;
  const padB = (box[3] - FOOT.y) * s;

  const cx =
    safe.right - safe.left > padL + padR
      ? softMin(softMax(x, safe.left + padL, softness), safe.right - padR, softness)
      : (safe.left + safe.right) / 2 - (padR - padL) / 2;
  const cy =
    safe.bottom - safe.top > padT + padB
      ? softMin(softMax(y, safe.top + padT, softness), safe.bottom - padB, softness)
      : safe.bottom - padB;
  return { x: cx, y: cy };
}

function lerpBox(
  a: [number, number, number, number],
  b: [number, number, number, number],
  t: number,
): [number, number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
}

type Pt = { x: number; y: number };

function evalBezier(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return {
    x: b0 * p0.x + b1 * c1.x + b2 * c2.x + b3 * p1.x,
    y: b0 * p0.y + b1 * c1.y + b2 * c2.y + b3 * p1.y,
  };
}

function buildCurve(p0: Pt, p1: Pt, safe: SafeBox): { p0: Pt; c1: Pt; c2: Pt; p1: Pt } {
  const dx = p1.x - p0.x;
  const spanW = safe.right - safe.left;
  const handle = Math.max(0.45 * Math.abs(dx), 0);
  const dir = dx >= 0 ? 1 : -1;
  let c1: Pt = { x: p0.x + dir * handle, y: p0.y };
  let c2: Pt = { x: p1.x - dir * handle, y: p1.y };
  const minBow = 0.14 * spanW;
  if (Math.abs(dx) < minBow) {
    const bow = ((p0.x + p1.x) / 2 < (safe.left + safe.right) / 2 ? 1 : -1) * (minBow - Math.abs(dx)) * 0.9;
    c1 = { x: c1.x + bow, y: lerp(p0.y, p1.y, 0.2) };
    c2 = { x: c2.x + bow, y: lerp(p0.y, p1.y, 0.8) };
  }
  const clampPt = (p: Pt): Pt => ({
    x: Math.min(safe.right, Math.max(safe.left, p.x)),
    y: Math.min(safe.bottom, Math.max(safe.top, p.y)),
  });
  return { p0, c1: clampPt(c1), c2: clampPt(c2), p1 };
}

function curveLengthAt(curve: { p0: Pt; c1: Pt; c2: Pt; p1: Pt }, t: number): number {
  let dist = 0;
  let prev = curve.p0;
  const steps = Math.max(1, Math.ceil(32 * clamp01(t)));
  for (let i = 1; i <= steps; i++) {
    const pt = evalBezier(curve.p0, curve.c1, curve.c2, curve.p1, (i / steps) * clamp01(t));
    dist += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    prev = pt;
  }
  return dist;
}

export function buildHolds(
  rawHolds: [number, number][],
  minSpans: number | number[],
  maxScroll: number,
): [number, number][] {
  const spanAt = (idx: number) => (typeof minSpans === "number" ? minSpans : (minSpans[idx] ?? 0));
  const out: [number, number][] = rawHolds.map(([a, b]) => (a <= b ? [a, b] : [(a + b) / 2, (a + b) / 2]));
  if (!out.length) return out;

  out[0][0] = -Infinity;
  const last = out[out.length - 1];
  last[1] = Infinity;
  last[0] = Math.min(last[0], maxScroll - 1);

  for (let i = 0; i < out.length - 1; i++) {
    const cur = out[i];
    const next = out[i + 1];
    if (next[0] < cur[1]) {
      const mid = (cur[1] + next[0]) / 2;
      cur[1] = Math.max(cur[0], mid);
      next[0] = Math.min(next[1], mid);
      if (next[0] < cur[1]) next[0] = cur[1];
    }
    let deficit = spanAt(i) - (next[0] - cur[1]);
    if (deficit > 0) {
      const trimCur = Math.min(deficit / 2, cur[1] - cur[0]);
      const trimNext = Math.min(deficit / 2, next[1] - next[0]);
      cur[1] -= trimCur;
      next[0] += trimNext;
      deficit -= trimCur + trimNext;
      const extraNext = Math.min(deficit, next[1] - next[0]);
      next[0] += extraNext;
      deficit -= extraNext;
      if (deficit > 0) {
        cur[1] -= Math.min(deficit, cur[1] - cur[0]);
      }
    }
  }
  for (const h of out) {
    if (h[1] < h[0]) h[1] = h[0];
  }
  return out;
}

export function evalPupFrame(
  stops: MeasuredStop[],
  holds: [number, number][],
  sy: number,
  opts: { safe: SafeBox; blend: number },
): EvalPupResult {
  const { k, t } = findHoldSegment(holds, sy);
  if (t <= 0 || k >= stops.length - 1) {
    const stop = stops[k];
    const raw = stopScreenFoot(stop, sy);
    const clamped = clampFootToSafe(raw.x, raw.y, stop.s, stop.box, opts.safe);
    return {
      x: clamped.x,
      y: clamped.y,
      s: stop.s,
      front: !stop.behind,
      airborne: false,
      k,
      t: 0,
      walked: 0,
    };
  }

  const a = stops[k];
  const b = stops[k + 1];
  const holdEnd = holds[k][1];
  const nextStart = holds[k + 1][0];
  const span = Math.max(1, nextStart - holdEnd);
  const v = clamp01((sy - holdEnd) / span);

  const footA = stopScreenFoot(a, holdEnd);
  const footB = stopScreenFoot(b, nextStart);
  const curve = buildCurve(
    { x: footA.x, y: footA.y - a.sink * a.s },
    { x: footB.x, y: footB.y - b.sink * b.s },
    opts.safe,
  );

  // Quintic smoothstep
  const w = v * v * v * (v * (6 * v - 15) + 10);
  const pos = evalBezier(curve.p0, curve.c1, curve.c2, curve.p1, w);
  const scale = lerp(a.s, b.s, smoothstep(clamp01(v / 0.65)));

  const blendFrac = Math.min(0.3, Math.max(0.06, opts.blend / span));
  const wStart = 1 - smoothRange(0, blendFrac, v);
  const wEnd = smoothRange(1 - blendFrac, 1, v);

  let y = pos.y + wStart * (stopScreenFoot(a, sy).y - footA.y) + wEnd * (stopScreenFoot(b, sy).y - footB.y);
  const x = pos.x;

  y += a.sink * a.s * (1 - smoothRange(0, 0.22, v)) + b.sink * b.s * smoothRange(0.78, 1, v);

  let airborne = false;
  if (a.behind && v < 0.36) {
    y -= Math.sin((v / 0.36) * Math.PI) * Math.min(64 * a.s, 72);
    airborne = v < 0.32;
  }
  if (b.behind && v > 0.68) {
    y -= Math.sin(((v - 0.68) / 0.32) * Math.PI) * Math.min(56 * b.s, 60);
    airborne = true;
  }
  if (a.sink && v < 0.2) {
    airborne = true;
  }

  const front = !((a.behind && v < 0.12) || (b.behind && v > 0.92));
  const box =
    v < 0.5
      ? lerpBox(a.box, DEFAULT_BOX, smoothRange(0, a.sink ? 0.22 : a.behind ? 0.36 : 0.06, v))
      : lerpBox(DEFAULT_BOX, b.box, smoothRange(b.sink ? 0.78 : b.behind ? 0.68 : 0.94, 1, v));

  const clamped = clampFootToSafe(x, y, scale, box, opts.safe);
  return {
    x: clamped.x,
    y: clamped.y,
    s: scale,
    front,
    airborne,
    k,
    t: v,
    walked: curveLengthAt(curve, w),
  };
}

export function treadmillDecision(
  delta: number,
  idle: number,
): { mode: "walk" | "stand" | "hold"; facing: 1 | -1 | null; idle: number } {
  if (Math.abs(delta) > 0.15) {
    return { mode: "walk", facing: delta < 0 ? 1 : -1, idle: 0 };
  }
  if (idle > 0.25) {
    return { mode: "stand", facing: null, idle };
  }
  return { mode: "hold", facing: null, idle };
}

function snapScrollNearObstacle(stops: MeasuredStop[], holds: [number, number][], sy: number): number {
  const { k, t } = findHoldSegment(holds, sy);
  if (t <= 0 || k >= stops.length - 1) return sy;
  const a = stops[k];
  const b = stops[k + 1];
  const lowSnap = a.sink ? 0.22 : a.behind ? 0.36 : 0;
  const highSnap = b.sink ? 0.78 : b.behind ? 0.68 : 1;
  let snapped = t;
  if (t < lowSnap) {
    snapped = t < lowSnap / 2 ? 0 : lowSnap;
  } else if (t > highSnap) {
    snapped = t > (1 + highSnap) / 2 ? 1 : highSnap;
  }
  return snapped === t ? sy : holds[k][1] + snapped * (holds[k + 1][0] - holds[k][1]);
}

function findStickyAncestor(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    if (window.getComputedStyle(p).position === "sticky") return p;
  }
  return null;
}

function measureStopTrack(el: HTMLElement, rect: DOMRect): StopTrack {
  const sticky = findStickyAncestor(el);
  const sy = window.scrollY;
  if (!sticky) {
    return { kind: "page", top: rect.top + sy };
  }
  const stickyTop = parseFloat(window.getComputedStyle(sticky).top) || 0;
  const offsetInSticky = rect.top - sticky.getBoundingClientRect().top;
  const prevPos = sticky.style.position;
  sticky.style.position = "relative";
  const relRect = sticky.getBoundingClientRect();
  const parent = sticky.parentElement;
  const parentBottom = parent
    ? parent.getBoundingClientRect().bottom - (parseFloat(window.getComputedStyle(parent).paddingBottom) || 0)
    : relRect.bottom;
  sticky.style.position = prevPos;

  const from = relRect.top + sy - stickyTop;
  const to = parentBottom + sy - relRect.height - stickyTop;
  if (to <= from) {
    return { kind: "page", top: relRect.top + sy + offsetInSticky };
  }
  return { kind: "pin", top: stickyTop + offsetInSticky, from, to };
}

function computeRawHold(stop: MeasuredStop, safe: SafeBox, band: readonly [number, number]): [number, number] {
  if (stop.track.kind === "pin") {
    return [stop.track.from, stop.track.to];
  }
  const top = stop.track.top;
  const yMin = top + stop.box[1] * stop.s;
  const yMax = top + stop.box[3] * stop.s;
  const mid = (yMin + yMax) / 2;
  const safeH = safe.bottom - safe.top;
  let lo = Math.max(mid - (safe.top + band[1] * safeH), yMax - safe.bottom);
  let hi = Math.min(mid - (safe.top + band[0] * safeH), yMin - safe.top);
  if (lo > hi) {
    lo = hi = mid - (safe.top + safeH / 2);
  }
  return [lo, hi];
}

function measureJourney(probeEl: HTMLElement | null): MeasuredJourney {
  const lane =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 767px), (pointer: coarse) and (max-height: 519px)").matches;
  const clientW = document.documentElement.clientWidth || window.innerWidth;
  const viewH = (probeEl?.getBoundingClientRect().height || 0) || window.innerHeight;
  const headerH = document.getElementById("site-header")?.offsetHeight ?? 76;
  const waBar = document.querySelector<HTMLElement>("[data-whatsapp-bar]");
  const waBarH = waBar && waBar.getClientRects().length ? waBar.getBoundingClientRect().height : 0;
  const safe: SafeBox = {
    left: 10,
    top: headerH + 10,
    right: clientW - 10,
    bottom: viewH - 10 - waBarH,
  };

  const mainEl = document.getElementById("main");
  const stops: MeasuredStop[] = [];
  const meta: StopMeta[] = [];
  const rawHolds: [number, number][] = [];

  const pushDomStop = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const poseAttr = (el.dataset.pose || "sit") as PoseName;
    const pose: PoseName = POSES[poseAttr] ? poseAttr : "sit";
    const act = el.dataset.act ?? "";
    const baseScale = rect.width / RIG_W;
    const scale = act === "basket" || lane ? baseScale : 1.12 * baseScale;
    const pivot = pose === "peek" ? { x: FOOT.x, y: 159 } : FOOT;
    const track = measureStopTrack(el, rect);
    if (track.kind !== "screen") {
      track.top += pivot.y * (baseScale - scale);
    }
    const stop: MeasuredStop = {
      x: rect.left + pivot.x * (baseScale - scale),
      track,
      s: scale,
      behind: el.dataset.behind === "true",
      sink: 0,
      box: getPoseBox(pose),
    };
    const scene = el.closest<HTMLElement>("[data-pup-scene]");
    stops.push(stop);
    meta.push({
      scene,
      pose,
      facing: el.dataset.facing === "left" ? -1 : 1,
      act,
      looks: scene ? Array.from(scene.querySelectorAll("[data-pup-look]")) : [],
      track: act === "treadmill" ? (scene?.querySelector<HTMLElement>("[data-treadmill]") ?? null) : null,
    });

    let hold = computeRawHold(stop, safe, lane ? BAND_MOBILE : BAND_DESKTOP);
    if (!lane && scene && stop.track.kind === "page" && act !== "basket" && act !== "peekaboo") {
      const safeH = safe.bottom - safe.top;
      const sceneTopLimit = scene.getBoundingClientRect().top + window.scrollY - safe.top + 0.08 * safeH;
      const minBottomVisible = stop.track.top + stop.box[3] * stop.s - safe.bottom;
      if (hold[1] > sceneTopLimit) {
        const hi = Math.max(sceneTopLimit, minBottomVisible + 0.12 * safeH);
        hold = [Math.max(minBottomVisible, hi - Math.max(hold[1] - hold[0], 0.2 * safeH)), hi];
      }
    }
    rawHolds.push(hold);
  };

  const visibleStops = Array.from(document.querySelectorAll<HTMLElement>("[data-pup-stop]")).filter(
    (el) => el.getClientRects().length > 0,
  );

  if (lane) {
    const laneStops = visibleStops.filter((el) => el.dataset.lane === "true");
    const first = laneStops[0];
    const last = laneStops.length > 1 ? laneStops[laneStops.length - 1] : undefined;
    if (first) pushDomStop(first);

    const firstScene = meta[0]?.scene ?? null;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("#main [data-pup-scene]")).filter(
      (s) => s !== firstScene && s.getClientRects().length > 0,
    );
    const laneScale = Math.min(0.62, Math.max(0.5, clientW / 650));
    const peekBox = getPoseBox("peek");
    scenes.forEach((sceneEl, idx) => {
      const leftEdge = idx % 2 === 0;
      const x = leftEdge ? safe.left + 2 - peekBox[0] * laneScale : safe.right - 2 - peekBox[2] * laneScale;
      stops.push({
        x,
        track: { kind: "screen", top: 0 },
        s: laneScale,
        behind: false,
        sink: SINK_PEEK,
        box: peekBox,
      });
      meta.push({
        scene: sceneEl,
        pose: "peek",
        facing: leftEdge ? 1 : -1,
        act: "lane",
        looks: [],
        track: null,
      });
      const r = sceneEl.getBoundingClientRect();
      const lo = r.top + window.scrollY - 0.42 * viewH;
      const hi = r.bottom + window.scrollY - 0.58 * viewH;
      rawHolds.push(lo <= hi ? [lo, hi] : [(lo + hi) / 2, (lo + hi) / 2]);
    });
    if (last) pushDomStop(last);
  } else {
    visibleStops.forEach(pushDomStop);
  }

  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const minSpans = stops.slice(1).map((st, idx) => {
    const prev = stops[idx];
    const bandPx = (BAND_DESKTOP[1] - BAND_DESKTOP[0]) * viewH;
    const baseMin = (lane ? 0.32 : 0.5) * viewH;
    const dx = Math.abs(st.x + FOOT.x * st.s - (prev.x + FOOT.x * prev.s));
    return Math.min(1.4 * viewH, Math.max(baseMin, 1.15 * Math.hypot(dx, bandPx)));
  });

  return {
    lane,
    stops,
    meta,
    holds: buildHolds(rawHolds, minSpans, maxScroll),
    blend: 0.12 * viewH,
    mainTop: mainEl ? mainEl.getBoundingClientRect().top + window.scrollY : 0,
  };
}

const setDataIfChanged = (el: HTMLElement, key: string, val: string) => {
  if (el.dataset[key] !== val) el.dataset[key] = val;
};

const pickOther = <T,>(arr: readonly T[], avoid: T | null): T => {
  const pool = arr.filter((x) => x !== avoid);
  return pool[Math.floor(Math.random() * pool.length)] ?? arr[0];
};

export function PupCompanion() {
  const layerRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const bodyWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bubbleAtRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const actor = actorRef.current;
    const bodyWrap = bodyWrapRef.current;
    const svg = svgRef.current;
    const bubbleAt = bubbleAtRef.current;
    const bubble = bubbleRef.current;
    if (!layer || !actor || !bodyWrap || !svg || !bubbleAt || !bubble) return;

    const docEl = document.documentElement;
    const isReduced = () =>
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let journey: MeasuredJourney | null = null;
    let rig: PupRig | null = null;
    let active = false;
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    let printCursor = 0;
    let bubbleHideAt = 0;
    const showBubble = (text: string, now: number, secs = 1.4) => {
      bubble.textContent = text;
      bubble.dataset.show = "true";
      bubbleHideAt = now + secs;
    };

    let mousePt: { x: number; y: number; t: number } | null = null;
    let focusLook: { el: Element; until: number } | null = null;

    let lastTime = performance.now() / 1000;
    let lastScrollY = window.scrollY;
    let lastScrollAt = lastTime;
    let scrollDir: 1 | -1 = 1;

    let prevPos: { x: number; y: number } | null = null;
    let curFrame: EvalPupResult | null = null;
    const residual = { x: 0, y: 0, s: 0 };

    let travelIdle = 0;
    let heldStopIdx = -1;
    let heldSince = 0;
    let idleTrickSince = 0;
    let queue: TrickStep[] = [];
    let lastAutoLookAt = 0;
    let autoLookCursor = -1;
    let lastTrackLeft: number | null = null;
    let trackIdle = 0;
    let printSegIdx = -1;
    let printStepCount = 0;
    let nextBasketTwitch = 0;
    let wasSnapped = false;
    let laneSmooth: { x: number; y: number } | null = null;
    let prevBottomY = 0;
    let laneWalked = 0;
    let layerTopOffset = 0;

    let clickStreak = 0;
    let lastClickAt = 0;
    let lastTrickName: string | null = null;

    const getLaneFloorY = () => {
      const bar = document.querySelector<HTMLElement>("[data-whatsapp-bar]");
      const r = bar && bar.getClientRects().length ? bar.getBoundingClientRect() : null;
      return r && r.height ? r.top : window.innerHeight - 6;
    };

    const liveSafeBox = (j: MeasuredJourney): SafeBox => {
      const clientW = docEl.clientWidth || window.innerWidth;
      const headerH = (document.getElementById("site-header")?.offsetHeight ?? 76) + 10;
      if (j.lane) {
        return { left: 10, top: headerH, right: clientW - 10, bottom: getLaneFloorY() + 40 };
      }
      const bar = document.querySelector<HTMLElement>("[data-whatsapp-bar]");
      const barTop = bar && bar.getClientRects().length ? bar.getBoundingClientRect().top : window.innerHeight;
      return { left: 10, top: headerH, right: clientW - 10, bottom: Math.min(window.innerHeight, barTop) - 10 };
    };

    const evalJourneyAt = (j: MeasuredJourney, sy: number): EvalPupResult => {
      if (j.lane) {
        const floorY = getLaneFloorY();
        for (const st of j.stops) {
          if (st.track.kind === "screen") st.track.top = floorY - 159 * st.s;
        }
      }
      return evalPupFrame(j.stops, j.holds, sy, { safe: liveSafeBox(j), blend: j.blend });
    };

    const makeTrickCtx = (m: StopMeta): TrickContext => ({
      d: rig!,
      rest: POSES[m.pose] ?? POSES.sit,
      facing: m.facing,
      say: (txt, secs) => showBubble(txt, performance.now() / 1000, secs),
      hearts: () => {
        if (!curFrame || !rig) return;
        const hx = curFrame.x - FOOT.x * curFrame.s + (rig.facingDir > 0 ? 212 : RIG_W - 212) * curFrame.s;
        const hy = curFrame.y - (FOOT.y - 40) * curFrame.s - layerTopOffset;
        spawnHearts(layer, hx, hy);
      },
    });

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.pointerType === "mouse") {
        mousePt = { x: ev.clientX, y: ev.clientY, t: performance.now() / 1000 };
      }
    };

    const onPupCue = (ev: Event) => {
      const detail = (ev as CustomEvent<PupCueDetail>).detail;
      if (!detail) return;
      const activeScene = heldStopIdx >= 0 ? journey?.meta[heldStopIdx]?.scene : null;
      if (!activeScene || (detail.look && !activeScene.contains(detail.look))) return;
      const now = performance.now() / 1000;
      if (detail.look) {
        focusLook = { el: detail.look, until: now + (detail.secs ?? 1.6) };
      }
      if (detail.say) {
        showBubble(detail.say, now);
      }
    };

    const onFocusIn = (ev: FocusEvent) => {
      const target = ev.target;
      if (target instanceof HTMLElement && target.matches("a, button, input, textarea, select, summary")) {
        focusLook = { el: target, until: performance.now() / 1000 + 1.4 };
      }
    };

    const onActorClick = () => {
      if (!rig || !journey) return;
      const r = rig;
      const now = performance.now() / 1000;
      clickStreak = now - lastClickAt < 0.7 ? clickStreak + 1 : 1;
      lastClickAt = now;
      idleTrickSince = now;

      if (heldStopIdx < 0) {
        const metaNear = journey.meta[Math.max(0, curFrame?.k ?? 0)];
        const trick = pickOther(TRAVEL_TRICKS, lastTrickName as (typeof TRAVEL_TRICKS)[number] | null);
        lastTrickName = trick;
        const ctx = makeTrickCtx(metaNear);
        queue =
          trick === "jump"
            ? [
                [now, () => { r.hop(1.35); ctx.say(pickOther(["wheee!", "boing!", "yip!"], null)); }],
                [now + 0.5, () => r.hop(0.7)],
              ]
            : trick === "woof"
              ? [
                  [now, (t) => { r.woof(t); ctx.say("woof!"); }],
                  [now + 0.4, (t) => r.woof(t)],
                ]
              : trick === "love"
                ? [[now, () => { r.wag(1); r.hop(0.5); ctx.hearts(); ctx.say("I like you!"); }]]
                : [[now, (t) => { r.jolt(1.4); r.hop(0.4); r.yawn(t, 0.22); ctx.say("achoo!"); }]];
        return;
      }

      const stopMeta = journey.meta[heldStopIdx];
      let chosen: string;
      if (stopMeta.track) {
        chosen = pickOther(["woof", "hop", "love"], lastTrickName);
      } else if (stopMeta.act === "basket") {
        chosen = pickOther(["tilt", "love", "sneeze", "woof"], lastTrickName);
      } else if (stopMeta.pose === "peek") {
        chosen = pickOther(["peekaboo", "woof", "tilt", "sneeze"], lastTrickName);
      } else {
        chosen = pickNextTrick(lastTrickName, clickStreak);
      }
      if (chosen === "peekaboo" && queue.length) return;
      lastTrickName = chosen;
      r.reset();
      const fn = TRICKS[chosen] ?? TRICKS.woof;
      queue = fn(makeTrickCtx(stopMeta), now);
    };

    const onActorEnter = (ev: PointerEvent) => {
      if (ev.pointerType === "mouse" && rig && heldStopIdx >= 0) {
        rig.petting(true);
        rig.wag(1);
      }
    };

    const onActorLeave = () => {
      if (rig) {
        rig.petting(false);
        if (heldStopIdx >= 0) {
          rig.wag(journey?.meta[heldStopIdx]?.act === "basket" ? 0.3 : 0.7);
        }
      }
    };

    const stepFrame = () => {
      if (!active || !journey || !rig) return;
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, Math.max(0.001, now - lastTime));
      lastTime = now;

      const sy = window.scrollY;
      const scrollDelta = sy - lastScrollY;
      lastScrollY = sy;
      if (Math.abs(scrollDelta) > 0.5) {
        lastScrollAt = now;
        scrollDir = scrollDelta > 0 ? 1 : -1;
      }

      while (queue.length && queue[0][0] <= now) {
        const nextItem = queue.shift();
        nextItem?.[1](now);
      }

      const effectiveSy = now - lastScrollAt > 0.25 ? snapScrollNearObstacle(journey.stops, journey.holds, sy) : sy;
      const frame = evalJourneyAt(journey, effectiveSy);

      const inLaneScreen =
        journey.lane &&
        (() => {
          const curSt = journey.stops[frame.k];
          const nextSt = frame.t > 0 ? journey.stops[frame.k + 1] : curSt;
          return curSt.track.kind === "screen" && nextSt?.track.kind === "screen";
        })();

      const decay = Math.exp(-dt / 0.28);
      residual.x *= decay;
      residual.y *= decay;
      residual.s *= decay;
      if (Math.abs(residual.x) < 0.05 && Math.abs(residual.y) < 0.05) {
        residual.x = 0;
        residual.y = 0;
      }

      const snappedNow = effectiveSy !== sy;
      if (snappedNow !== wasSnapped && prevPos && !inLaneScreen) {
        residual.x = prevPos.x - frame.x;
        residual.y = prevPos.y - frame.y;
      }
      wasSnapped = snappedNow;

      const scale = frame.s + residual.s;
      let fx = frame.x + residual.x;
      let fy = frame.y + residual.y;
      const laneFloorY = journey.lane ? getLaneFloorY() : 0;
      let settled = true;

      if (inLaneScreen) {
        if (!laneSmooth) {
          laneSmooth = prevPos ? { x: prevPos.x, y: prevPos.y - prevBottomY } : { x: fx, y: fy - laneFloorY };
        }
        const k = 1 - Math.exp(-dt / 0.14);
        laneSmooth.x += (fx - laneSmooth.x) * k;
        laneSmooth.y += (fy - laneFloorY - laneSmooth.y) * k;
        settled = Math.hypot(fx - laneSmooth.x, fy - laneFloorY - laneSmooth.y) < 1.5;
        fx = laneSmooth.x;
        fy = laneFloorY + laneSmooth.y;
      } else if (laneSmooth) {
        residual.x = (prevPos?.x ?? fx) - frame.x;
        residual.y = (prevPos?.y ?? fy) - frame.y;
        fx = frame.x + residual.x;
        fy = frame.y + residual.y;
        laneSmooth = null;
      }

      prevBottomY = laneFloorY;
      curFrame = { ...frame, x: fx, y: fy, s: scale };
      setDataIfChanged(layer, "anchor", inLaneScreen ? "bottom" : "top");
      layerTopOffset = inLaneScreen ? layer.getBoundingClientRect().top : 0;

      const holding = frame.t === 0 && settled;
      const stopIdx = frame.k;

      if (holding) {
        if (heldStopIdx !== stopIdx) {
          const m = journey.meta[stopIdx];
          queue = [];
          focusLook = null;
          heldStopIdx = stopIdx;
          heldSince = now;
          idleTrickSince = now;
          lastTrackLeft = null;
          trackIdle = 0;
          rig.reset();
          rig.setPose(m.pose);
          rig.face(m.facing, 0.14);
          rig.stride(0);
          rig.wag(m.act === "basket" ? 0.3 : 0.7);
          rig.jolt(0.4);
          nextBasketTwitch = now + 2.4;
        }

        const m = journey.meta[stopIdx];
        if (m.track && !queue.length) {
          const left = m.track.getBoundingClientRect().left;
          const delta = lastTrackLeft === null ? 0 : left - lastTrackLeft;
          lastTrackLeft = left;
          rig.walkedTo(-left / Math.max(0.05, scale));
          const dec = treadmillDecision(delta, trackIdle + dt);
          trackIdle = dec.idle;
          if (dec.mode === "walk") {
            rig.setPose("walk");
            rig.stride(1);
            if (dec.facing) rig.face(dec.facing, 0.16);
          } else if (dec.mode === "stand") {
            rig.setPose("stand");
            rig.stride(0);
          }
        }

        if (m.act === "tilt" && !queue.length && now - heldSince > 1.2) {
          const s = Math.sin(0.9 * now);
          rig.cock(s > 0.35 ? 13 : s < -0.35 ? -10 : 0);
        }

        if (m.act === "basket" && !queue.length && now > nextBasketTwitch) {
          nextBasketTwitch = now + 4.5 + 3 * Math.random();
          if (Math.random() < 0.7) rig.jolt(0.55);
          else rig.yawn(now, 0.7);
        }

        const userLooking = (focusLook && focusLook.until > now) || (mousePt && now - mousePt.t < 2.5);
        if (m.looks.length && !userLooking && now - heldSince > 0.8 && now - lastAutoLookAt > 1.7) {
          lastAutoLookAt = now;
          autoLookCursor = (autoLookCursor + 1) % (m.looks.length + 1);
          if (autoLookCursor < m.looks.length) {
            focusLook = { el: m.looks[autoLookCursor], until: now + 1.4 };
          }
        }

        if (Math.abs(scrollDelta) > 0.5) idleTrickSince = now;
        if (!queue.length && !m.track && m.act !== "basket" && now - idleTrickSince > 9) {
          idleTrickSince = now;
          queue =
            Math.random() < 0.55
              ? TRICKS.tilt(makeTrickCtx(m), now)
              : [
                  [now, () => rig?.wag(1)],
                  [now + 2.4, () => rig?.wag(0.7)],
                ];
        }
      } else {
        if (heldStopIdx !== -1) {
          heldStopIdx = -1;
          queue = [];
          rig.reset();
        }
        const frameMove = prevPos ? Math.hypot(fx - prevPos.x, fy - prevPos.y) : 0;
        travelIdle = frameMove > 0.25 ? 0 : travelIdle + dt;

        let airborne = frame.airborne;
        if (journey.lane && frame.t > 0) {
          const stA = journey.stops[stopIdx];
          const stB = journey.stops[stopIdx + 1];
          if (stA.sink && frame.t < 0.22) airborne = scrollDir > 0;
          else if (stB?.sink && frame.t > 0.78) airborne = scrollDir < 0;
        }

        if (airborne) {
          rig.setPose("hop");
          rig.stride(0);
        } else if (travelIdle > 0.3) {
          rig.setPose("stand");
          rig.stride(0);
          if (travelIdle > 2.6 && travelIdle - dt <= 2.6) {
            showBubble("coming?", now);
          }
        } else {
          rig.setPose("walk");
          rig.stride(1);
        }

        const walkedDist = inLaneScreen ? (laneWalked += frameMove) : frame.walked;
        rig.walkedTo(walkedDist / Math.max(0.05, scale));

        if (prevPos) {
          const dx = fx - prevPos.x;
          const dy = fy - prevPos.y;
          if (Math.abs(dx) > 0.6 && Math.abs(dx) > 0.35 * Math.abs(dy)) {
            rig.face(dx > 0 ? 1 : -1, 0.16);
          }
        }

        if (!journey.lane) {
          const stepIdx = Math.floor(frame.walked / (34 * scale));
          if (printSegIdx === stopIdx && stepIdx !== printStepCount && !frame.airborne && prevPos) {
            const printsContainer = document.querySelector(".pup-prints");
            const prints = printsContainer ? (Array.from(printsContainer.children) as HTMLElement[]) : [];
            if (prints.length) {
              const odd = stepIdx & 1;
              const pawLocalX = odd ? 186 : 110;
              const originX = fx - FOOT.x * scale;
              const originY = fy - FOOT.y * scale;
              const px = originX + (rig.facingDir > 0 ? pawLocalX : RIG_W - pawLocalX) * scale;
              const py = originY + 226 * scale + sy - journey.mainTop + (odd ? -4 : 4) * scale;
              const rad = Math.atan2(fy - prevPos.y + scrollDelta, fx - prevPos.x) + Math.PI / 2;
              const sz = 14 * Math.max(0.75, 1.5 * scale);
              const printEl = prints[printCursor++ % prints.length];
              printEl.style.transform = `translate(${(px - sz / 2).toFixed(1)}px, ${(py - sz / 2).toFixed(1)}px) rotate(${rad.toFixed(3)}rad)`;
              printEl.style.width = `${sz.toFixed(1)}px`;
              printEl.style.height = `${sz.toFixed(1)}px`;
              if (typeof printEl.animate === "function") {
                printEl.animate(
                  [{ opacity: 0 }, { opacity: 0.45, offset: 0.08 }, { opacity: 0.45, offset: 0.5 }, { opacity: 0 }],
                  { duration: 2600, easing: "ease-out" },
                );
              }
            }
          }
          printSegIdx = stopIdx;
          printStepCount = stepIdx;
        }
      }

      prevPos = { x: fx, y: fy };

      journey.meta.forEach((m, idx) => {
        if (m.scene) {
          setDataIfChanged(m.scene, "here", String(holding && idx === stopIdx));
          setDataIfChanged(m.scene, "visited", String(idx <= stopIdx || (idx === stopIdx + 1 && frame.t > 0.92)));
        }
      });

      if (focusLook && focusLook.until > now) {
        const r = focusLook.el.getBoundingClientRect();
        rig.lookAt({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      } else if (mousePt && now - mousePt.t < 2.5) {
        rig.lookAt(mousePt);
      } else {
        rig.lookAt(null);
      }

      actor.style.transform = `translate3d(${(fx - FOOT.x * scale).toFixed(2)}px, ${(fy - FOOT.y * scale - layerTopOffset).toFixed(2)}px, 0)`;
      bodyWrap.style.transform = `scale(${scale.toFixed(4)})`;
      setDataIfChanged(layer, "front", String(frame.front));
      setDataIfChanged(actor, "holding", String(holding));

      if (bubble.dataset.show === "true") {
        if (now > bubbleHideAt) bubble.dataset.show = "false";
        const bx = (rig.facingDir > 0 ? 214 : RIG_W - 214) * scale;
        bubbleAt.style.transform = `translate(${bx.toFixed(1)}px, ${(30 * scale).toFixed(1)}px)`;
      }

      rig.tick(dt, now);
      raf = requestAnimationFrame(stepFrame);
    };

    const startJourney = () => {
      if (active || isReduced()) return;
      const probe = document.querySelector<HTMLElement>(".pup-probe");
      const measured = measureJourney(probe);
      if (measured.stops.length < 2) return;

      journey = measured;
      active = true;
      docEl.dataset.pup = measured.lane ? "lane" : "live";
      layer.hidden = false;

      const firstMeta = measured.meta[0];
      rig = new PupRig(svg, firstMeta.pose, firstMeta.facing);
      lastScrollY = window.scrollY;
      prevPos = null;
      lastScrollAt = lastTime = performance.now() / 1000;
      wasSnapped = false;
      laneSmooth = null;

      const initFrame = evalJourneyAt(measured, window.scrollY);
      if (initFrame.k === 0 && initFrame.t === 0 && firstMeta.act === "peekaboo") {
        heldStopIdx = 0;
        heldSince = lastTime;
        const duckPose = { ...POSES.peek, headY: 120 };
        const friends = firstMeta.scene?.querySelectorAll("[data-pup-friend]") ?? [];
        const friendL = friends[0];
        const friendR = friends[friends.length - 1];
        queue = [
          [lastTime + 0.1, () => rig?.setPose(duckPose)],
          [lastTime + 0.7, (t) => { rig?.setPose("peek"); rig?.jolt(1.2); showBubble("peekaboo!", t, 1.6); }],
          [lastTime + 1.5, (t) => { if (friendL) focusLook = { el: friendL, until: t + 0.8 }; }],
          [lastTime + 2.3, (t) => { if (friendR) focusLook = { el: friendR, until: t + 0.8 }; }],
          [lastTime + 3.1, () => { focusLook = null; rig?.wag(1); }],
        ];
      } else {
        heldStopIdx = -1;
      }

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pup:cue", onPupCue);
      window.addEventListener("focusin", onFocusIn);
      actor.addEventListener("click", onActorClick);
      actor.addEventListener("pointerenter", onActorEnter);
      actor.addEventListener("pointerleave", onActorLeave);
      raf = requestAnimationFrame(stepFrame);
    };

    const stopJourney = () => {
      if (!active) return;
      active = false;
      cancelAnimationFrame(raf);
      delete docEl.dataset.pup;
      layer.hidden = true;
      delete layer.dataset.anchor;
      layerTopOffset = 0;
      journey?.meta.forEach((m) => {
        if (m.scene) {
          delete m.scene.dataset.here;
          delete m.scene.dataset.visited;
        }
      });
      journey = null;
      rig = null;
      heldStopIdx = -1;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pup:cue", onPupCue);
      window.removeEventListener("focusin", onFocusIn);
      actor.removeEventListener("click", onActorClick);
      actor.removeEventListener("pointerenter", onActorEnter);
      actor.removeEventListener("pointerleave", onActorLeave);
    };

    const scheduleRemeasure = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!active || !journey) return;
        const probe = document.querySelector<HTMLElement>(".pup-probe");
        const next = measureJourney(probe);
        if (next.stops.length < 2) {
          stopJourney();
          return;
        }
        const prev = curFrame;
        const modeChanged = next.lane !== journey.lane;
        journey = next;
        docEl.dataset.pup = next.lane ? "lane" : "live";
        if (modeChanged) heldStopIdx = -1;
        if (prev) {
          const fresh = evalJourneyAt(next, window.scrollY);
          residual.x = prev.x - fresh.x;
          residual.y = prev.y - fresh.y;
          residual.s = prev.s - fresh.s;
        }
      }, 120);
    };

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleRemeasure) : null;
    ro?.observe(document.body);
    window.addEventListener("resize", scheduleRemeasure, { passive: true });
    window.addEventListener("load", scheduleRemeasure);

    const mq = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const onMotionChange = () => (isReduced() ? stopJourney() : startJourney());
    mq?.addEventListener("change", onMotionChange);

    startJourney();
    document.fonts?.ready?.then(scheduleRemeasure);

    return () => {
      stopJourney();
      if (resizeTimer) clearTimeout(resizeTimer);
      ro?.disconnect();
      window.removeEventListener("resize", scheduleRemeasure);
      window.removeEventListener("load", scheduleRemeasure);
      mq?.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div ref={layerRef} aria-hidden="true" className="pup-layer" hidden data-front="true" data-anchor="top">
      <div ref={actorRef} className="pup-actor">
        <div ref={bodyWrapRef} className="pup-actor__body">
          <svg
            ref={svgRef}
            viewBox="0 0 300 240"
            style={{ overflow: "visible" } as CSSProperties}
            aria-hidden="true"
            focusable="false"
          >
            {TEDDY_POSES.actor}
          </svg>
        </div>
        <span ref={bubbleAtRef} className="pup-bubble-at">
          <span ref={bubbleRef} className="pup-bubble" data-show="false" />
        </span>
      </div>
    </div>
  );
}
