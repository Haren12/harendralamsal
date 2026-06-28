import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/PostForm";

export const Route = createFileRoute("/_authenticated/admin/new")({
  head: () => ({
    meta: [{ title: "New post — Admin" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: NewPost,
});

function NewPost() {
  return (
    <section className="container-page py-10 md:py-14">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to admin
      </Link>
      <h1 className="mt-4 text-3xl font-black tracking-tight">New blog post</h1>
      <div className="mt-8">
        <PostForm />
      </div>
    </section>
  );
}
