import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, MessageSquareText, Gauge, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal, SplitHeadline, ParallaxImage } from "@/components/site/Motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HeroVideo } from "@/components/site/HeroVideo";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SERVICES, BUSINESS } from "@/lib/knowledge";
import { GALLERY } from "@/lib/gallery";
import { money } from "@/lib/format";
import { serviceCatalogOptions, useServiceCatalog } from "@/lib/catalog";
import heroPoster from "@/assets/hero-m4.jpg";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(serviceCatalogOptions),
  head: () => ({
    meta: [
      { title: "Tru Detailerz — Mobile Auto Detailing in the GTA" },
      { name: "description", content: "Mobile detailing, paint correction and ceramic coating across the Greater Toronto Area. Request a quote or book online." },
      { property: "og:title", content: "Tru Detailerz — Precision in Every Detail" },
      { property: "og:description", content: "Mobile auto detailing, paint correction and ceramic coating across the GTA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: heroPoster },
      { name: "twitter:image", content: heroPoster },
      { property: "og:logo", content: "/tru-detailerz-logo.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoWash",
          name: BUSINESS.name,
          email: BUSINESS.email,
          openingHours: ["Mo-Fr 08:00-18:00", "Sa 09:00-16:00"],
        }),
      },
    ],
  }),
  component: Home,
});

const SERVICE_IMAGES: Record<string, number> = {
  "full-detail": 4, "ceramic-coating": 0, "paint-correction": 2, "paint-protection-film": 5, "interior-detail": 7, "maintenance-detail": 3,
};

const HOME_FAQ = [
  { q: "How do I choose the right detailing service?", a: "Start with the result you want. Full Detail resets a daily driver, Paint Correction removes swirls and haze, Ceramic Coating adds long-term gloss and protection, and PPF guards against rock chips. Not sure? Request a quote and we'll recommend a package for your vehicle." },
  { q: "How long does a typical appointment take?", a: `It depends on the service: about ${SERVICES[5].durationHours} hours for a Maintenance Detail, ${SERVICES[0].durationHours} for a Full Detail, ${SERVICES[1].durationHours} for Ceramic Coating and up to ${SERVICES[3].durationHours} for Paint Protection Film. Your quote confirms the exact time.` },
  { q: "What's the difference between ceramic coating and paint correction?", a: "Paint correction is machine polishing that removes defects like swirls and light scratches. Ceramic coating is a protective layer applied on top. Because a coating locks in whatever is underneath, most vehicles benefit from some correction first." },
  { q: "How do I request a quote?", a: "Use the Get a Quote form. Tell us about your vehicle, its condition and the services you're interested in, and you'll receive an itemized quote." },
  { q: "How can I book an appointment?", a: "Choose Book an Appointment, pick your services and add-ons, then submit your preferred date and time. The studio will review your request and confirm availability with you." },
  { q: "How should I prepare my vehicle?", a: "Remove personal items from the cabin and trunk. There's no need to wash the vehicle beforehand." },
  { q: "How can I contact the studio?", a: `Email ${BUSINESS.email} or send a quote request — we reply with an itemized recommendation.` },
];

const WHY = [
  [Gauge, "Paint measured first", "Paint depth is checked before any correction so we remove defects, not clear coat."],
  [ShieldCheck, "Surface-specific care", "Paint, leather, trim and glass each get the products and process they need."],
  [Sparkles, "Recommendations for your car", "We suggest the package that fits its condition and how you drive it."],
  [MessageSquareText, "Clear communication", "Itemized quote requests and clear follow-up before your visit."],
] as const;

const STEPS = [
  ["Request a Quote", "Tell us about your vehicle and the result you want."],
  ["Get a Recommendation", "We confirm the right package and send an itemized quote."],
  ["Choose Your Time", "Submit a preferred time online. The studio will confirm availability with you."],
  ["Drive Away Refreshed", "We inspect the finished work with you and suggest your next maintenance."],
];

