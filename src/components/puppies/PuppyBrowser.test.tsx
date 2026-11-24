import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PuppyBrowser } from "./PuppyBrowser";
import { getPuppies } from "@/lib/puppies";

const nav = vi.hoisted(() => ({ search: "", replace: vi.fn() }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(nav.search),
  usePathname: () => "/puppies",
  useRouter: () => ({ replace: nav.replace }),
}));

const cards = () => within(screen.getByRole("list", { name: "Available puppies" })).queryAllByRole("link");
const chip = (name: string) => screen.getByRole("button", { name });

describe("PuppyBrowser", () => {
  beforeEach(() => {
    nav.search = "";
    nav.replace.mockClear();
  });

  it("shows every puppy as a card with a readable summary", () => {
    render(<PuppyBrowser puppies={getPuppies()} />);
    expect(cards()).toHaveLength(15);
    expect(screen.getByRole("link", { name: "Max, Maltipoo, boy, 3 months, available" })).toHaveAttribute("href", "/puppies/maltipoo-max-male");
    expect(screen.getByRole("link", { name: "Toy Poodle, boy & girl, 2 months, available" })).toBeInTheDocument();
    expect(screen.getByText("15 puppies looking for a home")).toBeInTheDocument();
    expect(chip("Everywhere")).toHaveAttribute("aria-pressed", "true");
  });

  it("filters by breed and keeps the choice in the URL", async () => {
    const user = userEvent.setup();
    render(<PuppyBrowser puppies={getPuppies()} />);
    await user.click(chip("Maltipoo"));
    expect(chip("Maltipoo")).toHaveAttribute("aria-pressed", "true");
    expect(cards()).toHaveLength(6);
    expect(screen.getByText("6 puppies match")).toBeInTheDocument();
    expect(nav.replace).toHaveBeenLastCalledWith("/puppies?breed=maltipoo", { scroll: false });
  });

  it("toggles a chip off when it is pressed again", async () => {
    const user = userEvent.setup();
    render(<PuppyBrowser puppies={getPuppies()} />);
    await user.click(chip("Girls"));
    await user.click(chip("Girls"));
    expect(chip("Girls")).toHaveAttribute("aria-pressed", "false");
    expect(cards()).toHaveLength(15);
    expect(nav.replace).toHaveBeenLastCalledWith("/puppies", { scroll: false });
  });

  it("reads the starting filters from the URL", () => {
    nav.search = "collection=korean-teacup";
    render(<PuppyBrowser puppies={getPuppies()} />);
    expect(chip("Korean Teacup")).toHaveAttribute("aria-pressed", "true");
    expect(chip("Everywhere")).toHaveAttribute("aria-pressed", "false");
    expect(cards()).toHaveLength(5);
  });

  it("'Everywhere' clears the origin and collection but keeps other filters", async () => {
    nav.search = "collection=korean-teacup&gender=male";
    const user = userEvent.setup();
    render(<PuppyBrowser puppies={getPuppies()} />);
    await user.click(chip("Everywhere"));
    expect(nav.replace).toHaveBeenLastCalledWith("/puppies?gender=male", { scroll: false });
    expect(cards()).toHaveLength(6);
  });

  it("offers a way back when nothing matches", async () => {
    nav.search = "gender=male&breed=shih-tzu&collection=korean-teacup";
    const user = userEvent.setup();
    render(<PuppyBrowser puppies={getPuppies()} />);
    expect(screen.getByText("No puppies match just now.")).toBeInTheDocument();
    expect(screen.getByText("0 puppies match")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show all puppies" }));
    expect(cards()).toHaveLength(15);
    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
  });

  it("only offers 'Clear filters' while something is filtered", async () => {
    const user = userEvent.setup();
    render(<PuppyBrowser puppies={getPuppies()} />);
    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
    await user.click(chip("Poodle"));
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(cards()).toHaveLength(15);
  });
});
