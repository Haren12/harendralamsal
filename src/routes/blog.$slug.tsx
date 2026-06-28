import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { ArrowLeft, Calendar, Clock, Eye, Tag, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getPublishedPost, incrementPostView, listPublishedPosts } from "@/lib/blog.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData({
      queryKey: ["publicPost", params.slug],
      queryFn: () => getPublishedPost({ data: { slug: params.slug } }),
    });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return {};
    const title = p.seo_title || p.title_en || p.title_ne;
    const desc = p.seo_description || p.excerpt_en || p.excerpt_ne;
    const keywords = [
      p.focus_keyword,
      ...p.secondary_keywords,
      ...p.tags,
    ].filter(Boolean).join(", ");
    const meta: any[] = [
      { title: `${title} — Harendra Lamsal` },
      { name: "description", content: desc },
      ...(keywords ? [{ name: "keywords", content: keywords }] : []),
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${p.slug}` },
      { property: "article:published_time", content: p.published_at ?? p.created_at },
    ];
    if (p.category) meta.push({ property: "article:section", content: p.category.name_en });
    if (p.cover_image_url) {
      meta.push({ property: "og:image", content: p.cover_image_url });
      meta.push({ name: "twitter:image", content: p.cover_image_url });
    }
    return {
      meta,
      links: [{ rel: "canonical", href: `/blog/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: desc,
            datePublished: p.published_at ?? p.created_at,
            dateModified: p.updated_at,
            image: p.cover_image_url ?? undefined,
            author: { "@type": "Person", name: "Harendra Lamsal" },
            articleSection: p.category?.name_en,
            keywords,
            citation: p.external_references.length > 0 ? p.external_references : undefined,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <h1 className="text-3xl font-bold">Post not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-accent">
        Back to blog
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-page py-32 text-center">
      <h1 className="text-2xl font-bold">Couldn't load article</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { post: loaderPost } = Route.useLoaderData();
  const getPost = useServerFn(getPublishedPost);
  const countView = useServerFn(incrementPostView);
  const listPosts = useServerFn(listPublishedPosts);

  const postQ = useQuery({
    queryKey: ["publicPost", slug],
    queryFn: () => getPost({ data: { slug } }),
    initialData: loaderPost,
  });
  const relatedQ = useQuery({ queryKey: ["publicPosts"], queryFn: () => listPosts() });

  const post = postQ.data;
  const { lang, t } = useI18n();
  const ne = lang === "ne";

  useEffect(() => {
    const key = `viewed-post:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    countView({ data: { slug } })
      .then(() => postQ.refetch())
      .catch(() => {
        sessionStorage.removeItem(key);
      });
  }, [countView, postQ, slug]);

  if (postQ.isError) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="text-2xl font-bold">Couldn't load article</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {postQ.error.message || "Please try opening this post again."}
        </p>
      </div>
    );
  }

  if (!post) {
    return <div className="container-page py-32 text-center text-muted-foreground">Loading…</div>;
  }

  const showNe = ne && post.lang !== "en";
  const related = (relatedQ.data ?? [])
    .filter((p) => p.slug !== post.slug && p.category?.slug === post.category?.slug)
    .slice(0, 3);

  return (
    <>
      <article>
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
          {post.cover_image_url ? (
            <img src={post.cover_image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[image:var(--gradient-primary)] opacity-70" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="container-page relative flex h-full max-w-4xl flex-col justify-end pb-10">
            <Link
              to="/blog"
              className="inline-flex w-fit items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Blog
            </Link>
          </div>
        </div>

        <div className="container-page max-w-3xl py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            {post.category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 font-bold text-accent">
                {ne ? post.category.name_ne : post.category.name_en}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.published_at &&
                new Date(post.published_at).toLocaleDateString(ne ? "ne-NP" : "en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {post.reading_minutes} {t("common.minRead")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" /> {post.views_count.toLocaleString(ne ? "ne-NP" : "en-US")}{" "}
              {ne ? "भ्यु" : "views"}
            </span>
          </div>

          <h1
            className={cn(
              "mt-4 text-3xl font-black tracking-tight sm:text-5xl text-balance",
              showNe && "font-nepali",
            )}
          >
            {showNe ? post.title_ne || post.title_en : post.title_en || post.title_ne}
          </h1>

          <div className="mt-6 flex items-center gap-3 border-y border-border py-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-xs font-bold text-primary-foreground">
              HL
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Harendra Lamsal</p>
              <p className="text-xs text-muted-foreground">Website Developer · Blogger</p>
            </div>
            <div className="flex gap-1">
              {[Twitter, Facebook, Linkedin, Share2].map((Icon, i) => (
                <button
                  key={i}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-accent"
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          {(showNe ? post.excerpt_ne : post.excerpt_en) && (
            <p
              className={cn(
                "mt-8 text-xl leading-relaxed text-foreground/80",
                showNe && "font-nepali",
              )}
            >
              {showNe ? post.excerpt_ne : post.excerpt_en}
            </p>
          )}

          <div
            className={cn(
              "prose prose-lg mt-6 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground",
              showNe && "font-nepali",
            )}
          >
            {showNe ? post.body_ne || post.body_en : post.body_en || post.body_ne}
          </div>

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map((tg) => (
                <span
                  key={tg}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground"
                >
                  #{tg}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-surface/40">
          <div className="container-page py-16">
            <h2 className={cn("text-2xl font-bold tracking-tight", ne && "font-nepali")}>
              {ne ? "सम्बन्धित लेखहरू" : "Related articles"}
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="surface-card overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    {r.cover_image_url ? (
                      <img
                        src={r.cover_image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[image:var(--gradient-primary)] opacity-70" />
                    )}
                  </div>
                  <div className="p-5">
                    {r.category && (
                      <p className="text-[11px] uppercase tracking-wider text-accent font-bold">
                        {ne ? r.category.name_ne : r.category.name_en}
                      </p>
                    )}
                    <h3
                      className={cn(
                        "mt-1.5 text-base font-bold leading-snug",
                        ne && r.lang !== "en" && "font-nepali",
                      )}
                    >
                      {ne && r.lang !== "en" ? r.title_ne || r.title_en : r.title_en || r.title_ne}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
