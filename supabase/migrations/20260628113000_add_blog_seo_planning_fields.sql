ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
  ADD COLUMN IF NOT EXISTS secondary_keywords TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS internal_link_suggestions TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS external_references TEXT[] NOT NULL DEFAULT '{}';
