export type PoseValues = {
  bodyRot: number;
  bodyX: number;
  bodyY: number;
  stretch: number;
  headX: number;
  headY: number;
  headRot: number;
  earL: number;
  earR: number;
  tail: number;
  fn: number;
  ff: number;
  bn: number;
  bf: number;
  sit: number;
  eyes: number;
  happy: number;
  tongue: number;
  mouth: number;
  front: number;
};

export type PoseName =
  | "stand"
  | "walk"
  | "sit"
  | "peek"
  | "snug"
  | "lie"
  | "sleep"
  | "settle"
  | "hop"
  | "sniff"
  | "bow"
  | "beg";

export type RigMotion = {
  phase: number;
  stride: number;
  time: number;
  wag: number;
  gazeX: number;
  gazeY: number;
  blink: number;
  ear: number;
};

export const RIG_W = 300;
export const RIG_H = 240;
export const EYE_Y = 98;
export const HEAD_PIVOT: readonly [number, number] = [212, 100];

const BODY_PIVOT: readonly [number, number] = [196, 206];
const SHOULDER_N: readonly [number, number] = [186, 194];
const SHOULDER_F: readonly [number, number] = [168, 192];
const HIP_N: readonly [number, number] = [110, 194];
const HIP_F: readonly [number, number] = [94, 192];
const TAIL_BASE: readonly [number, number] = [84, 150];
const EAR_L_PIVOT: readonly [number, number] = [174, 82];
const EAR_R_PIVOT: readonly [number, number] = [250, 82];

const BASE_POSE: PoseValues = {
  bodyRot: 0,
  bodyX: 0,
  bodyY: 0,
  stretch: 1,
  headX: 0,
  headY: 0,
  headRot: 0,
  earL: 0,
  earR: 0,
  tail: 0,
  fn: 0,
  ff: 0,
  bn: 0,
  bf: 0,
  sit: 0,
  eyes: 1,
  happy: 0,
  tongue: 0,
  mouth: 0,
  front: 0,
};

export const POSES: Record<PoseName, PoseValues> = {
  stand: BASE_POSE,
  walk: { ...BASE_POSE, tail: -6, tongue: 1 },
  sit: { ...BASE_POSE, bodyRot: -24, bodyY: -2, headX: -10, headY: -6, tail: 34, sit: 1, tongue: 1 },
  peek: { ...BASE_POSE, headY: 4, earL: -6, earR: 6, tail: -20, front: 1, tongue: 1 },
  snug: { ...BASE_POSE, headY: 9, headRot: 4, earL: 3, earR: -3, tail: -20, front: 1, tongue: 0 },
  lie: { ...BASE_POSE, bodyRot: -5, bodyY: 22, headX: 12, headY: 40, headRot: 3, fn: -84, ff: -80, sit: 1, tail: 58, tongue: 0 },
  sleep: { ...BASE_POSE, bodyRot: -5, bodyY: 22, headX: 14, headY: 44, headRot: -8, fn: -84, ff: -80, sit: 1, tail: 64, eyes: 0, earL: 4, earR: -4 },
  settle: { ...BASE_POSE, bodyRot: -5, bodyY: 22, headX: 10, headY: 16, fn: -84, ff: -80, sit: 1, tail: 40, tongue: 1 },
  hop: { ...BASE_POSE, bodyRot: -9, stretch: 1.06, headY: -6, fn: -42, ff: -32, bn: 40, bf: 30, earL: -26, earR: 26, tail: -24, tongue: 1 },
  sniff: { ...BASE_POSE, bodyRot: 7, headX: 16, headY: 32, headRot: 9, tail: -14, fn: 6, ff: 4 },
  bow: { ...BASE_POSE, bodyRot: 15, bodyY: 2, headX: 14, headY: 30, fn: -58, ff: -52, tail: -32, happy: 1, tongue: 1 },
  beg: { ...BASE_POSE, bodyRot: -36, bodyY: -6, headX: -18, headY: -18, sit: 1, fn: -70, ff: -64, tail: 30, happy: 1, tongue: 1 },
};

const POSE_KEYS = Object.keys(BASE_POSE) as (keyof PoseValues)[];

export const DEFAULT_MOTION: RigMotion = {
  phase: 0,
  stride: 0,
  time: 0,
  wag: 0,
  gazeX: 0,
  gazeY: 0,
  blink: 0,
  ear: 0,
};

