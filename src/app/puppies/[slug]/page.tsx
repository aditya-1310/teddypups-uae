import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { PawIcon } from "@/components/icons";
import { EnquiryForm } from "@/components/puppies/EnquiryForm";
import { PuppyGallery } from "@/components/puppies/PuppyGallery";
import { Teddy } from "@/components/teddy/Teddy";
import journeysData from "@/data/journeys.json";
import { getGoneHome, getPuppies, type Media } from "@/lib/puppies";
import { SITE } from "@/lib/site";

type Journey = (typeof journeysData)[number];
const journeys = journeysData as Journey[];

type ProfileData = {
  slug: string;
  gone: boolean;
  displayName: string;
  breed: string;
  age: string;
  facts: Record<string, string>;
  media: Media[];
  origin: "local" | "imported";
  description: string;
};

function getAllProfiles(): ProfileData[] {
  const avail = getPuppies().map((p) => ({
    slug: p.slug,
    gone: false,
    displayName: p.displayName,
    breed: p.breed,
    age: p.age,
    facts: {
      Breed: p.breed,
      "Boy or girl": p.genderLabel,
      Age: p.age,
      Where: p.origin === "local" ? "In Dubai" : "Imported for you",
    },
    media: p.media,
    origin: p.origin,
    description: `Meet ${p.displayName}: ${p.breed}, ${p.genderLabel.toLowerCase()}, ${p.age} old, ${p.origin}. Real photos${p.media.some((m) => m.kind === "video") ? " and video" : ""} from ${SITE.name}.`,
  }));

  const gone = getGoneHome().map((g) => ({
    slug: g.slug,
    gone: true,
    displayName: g.name,
    breed: g.facts.Breed,
    age: g.facts.Age,
    facts: g.facts,
    media: g.media,
    origin: (g.facts.Where === "In Dubai" ? "local" : "imported") as "local" | "imported",
    description: g.description,
  }));

  return [...avail, ...gone];
}

export function generateStaticParams() {
  return getAllProfiles().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pup = getAllProfiles().find((p) => p.slug === slug);
  if (!pup) return { title: "Puppy not found" };
  return {
    title: `${pup.displayName}, ${pup.breed} puppy`,
    description: pup.description,
  };
}

const PROMISES = [
  "Vaccinated",
  "Dewormed",
  "Verified health certificate from licensed vets",
  "Thoroughly checked before joining your family",
];

