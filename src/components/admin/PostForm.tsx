import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Upload, X, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { listCategoriesPublic, adminCreatePost, adminUpdatePost } from "@/lib/blog.functions";
import type { BlogPost } from "@/lib/blog.types";
import { cn } from "@/lib/utils";

type FormState = {
  slug: string;
  title_en: string;
  title_ne: string;
  excerpt_en: string;
  excerpt_ne: string;
  body_en: string;
  body_ne: string;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string;
  lang: "en" | "ne" | "both";
  reading_minutes: number;
  seo_title: string;
  seo_description: string;
  published: boolean;
  published_at: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const empty: FormState = {
  slug: "",
  title_en: "",
  title_ne: "",
  excerpt_en: "",
  excerpt_ne: "",
  body_en: "",
  body_ne: "",
  cover_image_url: null,
  category_id: null,
  tags: "",
  lang: "en",
  reading_minutes: 5,
  seo_title: "",
  seo_description: "",
  published: false,
  published_at: "",
};

export function PostForm({ existing }: { existing?: BlogPost | null }) {
  const navigate = useNavigate();
  const listCats = useServerFn(listCategoriesPublic);
  const createFn = useServerFn(adminCreatePost);
  const updateFn = useServerFn(adminUpdatePost);

  const catsQ = useQuery({ queryKey: ["cats"], queryFn: () => listCats() });

  const [form, setForm] = useState<FormState>(() =>
    existing
      ? {
          slug: existing.slug,
          title_en: existing.title_en,
          title_ne: existing.title_ne,
          excerpt_en: existing.excerpt_en,
          excerpt_ne: existing.excerpt_ne,
          body_en: existing.body_en,
          body_ne: existing.body_ne,
          cover_image_url: existing.cover_image_url,
          category_id: existing.category_id,
          tags: existing.tags.join(", "),
          lang: existing.lang,
          reading_minutes: existing.reading_minutes,
          seo_title: existing.seo_title ?? "",
          seo_description: existing.seo_description ?? "",
          published: existing.published,
          published_at: existing.published_at?.slice(0, 16) ?? "",
        }
      : empty,
  );
  const [autoSlug, setAutoSlug] = useState(!existing);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (autoSlug && form.title_en) setForm((f) => ({ ...f, slug: slugify(f.title_en) }));
  }, [form.title_en, autoSlug]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        slug: form.slug,
        title_en: form.title_en,
        title_ne: form.title_ne,
        excerpt_en: form.excerpt_en,
        excerpt_ne: form.excerpt_ne,
        body_en: form.body_en,
        body_ne: form.body_ne,
        cover_image_url: form.cover_image_url || null,
        category_id: form.category_id || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        lang: form.lang,
        reading_minutes: form.reading_minutes,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        published: form.published,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
      };
      if (existing) {
        return updateFn({ data: { ...payload, id: existing.id } });
      }
      return createFn({ data: payload });
    },
    onSuccess: () => {
      toast.success(existing ? "Post updated" : "Post created");
      navigate({ to: "/admin" });
    },
    onError: (e: any) => toast.error(e.message ?? "Save failed"),
  });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("blog-images").upload(path, file, {
        cacheControl: "31536000", upsert: false,
      });
      if (upErr) throw upErr;
      const { data: signed, error: sErr } = await supabase.storage
        .from("blog-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10); // 10 years
      if (sErr) throw sErr;
      setForm((f) => ({ ...f, cover_image_url: signed.signedUrl }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
      className="grid gap-8 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5">
        <Field label="Slug *">
          <div className="flex gap-2">
            <input
              value={form.slug}
              onChange={(e) => { setAutoSlug(false); setForm({ ...form, slug: slugify(e.target.value) }); }}
              required
              className="input flex-1"
              placeholder="my-post-slug"
            />
            {autoSlug && <span className="text-xs text-muted-foreground self-center">auto</span>}
          </div>
        </Field>

        <Field label="Title (English) *">
          <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })}
            required maxLength={300} className="input w-full" />
        </Field>

        <Field label="Title (Nepali)">
          <input value={form.title_ne} onChange={(e) => setForm({ ...form, title_ne: e.target.value })}
            maxLength={300} className="input w-full font-nepali" />
        </Field>

        <Field label="Excerpt (English)">
          <textarea value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })}
            rows={2} maxLength={600} className="input w-full" />
        </Field>

        <Field label="Excerpt (Nepali)">
          <textarea value={form.excerpt_ne} onChange={(e) => setForm({ ...form, excerpt_ne: e.target.value })}
            rows={2} maxLength={600} className="input w-full font-nepali" />
        </Field>

        <Field label="Body (English)">
          <textarea value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })}
            rows={14} className="input w-full font-mono text-sm" placeholder="Markdown / plain text supported" />
        </Field>

        <Field label="Body (Nepali)">
          <textarea value={form.body_ne} onChange={(e) => setForm({ ...form, body_ne: e.target.value })}
            rows={14} className="input w-full font-nepali" />
        </Field>

        <details className="surface-card p-5">
          <summary className="cursor-pointer text-sm font-bold">SEO</summary>
          <div className="mt-4 space-y-4">
            <Field label="SEO title (overrides article title)">
              <input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                maxLength={200} className="input w-full" />
            </Field>
            <Field label="SEO description (meta description)">
              <textarea value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                rows={3} maxLength={400} className="input w-full" />
              <p className="mt-1 text-[11px] text-muted-foreground">{form.seo_description.length}/160 recommended</p>
            </Field>
          </div>
        </details>
      </div>

      <aside className="space-y-5">
        <div className="surface-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publish</p>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
          <Field label="Publish date" className="mt-4">
            <input type="datetime-local" value={form.published_at}
              onChange={(e) => setForm({ ...form, published_at: e.target.value })}
              className="input w-full" />
          </Field>
          <button type="submit" disabled={save.isPending || uploading}
            className={cn("mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-sm font-semibold text-background hover:scale-[1.01] transition-transform disabled:opacity-60")}>
            <Save className="h-4 w-4" />
            {save.isPending ? "Saving…" : existing ? "Update post" : "Create post"}
          </button>
        </div>

        <div className="surface-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Featured image</p>
          {form.cover_image_url ? (
            <div className="mt-3 space-y-2">
              <img src={form.cover_image_url} alt="" className="aspect-[16/10] w-full rounded-lg object-cover" />
              <button type="button" onClick={() => setForm({ ...form, cover_image_url: null })}
                className="inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                <X className="h-3 w-3" /> Remove
              </button>
            </div>
          ) : (
            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-background/50 p-6 text-center text-xs text-muted-foreground hover:border-accent">
              <Upload className="h-5 w-5" />
              {uploading ? "Uploading…" : "Click to upload (max 5MB)"}
              <input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>

        <div className="surface-card p-5">
          <Field label="Category">
            <select value={form.category_id ?? ""} onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
              className="input w-full">
              <option value="">— None —</option>
              {catsQ.data?.map((c) => (
                <option key={c.id} value={c.id}>{c.name_en}</option>
              ))}
            </select>
          </Field>
          <Field label="Language" className="mt-4">
            <select value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value as any })}
              className="input w-full">
              <option value="en">English</option>
              <option value="ne">Nepali</option>
              <option value="both">Both</option>
            </select>
          </Field>
          <Field label="Reading minutes" className="mt-4">
            <input type="number" min={1} max={120} value={form.reading_minutes}
              onChange={(e) => setForm({ ...form, reading_minutes: parseInt(e.target.value) || 5 })}
              className="input w-full" />
          </Field>
          <Field label="Tags (comma separated)" className="mt-4">
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="seo, wordpress, nepal" className="input w-full" />
          </Field>
        </div>
      </aside>

      <style>{`
        .input {
          border-radius: 0.625rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.6rem 0.8rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-accent) 20%, transparent);
        }
      `}</style>
    </form>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
