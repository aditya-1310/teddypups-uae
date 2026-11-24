import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FamilyWall } from "./FamilyWall";
import type { FamilyPhoto } from "./FamilyWall";

const photos: FamilyPhoto[] = [
  { id: "1", url: "/media/1.jpg", kind: "image", width: 600, height: 800, alt: "Family 1", focalX: 0.5, focalY: 0.5, color: "#eee", caption: "Lulu 🧸" },
  { id: "2", url: "/media/2.jpg", kind: "image", width: 600, height: 800, alt: "Family 2", focalX: 0.5, focalY: 0.5, color: "#ddd", caption: "" },
];

describe("FamilyWall", () => {
  it("renders all polaroid photos and opens the lightbox at the clicked index", async () => {
    const user = userEvent.setup();
    render(<FamilyWall photos={photos} />);

    const list = screen.getByRole("list", { name: "Photos from TeddyPups families" });
    expect(within(list).getAllByRole("button")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Open photo 1 of 2: Lulu 🧸" }));
    const dialog = screen.getByRole("dialog", { name: "Photo viewer" });
    expect(within(dialog).getByText("Lulu 🧸")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Next" }));
    expect(within(dialog).getByText("2 of 2")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog", { name: "Photo viewer" })).not.toBeInTheDocument();
  });
});
