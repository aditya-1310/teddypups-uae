import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PuppyGallery } from "./PuppyGallery";
import type { Media } from "@/lib/puppies";

const img = (id: string): Media => ({ id, url: `/media/${id}.jpg`, kind: "image", width: 600, height: 800, alt: `photo ${id}`, focalX: 0.5, focalY: 0.5, color: "#eee" });
const video: Media = { ...img("v"), kind: "video", url: "/media/v.mp4", alt: "Video of Max", poster: img("poster") };
const media = [img("a"), video, img("c")];

describe("PuppyGallery", () => {
  it("shows the first photo with a counter and a thumbnail strip", () => {
    render(<PuppyGallery name="Max" media={media} />);
    expect(screen.getByRole("button", { name: "Open Max, photo 1 of 3 full screen" })).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    const strip = screen.getByRole("list", { name: "All photos of Max" });
    expect(within(strip).getAllByRole("button").map((b) => b.getAttribute("aria-label"))).toEqual([
      "Max, photo 1 of 3",
      "Max, video 2 of 3",
      "Max, photo 3 of 3",
    ]);
    expect(within(strip).getByRole("button", { name: "Max, photo 1 of 3" })).toHaveAttribute("aria-current", "true");
  });

  it("steps forward and wraps around with the arrows", async () => {
    const user = userEvent.setup();
    render(<PuppyGallery name="Max" media={media} />);
    await user.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Video of Max")).toHaveAttribute("src", "/media/v.mp4");
    await user.click(screen.getByRole("button", { name: "Previous photo" }));
    await user.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("jumps to a thumbnail", async () => {
    const user = userEvent.setup();
    render(<PuppyGallery name="Max" media={media} />);
    await user.click(screen.getByRole("button", { name: "Max, photo 3 of 3" }));
    expect(screen.getByRole("button", { name: "Open Max, photo 3 of 3 full screen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Max, photo 3 of 3" })).toHaveAttribute("aria-current", "true");
  });

  it("opens a full-screen viewer that can page and close", async () => {
    const user = userEvent.setup();
    render(<PuppyGallery name="Max" media={media} />);
    await user.click(screen.getByRole("button", { name: "Open Max, photo 1 of 3 full screen" }));
    const viewer = screen.getByRole("dialog", { name: "Max photos" });
    expect(within(viewer).getByText("Max, photo 1 of 3")).toBeInTheDocument();
    await user.click(within(viewer).getByRole("button", { name: "Next" }));
    expect(within(viewer).getByText("Max, video 2 of 3")).toBeInTheDocument();
    await user.click(within(viewer).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog", { name: "Max photos" })).not.toBeInTheDocument();
  });

  it("hides the arrows when there is only one photo", () => {
    render(<PuppyGallery name="Buddy" media={[img("a")]} />);
    expect(screen.queryByRole("button", { name: "Next photo" })).not.toBeInTheDocument();
  });
});