export default async function PuppyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profiles = getAllProfiles();
  const pup = profiles.find((p) => p.slug === slug);
  if (!pup) notFound();

  const pool = profiles.filter((p) => p.gone === pup.gone);
  const idx = pool.findIndex((p) => p.slug === pup.slug);
  const prev = pool[(idx - 1 + pool.length) % pool.length];
  const next = pool[(idx + 1) % pool.length];

  const cover = pup.media[0];
  const journey = journeys.find((j) => j.key === pup.origin) ?? journeys[1];

  return (
    <div className="tp-page">
      <article
        className="tp-storybook"
        style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${cover?.color ?? "#785838"} 24%, var(--color-milk)) 0, var(--color-milk) 85%)` } as CSSProperties}
      >
        <div aria-hidden="true" className="tp-ribbon">
          <div className="tp-ribbon__track">
            <span className="tp-ribbon__band" />
          </div>
        </div>
        <div className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
            <Link className="link-ink" href={pup.gone ? "/gone-home" : "/puppies"}>
              {pup.gone ? "Gone home" : "Available puppies"}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{pup.displayName}</span>
          </nav>

          <p className="tp-chapter">
            <span aria-hidden="true" className="tp-chapter__n font-plush">
              1
            </span>
            <span className="font-scrawl">hello, it&apos;s me</span>
          </p>

          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <PuppyGallery name={pup.displayName} media={pup.media} />
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
                <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20" data-reveal="true">
                  <span aria-hidden="true" className="tp-tag__ring" />
                  <Teddy pose="peek" label={`Teddy, peeking over ${pup.displayName}'s tag`} className="absolute -top-[4.8rem] right-6 w-[9.5rem]" />
                  {pup.gone ? (
                    <span className="inline-grid place-items-center rounded-full border-[3px] border-current px-3 py-1 font-scrawl text-sm uppercase tracking-wide -rotate-6 text-toffee-deep">
                      Gone home ♥
                    </span>
                  ) : (
                    <span className="chip">
                      <PawIcon className="size-4 text-toffee" />
                      Available
                    </span>
                  )}
                  <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{pup.displayName}</h1>
                  <p className="mt-2 text-lg font-semibold text-cocoa-soft">{pup.breed}</p>

                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                    {Object.entries(pup.facts).map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-scrawl text-sm text-cocoa-soft">{k}</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8 flex flex-col gap-3">
                    <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                      Ask about {pup.displayName} on WhatsApp
                    </a>
                    <a href={`#enquire-${pup.slug}`} className="btn btn-ghost">
                      Send an enquiry
                    </a>
                  </div>
                </div>

                <div className="tp-paper mt-8 -rotate-1">
                  <p className="tp-chapter">
                    <span aria-hidden="true" className="tp-chapter__n font-plush">
                      2
                    </span>
                    <span className="font-scrawl">what comes with {pup.displayName}</span>
                  </p>
                  <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                  <ul className="mt-4 space-y-2.5">
                    {PROMISES.map((item) => (
                      <li key={item} className="flex items-start gap-3 font-semibold">
                        <svg viewBox="0 0 32 32" className="mt-0.5 size-6 shrink-0 text-toffee-deep" aria-hidden="true">
                          <path d="M5 17l7 7L27 8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {!pup.gone && (
            <section aria-labelledby={`home-steps-${pup.slug}`} className="mt-20">
              <p className="tp-chapter">
                <span aria-hidden="true" className="tp-chapter__n font-plush">
                  3
                </span>
                <span className="font-scrawl">the way home</span>
              </p>
              <h2 id={`home-steps-${pup.slug}`} className="font-plush text-big mt-3">
                {pup.origin === "local" ? "Meeting in our Dubai showroom" : "Coming home from abroad"}
              </h2>
              <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
                {journey.steps.map((s, i) => (
                  <li key={s.title}>
                    <span aria-hidden="true" className="tp-trail__num font-plush">
                      {i + 1}
                    </span>
                    <h3 className="font-plush-text text-xl font-bold leading-tight">{s.title}</h3>
                    <p className="mt-2 max-w-[38ch] text-cocoa-soft">{s.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section id={`enquire-${pup.slug}`} aria-labelledby={`enquire-title-${pup.slug}`} className="tp-letter mt-20 grid gap-10 lg:grid-cols-12">
            <span aria-hidden="true" className="tp-letter__stamp">
              <PawIcon className="size-9" />
            </span>
            <div className="lg:col-span-4">
              <p className="tp-chapter">
                <span aria-hidden="true" className="tp-chapter__n font-plush">
                  {pup.gone ? 3 : 4}
                </span>
                <span className="font-scrawl">dear TeddyPups…</span>
              </p>
              <h2 id={`enquire-title-${pup.slug}`} className="font-plush text-big mt-2">
                {pup.gone ? "Looking for a puppy like this?" : `Ask about ${pup.displayName}`}
              </h2>
              <p className="mt-4 text-cocoa-soft">
                Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EnquiryForm puppySlug={pup.slug} puppyName={pup.displayName} breed={pup.breed} />
            </div>
          </section>

          <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Previous pup", item: prev },
              { label: "Next pup", item: next },
            ].map(({ label, item }) => {
              const thumb = item.media[0];
              return (
                <Link
                  key={item.slug}
                  className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
                  href={`/puppies/${item.slug}`}
                >
                  <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
                    {thumb && (
                      <Image
                        src={thumb.url}
                        alt={thumb.alt || item.displayName}
                        fill
                        sizes="80px"
                        style={{ objectFit: "cover", objectPosition: `${thumb.focalX * 100}% ${thumb.focalY * 100}%`, backgroundColor: thumb.color }}
                      />
                    )}
                  </span>
                  <span>
                    <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
                    <span className="font-plush text-[1.6rem]">{item.displayName}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </article>
    </div>
  );
}
