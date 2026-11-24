import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("lists the explore links", () => {
    render(<SiteFooter />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(within(nav).getAllByRole("link").map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Available puppies", "/puppies"],
      ["Gone home", "/gone-home"],
      ["Happy families", "/happy-families"],
      ["How it works", "/how-it-works"],
      ["Delivery & collection", "/how-it-works#delivery"],
      ["FAQ", "/faq"],
      ["Visit & contact", "/contact"],
    ]);
  });

  it("shows how to say hello", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("heading", { name: "Say hello" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", expect.stringContaining("wa.me/"));
    expect(screen.getByRole("link", { name: "info@instabizweb.com" })).toHaveAttribute("href", "mailto:info@instabizweb.com");
    expect(screen.getByText("Downtown Dubai, United Arab Emirates")).toBeInTheDocument();
    const social = screen.getByRole("list", { name: "Social media" });
    expect(within(social).getAllByRole("link").map((a) => a.textContent)).toEqual(["Instagram", "TikTok", "Facebook"]);
  });

  it("carries the current year in the copyright line", () => {
    render(<SiteFooter />);
    expect(screen.getByText(String(new Date().getFullYear()), { exact: false })).toBeInTheDocument();
  });
});