function Home() {
  const catalog = useServiceCatalog();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const shots = GALLERY.slice(0, 6);
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [lead, ...rest] = catalog.slice(0, 6);

  return (
    <SiteLayout>
      {/* 01 Hero */}
      <section ref={heroRef} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy text-navy-foreground">
        <motion.img
          src={GALLERY[0].src} alt="BMW M4 with a freshly coated, mirror-gloss finish" width={1600} height={1216} fetchPriority="high"
          initial={reduce ? false : { scale: 1.12, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.8, ease: [0.2, 0.7, 0.2, 1] }}
          style={reduce ? undefined : { y: heroY }}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[65%_50%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/55 to-navy/30" />
        <motion.div style={reduce ? undefined : { opacity: heroFade }} className="container-site pb-16 pt-32 md:pb-24">
          <Reveal><p className="eyebrow flex items-center gap-3 text-sky"><span className="h-px w-10 bg-sky" />Detailing studio · {BUSINESS.city}</p></Reveal>
          <SplitHeadline as="h1" text="Precision in Every Detail." className="font-display text-hero mt-6 max-w-5xl" delay={0.2} />
          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,28rem)_auto] md:items-end md:justify-between">
            <Reveal delay={0.6}><p className="text-lg leading-relaxed text-navy-foreground/80">Exceptional automotive detailing. Engineered finishes. Protection that lasts.</p></Reveal>
            <Reveal delay={0.75} className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="cta" size="lg" className="h-12 rounded-sm px-7"><Link to="/book">Book Your Appointment</Link></Button>
              <Button asChild size="lg" variant="outline" className="group h-12 rounded-sm border-navy-foreground/30 bg-transparent px-7 text-navy-foreground hover:bg-navy-foreground hover:text-navy"><Link to="/services">Explore Our Services <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link></Button>
            </Reveal>
          </div>
        </motion.div>
        <div aria-hidden className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-navy-foreground/60 md:flex">
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-navy-foreground/20"><motion.span className="absolute inset-x-0 top-0 h-4 bg-navy-foreground" animate={reduce ? undefined : { y: [-16, 40] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} /></span>
        </div>
      </section>

      {/* 02 Brand introduction */}
      <section className="container-site grid gap-12 py-24 md:py-36 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal><p className="eyebrow text-primary">The studio</p></Reveal>
          <SplitHeadline text="More Than Detailing. A Standard of Excellence." className="font-display text-display mt-5 text-navy" />
          <Reveal delay={0.2} className="mt-8 grid max-w-2xl gap-6 text-lg leading-relaxed text-slate sm:grid-cols-2 sm:text-base">
            <p>Every vehicle is inspected under studio lighting before anything is recommended — so the work matches the car, not a package list.</p>
            <p>From a maintenance wash to full-body film, each finish is prepared by hand, checked twice and explained clearly.</p>
          </Reveal>
          <Reveal delay={0.3}>
            <dl className="mt-12 grid max-w-xl grid-cols-3 border-t border-navy/15 pt-6">
              {[["Starting from", money(catalog.length ? Math.min(...catalog.map((s) => s.priceFrom)) : 0)], ["Services", String(catalog.length)], ["Booking", "Online"]].map(([k, v]) => (
                <div key={k}><dt className="eyebrow text-slate">{k}</dt><dd className="mt-2 font-display text-3xl text-navy tabular md:text-4xl">{v}</dd></div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="lg:col-span-5">
          <HeroVideo className="aspect-[4/5] w-full" />
          <p className="mt-3 text-xs text-slate">Interior finishing, applied by hand.</p>
        </Reveal>
      </section>

      {/* 03 Services */}
      <section className="bg-navy py-24 text-navy-foreground md:py-32">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <Reveal><p className="eyebrow text-sky">Services</p></Reveal>
              <SplitHeadline text="Care at every level." className="font-display text-display mt-5" />
            </div>
            <Reveal><Link to="/services" className="group inline-flex items-center gap-2 text-sm font-semibold"><span className="link-underline pb-1">All services</span><ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></Reveal>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            {lead && <ServiceCard s={lead} big className="lg:col-span-7 lg:row-span-2" />}
            {rest.map((s, i) => <ServiceCard key={s.slug} s={s} delay={0.08 * (i + 1)} className={i < 2 ? "lg:col-span-5" : "lg:col-span-4"} />)}
          </div>
        </div>
      </section>

      {/* 04 Why */}
      <section className="grid lg:grid-cols-2">
        <ParallaxImage src={GALLERY[1].src} alt={`${GALLERY[1].car} after ${GALLERY[1].work.toLowerCase()}`} className="min-h-[60vh] lg:min-h-full" />
        <div className="px-5 py-24 md:px-16 md:py-32 lg:max-w-2xl">
          <Reveal><p className="eyebrow text-primary">Why Tru Detailerz</p></Reveal>
          <SplitHeadline text="The details that matter, handled properly." className="font-display text-display mt-5 text-navy" />
          <dl className="mt-12">
            {WHY.map(([I, t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-t border-navy/15 py-6">
                <I className="mt-1 h-5 w-5 text-primary" strokeWidth={1.5} />
                <div><dt className="text-lg font-semibold text-navy">{t}</dt><dd className="mt-1.5 leading-relaxed text-slate">{d}</dd></div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 05 Gallery */}
      <section className="bg-charcoal py-24 text-navy-foreground md:py-32">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div><Reveal><p className="eyebrow text-sky">Recent work</p></Reveal><SplitHeadline text="Finished in the studio." className="font-display text-display mt-5" /></div>
            <Reveal><Link to="/gallery" className="group inline-flex items-center gap-2 text-sm font-semibold"><span className="link-underline pb-1">View all work</span><ArrowUpRight className="h-4 w-4" /></Link></Reveal>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
            {shots.map((g, i) => {
              const layout = ["col-span-2 md:col-span-8 md:row-span-2 aspect-[4/3] md:aspect-auto", "md:col-span-4 aspect-[4/5] md:aspect-[4/3]", "md:col-span-4 aspect-[4/5] md:aspect-[4/3]", "md:col-span-4 aspect-square", "md:col-span-5 aspect-square md:aspect-[4/3]", "col-span-2 md:col-span-3 aspect-[16/9] md:aspect-auto"][i];
              return (
                <Reveal key={g.car} delay={(i % 3) * 0.08} className={layout}>
                  <button type="button" onClick={() => setLightbox(i)} aria-label={`View ${g.car} — ${g.work}`} className="group relative block h-full w-full overflow-hidden text-left">
                    <img src={g.src} alt={`${g.car} — ${g.work}`} loading="lazy" width={1200} height={912} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]" />
                    <span className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/0 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
                      <span className="min-w-0"><span className="block font-display text-lg leading-tight md:text-2xl">{g.car}</span><span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-navy-foreground/70">{g.work}</span></span>
                      <ArrowUpRight className="hidden h-5 w-5 shrink-0 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:block" />
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
        <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
          <DialogContent className="max-w-6xl gap-0 overflow-hidden rounded-none border-0 bg-navy p-0 [&>button]:hidden">
            {lightbox !== null && (
              <>
                <DialogTitle className="sr-only">{shots[lightbox].car}</DialogTitle>
                <motion.img key={lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={shots[lightbox].src} alt={`${shots[lightbox].car} — ${shots[lightbox].work}`} className="max-h-[78vh] w-full object-contain" />
                <div className="flex items-center justify-between gap-3 p-3 text-navy-foreground">
                  <p className="min-w-0 truncate text-sm"><b className="font-display text-base font-normal">{shots[lightbox].car}</b> · {shots[lightbox].work}</p>
                  <div className="flex shrink-0 gap-1">
                    <Button size="icon" variant="ghost" className="text-navy-foreground hover:bg-navy-deep hover:text-navy-foreground" aria-label="Previous image" onClick={() => setLightbox((lightbox + shots.length - 1) % shots.length)}><ChevronLeft /></Button>
                    <Button size="icon" variant="ghost" className="text-navy-foreground hover:bg-navy-deep hover:text-navy-foreground" aria-label="Next image" onClick={() => setLightbox((lightbox + 1) % shots.length)}><ChevronRight /></Button>
                    <Button size="icon" variant="ghost" className="text-navy-foreground hover:bg-navy-deep hover:text-navy-foreground" aria-label="Close" onClick={() => setLightbox(null)}><X /></Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </section>

      {/* 06 Process */}
      <section className="container-site py-24 md:py-36">
        <div className="max-w-3xl">
          <Reveal><p className="eyebrow text-primary">How it works</p></Reveal>
          <SplitHeadline text="From inquiry to showroom finish." className="font-display text-display mt-5 text-navy" />
        </div>
        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
          <motion.span aria-hidden initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1] }} className="absolute left-0 right-0 top-[1.4rem] hidden h-px origin-left bg-navy/20 md:block" />
          {STEPS.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={0.15 + i * 0.15} className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-4 md:block">
              <span className="relative grid h-11 w-11 place-items-center rounded-full border border-navy/20 bg-background font-display text-lg text-navy">0{i + 1}</span>
              <div className="md:mt-8"><p className="font-display text-2xl text-navy md:text-3xl">{t}</p><p className="mt-2 leading-relaxed text-slate">{d}</p></div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 07 About */}
      <section className="bg-navy text-navy-foreground">
        <div className="container-site grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:items-center">
          <div className="grid grid-cols-5 gap-3 lg:col-span-6">
            <ParallaxImage src={GALLERY[6].src} alt={`${GALLERY[6].car} — ${GALLERY[6].work}`} className="col-span-3 aspect-[3/4]" />
            <ParallaxImage src={GALLERY[2].src} alt={`${GALLERY[2].car} — ${GALLERY[2].work}`} className="col-span-2 mt-16 aspect-[3/5]" strength={12} />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal><p className="eyebrow text-sky">About the studio</p></Reveal>
            <SplitHeadline text="Obsessed With the Details That Matter." className="font-display text-display mt-5" />
            <Reveal delay={0.2}>
              <p className="mt-8 leading-relaxed text-navy-muted">Tru Detailerz provides mobile auto detailing across the {BUSINESS.city}. Each vehicle is inspected before work begins, prepared properly, and checked again before it goes home.</p>
              <Link to="/about" className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold"><span className="link-underline pb-1">More about the studio</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 09 FAQ */}
      <section className="container-site grid gap-12 py-24 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal><p className="eyebrow text-primary">FAQ</p></Reveal>
          <SplitHeadline text="Good questions." className="font-display text-display mt-5 text-navy" />
          <Reveal><Link to="/faq" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"><span className="link-underline pb-1">See all questions</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></Reveal>
        </div>
        <Reveal className="lg:col-span-8">
          <Accordion type="single" collapsible className="border-t border-navy/15">
            {HOME_FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`} className="border-navy/15">
                <AccordionTrigger className="py-6 text-left font-display text-xl font-normal text-navy hover:no-underline md:text-2xl">{f.q}</AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-6 text-base leading-relaxed text-slate">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      {/* 10 Final CTA */}
      <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
        <ParallaxImage src={GALLERY[4].src} alt="" className="absolute inset-0 -z-10" strength={10} />
        <div className="absolute inset-0 -z-10 bg-navy/75" />
        <div className="container-site py-28 text-center md:py-40">
          <SplitHeadline text="Your Vehicle Deserves Better." className="font-display text-hero mx-auto max-w-4xl" />
          <Reveal delay={0.3}><p className="mx-auto mt-6 max-w-lg text-lg text-navy-foreground/80">Give your vehicle the attention, protection, and finish it deserves.</p></Reveal>
          <Reveal delay={0.4} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="cta" size="lg" className="h-12 rounded-sm px-7"><Link to="/book">Book an Appointment</Link></Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-sm border-navy-foreground/30 bg-transparent px-7 text-navy-foreground hover:bg-navy-foreground hover:text-navy"><Link to="/quote">Get a Quote</Link></Button>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}

function ServiceCard({ s, big, className = "", delay = 0 }: { s: { slug: string; name: string; short: string; priceFrom: number }; big?: boolean; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={className}>
      <Link to="/services/$slug" params={{ slug: s.slug }} className={`group relative flex h-full flex-col justify-end overflow-hidden ${big ? "min-h-[420px] lg:min-h-[640px]" : "min-h-[300px]"}`}>
        <img src={GALLERY[SERVICE_IMAGES[s.slug] ?? 0].src} alt="" loading="lazy" width={1200} height={912} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]" />
        <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/0" />
        <div className="relative p-6 md:p-8">
          <p className="eyebrow text-sky">From {money(s.priceFrom)}</p>
          <h3 className={`mt-3 font-display leading-none ${big ? "text-4xl md:text-6xl" : "text-3xl"}`}>{s.name}</h3>
          <p className={`mt-3 max-w-md text-sm leading-relaxed text-navy-foreground/75 ${big ? "" : "line-clamp-2"}`}>{s.short}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Explore service <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" /></span>
        </div>
      </Link>
    </Reveal>
  );
}
