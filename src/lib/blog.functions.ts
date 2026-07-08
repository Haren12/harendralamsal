import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { BlogPost, BlogCategory } from "./blog.types";

const POST_SELECT = `
  id, slug, title_en, title_ne, excerpt_en, excerpt_ne, body_en, body_ne,
  cover_image_url, category_id, tags, lang, reading_minutes, views_count,
  seo_title, seo_description, focus_keyword, secondary_keywords,
  internal_link_suggestions, external_references,
  published, published_at, created_at, updated_at,
  category:blog_categories(name_en, name_ne, slug)
`;

const configuredAdminEmails = [
  "harendralamsal4140@gmail.com",
  ...(process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
];

type AppSupabaseClient = SupabaseClient<Database>;

class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

function getNormalizedEmail(claims?: {
  email?: string | null;
  user_metadata?: { email?: string | null } | null;
}) {
  const directEmail = claims?.email?.trim().toLowerCase();
  if (directEmail) return directEmail;
  return claims?.user_metadata?.email?.trim().toLowerCase() ?? null;
}

function getServerSupabaseEnv() {
  return {
    url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    publishableKey:
      process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  };
}

function publicClient() {
  const { url, publishableKey } = getServerSupabaseEnv();
  return createClient<Database>(url!, publishableKey!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

async function publicReadClient() {
  const { serviceRoleKey } = getServerSupabaseEnv();
  if (!serviceRoleKey) return publicClient();

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return supabaseAdmin;
  } catch {
    return publicClient();
  }
}

async function getAdminLookupClient() {
  const { serviceRoleKey } = getServerSupabaseEnv();
  if (!serviceRoleKey) return null;

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return supabaseAdmin;
  } catch {
    return null;
  }
}

async function getUserEmailFromAuth(supabase: AppSupabaseClient) {
  try {
    const userRes = await supabase.auth.getUser();
    const maybeUser = userRes.data.user;
    return maybeUser?.email?.trim().toLowerCase() ?? null;
  } catch {
    return null;
  }
}

async function assertAdmin(
  supabase: AppSupabaseClient,
  userId: string,
  claims?: { email?: string | null },
) {
  const normalizedEmail = getNormalizedEmail(claims);

  const adminLookupClient = await getAdminLookupClient();
  const roleSources: AppSupabaseClient[] = adminLookupClient
    ? [adminLookupClient, supabase]
    : [supabase];

  let roleData: { role?: string } | null = null;
  for (const roleSource of roleSources) {
    const { data, error } = await roleSource
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!error && data) {
      roleData = data;
      break;
    }
  }

  const emailFromAuth = await getUserEmailFromAuth(supabase);

  const finalEmail = normalizedEmail ?? emailFromAuth;
  const finalIsConfiguredAdmin = !!finalEmail && configuredAdminEmails.includes(finalEmail);

  if (roleData || finalIsConfiguredAdmin) return;
  throw new HttpError(403, "Forbidden: admin role required");
}

// ---------- PUBLIC ----------

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await publicReadClient();
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
    const supabase = await publicReadClient();
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (post ?? null) as unknown as BlogPost | null;
  });

export const incrementPostView = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: count, error } = await supabase.rpc("increment_blog_post_view", {
      post_slug: data.slug,
    });
    if (error) throw new Error(error.message);
    return { views_count: count ?? 0 };
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

export const getCategoryBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({ slug: z.string().min(1) }).parse(d)
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();

    const { data: category, error } = await supabase
      .from("blog_categories")
      .select("id, slug, name_en, name_ne")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return category;
  });


export const listPostsByCategory = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({ slug: z.string().min(1) }).parse(d)
  )
  .handler(async ({ data }) => {
    const supabase = await publicReadClient();

    const { data: posts, error } = await supabase
  .from("blog_posts")
  .select(
    `
      ${POST_SELECT},
      blog_categories!inner(slug)
    `
  )
  .eq("published", true)
  .eq("blog_categories.slug", data.slug)
  .order("published_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (posts ?? []) as BlogPost[];
  });

// ---------- ADMIN ----------

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const normalizedEmail = getNormalizedEmail(context.claims);
    const emailFromAuth = await getUserEmailFromAuth(context.supabase);
    const finalEmail = normalizedEmail ?? emailFromAuth;
    const isConfiguredAdmin = !!finalEmail && configuredAdminEmails.includes(finalEmail);

    const adminLookupClient = await getAdminLookupClient();
    const roleSources: AppSupabaseClient[] = adminLookupClient
      ? [adminLookupClient, context.supabase]
      : [context.supabase];

    let hasRole = false;
    for (const roleSource of roleSources) {
      const { data, error } = await roleSource
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("role", "admin")
        .maybeSingle();

      if (!error && data) {
        hasRole = true;
        break;
      }
    }

    return {
      isAdmin: hasRole || isConfiguredAdmin,
      email: finalEmail,
      allowedEmails: configuredAdminEmails,
    };
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
  focus_keyword: z.string().max(120).nullable().optional(),
  secondary_keywords: z.array(z.string().max(80)).max(30).default([]),
  internal_link_suggestions: z.array(z.string().max(300)).max(30).default([]),
  external_references: z.array(z.string().max(500)).max(30).default([]),
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
