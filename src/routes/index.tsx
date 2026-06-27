import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Star, Sparkles, ArrowRight, Quote } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { skills, services, projects, posts, testimonials } from "@/lib/content";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Harendra Lamsal — Website Developer, Blogger & Digital Creator from Nepal" },
      {
        name: "description",
        content:
          "I build modern websites and write practical articles about web development, WordPress, SEO, and AI — in English and Nepali. Available for projects worldwide.",
      },
      { property: "og:title", content: "Harendra Lamsal — Web Developer & Blogger" },
      { property: "og:description", content: "Building websites. Sharing knowledge. Creating digital experiences." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Services />
      <Featured />
      <LatestBlog />
      <Testimonials />
      <Newsletter />
      <ContactCTA />
    </>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const { t, lang } = useI18n();
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="container-page relative grid items-center gap-12 py-16 md:grid-cols-[1.05fr_1fr] md:py-24 lg:py-28">
        {/* Left: Portrait */}
        <div className="relative order-2 md:order-1">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-[image:var(--gradient-accent)] opacity-20 blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elevated)]">
              <img
                src={"/harendra_portrait.png"}
                alt="Harendra Lamsal portrait"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[oklch(0.15_0.05_256)] to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-primary-foreground">
                <div>
                  <p className="text-sm font-semibold">Harendra Lamsal</p>
                  <p className="text-[11px] uppercase tracking-wider opacity-70">Nepal · Worldwide</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Floating stat badge */}
            <div className="absolute -left-6 top-12 hidden rotate-[-6deg] rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] md:block">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Star className="h-4 w-4 fill-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">50+ projects</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">delivered</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-5 bottom-16 hidden rotate-[5deg] rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] md:block">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">Lighthouse 95+</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Copy */}
        <div className="order-1 md:order-2">
          <p className={cn("inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground", lang === "ne" && "font-nepali")}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {t("hero.eyebrow")}
          </p>
          <h1
            className={cn(
              "mt-5 text-4xl font-black tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl",
              lang === "ne" && "font-nepali",
            )}
          >
            {t("hero.headline")}
          </h1>
          <p
            className={cn(
              "mt-4 text-xl font-semibold text-foreground/80 sm:text-2xl",
              lang === "ne" && "font-nepali",
            )}
          >
            {t("hero.subheadline")}
          </p>
          <p
            className={cn(
              "mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg",
              lang === "ne" && "font-nepali",
            )}
          >
            {t("hero.description")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
            >
              <span className={lang === "ne" ? "font-nepali" : ""}>{t("hero.cta.portfolio")}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <span className={lang === "ne" ? "font-nepali" : ""}>{t("hero.cta.blog")}</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]"
            >
              <span className={lang === "ne" ? "font-nepali" : ""}>{t("hero.cta.contact")}</span>
            </Link>
          </div>

          <p className={cn("mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground", lang === "ne" && "font-nepali")}>
            {t("hero.based")}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Marquee ---------------- */