const round2 = (n: number) => Math.round(100 * n) / 100;
const rot = (deg: number, [cx, cy]: readonly [number, number]) => `rotate(${round2(deg)} ${cx} ${cy})`;
const damp = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);
const clamp = (v: number, lo = -1, hi = 1) => Math.max(lo, Math.min(hi, v));

export function lerpPose(a: PoseValues, b: PoseValues, t: number): PoseValues {
  const out = { ...a };
  for (const k of POSE_KEYS) {
    out[k] = a[k] + (b[k] - a[k]) * t;
  }
  return out;
}

export type RigAttrs = {
  body: string;
  fn: string;
  ff: string;
  bn: string;
  bf: string;
  tail: string;
  haunch: string;
  head: string;
  earL: string;
  earR: string;
  eyes: string;
  blink: string;
  openEyes: string;
  happyEyes: string;
  shutEyes: string;
  tongue: string;
  mouth: string;
  backLegs: string;
  haunchOpacity: string;
  side: string;
  ledge: string;
  shadow: string;
  shadowOpacity: string;
};

export function computeRigAttrs(pose: PoseValues, m: RigMotion = DEFAULT_MOTION): RigAttrs {
  const sinA = Math.sin(m.phase);
  const sinB = Math.sin(m.phase + Math.PI);
  const swing = 20 + 10 * m.stride;
  const stepLift = (1 - Math.cos(2 * m.phase)) / 2;
  const moving = m.stride > 0.01 ? 1 : 0;
  const breath = Math.sin(2.4 * m.time) * (1 - moving);
  const bodyY = pose.bodyY - stepLift * (2.5 + 4 * m.stride) * moving + 0.6 * breath;
  const bodyRot = pose.bodyRot + 1.6 * Math.sin(m.phase) * moving;
  const counterRot = -pose.bodyRot;
  const wagAmp = 5 + 17 * m.wag;
  const wagFreq = 1.2 + 2.6 * m.wag;
  const tailDeg = pose.tail + Math.sin(m.time * wagFreq * Math.PI * 2) * wagAmp;
  const headBob = -((1 - Math.cos(2 * m.phase - 0.7)) / 2) * (2 + 3 * m.stride) * moving + 0.9 * breath;

  return {
    body: `translate(${round2(pose.bodyX)} ${round2(bodyY)}) ${rot(bodyRot, BODY_PIVOT)} translate(${BODY_PIVOT[0]} 0) scale(${round2(pose.stretch)} 1) translate(${-BODY_PIVOT[0]} 0)`,
    fn: `translate(${SHOULDER_N[0]} ${SHOULDER_N[1]}) rotate(${round2(pose.fn + counterRot + sinA * swing * moving)})`,
    ff: `translate(${SHOULDER_F[0]} ${SHOULDER_F[1]}) rotate(${round2(pose.ff + counterRot + sinB * swing * moving)})`,
    bn: `translate(${HIP_N[0]} ${HIP_N[1]}) rotate(${round2(pose.bn + sinB * swing * moving)})`,
    bf: `translate(${HIP_F[0]} ${HIP_F[1]}) rotate(${round2(pose.bf + sinA * swing * moving)})`,
    tail: rot(tailDeg, TAIL_BASE),
    haunch: `translate(0 ${round2(-(0.06 * pose.bodyRot))})`,
    head: `translate(${round2(pose.headX)} ${round2(pose.headY + headBob)}) ${rot(pose.headRot + 1.4 * Math.sin(m.phase) * moving, HEAD_PIVOT)}`,
    earL: rot(pose.earL + m.ear + 4 * Math.sin(2 * m.phase) * moving, EAR_L_PIVOT),
    earR: rot(pose.earR - m.ear - 4 * Math.sin(2 * m.phase) * moving, EAR_R_PIVOT),
    eyes: `translate(${round2(3.4 * m.gazeX)} ${round2(2.6 * m.gazeY)})`,
    blink: `translate(0 ${round2(98 * m.blink * 0.92)}) scale(1 ${round2(1 - 0.92 * m.blink)})`,
    openEyes: String(round2(Math.max(0, pose.eyes - pose.happy))),
    happyEyes: String(round2(Math.min(pose.happy, pose.eyes))),
    shutEyes: String(round2(1 - pose.eyes)),
    tongue: String(round2(pose.tongue * (1 - pose.mouth))),
    mouth: String(round2(pose.mouth)),
    backLegs: String(round2(1 - pose.sit)),
    haunchOpacity: String(round2(pose.sit * (1 - pose.front))),
    side: String(round2(1 - pose.front)),
    ledge: String(round2(pose.front)),
    shadow: `translate(${round2(0.6 * pose.bodyX)} 0) scale(${round2(1 - 0.05 * stepLift * moving)} 1)`,
    shadowOpacity: String(round2(0.12 * (1 - pose.front))),
  };
}

