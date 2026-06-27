import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { BlogPost, BlogCategory } from "./blog.types";

const POST_SELECT = `
  id, slug, title_en, title_ne, excerpt_en, excerpt_ne, body_en, body_ne,
  cover_image_url, category_id, tags, lang, reading_minutes,
  seo_title, seo_description, published, published_at, created_at, updated_at,
  category:blog_categories(name_en, name_ne, slug)
`;

const configuredAdminEmails = (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function publicClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

async function assertAdmin(supabase: any, userId: string, claims?: { email?: string | null }) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) throw new Error(error.message);

  const normalizedEmail = claims?.email?.trim().toLowerCase();
  const isConfiguredAdmin = !!normalizedEmail && configuredAdminEmails.includes(normalizedEmail);

  if (data || isConfiguredAdmin) return;
  throw new Error("Forbidden: admin role required");
}

// ---------- PUBLIC ----------

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_SELECT)
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as BlogPost[];
});

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (post ?? null) as unknown as BlogPost | null;
  });

export const listCategoriesPublic = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, slug, name_en, name_ne")
    .order("name_en");
  if (error) throw new Error(error.message);
  return (data ?? []) as BlogCategory[];
});

// ---------- ADMIN ----------

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    const normalizedEmail = context.claims?.email?.trim().toLowerCase();
    const isConfiguredAdmin = !!normalizedEmail && configuredAdminEmails.includes(normalizedEmail);

    return { isAdmin: !!data || isConfiguredAdmin };
  });

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId, context.claims);
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as BlogPost[];
  });

export const adminGetPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId, context.claims);
    const { data: post, error } = await context.supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (post ?? null) as unknown as BlogPost | null;
  });

const postInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  title_en: z.string().max(300).default(""),
  title_ne: z.string().max(300).default(""),
  excerpt_en: z.string().max(600).default(""),
  excerpt_ne: z.string().max(600).default(""),
  body_en: z.string().default(""),
  body_ne: z.string().default(""),
  cover_image_url: z.string().url().nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  lang: z.enum(["en", "ne", "both"]).default("en"),
  reading_minutes: z.number().int().min(1).max(120).default(5),
  seo_title: z.string().max(200).nullable().optional(),
  seo_description: z.string().max(400).nullable().optional(),
  published: z.boolean().default(false),
  published_at: z.string().nullable().optional(),
});

export const adminCreatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => postInputSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId, context.claims);
    const payload = {
      ...data,
      author_id: context.userId,
      published_at: data.published ? (data.published_at ?? new Date().toISOString()) : null,
    };
    const { data: post, error } = await context.supabase
      .from("blog_posts")
      .insert(payload)
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    return post;
  });

export const adminUpdatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => postInputSchema.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId, context.claims);
    const { id, ...rest } = data;
    const payload = {
      ...rest,
      published_at: rest.published ? (rest.published_at ?? new Date().toISOString()) : null,
    };
    const { data: post, error } = await context.supabase
      .from("blog_posts")
      .update(payload)
      .eq("id", id)
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    return post;
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId, context.claims);
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
