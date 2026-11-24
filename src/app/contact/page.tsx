import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { LetterForm } from "@/components/contact/LetterForm";
import { PawIcon } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";
import { getPuppies } from "@/lib/puppies";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit & contact",
  description: "Visit our Downtown Dubai showroom or write to TeddyPups U.A.E. for photos, videos, and availability.",
};

export default function ContactPage() {
  const puppies = getPuppies();

  return (
    <div data-page="contact" className="tp-page">
      <section
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene"
        style={{ "--sky-top": "#fff9ee", "--sky-bottom": "#f9dca4" } as CSSProperties}
        aria-labelledby="contact-title"
      >
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we&apos;d love to hear from you!
            </p>
          </header>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <LetterForm puppies={puppies} />
              <Teddy pose="portrait" label="Teddy, waiting for your letter" facing="left" className="ml-auto mr-6 -mt-3 w-36 md:w-40" />
            </div>

            <div className="lg:col-span-5 lg:row-start-1">
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
                WhatsApp {SITE.phoneDisplay}
              </a>

              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href={SITE.phoneHref}>
                      {SITE.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 break-all text-lg font-semibold">
                    <a href={`mailto:${SITE.email}`} className="link-ink">
                      {SITE.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <svg viewBox="0 0 300 120" className="absolute -bottom-1 right-0 w-3/4 text-toffee/30" aria-hidden="true">
                  <path
                    d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">
                      Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.
                    </p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <PawIcon className="size-5 shrink-0 text-toffee-deep" />
                      {SITE.address}
                    </p>
                    <a href="https://www.instabizweb.com/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">
                      Open in Google Maps
                    </a>
                  </div>
                  <figure className="tp-visit__photo">
                    <Image
                      src="/media/skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg"
                      alt="The apricot teddy bear puppy from our showroom, held up to say hello"
                      fill
                      sizes="(min-width: 640px) 11rem, 90vw"
                      style={{ objectFit: "cover", objectPosition: "45.3% 44.4%", backgroundColor: "#685848" }}
                    />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
