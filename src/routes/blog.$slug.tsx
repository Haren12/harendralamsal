import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Tag,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Send,
  Mail,
  LinkIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { getPublishedPost, incrementPostView, listPublishedPosts } from "@/lib/blog.functions";
import { cn } from "@/lib/utils";

const SITE_ORIGIN = "https://harendralamsal.com";

function getPostUrl(slug: string) {
  if (typeof window !== "undefined") {
    return new URL(`/blog/${slug}`, window.location.origin).toString();
  }
  return `${SITE_ORIGIN}/blog/${slug}`;
}

type SharePayload = {
  title: string;
  description: string;
  url: string;
};

function getShareHref(kind: string, { title, description, url }: SharePayload) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(description || title);
  const encodedEmailSubject = encodeURIComponent(title);
  const encodedEmailBody = encodeURIComponent(`${description || title}\n\n${url}`);

  switch (kind) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "messenger":
      return `fb-messenger://share/?link=${encodedUrl}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "email":
      return `mailto:?subject=${encodedEmailSubject}&body=${encodedEmailBody}`;
    default:
      return url;
  }
}

async function copyShareLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied successfully");
  } catch {
    toast.error("Could not copy link");
  }
}

function SharePopup({
  open,
  payload,
  onClose,
}: {
  open: boolean;
  payload: SharePayload;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [shouldRender, setShouldRender] = useState(open);
  const [visible, setVisible] = useState(open);
  const shareItems = [
    { kind: "facebook", label: "Facebook", Icon: Facebook },
    { kind: "messenger", label: "Messenger", Icon: MessageCircle },
    { kind: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
    { kind: "x", label: "X", Icon: Twitter },
    { kind: "telegram", label: "Telegram", Icon: Send },
    { kind: "linkedin", label: "LinkedIn", Icon: Linkedin },
    { kind: "email", label: "Email", Icon: Mail },
  ];

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setShouldRender(false), 180);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open || !shouldRender) return;

    const timeout = window.setTimeout(() => closeButtonRef.current?.focus(), 80);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 grid place-items-end bg-background/70 p-4 backdrop-blur-md transition-opacity duration-200 sm:place-items-center",
        visible ? "opacity-100" : "opacity-0",
      )}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-dialog-title"
        className={cn(
          "glow-border w-full max-w-md overflow-hidden rounded-2xl border border-border bg-popover/90 shadow-[var(--shadow-elevated)] backdrop-blur-2xl transition duration-200",
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0",
        )}
      >
        <div className="flex items-start gap-4 border-b border-border bg-card/45 px-5 py-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent shadow-[var(--shadow-glow)]">
            <Share2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="share-dialog-title" className="text-base font-bold tracking-tight">
              Share this article
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{payload.title}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close share options"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-background/50 text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
          {shareItems.map(({ kind, label, Icon }) => (
            <a
              key={kind}
              href={getShareHref(kind, payload)}
              target={kind === "email" ? undefined : "_blank"}
              rel={kind === "email" ? undefined : "noreferrer"}
              className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/55 px-3 py-4 text-center text-sm font-semibold text-foreground shadow-[var(--shadow-card)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/45 hover:text-accent hover:shadow-[var(--shadow-glow)]"
              onClick={onClose}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-background/55 text-accent transition-transform group-hover:scale-105">
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </a>
          ))}
          <button
            type="button"
            className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/55 px-3 py-4 text-center text-sm font-semibold text-foreground shadow-[var(--shadow-card)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/45 hover:text-accent hover:shadow-[var(--shadow-glow)]"
            onClick={() => {
              copyShareLink(payload.url);
              onClose();
            }}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-background/55 text-accent transition-transform group-hover:scale-105">
              <LinkIcon className="h-4 w-4" />
            </span>
            Copy Link
          </button>
        </div>
      </section>
    </div>
  );
}

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
    const keywords = [p.focus_keyword, ...p.secondary_keywords, ...p.tags]
      .filter(Boolean)
      .join(", ");
    const meta: Array<Record<string, string>> = [
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
  const [sharePopupOpen, setSharePopupOpen] = useState(false);

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
  const postTitle = showNe ? post.title_ne || post.title_en : post.title_en || post.title_ne;
  const postDescription = showNe
    ? post.excerpt_ne || post.excerpt_en
    : post.excerpt_en || post.excerpt_ne;
  const postUrl = getPostUrl(post.slug);
  const sharePayload = {
    title: postTitle,
    description: postDescription,
    url: postUrl,
  };
  const openShare = async () => {
    if (typeof navigator === "undefined") {
      setSharePopupOpen(true);
      return;
    }

    const nativeShareData = {
      title: sharePayload.title,
      text: sharePayload.description,
      url: sharePayload.url,
    };

    if (navigator.share && (!navigator.canShare || navigator.canShare(nativeShareData))) {
      try {
        await navigator.share(nativeShareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    setSharePopupOpen(true);
  };
  const shareLinks = [
    {
      Icon: Twitter,
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      Icon: Facebook,
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    },
    {
      Icon: Linkedin,
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    },
  ];
  const related = (relatedQ.data ?? [])
    .filter((p) => p.slug !== post.slug && p.category?.slug === post.category?.slug)
    .slice(0, 3);

  return (
    <>
      <article>
        <div className="hero-bg relative aspect-[21/9] min-h-[360px] w-full overflow-hidden bg-muted">
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt=""
              className="h-full w-full object-cover opacity-80"
            />
          ) : (
            <div className="h-full w-full bg-[image:var(--gradient-primary)] opacity-70" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/10" />
          <div className="container-page relative flex h-full max-w-4xl flex-col justify-end pb-10">
            <Link
              to="/blog"
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground shadow-[var(--shadow-card)] backdrop-blur hover:text-accent"
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-2.5 py-1 backdrop-blur">
              <Calendar className="h-3.5 w-3.5" />
              {post.published_at &&
                new Date(post.published_at).toLocaleDateString(ne ? "ne-NP" : "en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-2.5 py-1 backdrop-blur">
              <Clock className="h-3.5 w-3.5" /> {post.reading_minutes} {t("common.minRead")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-2.5 py-1 backdrop-blur">
              <Eye className="h-3.5 w-3.5" />{" "}
              {post.views_count.toLocaleString(ne ? "ne-NP" : "en-US")} {ne ? "भ्यु" : "views"}
            </span>
          </div>

          <h1
            className={cn(
              "mt-4 text-3xl font-black tracking-tight sm:text-5xl text-balance",
              showNe && "font-nepali",
            )}
          >
            {postTitle}
          </h1>

          <div className="surface-card mt-6 flex items-center gap-3 px-4 py-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
              HL
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Harendra Lamsal</p>
              <p className="text-xs text-muted-foreground">Website Developer · Blogger</p>
            </div>
            <div className="flex gap-1">
              {shareLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card/70 text-muted-foreground transition-all hover:border-accent/40 hover:text-accent hover:shadow-[var(--shadow-glow)]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
              <button
                type="button"
                aria-label="Share article"
                title="Share article"
                onClick={openShare}
                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card/70 text-muted-foreground transition-all hover:border-accent/40 hover:text-accent hover:shadow-[var(--shadow-glow)]"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
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
              "prose prose-lg mt-6 max-w-none whitespace-pre-wrap rounded-2xl border border-border bg-card/35 p-5 text-base leading-relaxed text-foreground shadow-[var(--shadow-card)] backdrop-blur md:p-7",
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
                  className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur hover:border-accent/40 hover:text-accent"
                >
                  #{tg}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-surface/35">
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
                  className="surface-card group overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    {r.cover_image_url ? (
                      <img
                        src={r.cover_image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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

      <SharePopup
        open={sharePopupOpen}
        payload={sharePayload}
        onClose={() => setSharePopupOpen(false)}
      />
    </>
  );
}
