import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { listPublishedPosts, listCategoriesPublic } from "@/lib/blog.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Web Development, WordPress, SEO & AI | Harendra Lamsal" },
      {
        name: "description",
        content:
          "Practical articles on web development, WordPress, SEO, AI tools, freelancing, and more — in English and Nepali.",
      },
      { property: "og:title", content: "Blog — Harendra Lamsal" },
      {
        property: "og:description",
        content: "Practical articles in English and Nepali on the modern web.",
      },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogRoute,
});

function BlogRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPath !== "/blog") return <Outlet />;

  return <BlogIndex />;
}

function BlogIndex() {
  const { t, lang } = useI18n();
  const ne = lang === "ne";
  const [q, setQ] = useState("");
  const [catSlug, setCatSlug] = useState<string>("All");

  const listPosts = useServerFn(listPublishedPosts);
  const listCats = useServerFn(listCategoriesPublic);

  const postsQ = useQuery({ queryKey: ["publicPosts"], queryFn: () => listPosts() });
  const catsQ = useQuery({ queryKey: ["publicCats"], queryFn: () => listCats() });

  const posts = postsQ.data ?? [];

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return posts.filter((p) => {
      if (catSlug !== "All" && p.category?.slug !== catSlug) return false;
      if (!term) return true;
      return (
        p.title_en.toLowerCase().includes(term) ||
        p.title_ne.includes(term) ||
        p.excerpt_en.toLowerCase().includes(term) ||
        p.excerpt_ne.includes(term) ||
        p.tags.some((tg) => tg.toLowerCase().includes(term))
      );
    });
  }, [q, catSlug, posts]);

  return (
    <>
      <section className="hero-bg">
        <div className="container-page py-16 md:py-24">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-6 bg-accent" /> {ne ? "ब्लग" : "Blog"}
          </p>
          <h1
            className={cn(
              "mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance",
              ne && "font-nepali",
            )}
          >
            {ne ? "लेखहरू, ट्युटोरियल र विचारहरू।" : "Articles, tutorials & thoughts."}
          </h1>
          <p
            className={cn(
              "mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground",
              ne && "font-nepali",
            )}
          >
            {ne
              ? "वेब, WordPress, SEO र AI को बारेमा व्यावहारिक लेखन — अंग्रेजी र नेपाली दुवैमा।"
              : "Practical writing about the modern web, WordPress, SEO, and AI — in English and Nepali."}
          </p>

          <div className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-[var(--shadow-card)]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("common.search")}
                className={cn(
                  "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground",
                  ne && "font-nepali",
                )}
              />
            </div>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
            >
              <UserPlus className="h-4 w-4" /> Admin signup
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-wrap gap-2">
          <Pill active={catSlug === "All"} onClick={() => setCatSlug("All")}>
            <span className={ne ? "font-nepali" : ""}>{t("common.allCategories")}</span>
          </Pill>
          {catsQ.data?.map((c) => (
            <Pill key={c.id} active={catSlug === c.slug} onClick={() => setCatSlug(c.slug)}>
              <span className={ne ? "font-nepali" : ""}>{ne ? c.name_ne : c.name_en}</span>
            </Pill>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {postsQ.isLoading ? (
            <p className="col-span-full py-16 text-center text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="col-span-full py-16 text-center text-muted-foreground">
              {posts.length === 0 ? "No posts published yet." : "No articles match your search."}
            </p>
          ) : (
            filtered.map((p) => {
              const showNe = ne && p.lang !== "en";
              return (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="surface-card group overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-[image:var(--gradient-primary)] opacity-70" />
                    )}
                    {p.category && (
                      <div className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
                        {ne ? p.category.name_ne : p.category.name_en}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3
                      className={cn(
                        "text-base font-bold leading-snug tracking-tight group-hover:text-accent",
                        showNe && "font-nepali",
                      )}
                    >
                      {showNe ? p.title_ne || p.title_en : p.title_en || p.title_ne}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground",
                        showNe && "font-nepali",
                      )}
                    >
                      {showNe ? p.excerpt_ne || p.excerpt_en : p.excerpt_en || p.excerpt_ne}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                      <span>
                        {p.published_at
                          ? new Date(p.published_at).toLocaleDateString(ne ? "ne-NP" : "en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                      <span>
                        {p.reading_minutes} {t("common.minRead")}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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