const ATTR_BINDINGS: readonly [string, string, keyof RigAttrs | "root"][] = [
  ["root", "transform", "root"],
  ["shadow", "transform", "shadow"],
  ["shadow", "opacity", "shadowOpacity"],
  ["body", "transform", "body"],
  ["body", "opacity", "side"],
  ["bf", "transform", "bf"],
  ["bf", "opacity", "backLegs"],
  ["bn", "transform", "bn"],
  ["bn", "opacity", "backLegs"],
  ["ff", "transform", "ff"],
  ["fn", "transform", "fn"],
  ["tail", "transform", "tail"],
  ["haunch", "transform", "haunch"],
  ["haunch", "opacity", "haunchOpacity"],
  ["head", "transform", "head"],
  ["earL", "transform", "earL"],
  ["earR", "transform", "earR"],
  ["eyes", "transform", "eyes"],
  ["open", "opacity", "openEyes"],
  ["blink", "transform", "blink"],
  ["happy", "opacity", "happyEyes"],
  ["shut", "opacity", "shutEyes"],
  ["tongue", "opacity", "tongue"],
  ["mouth", "opacity", "mouth"],
  ["ledge", "opacity", "ledge"],
];

export class PupRig {
  svg: SVGSVGElement;
  els = new Map<string, Element>();
  written = new Map<string, string>();
  pose: PoseValues;
  target: PoseValues;
  m: RigMotion = { ...DEFAULT_MOTION };
  facing: number;
  facingTarget: number;
  strideTarget = 0;
  wagTarget = 0.35;
  gazeTarget = { x: 0, y: 0 };
  tilt = 0;
  tiltTarget = 0;
  earV = 0;
  nextBlink = 1.2;
  blinkAt = -1;
  woofUntil = 0;
  bounce = 0;
  bounceV = 0;
  offset = 0;
  offsetTarget = 0;
  pet = 0;
  petTarget = 0;
  turn = 0.07;
  lean = 0;

  constructor(svg: SVGSVGElement, initialPose: PoseName = "sit", facing: 1 | -1 = 1) {
    this.svg = svg;
    svg.querySelectorAll<SVGElement>("[data-p]").forEach((el) => {
      if (el.dataset.p) this.els.set(el.dataset.p, el);
    });
    const base = POSES[initialPose] ?? POSES.sit;
    this.pose = { ...base };
    this.target = base;
    this.facing = facing;
    this.facingTarget = facing;
  }

  setPose(p: PoseName | PoseValues) {
    this.target = typeof p === "string" ? POSES[p] ?? POSES.sit : p;
  }

  jump(p: PoseName, facing?: 1 | -1) {
    const base = POSES[p] ?? POSES.sit;
    this.pose = { ...base };
    this.target = base;
    if (facing) {
      this.facing = facing;
      this.facingTarget = facing;
    }
  }

  face(dir: 1 | -1, turn = 0.07) {
    this.facingTarget = dir;
    this.turn = turn;
  }

  get facingDir(): 1 | -1 {
    return this.facingTarget >= 0 ? 1 : -1;
  }

  stride(v: number) {
    this.strideTarget = clamp(v, 0, 1);
  }

  advance(px: number) {
    this.m.phase += (px / 46) * Math.PI;
  }

  walkedTo(px: number) {
    this.m.phase = (px / 46) * Math.PI;
  }

  wag(v: number) {
    this.wagTarget = clamp(v, 0, 1);
  }

  cock(deg: number) {
    this.tiltTarget = deg;
  }

  lookAt(pt: { x: number; y: number } | null) {
    if (!pt) {
      this.gazeTarget = { x: 0, y: 0 };
      return;
    }
    const rect = this.svg.getBoundingClientRect();
    const hx = this.facingTarget > 0 ? HEAD_PIVOT[0] : RIG_W - HEAD_PIVOT[0];
    const cx = rect.left + (hx / RIG_W) * rect.width;
    const cy = rect.top + (EYE_Y / RIG_H) * rect.height;
    const dx = pt.x - cx;
    const dy = pt.y - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const mag = Math.min(1, dist / 160);
    this.gazeTarget = {
      x: (dx / dist) * mag * this.facingTarget,
      y: (dy / dist) * mag,
    };
  }

