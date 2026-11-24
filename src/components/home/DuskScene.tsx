"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Lightbox } from "@/components/media/Lightbox";
import { Teddy } from "@/components/teddy/Teddy";
import photosData from "@/data/family-photos.json";
import type { FamilyPhoto } from "@/components/families/FamilyWall";

const DUSK_PHOTOS = (photosData as FamilyPhoto[]).filter((p) => p.caption).slice(0, 8);

export function DuskScene() {
  const [viewer, setViewer] = useState<number | null>(null);
  return (
    <div data-section="families">
      <section data-pup-scene="true" data-tone="dark" className="tp-scene tp-dusk" style={{ "--sky-top": "#a65a30", "--sky-bottom": "#4d2b19" } as React.CSSProperties} aria-labelledby="dusk-title">
        <div className="tp-dusk__sky gutter">
          <div className="tp-dusk__head">
            <h2 id="dusk-title" className="font-plush text-huge">
              Happy families &amp; puppies
            </h2>
            <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
              We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
            </p>
          </div>
          <figure className="tp-dusk__note">
            <blockquote className="font-plush-text">
              “
              TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.
              ”
            </blockquote>
            <figcaption className="font-scrawl">
              Sarah M.
              , Dubai, UAE
            </figcaption>
          </figure>
        </div>
        <div className="tp-photowall">
          <div className="tp-photowall__wall">
            <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
              <li data-reveal="true" style={{ "--d": "330ms" } as React.CSSProperties}>
                <button type="button" onClick={() => setViewer(0)} className="tp-photowall__print" aria-label="Open photo 1 of 64: Lulu 🧸 with her new mummy ❤️">
                  <span className="tp-polaroid" style={{ "--tilt": "-2.2deg", "--tape": "#f6d79a", "--i": "0" } as React.CSSProperties}>
                    <span aria-hidden="true" className="tp-tape tp-tape--center" />
                    <span className="tp-polaroid__photo">
                      <Image src="/media/dI8Jv0KRTiLJ/d2d7e5375b/27b888_7d940ce5701f48d98327e4a242b53ac4-mv2.jpg" alt="A happy TeddyPups family with their new puppy" width={433} height={433} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw" style={{ color: "transparent", width: "100%", height: "auto", backgroundColor: "#d8b898" } as React.CSSProperties} />
                    </span>
                    <span className="tp-polaroid__caption font-scrawl">
                      Lulu 🧸 with her new mummy ❤️
                    </span>
                  </span>
                </button>
              </li>
              <li data-reveal="true" data-pup-look="" style={{ "--d": "0ms" } as React.CSSProperties}>
                <button type="button" onClick={() => setViewer(1)} className="tp-photowall__print" aria-label="Open photo 2 of 64: Adorable Maltipoo baby 🧸❤️">
                  <span className="tp-polaroid" style={{ "--tilt": "1.6deg", "--tape": "#f9cdbf", "--i": "1" } as React.CSSProperties}>
                    <span aria-hidden="true" className="tp-tape tp-tape--left" />
                    <span className="tp-polaroid__photo">
                      <Image src="/media/TI-WtaFssfQt/c41fb2a387/27b888_15920f828b864dd1b44b98ec4e964c53-mv2.jpg" alt="A happy TeddyPups family with their new puppy" width={433} height={433} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw" style={{ color: "transparent", width: "100%", height: "auto", backgroundColor: "#d8b888" } as React.CSSProperties} />
                    </span>
                    <span className="tp-polaroid__caption font-scrawl">
                      Adorable Maltipoo baby 🧸❤️
                    </span>
                  </span>
                </button>
              </li>
              <li data-reveal="true" style={{ "--d": "550ms" } as React.CSSProperties}>
                <button type="button" onClick={() => setViewer(2)} className="tp-photowall__print" aria-label="Open photo 3 of 64: My new teddy puppy 🥰🧸">
                  <span className="tp-polaroid" style={{ "--tilt": "-0.9deg", "--tape": "#cfe5f6", "--i": "2" } as React.CSSProperties}>
                    <span aria-hidden="true" className="tp-tape tp-tape--right" />
                    <span className="tp-polaroid__photo">
                      <Image src="/media/j6T9eswP2eS8/59c6879a1d/27b888_bc27df54dcce410196c6016475364ff3-mv2.jpg" alt="A happy TeddyPups family with their new puppy" width={433} height={433} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw" style={{ color: "transparent", width: "100%", height: "auto", backgroundColor: "#c8b898" } as React.CSSProperties} />
                    </span>
                    <span className="tp-polaroid__caption font-scrawl">
                      My new teddy puppy 🥰🧸
                    </span>
                  </span>
                </button>
              </li>
              <li data-reveal="true" style={{ "--d": "110ms" } as React.CSSProperties}>
                <button type="button" onClick={() => setViewer(3)} className="tp-photowall__print" aria-label="Open photo 4 of 64: Our new puppies 🧸🥰🤗">
                  <span className="tp-polaroid" style={{ "--tilt": "2.4deg", "--tape": "#f6d79a", "--i": "3" } as React.CSSProperties}>
                    <span aria-hidden="true" className="tp-tape tp-tape--tl" />
                    <span aria-hidden="true" className="tp-tape tp-tape--tr" />
                    <span className="tp-polaroid__photo">
                      <Image src="/media/HJgL4rRnmReV/533701358f/27b888_082e47dfd8144423a96dc70d966fa5b2-mv2.jpg" alt="A happy TeddyPups family with their new puppy" width={433} height={433} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw" style={{ color: "transparent", width: "100%", height: "auto", backgroundColor: "#c8a888" } as React.CSSProperties} />
                    </span>
                    <span className="tp-polaroid__caption font-scrawl">
                      Our new puppies 🧸🥰🤗
                    </span>
                  </span>
                </button>
              </li>
              <li data-reveal="true" data-pup-look="" style={{ "--d": "660ms" } as React.CSSProperties}>
                <button type="button" onClick={() => setViewer(4)} className="tp-photowall__print" aria-label="Open photo 5 of 64: New puppy 🧸😍">
                  <span className="tp-polaroid" style={{ "--tilt": "-1.5deg", "--tape": "#e9dcc4", "--i": "4" } as React.CSSProperties}>
                    <span aria-hidden="true" className="tp-tape tp-tape--center" />
                    <span className="tp-polaroid__photo">
                      <Image src="/media/uc5ANs5jm7r7/7160d8b7b1/27b888_f7f4966e59e94db591784d4ec546682f-mv2.jpg" alt="A happy TeddyPups family with their new puppy" width={433} height={433} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw" style={{ color: "transparent", width: "100%", height: "auto", backgroundColor: "#e8d8b8" } as React.CSSProperties} />
                    </span>
                    <span className="tp-polaroid__caption font-scrawl">
                      New puppy 🧸😍
                    </span>
                  </span>
                </button>
              </li>
              <li data-reveal="true" style={{ "--d": "220ms" } as React.CSSProperties}>
                <button type="button" onClick={() => setViewer(5)} className="tp-photowall__print" aria-label="Open photo 6 of 64: Gang of 3 😍🧸">
                  <span className="tp-polaroid" style={{ "--tilt": "0.8deg", "--tape": "#f6d79a", "--i": "5" } as React.CSSProperties}>
                    <span aria-hidden="true" className="tp-tape tp-tape--right" />
                    <span className="tp-polaroid__photo">
                      <Image src="/media/pRJubyqHw8p7/d58c4c07ee/27b888_b073c5815f7c4f92ad9a57741a653663-mv2.jpg" alt="A happy TeddyPups family with their new puppy" width={433} height={433} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw" style={{ color: "transparent", width: "100%", height: "auto", backgroundColor: "#b89878" } as React.CSSProperties} />
                    </span>
                    <span className="tp-polaroid__caption font-scrawl">
                      Gang of 3 😍🧸
                    </span>
                  </span>
                </button>
              </li>
              <li data-reveal="true" style={{ "--d": "770ms" } as React.CSSProperties}>
                <button type="button" onClick={() => setViewer(6)} className="tp-photowall__print" aria-label="Open photo 7 of 64: So happy 😍😍">
                  <span className="tp-polaroid" style={{ "--tilt": "-2.6deg", "--tape": "#f9cdbf", "--i": "6" } as React.CSSProperties}>
                    <span aria-hidden="true" className="tp-tape tp-tape--left" />
                    <span className="tp-polaroid__photo">
                      <Image src="/media/4wOJk9azop_-/65ecf66bf0/27b888_cfe895dbcc2d4bff85f890be9b496543-mv2.jpg" alt="A happy TeddyPups family with their new puppy" width={433} height={433} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw" style={{ color: "transparent", width: "100%", height: "auto", backgroundColor: "#583838" } as React.CSSProperties} />
                    </span>
                    <span className="tp-polaroid__caption font-scrawl">
                      So happy 😍😍
                    </span>
                  </span>
                </button>
              </li>
              <li data-reveal="true" style={{ "--d": "440ms" } as React.CSSProperties}>
                <button type="button" onClick={() => setViewer(7)} className="tp-photowall__print" aria-label="Open photo 8 of 64: New pup 🤗💫">
                  <span className="tp-polaroid" style={{ "--tilt": "1.2deg", "--tape": "#cfe5f6", "--i": "7" } as React.CSSProperties}>
                    <span aria-hidden="true" className="tp-tape tp-tape--center" />
                    <span className="tp-polaroid__photo">
                      <Image src="/media/3h20rIasJCOa/10c307cb1c/27b888_a7e7ab6a931e4c79a798bab9927d396e-mv2.jpg" alt="A happy TeddyPups family with their new puppy" width={433} height={433} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw" style={{ color: "transparent", width: "100%", height: "auto", backgroundColor: "#182848" } as React.CSSProperties} />
                    </span>
                    <span className="tp-polaroid__caption font-scrawl">
                      New pup 🤗💫
                    </span>
                  </span>
                </button>
              </li>
            </ul>
            <div className="tp-facade__ground">
              <span aria-hidden="true" className="tp-facade__door" />
              <span aria-hidden="true" className="tp-lamp">
                <span className="tp-lamp__light" />
              </span>
              <Link className="btn btn-primary tp-facade__cta" href="/happy-families">
                See every happy family
              </Link>
              <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-dusk__teddy">
                <Teddy pose="sit" />
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="tp-street__pavement" />
        </div>
        <Lightbox
          label="Photo viewer"
          items={DUSK_PHOTOS.map((p) => ({ kind: "image", url: p.url, alt: p.alt }))}
          index={viewer}
          caption={(i) => DUSK_PHOTOS[i]?.caption || `${i + 1} of ${DUSK_PHOTOS.length}`}
          onIndex={setViewer}
          onClose={() => setViewer(null)}
        />
      </section>
    </div>
  );
}
