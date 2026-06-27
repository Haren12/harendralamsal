import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { projects, projectCategories, type ProjectCategory } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Selected Web Projects | Harendra Lamsal" },
      { name: "description", content: "A selection of websites, e-commerce stores, landing pages, and WordPress projects built for clients in Nepal and around the world." },
      { property: "og:title", content: "Portfolio — Harendra Lamsal" },
      { property: "og:description", content: "Selected web projects: business sites, e-commerce, landing pages, WordPress." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { t, lang } = useI18n();
  const ne = lang === "ne";
  const [filter, setFilter] = useState<ProjectCategory | "All">("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <section className="hero-bg">
        <div className="container-page py-16 md:py-24">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-6 bg-accent" /> {ne ? "पोर्टफोलियो" : "Portfolio"}
          </p>
          <h1 className={cn("mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance", ne && "font-nepali")}>
            {ne ? "मेरो हालैको काम।" : "Selected recent work."}
          </h1>
          <p className={cn("mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground", ne && "font-nepali")}>
            {ne ? "साना व्यवसायदेखि स्कूलहरू सम्म — हरेक परियोजनाले फरक समस्या समाधान गर्छ।" : "From small businesses to schools — each project solving a different problem."}
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-wrap gap-2">
          <FilterButton active={filter === "All"} onClick={() => setFilter("All")}>
            <span className={ne ? "font-nepali" : ""}>{t("common.allCategories")}</span>
          </FilterButton>
          {projectCategories.map((c) => (
            <FilterButton key={c} active={filter === c} onClick={() => setFilter(c)}>
              {c}
            </FilterButton>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <article key={p.slug} className="surface-card group overflow-hidden">
              <div className={cn("relative aspect-[4/3] overflow-hidden bg-gradient-to-br", p.cover)}>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-2xl font-black text-white/90 drop-shadow-lg">{p.name}</span>
                </div>
                <div className="absolute right-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
                  {p.category}
                </div>
                <div className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur">
                  {p.year}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold tracking-tight">{p.name}</h3>
                <p className={cn("mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-3", ne && "font-nepali")}>
                  {ne ? p.description.ne : p.description.en}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((tag) => (
                    <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-3 border-t border-border pt-4 text-xs font-semibold">
                  {p.liveUrl && (
                    <a href={p.liveUrl} className="inline-flex items-center gap-1 text-foreground hover:text-accent">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className={ne ? "font-nepali" : ""}>{t("common.liveDemo")}</span>
                    </a>
                  )}
                  {p.caseStudyUrl && (
                    <a href={p.caseStudyUrl} className="inline-flex items-center gap-1 text-foreground hover:text-accent">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span className={ne ? "font-nepali" : ""}>{t("common.caseStudy")}</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
