export type BlogCategory = {
  id: string;
  slug: string;
  name_en: string;
  name_ne: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title_en: string;
  title_ne: string;
  excerpt_en: string;
  excerpt_ne: string;
  body_en: string;
  body_ne: string;
  cover_image_url: string | null;
  category_id: string | null;
  category: { name_en: string; name_ne: string; slug: string } | null;
  tags: string[];
  lang: "en" | "ne" | "both";
  reading_minutes: number;
  views_count: number;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  secondary_keywords: string[];
  internal_link_suggestions: string[];
  external_references: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
