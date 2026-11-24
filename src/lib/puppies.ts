import puppiesData from "@/data/puppies.json";
import goneHomeData from "@/data/gone-home.json";

export type Media = {
  id: string;
  url: string;
  kind: "image" | "video";
  width: number;
  height: number;
  alt: string;
  focalX: number;
  focalY: number;
  color: string;
  durationS?: number;
  poster?: Media;
};

export type Puppy = {
  slug: string;
  name: string;
  displayName: string;
  breed: string;
  gender: "male" | "female" | "male-female";
  genderLabel: string;
  age: string;
  status: string;
  origin: "local" | "imported";
  breeds: string[];
  collections: string[];
  cover: Media;
  media: Media[];
};

export type GoneHomePuppy = {
  slug: string;
  name: string;
  meta: string;
  from: string;
  facts: Record<string, string>;
  description: string;
  media: Media[];
};

export type PuppyFilters = {
  origin?: string;
  collection?: string;
  breed?: string;
  gender?: string;
};

const FILTER_KEYS = ["origin", "collection", "breed", "gender"] as const;

const puppies = puppiesData as Puppy[];
const goneHome = goneHomeData as GoneHomePuppy[];

export function getPuppies(): Puppy[] {
  return puppies;
}

export function getGoneHome(): GoneHomePuppy[] {
  return goneHome;
}

/** A puppy profile, whether still available or already gone home. */
export function getPuppy(slug: string): { slug: string; displayName: string } | undefined {
  const available = puppies.find((p) => p.slug === slug);
  if (available) return available;
  const gone = goneHome.find((p) => p.slug === slug);
  return gone && { ...gone, displayName: gone.name };
}

export function filterPuppies(list: Puppy[], f: PuppyFilters): Puppy[] {
  return list.filter(
    (p) =>
      (!f.origin || p.origin === f.origin) &&
      (!f.collection || p.collections.includes(f.collection)) &&
      (!f.breed || p.breeds.includes(f.breed)) &&
      (!f.gender || p.gender.split("-").includes(f.gender)),
  );
}

export function parseFilters(params: URLSearchParams): PuppyFilters {
  const f: PuppyFilters = {};
  for (const key of FILTER_KEYS) {
    const value = params.get(key);
    if (value) f[key] = value;
  }
  return f;
}

export function matchSummary(count: number, filtered: boolean): string {
  const noun = count === 1 ? "puppy" : "puppies";
  return filtered ? `${count} ${noun} match` : `${count} ${noun} looking for a home`;
}

/** "Max, Maltipoo, boy, 3 months, available" — the card's accessible name. */
export function puppyLabel(p: Puppy): string {
  const who = p.name ? `${p.displayName}, ${p.breed}` : p.displayName;
  return `${who}, ${p.genderLabel.toLowerCase()}, ${p.age}, available`;
}

/** "Maltipoo · boy · 3 months" (breed only shown when the puppy has its own name). */
export function puppyMeta(p: Puppy): string {
  return [p.name ? p.breed : null, p.genderLabel.toLowerCase(), p.age].filter(Boolean).join(" · ");
}

export const hasVideo = (p: { media: Media[] }) => p.media.some((m) => m.kind === "video");

/** "Ace, Pomeranian, boy, 3 months, gone home" */
export function goneLabel(p: GoneHomePuppy): string {
  const breed = p.facts.Breed;
  const named = p.name !== breed;
  return [named ? p.name : null, breed, p.facts["Boy or girl"].toLowerCase(), p.facts.Age, "gone home"].filter(Boolean).join(", ");
}