  woof(now: number) {
    this.woofUntil = now + 0.34;
    this.bounceV = -150;
    this.earV += 260;
  }

  jolt(power = 1) {
    this.earV += 220 * power;
  }

  hop(power = 1) {
    this.bounceV = -230 * power;
    this.earV += 200 * power;
  }

  yawn(now: number, dur = 0.9) {
    this.woofUntil = now + dur;
  }

  dash(px: number) {
    this.offsetTarget = px;
  }

  petting(active: boolean) {
    this.petTarget = active ? 1 : 0;
  }

  reset() {
    this.offsetTarget = 0;
    this.tiltTarget = 0;
    this.petTarget = 0;
  }

  tick(dtRaw: number, now: number) {
    const dt = Math.min(Math.max(dtRaw, 0), 0.05);
    const m = this.m;
    m.time = now;

    this.pose = lerpPose(this.pose, this.target, damp(dt, 0.16));
    this.facing += (this.facingTarget - this.facing) * damp(dt, this.turn);
    m.stride += (this.strideTarget - m.stride) * damp(dt, 0.12);
    if (m.stride < 0.012 && this.strideTarget === 0) m.stride = 0;
    m.wag += (this.wagTarget - m.wag) * damp(dt, 0.4);
    m.gazeX += (this.gazeTarget.x - m.gazeX) * damp(dt, 0.07);
    m.gazeY += (this.gazeTarget.y - m.gazeY) * damp(dt, 0.07);
    this.tilt += (this.tiltTarget + 3 * m.gazeX - this.tilt) * damp(dt, 0.18);

    this.earV += (-150 * m.ear - 10 * this.earV) * dt;
    m.ear = clamp(m.ear + this.earV * dt, -28, 28);

    this.bounceV += (-260 * this.bounce - 16 * this.bounceV) * dt;
    this.bounce += this.bounceV * dt;

    const prevOffset = this.offset;
    this.offset += (this.offsetTarget - this.offset) * damp(dt, 0.2);
    if (Math.abs(this.offsetTarget - this.offset) < 0.05) {
      this.offset = this.offsetTarget;
    }
    const moved = Math.abs(this.offset - prevOffset);
    if (moved) this.advance(moved);
    const dashStride = dt > 0 ? Math.min(1, moved / dt / 180) : 0;

    this.pet += (this.petTarget - this.pet) * damp(dt, 0.15);

    if (now > this.nextBlink && this.pose.eyes > 0.6) {
      this.blinkAt = now;
      this.nextBlink = now + 2.2 + 3.8 * Math.random();
      if (Math.random() < 0.18) this.nextBlink = now + 0.32;
    }
    const blinkPhase = (now - this.blinkAt) / 0.15;
    m.blink = blinkPhase >= 0 && blinkPhase <= 1 ? Math.sin(blinkPhase * Math.PI) : 0;

    const effectivePose: PoseValues = {
      ...this.pose,
      headRot: this.pose.headRot + this.tilt,
      bodyRot: this.pose.bodyRot + this.lean,
      bodyY: this.pose.bodyY + this.bounce,
      headY: this.pose.headY + 1.15 * this.bounce,
      mouth: now < this.woofUntil ? 1 : this.pose.mouth,
      happy: Math.max(this.pose.happy, this.pet),
    };

    const attrs = computeRigAttrs(effectivePose, dashStride > m.stride ? { ...m, stride: dashStride } : m);
    const scaleX = Math.abs(this.facing) < 0.02 ? 0.02 * Math.sign(this.facing || 1) : this.facing;
    const rootTransform = `translate(${this.offset.toFixed(1)} 0) translate(${RIG_W / 2} 0) scale(${scaleX.toFixed(3)} 1) translate(${-RIG_W / 2} 0)`;

    for (const [part, attr, key] of ATTR_BINDINGS) {
      const el = this.els.get(part);
      if (!el) continue;
      const val = key === "root" ? rootTransform : attrs[key];
      const cacheKey = `${part}:${attr}`;
      if (this.written.get(cacheKey) !== val) {
        el.setAttribute(attr, val);
        this.written.set(cacheKey, val);
      }
    }
  }
}

