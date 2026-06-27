import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/PostForm";
import { adminGetPost } from "@/lib/blog.functions";

export const Route = createFileRoute("/_authenticated/admin/edit/$id")({
  head: () => ({
    meta: [
      { title: "Edit post — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const getPost = useServerFn(adminGetPost);
  const postQ = useQuery({
    queryKey: ["adminPost", id],
    queryFn: () => getPost({ data: { id } }),
  });

  return (
    <section className="container-page py-10 md:py-14">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to admin
      </Link>
      <h1 className="mt-4 text-3xl font-black tracking-tight">Edit post</h1>
      <div className="mt-8">
        {postQ.isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : postQ.data ? (
          <PostForm existing={postQ.data} />
        ) : (
          <p className="text-muted-foreground">Post not found.</p>
        )}
      </div>
    </section>
  );
}
