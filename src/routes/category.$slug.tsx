import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ArrowUpRight } from "lucide-react";

import {
  listPostsByCategory,
  getCategoryBySlug,
} from "@/lib/blog.functions";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

{posts?.length ?? 0} {ne ? "लेख" : "Articles"}
🔥 TEST DEPLOY {posts?.length} Articles
export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.slug} Articles | Harendra Lamsal`,
      },
      {
        name: "description",
        content: `Browse all articles in the ${params.slug} category.`,
      },
      {
        property: "og:title",
        content: `${params.slug} Articles`,
      },
      {
        property: "og:url",
        content: `/category/${params.slug}`,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `/category/${params.slug}`,
      },
    ],
  }),

  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { t, lang } = useI18n();
const ne = lang === "ne";

  const getPosts = useServerFn(listPostsByCategory);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => getPosts({ data: { slug } }),
  });

  const getCategory = useServerFn(getCategoryBySlug);

const { data: category } = useQuery({
  queryKey: ["category-info", slug],
  queryFn: () => getCategory({ data: { slug } }),
});

  if (isLoading) {
    return (
      <div className="container-page py-20">
        Loading...
      </div>
    );
  }

 return (
  <>
    <section className="hero-bg">
      <div className="container-page py-16 md:py-24">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
          <span className="h-px w-6 bg-accent" />
          {ne ? "श्रेणी" : "Category"}
        </p>

        <h1
          className={cn(
            "mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl",
            ne && "font-nepali",
          )}
        >
          {ne
            ? category?.name_ne ?? category?.name_en ?? slug
            : category?.name_en ?? slug}
        </h1>
<p
  className={cn(
    "mt-6 max-w-2xl text-lg text-muted-foreground",
    ne && "font-nepali",
  )}
>
  {ne
    ? "यस श्रेणीका सबै लेखहरू यहाँ उपलब्ध छन्।"
    : "Browse all articles in this category."}
</p>

        <div className="mt-6 inline-flex rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-muted-foreground">
          {posts?.length ?? 0} {ne ? "लेख" : "Articles"}
        </div>
      </div>
    </section>

  <section className="container-page py-12">
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {posts?.map((post) => {
      const showNe = ne && post.lang !== "en";

    return (
  <Link
    key={post.id}
    to="/blog/$slug"
    params={{ slug: post.slug }}
    className="surface-card group overflow-hidden"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-muted">

      {post.cover_image_url ? (
        <img
          src={post.cover_image_url}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-[image:var(--gradient-primary)] opacity-70" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {post.category && (
        <div className="absolute left-3 top-3 rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
          {ne ? post.category.name_ne : post.category.name_en}
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
              {showNe
                ? post.title_ne || post.title_en
                : post.title_en || post.title_ne}
            </h3>

            <p
              className={cn(
                "mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground",
                showNe && "font-nepali",
              )}
            >
              {showNe
                ? post.excerpt_ne || post.excerpt_en
                : post.excerpt_en || post.excerpt_ne}
            </p>

            <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString(
                      ne ? "ne-NP" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : ""}
              </span>

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
</section>
  </>
);
}
