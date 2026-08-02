import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "https://harendralamsal.name.np";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/",
          "/about",
          "/services",
          "/portfolio",
          "/blog",
          "/resources",
          "/contact",
        ];

        const { data: blogPosts, error } = await supabaseAdmin
          .from("blog_posts")
          .select("slug")
          .eq("published", true);

        if (error) {
          console.error("Sitemap error:", error);
        }

        const postPaths = (blogPosts ?? []).map(
          (post) => `/blog/${post.slug}`
        );

        const all = [...staticPaths, ...postPaths];

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...all.map(
            (path) =>
              `  <url><loc>${BASE_URL}${path}</loc><changefreq>weekly</changefreq><priority>${path === "/" ? "1.0" : "0.7"}</priority></url>`
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
