import { DetailingMark } from "@/components/admin/DetailingMark";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS, SERVICES } from "@/lib/knowledge";
import { BRAND } from "@/lib/brand";
import { Reveal, SplitHeadline } from "./Motion";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  const darkTop = ["/", "/services", "/gallery", "/about", "/faq", "/contact"].includes(path);
  const solid = scrolled || open || !darkTop;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ${solid ? "border-b border-navy-foreground/10 bg-navy/95 backdrop-blur" : "border-b border-transparent bg-transparent"} text-navy-foreground`}>
        <div className="container-site flex h-[72px] items-center justify-between gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Tru Detailerz home">
            <DetailingMark className="h-11" />
            <span className="hidden font-display text-xl leading-none sm:block">Tru Detailerz</span>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="link-underline pb-1 text-[13px] font-medium tracking-wide text-navy-foreground/75 transition-colors hover:text-navy-foreground data-[status=active]:text-navy-foreground">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/quote" className="h-10 px-4 text-[13px] font-semibold leading-10 text-navy-foreground/85 transition-colors hover:text-navy-foreground">Get a quote</Link>
            <Button asChild variant="cta" size="sm" className="h-10 rounded-sm px-5"><Link to="/book">Book appointment</Link></Button>
          </div>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} className="grid h-11 w-11 place-items-center lg:hidden">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "calc(100dvh - 72px)" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }} className="overflow-y-auto bg-navy lg:hidden">
              <nav className="container-site flex flex-col pt-6" aria-label="Mobile">
                {NAV.map((n, i) => (
                  <motion.div key={n.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}>
                    <Link to={n.to} className="flex items-center justify-between border-b border-navy-foreground/10 py-4 font-display text-4xl">
                      {n.label}<ArrowUpRight className="h-5 w-5 text-sky" />
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-8 grid gap-3 pb-[max(2rem,env(safe-area-inset-bottom))]">
                  <Button asChild variant="cta" size="lg" className="rounded-sm"><Link to="/book">Book appointment</Link></Button>
                  <Button asChild size="lg" variant="outline" className="rounded-sm border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-deep hover:text-navy-foreground"><Link to="/quote">Get a quote</Link></Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main className={`flex-1 ${darkTop ? "" : "pt-[72px]"}`}>{children}</main>
      <footer className="bg-navy text-navy-foreground">
        <div className="container-site border-b border-navy-foreground/10 py-16 md:py-24">
          <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <p className="font-display text-display max-w-3xl">Precision in every detail.</p>
            <Link to="/book" className="group inline-flex items-center gap-3 text-sm font-semibold">
              <span className="link-underline pb-1">Book your appointment</span>
              <span className="grid h-12 w-12 place-items-center rounded-full border border-navy-foreground/25 transition-colors group-hover:border-primary group-hover:bg-primary"><ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
            </Link>
          </Reveal>
        </div>
        <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3"><DetailingMark className="h-14" /><span className="font-display text-2xl">Tru Detailerz</span></div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-muted">Mobile auto detailing, paint correction and ceramic coating throughout the {BUSINESS.city}.</p>
            <p className="mt-6 text-sm text-navy-muted">Serving the Greater Toronto Area</p>
          </div>
          <FooterCol title="Explore" className="lg:col-span-2" items={[...NAV.slice(1), { to: "/book", label: "Book appointment" }, { to: "/quote", label: "Get a quote" }].map((n) => <Link to={n.to} className="link-underline pb-0.5">{n.label}</Link>)} />
          <FooterCol title="Services" className="lg:col-span-3" items={SERVICES.map((s) => <Link to="/services/$slug" params={{ slug: s.slug }} className="link-underline pb-0.5">{s.name}</Link>)} />
          <FooterCol title="Studio" className="lg:col-span-3" items={[
            <a href={`tel:${BUSINESS.phone}`} className="link-underline pb-0.5">{BUSINESS.phone}</a>,
            ...BUSINESS.hours.map((h) => <span className="text-navy-muted">{h.day}: {h.time}</span>),
            <Link to="/admin" className="text-navy-muted transition-colors hover:text-navy-foreground">Business login</Link>,
          ]} />
        </div>
        <div className="border-t border-navy-foreground/10">
          <div className="container-site flex flex-col gap-2 py-6 text-[11px] text-navy-muted sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} {BUSINESS.name}. {BRAND.demoBusiness.disclaimer}</span>
            <span>{BRAND.footerAttribution}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, items, className = "" }: { title: string; items: ReactNode[]; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow text-sky">{title}</p>
      <ul className="mt-5 space-y-2.5 text-sm text-navy-foreground/85">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="container-site pb-16 pt-36 md:pb-24 md:pt-48">
        <Reveal><p className="eyebrow flex items-center gap-3 text-sky"><span className="h-px w-8 bg-sky" />{eyebrow}</p></Reveal>
        {typeof title === "string"
          ? <SplitHeadline as="h1" text={title} className="font-display text-display mt-6 max-w-4xl" delay={0.1} />
          : <h1 className="font-display text-display mt-6 max-w-4xl">{title}</h1>}
        {children && <Reveal delay={0.3} className="mt-8 max-w-2xl text-lg leading-relaxed text-navy-muted">{children}</Reveal>}
      </div>
    </section>
  );
}
