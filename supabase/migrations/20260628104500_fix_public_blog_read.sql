GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT SELECT ON public.blog_categories TO anon, authenticated;

DROP POLICY IF EXISTS "Published posts public" ON public.blog_posts;
CREATE POLICY "Published posts public"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "Categories public read" ON public.blog_categories;
CREATE POLICY "Categories public read"
ON public.blog_categories
FOR SELECT
TO anon, authenticated
USING (true);
