import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  CalendarClock,
  Edit3,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminListPosts, adminDeletePost } from "@/lib/blog.functions";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

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

  const total = postsQ.data?.length ?? 0;
  const published = postsQ.data?.filter((p) => p.published).length ?? 0;
  const drafts = total - published;
  const latest = postsQ.data?.[0];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050816] px-4 py-6 text-slate-100 md:px-6 md:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_36%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[1.75rem] border border-cyan-400/15 bg-slate-950/80 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/8 pb-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-200">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">
                newsroom
              </p>
              <h1 className="text-xl font-black tracking-tight text-white">Command center</h1>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <SidebarLink to="/admin" label="Dashboard" icon={BarChart3} active />
            <SidebarLink to="/admin/new" label="New post" icon={Plus} />
            <SidebarLink to="/" label="Public site" icon={ArrowRight} />
          </div>

          <div className="mt-6 space-y-3">
            <StatMini label="Posts" value={total} />
            <StatMini label="Published" value={published} />
            <StatMini label="Drafts" value={drafts} />
          </div>

          <button
            onClick={() => signOut()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/10"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <div className="space-y-6">
          <header className="overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-slate-950/78 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI newsroom
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Blog operations dashboard
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                  Manage stories, drafts, and published pieces from a premium cyber operations
                  surface built for speed and clarity.
                </p>
              </div>
              <Link
                to="/admin/new"
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(59,130,246,0.18))] px-4 py-3 text-sm font-semibold text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_30px_rgba(34,211,238,0.14)] transition-transform hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                New post
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Total stories",
                  value: total,
                  icon: BookOpenText,
                  tone: "from-cyan-400/18 to-blue-500/12",
                },
                {
                  label: "Live now",
                  value: published,
                  icon: Eye,
                  tone: "from-emerald-400/18 to-cyan-500/12",
                },
                {
                  label: "Draft queue",
                  value: drafts,
                  icon: EyeOff,
                  tone: "from-fuchsia-400/18 to-cyan-500/12",
                },
              ].map(({ label, value, icon: Icon, tone }) => (
                <div
                  key={label}
                  className={cn(
                    "rounded-[1.5rem] border border-white/8 bg-gradient-to-br p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
                    tone,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                      <p className="mt-2 text-3xl font-black text-white">{value}</p>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950/45 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </header>

          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-slate-950/78 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">
                    Content stream
                  </p>
                  <p className="mt-1 text-sm text-slate-400">Recent posts in the newsroom queue.</p>
                </div>
                <CalendarClock className="h-5 w-5 text-cyan-300" />
              </div>

              {postsQ.isLoading ? (
                <p className="p-8 text-center text-slate-400">Loading posts…</p>
              ) : postsQ.data?.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <p className="text-lg font-semibold text-slate-200">No posts yet</p>
                  <p className="mt-2 text-sm">Create the first story to populate the newsroom.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-sm">
                    <thead className="bg-white/3 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      <tr>
                        <th className="px-6 py-4 text-left">Title</th>
                        <th className="px-6 py-4 text-left">Category</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Views</th>
                        <th className="px-6 py-4 text-left">Updated</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {postsQ.data?.map((p) => (
                        <tr key={p.id} className="border-t border-white/8 hover:bg-white/4">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">
                              {p.title_en || p.title_ne || "(untitled)"}
                            </div>
                            <div className="mt-1 text-xs text-slate-400">/{p.slug}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{p.category?.name_en ?? "—"}</td>
                          <td className="px-6 py-4">
                            {p.published ? (
                              <Badge tone="emerald">Published</Badge>
                            ) : (
                              <Badge tone="amber">Draft</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-xs font-semibold">
                              <Eye className="h-3.5 w-3.5 text-cyan-300" />
                              {p.views_count.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {formatDate(p.updated_at, "en", "short")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                to="/admin/edit/$id"
                                params={{ id: p.id }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-200"
                                aria-label="Edit"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Delete "${p.title_en || p.slug}"? This cannot be undone.`,
                                    )
                                  ) {
                                    del.mutate(p.id);
                                  }
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-rose-400/30 hover:bg-rose-500/15 hover:text-rose-200"
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
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/78 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">
                  Latest signal
                </p>
                {latest ? (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-lg font-bold text-white">
                      {latest.title_en || latest.title_ne || "Untitled"}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {latest.excerpt_en || latest.excerpt_ne || "No summary available."}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                      <Chip>{latest.category?.name_en ?? "Uncategorized"}</Chip>
                      <Chip>{latest.published ? "Published" : "Draft"}</Chip>
                      <Chip>{formatDate(latest.updated_at, "en", "short")}</Chip>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">No content signal yet.</p>
                )}
              </div>

              <div className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/78 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">
                  Quick actions
                </p>
                <div className="mt-4 grid gap-3">
                  <Link
                    to="/admin/new"
                    className="inline-flex items-center justify-between rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/30 hover:bg-cyan-400/15"
                  >
                    Create article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/blog"
                    className="inline-flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/20 hover:bg-cyan-400/10"
                  >
                    Open public blog
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: "/admin" | "/admin/new" | "/";
  label: string;
  icon: LucideIcon;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
        active
          ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
          : "border-white/8 bg-white/5 text-slate-300 hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-100",
      )}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <ArrowRight className="h-3.5 w-3.5 opacity-70" />
    </Link>
  );
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Badge({ tone, children }: { tone: "emerald" | "amber"; children: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
        tone === "emerald"
          ? "bg-emerald-400/15 text-emerald-200"
          : "bg-amber-400/15 text-amber-100",
      )}
    >
      {children}
    </span>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1">{children}</span>
  );
}
