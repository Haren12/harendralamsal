import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Edit3, Trash2, LogOut, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminListPosts, adminDeletePost } from "@/lib/blog.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [{ title: "Admin — Blog Posts" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const listPosts = useServerFn(adminListPosts);
  const deletePost = useServerFn(adminDeletePost);

  const postsQ = useQuery({
    queryKey: ["adminPosts"],
    queryFn: () => listPosts(),
  });

  const del = useMutation({
    mutationFn: (id: string) => deletePost({ data: { id } }),
    onSuccess: () => {
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["adminPosts"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  return (
    <section className="container-page py-10 md:py-14">
      <header className="tech-panel rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
              Command center
            </p>
            <h1 className="text-3xl font-black tracking-tight">Blog admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {postsQ.data?.length ?? 0} posts ·{" "}
              {postsQ.data?.filter((p) => p.published).length ?? 0} published
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/new"
              className="tech-button inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" /> New post
            </Link>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2.5 text-sm font-semibold text-muted-foreground shadow-[var(--shadow-card)] backdrop-blur hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="surface-card mt-8 overflow-x-auto rounded-2xl">
        {postsQ.isLoading ? (
          <p className="p-8 text-center text-muted-foreground">Loading posts…</p>
        ) : postsQ.data?.length === 0 ? (
          <p className="p-12 text-center text-muted-foreground">
            No posts yet. Click <b>New post</b> to create one.
          </p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-muted/45 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Views</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {postsQ.data?.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-border transition-colors hover:bg-muted/25"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">
                      {p.title_en || p.title_ne || "(untitled)"}
                    </div>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category?.name_en ?? "—"}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                        <Eye className="h-3 w-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                        <EyeOff className="h-3 w-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-2.5 py-1 text-xs font-semibold">
                      <Eye className="h-3.5 w-3.5 text-accent" />
                      {p.views_count.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to="/admin/edit/$id"
                        params={{ id: p.id }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 hover:border-accent/40 hover:text-accent"
                        aria-label="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${p.title_en || p.slug}"? This cannot be undone.`)) {
                            del.mutate(p.id);
                          }
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
