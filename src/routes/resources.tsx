import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { resourceGroups } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Tools, Hosting, SEO, AI | Harendra Lamsal" },
      { name: "description", content: "Curated free tools, hosting recommendations, WordPress plugins, SEO and AI tools I personally use and recommend." },
      { property: "og:title", content: "Resources — Harendra Lamsal" },
      { property: "og:description", content: "Tools and resources I personally use and recommend." },
      { property: "og:url", content: "/resources" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const { lang } = useI18n();
  const ne = lang === "ne";

  return (
    <>
      <section className="hero-bg">
        <div className="container-page py-16 md:py-24">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-6 bg-accent" /> {ne ? "स्रोतहरू" : "Resources"}
          </p>
          <h1 className={cn("mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance", ne && "font-nepali")}>
            {ne ? "मैले प्रयोग गर्ने उपकरणहरू।" : "Tools I actually use."}
          </h1>
          <p className={cn("mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground", ne && "font-nepali")}>
            {ne ? "होस्टिङ, प्लगइन, SEO र AI उपकरणहरूको ह्यान्ड-पिक्ड सूची।" : "A hand-picked list of hosting, plugins, SEO tools, and AI utilities I personally use and recommend."}
          </p>
        </div>
      </section>

      <section className="container-page space-y-12 py-16 md:py-20">
        {resourceGroups.map((g) => (
          <div key={g.title.en}>
            <h2 className={cn("text-2xl font-bold tracking-tight", ne && "font-nepali")}>
              {ne ? g.title.ne : g.title.en}
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {g.items.map((it) => (
                <a
                  key={it.name}
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card flex items-start justify-between gap-3 p-5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold tracking-tight">{it.name}</p>
                    <p className={cn("mt-1 text-sm text-muted-foreground", ne && "font-nepali")}>
                      {ne ? it.description.ne : it.description.en}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
