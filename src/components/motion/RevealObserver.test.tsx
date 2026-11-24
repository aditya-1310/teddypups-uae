import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { RevealObserver } from "./RevealObserver";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

type Entry = { target: Element; isIntersecting: boolean };
let observers: { cb: (e: Entry[]) => void; observed: Set<Element> }[] = [];

beforeEach(() => {
  observers = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observed = new Set<Element>();
      constructor(public cb: (e: Entry[]) => void) {
        observers.push(this);
      }
      observe(el: Element) {
        this.observed.add(el);
      }
      unobserve(el: Element) {
        this.observed.delete(el);
      }
      disconnect() {
        this.observed.clear();
      }
    },
  );
});

describe("RevealObserver", () => {
  it("arms reveal targets, then marks them revealed once they scroll into view", () => {
    document.body.innerHTML = `<div data-reveal id="a"></div><div data-reveal id="b"></div><div id="c"></div>`;
    render(<RevealObserver />);
    const a = document.getElementById("a")!;
    const b = document.getElementById("b")!;

    expect(a).toHaveAttribute("data-armed");
    expect(document.getElementById("c")).not.toHaveAttribute("data-armed");
    expect(a).not.toHaveAttribute("data-revealed");

    act(() => observers[0].cb([{ target: a, isIntersecting: true }, { target: b, isIntersecting: false }]));
    expect(a).toHaveAttribute("data-revealed");
    expect(b).not.toHaveAttribute("data-revealed");
    expect(observers[0].observed.has(a)).toBe(false);
  });

  it("reveals everything at once when the visitor prefers reduced motion", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), addEventListener() {}, removeEventListener() {} }));
    document.body.innerHTML = `<div data-reveal id="a"></div>`;
    render(<RevealObserver />);
    expect(document.getElementById("a")).toHaveAttribute("data-revealed");
    vi.unstubAllGlobals();
  });
});
