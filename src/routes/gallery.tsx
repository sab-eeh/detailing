import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { GALLERY } from "@/lib/gallery";
import { Reveal } from "@/components/site/Motion";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Detailing Work | Tru Detailerz" },
      { name: "description", content: "Selected ceramic coating, paint correction and exterior detailing work from Tru Detailerz in the GTA." },
      { property: "og:title", content: "Gallery — Tru Detailerz" },
      { property: "og:description", content: "Selected detailing work from Tru Detailerz across the GTA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Gallery" title="Finished in the studio." />
      <section className="bg-charcoal py-16 text-navy-foreground md:py-24">
        <div className="container-site grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12">
          {GALLERY.map((g, i) => {
            const span = ["md:col-span-8 aspect-[16/10]", "md:col-span-4 aspect-[4/5] md:aspect-auto", "md:col-span-5 aspect-[4/5]", "md:col-span-7 aspect-[4/3] md:aspect-auto", "md:col-span-4 aspect-square", "md:col-span-4 aspect-square", "md:col-span-4 aspect-square", "sm:col-span-2 md:col-span-12 aspect-[16/9] md:aspect-[21/9]"][i] ?? "md:col-span-4 aspect-square";
            return (
              <Reveal as="figure" key={g.car} delay={(i % 3) * 0.08} className={`group relative overflow-hidden ${span}`}>
                <img src={g.src} alt={`${g.car} after ${g.work}`} loading={i < 2 ? "eager" : "lazy"} width={1200} height={912} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]" />
                <span className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block font-display text-2xl leading-tight">{g.car}</span>
                  <span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-navy-foreground/70">{g.work}</span>
                </figcaption>
              </Reveal>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
