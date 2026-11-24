import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { FaqBoard, type FaqItem } from "@/components/faq/FaqBoard";
import faqsData from "@/data/faqs.json";

export const metadata: Metadata = {
  title: "Questions & answers",
  description: "Common questions about TeddyPups U.A.E., puppy health checks, Dubai showroom visits, and worldwide delivery.",
};

const faqs = faqsData as FaqItem[];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div data-page="faq" className="tp-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section
        data-pup-scene="true"
        data-tone="dark"
        className="tp-scene tp-faqroom overflow-hidden"
        style={{ "--sky-top": "#a95e32", "--sky-bottom": "#331c11" } as CSSProperties}
        aria-labelledby="faq-title"
      >
        <div className="gutter relative mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="max-w-4xl">
            <h1 id="faq-title" className="font-plush text-giant">
              Questions &amp; answers
            </h1>
            <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">
              Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — our team is available 24/7.
            </p>
          </header>
          <div className="mt-12 md:mt-16">
            <FaqBoard faqs={faqs} />
          </div>
        </div>
      </section>
    </div>
  );
}
