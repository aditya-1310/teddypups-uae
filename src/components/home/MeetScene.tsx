import Image from "next/image";
import Link from "next/link";
import { PawIcon } from "@/components/icons";
import { Teddy } from "@/components/teddy/Teddy";

export function MeetScene() {
  return (
    <div data-section="meet">
      <section data-pup-scene="true" data-tone="light" className="tp-scene tp-meet" style={{ "--sky-top": "#fff1d8", "--sky-bottom": "#fbe3b4" } as React.CSSProperties} aria-labelledby="meet-title">
        <div data-pin-range="true" style={{ "--pinned": "0" } as React.CSSProperties}>
          <div className="tp-meet__stage">
            <header className="tp-meet__head gutter">
              <div>
                <h2 id="meet-title" className="font-plush text-huge">
                  Meet the pups
                </h2>
                <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">
                  Real puppies, real photos, looking for their families right now.
                </p>
              </div>
              <Link className="btn btn-primary shrink-0" href="/puppies">
                See all available puppies
              </Link>
            </header>
            <div className="tp-meet__hall">
              <ol className="tp-meet__track" data-treadmill="true" aria-label="Puppies looking for a family">
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#a24a1a" } as React.CSSProperties} href="/puppies/maltipoo-max-male">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Max
                      </span>
                      <span className="tp-door__meta">
                        Maltipoo,{" "}
                        boy
                        , 3 months
                        , with video
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/Z0ToauDx7Eve/5fffe4d022/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp" alt="Max, male Maltipoo puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "53.8% 44.3%", color: "transparent", backgroundColor: "#785838" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#5a3a28" } as React.CSSProperties} href="/puppies/korean-teacup-maltipoo-female">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Korean Teacup Maltipoo
                      </span>
                      <span className="tp-door__meta">
                        girl
                        , 2 months
                        , with video
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/gAaGwoGej2g6/5523e884dd/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg" alt="Female Korean Teacup Maltipoo puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "52.5% 42.6%", color: "transparent", backgroundColor: "#e8e8e8" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#d4893f" } as React.CSSProperties} href="/puppies/korean-teacup-poodle-female">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Korean Teacup Poodle
                      </span>
                      <span className="tp-door__meta">
                        girl
                        , 2 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/xeMJCapr5vcU/e618c653b2/b942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg" alt="Female Korean Teacup Poodle puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "54.5% 45.7%", color: "transparent", backgroundColor: "#f8d8b8" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#b8644a" } as React.CSSProperties} href="/puppies/maltipoo-cavapoo-male">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Maltipoo &amp; Cavapoo
                      </span>
                      <span className="tp-door__meta">
                        boy
                        , 3 months Maltipoo &amp; 2 months Cavapoo
                        , with video
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/YQhey4j7uWvZ/3ea10db6c1/b942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg" alt="Male Maltipoo & Cavapoo puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "44.7% 29.5%", color: "transparent", backgroundColor: "#b8a8a8" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#7a4a2e" } as React.CSSProperties} href="/puppies/toy-poodle-male-female">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Toy Poodle
                      </span>
                      <span className="tp-door__meta">
                        boy &amp; girl
                        , 2 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/vMu0BPvkAZ-j/c65e53967d/b942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg" alt="Toy Poodle puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "65.4% 44.7%", color: "transparent", backgroundColor: "#c8c8c8" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#a24a1a" } as React.CSSProperties} href="/puppies/maltipoo-female-2">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Maltipoo
                      </span>
                      <span className="tp-door__meta">
                        girl
                        , 3 months
                        , with video
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/3WJNmn6VVgVu/732f779474/b942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg" alt="Female Maltipoo puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "64.6% 42.3%", color: "transparent", backgroundColor: "#080808" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#5a3a28" } as React.CSSProperties} href="/puppies/pomeranian-female">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Pomeranian
                      </span>
                      <span className="tp-door__meta">
                        girl
                        , 3 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/3yOfnmoyPooH/81e0c7e00c/b942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg" alt="Female Pomeranian puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "40.3% 44.3%", color: "transparent", backgroundColor: "#080808" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#d4893f" } as React.CSSProperties} href="/puppies/copper-male">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Copper
                      </span>
                      <span className="tp-door__meta">
                        Cavapoo,{" "}
                        boy
                        , 2 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/O-6w4FYqE10j/be76f399cc/b942a5_bb73ebbb952047988f944f3a8e3052bd-mv2.jpg" alt="Copper, male Cavapoo puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "43.0% 50.5%", color: "transparent", backgroundColor: "#e8d8c8" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#b8644a" } as React.CSSProperties} href="/puppies/shitzu-female">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Shih Tzu
                      </span>
                      <span className="tp-door__meta">
                        girl
                        , 2 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/qNrTCSrsYyzY/168fa8c4ff/b942a5_eb14616c76c24da89afe7fa3b7d7ae6a-mv2.jpeg" alt="Female Shih Tzu puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "44.8% 42.5%", color: "transparent", backgroundColor: "#383848" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#7a4a2e" } as React.CSSProperties} href="/puppies/shitzu-male">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Shih Tzu
                      </span>
                      <span className="tp-door__meta">
                        boy
                        , 2 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/crgs9ih6as_M/e37bafb1bf/b942a5_344e49c6c34940d2b09a3ddd5c2e3234-mv2.jpg" alt="Male Shih Tzu puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "40.3% 43.6%", color: "transparent", backgroundColor: "#787888" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#a24a1a" } as React.CSSProperties} href="/puppies/maltipoo-female-1">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Maltipoo
                      </span>
                      <span className="tp-door__meta">
                        girl
                        , 2.5 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/wNm2_VIBEQvK/4b68f59e75/b942a5_7dd33c9b78c04f78a6a1c7386fb55620-mv2.jpg" alt="Female Maltipoo puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "47.5% 50.5%", color: "transparent", backgroundColor: "#e8d8c8" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#5a3a28" } as React.CSSProperties} href="/puppies/maltipoo-female">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Maltipoo
                      </span>
                      <span className="tp-door__meta">
                        girl
                        , 2 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/lMhASnmIIVQ4/ad2353ad31/b942a5_6a5617708d75408b8f73725080ed0149-mv2.jpg" alt="Female Maltipoo puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "56.9% 49.2%", color: "transparent", backgroundColor: "#e8d8c8" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#d4893f" } as React.CSSProperties} href="/puppies/korean-teacup-pomeranian-1">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Korean Teacup Pomeranian
                      </span>
                      <span className="tp-door__meta">
                        girl
                        , 2 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/EsAq2LSRvVCJ/4d553ed044/b942a5_a8d264c1aa754d80bc7c98917dfd1fda-mv2.jpg" alt="Female Korean Teacup Pomeranian puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "49.9% 51.3%", color: "transparent", backgroundColor: "#d8d8d8" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#b8644a" } as React.CSSProperties} href="/puppies/korean-teacup-pomeranian">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Korean Teacup Pomeranian
                      </span>
                      <span className="tp-door__meta">
                        girl
                        , 2 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/vzf7P8SPCZ-Q/a8db4ee114/b942a5_967bb346583b4146acb56607f5da5f21-mv2.jpg" alt="Female Korean Teacup Pomeranian puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "49.9% 48.6%", color: "transparent", backgroundColor: "#484848" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door" data-open="true">
                  <Link className="tp-door__link" style={{ "--door": "#7a4a2e" } as React.CSSProperties} href="/puppies/korean-teacup-pomeranian-male">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">
                        Korean Teacup Pomeranian
                      </span>
                      <span className="tp-door__meta">
                        boy
                        , 2 months
                      </span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <Image src="/media/nZTGFv46hrZI/fb9eeefc9c/b942a5_dcb8eb174915463ea0c40c58b7b0e406-mv2.jpg" alt="Male Korean Teacup Pomeranian puppy" fill sizes="(min-width: 1024px) 15rem, 44vw" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "48.9% 44.1%", color: "transparent", backgroundColor: "#080808" } as React.CSSProperties} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <PawIcon className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">
                        Available
                      </span>
                    </span>
                  </Link>
                </li>
                <li className="tp-door tp-door--all" data-open="true">
                  <Link className="tp-door__link" href="/puppies">
                    <span className="tp-door__frame tp-door__frame--all">
                      <span className="font-plush tp-door__all">
                        Meet them all
                      </span>
                    </span>
                  </Link>
                </li>
              </ol>
              <div aria-hidden="true" className="tp-meet__floor" />
              <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-meet__teddy">
                <Teddy pose="sit" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
