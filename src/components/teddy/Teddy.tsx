import type { CSSProperties } from "react";
import { TEDDY_POSES, type TeddyPose } from "./poses";

type TeddyProps = {
  pose: TeddyPose;
  /** Accessible description; omit for purely decorative appearances. */
  label?: string;
  facing?: "left" | "right";
  className?: string;
};

/** Teddy, the TeddyPups mascot, drawn as an SVG rig. */
export function Teddy({ pose, label, facing = "right", className }: TeddyProps) {
  return (
    <div className={className ? `pup-buddy ${className}` : "pup-buddy "} data-facing={facing}>
      <svg
        viewBox="0 0 300 240"
        style={{ overflow: "visible" } as CSSProperties}
        focusable="false"
        {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      >
        {TEDDY_POSES[pose]}
      </svg>
      <span aria-hidden="true" className="pup-bubble" data-show="false" />
    </div>
  );
}
