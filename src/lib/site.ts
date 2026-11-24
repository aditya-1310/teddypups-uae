export const SITE = {
  name: "TeddyPups U.A.E.",
  shortName: "TeddyPups",
  url: "https://puppy.instabizweb.com",
  tagline: "every puppy is family",
  phoneDisplay: "+971 50 000 0000",
  phoneHref: "tel:+971500000000",
  email: "info@instabizweb.com",
  address: "Downtown Dubai, United Arab Emirates",
  whatsapp: "https://wa.me/919898124987?text=Hi%20Insta%20Biz%20Web%2C%20I'd%20like%20to%20discuss%20a%20project.",
  social: [
    { label: "Instagram", href: "https://www.instabizweb.com/" },
    { label: "TikTok", href: "https://www.instabizweb.com/" },
    { label: "Facebook", href: "https://www.instabizweb.com/" },
  ],
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/puppies", label: "Puppies" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
] as const;

export const FOOTER_NAV = [
  { href: "/puppies", label: "Available puppies" },
  { href: "/gone-home", label: "Gone home" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/how-it-works#delivery", label: "Delivery & collection" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
] as const;

/** True when `pathname` is inside the section that `href` points to. */
export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}
