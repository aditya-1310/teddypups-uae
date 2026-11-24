import { describe, expect, it } from "vitest";
import { computeRigAttrs, POSES, PupRig } from "./pupRig";

describe("computeRigAttrs (SVG pose math)", () => {
  it("hides body, haunch, and shadow and shows ledge paws in 'snug' (basket) and 'peek' (quilt) poses", () => {
    for (const name of ["snug", "peek"] as const) {
      const attrs = computeRigAttrs(POSES[name]);
      expect(attrs.side).toBe("0");
      expect(attrs.haunchOpacity).toBe("0");
      expect(attrs.shadowOpacity).toBe("0");
      expect(attrs.ledge).toBe("1");
    }
  });

  it("shows sitting haunch and hides standing back legs in 'sit' pose", () => {
    const attrs = computeRigAttrs(POSES.sit);
    expect(attrs.side).toBe("1");
    expect(attrs.haunchOpacity).toBe("1");
    expect(attrs.backLegs).toBe("0");
    expect(attrs.ledge).toBe("0");
  });

  it("shows all four legs and hides ledge paws in 'walk' and 'stand' poses", () => {
    for (const name of ["walk", "stand"] as const) {
      const attrs = computeRigAttrs(POSES[name]);
      expect(attrs.side).toBe("1");
      expect(attrs.backLegs).toBe("1");
      expect(attrs.haunchOpacity).toBe("0");
      expect(attrs.ledge).toBe("0");
    }
  });
});

describe("PupRig", () => {
  it("updates SVG [data-p] attributes and flips root scale for facing direction", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.innerHTML = `<g data-p="root"><g data-p="body"></g><g data-p="ledge"></g><g data-p="haunch"></g></g>`;

    const rig = new PupRig(svg, "snug", 1);
    rig.tick(0.016, 1.0);
    expect(svg.querySelector('[data-p="body"]')?.getAttribute("opacity")).toBe("0");
    expect(svg.querySelector('[data-p="ledge"]')?.getAttribute("opacity")).toBe("1");
    expect(svg.querySelector('[data-p="root"]')?.getAttribute("transform")).toContain("scale(1.000 1)");

    rig.face(-1, 0.001);
    rig.tick(0.05, 1.05);
    expect(svg.querySelector('[data-p="root"]')?.getAttribute("transform")).toContain("scale(-1.000 1)");
  });
});