export type TrickContext = {
  d: PupRig;
  rest: PoseValues;
  facing: 1 | -1;
  say: (text: string, secs?: number) => void;
  hearts: () => void;
};

export type TrickStep = [number, (now: number) => void];

const flipDir = (f: 1 | -1): 1 | -1 => (f === 1 ? -1 : 1);

export const TRICKS: Record<string, (ctx: TrickContext, t: number) => TrickStep[]> = {
  woof: ({ d, say }, t) => [
    [t, (now) => { d.woof(now); say("woof!"); }],
    [t + 0.42, (now) => { d.woof(now); say("woof woof!"); }],
  ],
  spin: ({ d, rest, facing, say }, t) => [
    [t, () => { d.setPose("stand"); d.hop(0.5); }],
    [t + 0.14, () => d.face(flipDir(facing))],
    [t + 0.38, () => d.face(facing)],
    [t + 0.62, () => d.face(flipDir(facing))],
    [t + 0.86, () => { d.face(facing); say("wheee!"); }],
    [t + 1.3, () => d.setPose(rest)],
  ],
  beg: ({ d, rest, say }, t) => [
    [t, () => { d.setPose("beg"); d.wag(1); say("treat, please?", 1.7); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  bow: ({ d, rest, say }, t) => [
    [t, () => { d.setPose("bow"); d.wag(1); say("play with me!"); }],
    [t + 0.55, () => d.hop(0.45)],
    [t + 1.7, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  hop: ({ d, rest, say }, t) => [
    [t, () => { d.setPose("hop"); d.hop(1.1); say("boing!"); }],
    [t + 0.36, () => d.setPose(rest)],
    [t + 0.62, () => { d.setPose("hop"); d.hop(0.8); }],
    [t + 0.98, () => d.setPose(rest)],
  ],
  love: ({ d, rest, say, hearts }, t) => [
    [t, () => { d.setPose({ ...rest, happy: 1, tongue: 1 }); d.wag(1); hearts(); say("I like you!", 1.5); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  tilt: ({ d, say }, t) => [
    [t, () => { d.cock(-14); say("hm?"); }],
    [t + 0.8, () => d.cock(12)],
    [t + 1.6, () => d.cock(0)],
  ],
  sneeze: ({ d, say }, t) => [
    [t, () => d.cock(-8)],
    [t + 0.32, (now) => { d.cock(10); d.jolt(1.4); d.hop(0.35); d.yawn(now, 0.22); say("achoo!"); }],
    [t + 0.8, () => d.cock(0)],
  ],
  peekaboo: ({ d, say }, t) => [
    [t, () => d.setPose({ ...POSES.peek, headY: 120 })],
    [t + 0.55, () => { d.setPose("peek"); d.jolt(1.2); say("peekaboo!"); }],
  ],
};

const TRICK_BAG_NAMES = ["woof", "spin", "beg", "bow", "hop", "love", "tilt", "sneeze"];
let trickBag: string[] = [];

export function pickNextTrick(lastTrick: string | null, streak: number): string {
  if (streak >= 4) return "spin";
  if (!trickBag.length) {
    trickBag = TRICK_BAG_NAMES.filter((k) => k !== lastTrick).sort(() => Math.random() - 0.5);
  }
  return trickBag.pop() ?? "woof";
}

export function spawnHearts(container: HTMLElement, x: number, y: number) {
  for (let i = 0; i < 5; i++) {
    const span = document.createElement("span");
    span.className = "pup-heart";
    span.textContent = "♥";
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    container.append(span);
    const dx = (Math.random() - 0.5) * 90;
    const dy = -70 - 60 * Math.random();
    if (typeof span.animate === "function") {
      span
        .animate(
          [
            { transform: "translate(-50%, 0) scale(0.4)", opacity: 0 },
            { opacity: 1, offset: 0.2 },
            { transform: `translate(calc(-50% + ${dx.toFixed(0)}px), ${dy.toFixed(0)}px) scale(1.1)`, opacity: 0 },
          ],
          { duration: 1150 + 110 * i, delay: 80 * i, easing: "cubic-bezier(.2,.7,.3,1)", fill: "backwards" },
        )
        .finished.then(
          () => span.remove(),
          () => span.remove(),
        );
    } else {
      setTimeout(() => span.remove(), 1200);
    }
  }
}

export type PupCueDetail = {
  look?: Element | null;
  secs?: number;
  say?: string;
};

export function cuePup(detail: PupCueDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PupCueDetail>("pup:cue", { detail }));
}