function Marquee() {
  const words = ["WordPress", "React", "Next.js", "SEO", "PHP", "Tailwind", "AI Tools", "WooCommerce", "Performance"];
  return (
    <div className="border-y border-border bg-surface/60 py-4">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {words.map((w) => (
          <span key={w} className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- About strip ---------------- */

function About() {
  const { t, lang } = useI18n();
  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid items-start gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <Kicker>{t("section.about.kicker")}</Kicker>
          <h2 className={cn("mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-balance", lang === "ne" && "font-nepali")}>
            {t("section.about.title")}
          </h2>
        </div>
        <div>
          <p className={cn("text-lg leading-relaxed text-muted-foreground", lang === "ne" && "font-nepali")}>
            {t("section.about.body")}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { n: "6+", l: lang === "ne" ? "वर्ष अनुभव" : "years building" },
              { n: "50+", l: lang === "ne" ? "परियोजना" : "projects shipped" },
              { n: "200+", l: lang === "ne" ? "लेखहरू" : "articles published" },
            ].map((s) => (
              <div key={s.l} className="border-l-2 border-accent pl-4">
                <p className="text-3xl font-black text-foreground sm:text-4xl">{s.n}</p>
                <p className={cn("mt-1 text-xs uppercase tracking-wider text-muted-foreground", lang === "ne" && "font-nepali")}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-accent"
          >
            <span className={lang === "ne" ? "font-nepali" : ""}>
              {lang === "ne" ? "मेरो बारेमा थप" : "More about me"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Skills ---------------- */

function Skills() {
  const { t, lang } = useI18n();
  return (
    <section className="border-y border-border bg-surface/50">
      <div className="container-page py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>{t("section.skills.kicker")}</Kicker>
            <h2 className={cn("mt-3 text-3xl font-bold tracking-tight sm:text-4xl", lang === "ne" && "font-nepali")}>
              {t("section.skills.title")}
            </h2>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {skills.map((s, i) => (
            <div
              key={s.name}
              className="group surface-card relative overflow-hidden p-5"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold tracking-tight">{s.name}</p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {s.category}
                </span>
              </div>
              <div className="mt-5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-accent)] transition-[width] duration-700 ease-out"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-end text-[11px] font-semibold text-muted-foreground">
                  {s.level}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */

function Services() {
  const { t, lang } = useI18n();
  const featured = services.slice(0, 6);
  return (
    <section className="container-page py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>{t("section.services.kicker")}</Kicker>
          <h2 className={cn("mt-3 text-3xl font-bold tracking-tight sm:text-4xl", lang === "ne" && "font-nepali")}>
            {t("section.services.title")}
          </h2>
        </div>
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-accent">
          <span className={lang === "ne" ? "font-nepali" : ""}>{lang === "ne" ? "सबै सेवाहरू" : "All services"}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((s) => (
          <div key={s.slug} className="surface-card p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className={cn("mt-4 text-lg font-bold tracking-tight", lang === "ne" && "font-nepali")}>
              {lang === "ne" ? s.title.ne : s.title.en}
            </h3>
            <p className={cn("mt-2 text-sm leading-relaxed text-muted-foreground", lang === "ne" && "font-nepali")}>
              {lang === "ne" ? s.description.ne : s.description.en}
            </p>
            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                <span className={lang === "ne" ? "font-nepali" : ""}>{t("common.from")}</span>{" "}
                <span className="font-bold text-foreground">{s.priceFrom}</span>
              </span>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-accent"
              >
                <span className={lang === "ne" ? "font-nepali" : ""}>{t("common.inquire")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Featured projects ---------------- */

function Featured() {
  const { t, lang } = useI18n();
  const featured = projects.slice(0, 3);
  return (
    <section className="border-t border-border bg-surface/40">
      <div className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>{t("section.projects.kicker")}</Kicker>
            <h2 className={cn("mt-3 text-3xl font-bold tracking-tight sm:text-4xl", lang === "ne" && "font-nepali")}>
              {t("section.projects.title")}
            </h2>
          </div>
          <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-accent">
            <span className={lang === "ne" ? "font-nepali" : ""}>{t("section.projects.viewAll")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <article key={p.slug} className="surface-card group overflow-hidden">
              <div className={cn("relative aspect-[4/3] overflow-hidden bg-gradient-to-br", p.cover)}>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-2xl font-black text-white/90 drop-shadow-lg">{p.name}</span>
                </div>
                <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
                  {p.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold tracking-tight">{p.name}</h3>
                <p className={cn("mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2", lang === "ne" && "font-nepali")}>
                  {lang === "ne" ? p.description.ne : p.description.en}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((tag) => (
                    <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Latest blog ---------------- */

function LatestBlog() {
  const { t, lang } = useI18n();
  const recent = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <section className="container-page py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>{t("section.blog.kicker")}</Kicker>
          <h2 className={cn("mt-3 text-3xl font-bold tracking-tight sm:text-4xl", lang === "ne" && "font-nepali")}>
            {t("section.blog.title")}
          </h2>
        </div>
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-accent">
          <span className={lang === "ne" ? "font-nepali" : ""}>{t("section.blog.readAll")}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {recent.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="surface-card group overflow-hidden"
          >
            <div className={cn("relative aspect-[16/10] overflow-hidden bg-gradient-to-br", p.cover)}>
              <div className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
                {p.category}
              </div>
            </div>
            <div className="p-5">
              <h3 className={cn("text-base font-bold leading-snug tracking-tight group-hover:text-accent", lang === "ne" && p.lang !== "en" && "font-nepali")}>
                {lang === "ne" && p.lang !== "en" ? p.title.ne : p.title.en}
              </h3>
              <p className={cn("mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground", lang === "ne" && p.lang !== "en" && "font-nepali")}>
                {lang === "ne" && p.lang !== "en" ? p.excerpt.ne : p.excerpt.en}
              </p>
              <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                <span>{new Date(p.date).toLocaleDateString(lang === "ne" ? "ne-NP" : "en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span>{p.readingMinutes} {t("common.minRead")}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

function Testimonials() {
  const { t, lang } = useI18n();
  return (
    <section className="border-y border-border bg-surface/50">
      <div className="container-page py-20 md:py-24">
        <div className="text-center">
          <Kicker>{t("section.testimonials.kicker")}</Kicker>
          <h2 className={cn("mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl text-balance", lang === "ne" && "font-nepali")}>
            {t("section.testimonials.title")}
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((tm) => (
            <figure key={tm.name} className="surface-card relative p-6">
              <Quote className="absolute right-5 top-5 h-7 w-7 text-accent/30" />
              <blockquote className={cn("text-sm leading-relaxed text-foreground", lang === "ne" && "font-nepali")}>
                "{lang === "ne" ? tm.quote.ne : tm.quote.en}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-xs font-bold text-primary-foreground">
                  {tm.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold">{tm.name}</p>
                  <p className={cn("text-xs text-muted-foreground", lang === "ne" && "font-nepali")}>
                    {lang === "ne" ? tm.role.ne : tm.role.en}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Newsletter ---------------- */

function Newsletter() {
  const { t, lang } = useI18n();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error(lang === "ne" ? "मान्य इमेल चाहिन्छ।" : "Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success(t("section.newsletter.success"));
      setEmail("");
      setSubmitting(false);
    }, 600);
  }

  return (
    <section className="container-page py-20 md:py-28">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-[image:var(--gradient-primary)] p-8 text-primary-foreground sm:p-14">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Kicker tone="dark">{t("section.newsletter.kicker")}</Kicker>
            <h2 className={cn("mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-balance", lang === "ne" && "font-nepali")}>
              {t("section.newsletter.title")}
            </h2>
            <p className={cn("mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/80 sm:text-base", lang === "ne" && "font-nepali")}>
              {t("section.newsletter.body")}
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("section.newsletter.placeholder")}
              className="w-full flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-sm text-primary-foreground placeholder:text-primary-foreground/60 outline-none ring-0 backdrop-blur focus:border-accent"
              required
              maxLength={120}
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <span className={lang === "ne" ? "font-nepali" : ""}>{t("section.newsletter.subscribe")}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact CTA ---------------- */

function ContactCTA() {
  const { t, lang } = useI18n();
  return (
    <section className="container-page pb-24">
      <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-16 md:flex-row md:items-center">
        <div>
          <Kicker>{t("section.contact.kicker")}</Kicker>
          <h2 className={cn("mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-balance", lang === "ne" && "font-nepali")}>
            {t("section.contact.title")}
          </h2>
          <p className={cn("mt-3 max-w-xl text-muted-foreground", lang === "ne" && "font-nepali")}>
            {t("section.contact.body")}
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
        >
          <span className={lang === "ne" ? "font-nepali" : ""}>{t("section.contact.cta")}</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Bits ---------------- */

function Kicker({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em]",
        tone === "dark" ? "text-accent" : "text-accent",
      )}
    >
      <span className="h-px w-6 bg-accent" />
      {children}
    </p>
  );
}
