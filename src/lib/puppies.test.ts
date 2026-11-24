import { describe, expect, it } from "vitest";
import { filterPuppies, getPuppies, getPuppy, matchSummary, parseFilters } from "./puppies";

const slugs = (list: { slug: string }[]) => list.map((p) => p.slug);

describe("puppy catalogue", () => {
  it("lists the 15 available puppies in showroom order", () => {
    const all = getPuppies();
    expect(all).toHaveLength(15);
    expect(all[0].slug).toBe("maltipoo-max-male");
    expect(all[14].slug).toBe("korean-teacup-pomeranian-male");
  });

  it("finds a puppy by slug, including ones that have gone home", () => {
    expect(getPuppy("maltipoo-max-male")?.displayName).toBe("Max");
    expect(getPuppy("pomeranian-ace-boy")?.displayName).toBe("Ace");
    expect(getPuppy("nope")).toBeUndefined();
  });
});

// Expected results were read off the live reference site's filter UI.
describe("filterPuppies", () => {
  const all = getPuppies();

  it("returns every puppy when no filter is set", () => {
    expect(filterPuppies(all, {})).toHaveLength(15);
  });

  it("filters by breed", () => {
    expect(filterPuppies(all, { breed: "maltipoo" })).toHaveLength(6);
  });

  it("counts a boy & girl litter as both boys and girls", () => {
    const boys = filterPuppies(all, { gender: "male" });
    expect(slugs(boys)).toEqual([
      "maltipoo-max-male",
      "maltipoo-cavapoo-male",
      "toy-poodle-male-female",
      "copper-male",
      "shitzu-male",
      "korean-teacup-pomeranian-male",
    ]);
  });

  it("combines filters", () => {
    expect(slugs(filterPuppies(all, { gender: "male", breed: "shih-tzu" }))).toEqual(["shitzu-male"]);
    expect(filterPuppies(all, { gender: "male", breed: "shih-tzu", collection: "korean-teacup" })).toHaveLength(0);
  });

  it("filters by collection and origin", () => {
    expect(filterPuppies(all, { collection: "korean-teacup" })).toHaveLength(5);
    expect(filterPuppies(all, { origin: "imported" })).toHaveLength(15);
    expect(filterPuppies(all, { origin: "local" })).toHaveLength(0);
  });
});

describe("parseFilters", () => {
  it("reads known keys from the query string and ignores the rest", () => {
    expect(parseFilters(new URLSearchParams("breed=poodle&gender=female&utm=x"))).toEqual({
      breed: "poodle",
      gender: "female",
    });
  });
});

describe("matchSummary", () => {
  it("uses the reference wording", () => {
    expect(matchSummary(15, false)).toBe("15 puppies looking for a home");
    expect(matchSummary(6, true)).toBe("6 puppies match");
    expect(matchSummary(1, true)).toBe("1 puppy match");
    expect(matchSummary(0, true)).toBe("0 puppies match");
  });
});
