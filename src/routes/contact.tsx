import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/knowledge";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Tru Detailerz — Mobile Detailing in the GTA" },
      { name: "description", content: "Call Tru Detailerz at 437-296-2198, see our hours, or request a quote online." },
      { property: "og:title", content: "Contact — Tru Detailerz" },
      { property: "og:description", content: "Call, hours and mobile service area." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Contact" title="Book mobile detailing." />
      <section className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div className="border-t pt-5">
          <p className="eyebrow text-slate">Service area</p>
          <p className="mt-3 text-lg font-bold text-navy">{BUSINESS.city}</p>
          <p className="mt-1 text-slate">Serving {BUSINESS.serviceArea}.</p>
        </div>
        <div className="border-t pt-5">
          <p className="eyebrow text-slate">Reach us</p>
          <p className="mt-3 text-lg font-bold text-navy"><a href={`tel:${BUSINESS.phone}`} className="hover:text-navy">{BUSINESS.phone}</a></p>
          <p className="mt-1 text-slate">Call or text for availability.</p>
        </div>
        <div className="border-t pt-5">
          <p className="eyebrow text-slate">Hours</p>
          {BUSINESS.hours.map((h) => <p key={h.day} className="mt-2 flex justify-between text-navy"><span>{h.day}</span><span className="text-slate">{h.time}</span></p>)}
        </div>
      </section>
      <section className="container-site pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-md bg-navy p-8 text-navy-foreground md:flex-row md:items-center md:p-12">
          <p className="font-display text-4xl">The fastest way to a price is a quote request.</p>
          <div className="flex gap-3">
            <Button asChild variant="cta" size="lg"><Link to="/quote">Get a quote</Link></Button>
            <Button asChild variant="secondary" size="lg"><Link to="/book">Book</Link></Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
