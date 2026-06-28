import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  ArrowRight,
  Code2,
  LayoutTemplate,
  Wand2,
  TrendingUp,
  ShieldCheck,
  Zap,
  PenLine,
  MessageCircleQuestion,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { services } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Web Development, WordPress, SEO | Harendra Lamsal" },
      {
        name: "description",
        content:
          "Website development, WordPress design, SEO, speed optimization, maintenance, content strategy, and consulting for businesses worldwide.",
      },
      { property: "og:title", content: "Services — Harendra Lamsal" },
      {
        property: "og:description",
        content: "Modern websites, WordPress, SEO, speed optimization, and consulting.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const serviceIcons = {
  Code2,
  LayoutTemplate,
  Wand2,
  TrendingUp,
  ShieldCheck,
  Zap,
  PenLine,
  MessageCircleQuestion,
};

function ServicesPage() {
  const { lang, t } = useI18n();
  const ne = lang === "ne";

  return (
    <>
      <section className="hero-bg">
        <div className="container-page py-16 md:py-24">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-6 bg-accent" /> {ne ? "सेवाहरू" : "Services"}
          </p>
          <h1
            className={cn(
              "mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance",
              ne && "font-nepali",
            )}
          >
            {ne ? "तपाईंको वेब, राम्रो बनाऔं।" : "Let's make your web presence better."}
          </h1>
          <p
            className={cn(
              "mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground",
              ne && "font-nepali",
            )}
          >
            {ne
              ? "नयाँ साइट चाहिएको होस् वा पुरानो लाई सुधार्न खोज्नुभएको होस् — म तपाईंको लक्ष्य पूरा गर्न मद्दत गर्न सक्छु।"
              : "Whether you need a brand-new site or want to improve an existing one — here's how I can help."}
          </p>
        </div>
      </section>

      <section className="container-page grid gap-5 py-16 md:grid-cols-2 md:py-20">
        {services.map((s) => (
          <article key={s.slug} className="surface-card glow-border flex flex-col p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-accent/10 text-accent shadow-[var(--shadow-glow)]">
                  {(() => {
                    const Icon = serviceIcons[s.icon as keyof typeof serviceIcons] ?? Code2;
                    return <Icon className="h-5 w-5" />;
                  })()}
                </div>
                <h2 className={cn("text-xl font-bold tracking-tight", ne && "font-nepali")}>
                  {ne ? s.title.ne : s.title.en}
                </h2>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed text-muted-foreground",
                    ne && "font-nepali",
                  )}
                >
                  {ne ? s.description.ne : s.description.en}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                {s.priceFrom}
              </span>
            </div>
            <ul className="mt-5 space-y-2">
              {s.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className={ne ? "font-nepali" : ""}>{ne ? b.ne : b.en}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                <span className={ne ? "font-nepali" : ""}>{t("common.from")}</span>{" "}
                <span className="font-bold text-foreground">{s.priceFrom}</span>
              </span>
              <Link
                to="/contact"
                className="tech-button inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
              >
                <span className={ne ? "font-nepali" : ""}>{t("common.inquire")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
