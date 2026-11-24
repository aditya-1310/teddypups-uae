import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "./SiteHeader";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

describe("SiteHeader", () => {
  beforeEach(() => {
    pathname.current = "/";
  });

  it("links the logo home and lists the six main pages", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "TeddyPups U.A.E. — home" })).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getAllByRole("link").map((a) => a.textContent)).toEqual([
      "Home",
      "Puppies",
      "Happy families",
      "How it works",
      "FAQ",
      "Visit & contact",
    ]);
  });

  it("marks the current section, including nested puppy profiles", () => {
    pathname.current = "/puppies/maltipoo-max-male";
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Puppies" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    expect(screen.queryByRole("dialog", { name: "Site menu" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = screen.getByRole("dialog", { name: "Site menu" });
    expect(dialog).toHaveAttribute("open");
    expect(within(dialog).getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(dialog).not.toHaveAttribute("open");
  });

  it("closes the mobile menu when a link is chosen", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = screen.getByRole("dialog", { name: "Site menu" });
    await user.click(within(dialog).getByRole("link", { name: "FAQ" }));
    expect(dialog).not.toHaveAttribute("open");
  });

  it("picks up a solid background once the page is scrolled", () => {
    const { container } = render(<SiteHeader />);
    const header = container.querySelector("header")!;
    expect(header).toHaveAttribute("data-scrolled", "false");
    act(() => {
      window.scrollY = 120;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(header).toHaveAttribute("data-scrolled", "true");
  });
});
