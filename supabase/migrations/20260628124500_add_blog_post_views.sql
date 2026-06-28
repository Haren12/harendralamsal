ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS views_count INTEGER NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_blog_post_view(post_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_views INTEGER;
BEGIN
  UPDATE public.blog_posts
  SET views_count = views_count + 1
  WHERE slug = post_slug
    AND published = true
  RETURNING views_count INTO updated_views;

  RETURN COALESCE(updated_views, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_blog_post_view(TEXT) TO anon, authenticated;
