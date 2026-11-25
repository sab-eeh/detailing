import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { SERVICES } from "@/lib/knowledge";
import { money } from "@/lib/format";
import { serviceCatalogOptions, useServiceCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/services/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(serviceCatalogOptions),
  head: () => ({
    meta: [
      { title: "Detailing Services & Pricing — Tru Detailerz GTA" },
      { name: "description", content: "Mobile detailing, ceramic coating, paint correction and interior and exterior care across the GTA, with starting prices." },
      { property: "og:title", content: "Detailing Services — Tru Detailerz" },
      { property: "og:description", content: "Ceramic coating, paint correction and mobile detailing across the GTA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const catalog = useServiceCatalog();
  return (
    <SiteLayout>
      <PageHeader eyebrow="Services" title="Every finish, handled precisely.">
        Demo pricing shown as starting points. Final pricing is confirmed after a paint inspection.
      </PageHeader>
      <section className="container-site py-12">
        <ul className="divide-y border-y">
          {catalog.map((s) => (
            <li key={s.slug}>
              <Link to="/services/$slug" params={{ slug: s.slug }} className="group grid items-center gap-4 py-7 md:grid-cols-12">
                <h2 className="font-display text-3xl text-navy md:col-span-4">{s.name}</h2>
                <p className="text-sm text-slate md:col-span-5">{s.short}</p>
                <p className="tabular text-sm text-slate md:col-span-1">~{s.durationHours} hrs</p>
                <p className="flex items-center justify-between font-semibold text-navy md:col-span-2 md:justify-end md:gap-4">
                  From {money(s.priceFrom)} <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
