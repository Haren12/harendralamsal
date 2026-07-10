import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, FolderOpen, ArrowRight, ImageOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getCategoryBySlug, listPostsByCategory } from "@/lib/blog.functions";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params, context }) => {
    const [category, posts] = await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["category-info", params.slug],
        queryFn: () => getCategoryBySlug({ data: { slug: params.slug } }),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["category-posts", params.slug],
        queryFn: () => listPostsByCategory({ data: { slug: params.slug } }),
      }),
    ]);

    return { category, posts };
  },
  head: ({ loaderData, params }) => {
    const categoryName = loaderData?.category?.name_en?.trim() || params.slug.replace(/-/g, " ");

    return {
      meta: [
        { title: `${categoryName} Articles | Harendra Lamsal` },
        {
          name: "description",
          content: `Browse all published articles in the ${categoryName} category.`,
        },
        { property: "og:title", content: `${categoryName} Articles` },
        {
          property: "og:description",
          content: `Browse all published articles in the ${categoryName} category.`,
        },
        { property: "og:url", content: `/category/${params.slug}` },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
  pendingComponent: CategoryPending,
  component: CategoryPage,
});

function CategoryPage() {
  const { t, lang } = useI18n();
  const ne = lang === "ne";
  const { slug } = Route.useParams();
  const { category, posts } = Route.useLoaderData();
  const displayName =
    (ne ? category?.name_ne : category?.name_en) ?? category?.name_en ?? slug.replace(/-/g, " ");
  const totalPosts = posts?.length ?? 0;

  return (
    <>
      <section className="hero-bg relative overflow-hidden border-b border-border/70">
        <div className="container-page relative py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-accent shadow-[var(--shadow-card)] backdrop-blur">
              <FolderOpen className="h-3.5 w-3.5" />
              <span className={cn(ne && "font-nepali")}>{t("footer.categories")}</span>
            </p>
            <h1
              className={cn(
                "mt-5 text-4xl font-black tracking-tight text-balance sm:text-5xl lg:text-6xl",
                ne && "font-nepali",
              )}
            >
              {displayName}
            </h1>
            <p
              className={cn(
                "mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground",
                ne && "font-nepali",
              )}
            >
              {ne
                ? "यो श्रेणीका सबै प्रकाशित लेखहरू यहाँ देखिन्छन्।"
                : "All published articles from this category are collected here."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-foreground shadow-[var(--shadow-card)] backdrop-blur">
                <Clock className="h-4 w-4 text-accent" />
                {totalPosts} {ne ? "लेखहरू" : "articles"}
              </span>
              {category?.slug && (
                <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  #{category.slug}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        {!posts || posts.length === 0 ? (
          <EmptyState ne={ne} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => {
              const showNe = ne && post.lang !== "en";
              const title = showNe
                ? post.title_ne || post.title_en
                : post.title_en || post.title_ne;
              const excerpt = showNe
                ? post.excerpt_ne || post.excerpt_en
                : post.excerpt_en || post.excerpt_ne;
              const published = post.published_at ? formatDate(post.published_at, lang) : "";

              return (
                <Link
                  key={post.id}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="surface-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[image:var(--gradient-primary)] opacity-80">
                        <ImageOff className="h-9 w-9 text-primary-foreground/80" aria-hidden />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {post.category && (
                      <div className="absolute left-3 top-3 rounded-full border border-border bg-background/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
                        {ne ? post.category.name_ne : post.category.name_en}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2
                      className={cn(
                        "text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-accent",
                        showNe && "font-nepali",
                      )}
                    >
                      {title}
                    </h2>

                    <p
                      className={cn(
                        "mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground",
                        showNe && "font-nepali",
                      )}
                    >
                      {excerpt}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <span>{published}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1">
                        <Clock className="h-3 w-3 text-accent" />
                        {post.reading_minutes} {t("common.minRead")}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function CategoryPending() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-28 rounded-full bg-muted" />
        <div className="h-12 w-full max-w-2xl rounded-2xl bg-muted md:h-16" />
        <div className="h-5 w-full max-w-xl rounded-full bg-muted" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="surface-card overflow-hidden">
              <div className="aspect-[16/10] bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 rounded-full bg-muted" />
                <div className="h-4 w-full rounded-full bg-muted" />
                <div className="h-4 w-5/6 rounded-full bg-muted" />
                <div className="h-4 w-28 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmptyState({ ne }: { ne: boolean }) {
  return (
    <div className="surface-card mx-auto max-w-2xl p-8 text-center md:p-12">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent">
        <FolderOpen className="h-6 w-6" />
      </div>
      <h2 className={cn("mt-5 text-2xl font-bold", ne && "font-nepali")}>
        {ne ? "अहिलेसम्म लेख छैन" : "No articles yet"}
      </h2>
      <p className={cn("mt-3 text-sm leading-relaxed text-muted-foreground", ne && "font-nepali")}>
        {ne
          ? "यो श्रेणीमा अहिले कुनै प्रकाशित लेख छैन। पछि फेरि जाँच गर्नुहोस्।"
          : "This category does not have any published articles yet. Please check back soon."}
      </p>
      <Link
        to="/blog"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
      >
        Back to blog
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
