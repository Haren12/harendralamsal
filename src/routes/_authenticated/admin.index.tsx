import * as React from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  adminTrashPosts,
  adminListPosts,
  adminUpdatePosts,
  listCategoriesPublic,
} from "@/lib/blog.functions";
import type { BlogCategory, BlogPost } from "@/lib/blog.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      {
        title: "Admin Dashboard",
      },
      {
        name: "robots",
        content: "noindex,nofollow",
      },
    ],
  }),

  component: AdminPage,
});


function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const listPosts = useServerFn(adminListPosts);
  const trashPosts = useServerFn(adminTrashPosts);
  const updatePosts = useServerFn(adminUpdatePosts);
  const listCategories = useServerFn(listCategoriesPublic);

  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"all" | "published" | "draft">("all");
  const [categoryId, setCategoryId] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<"updated_at" | "published_at" | "views" | "title">("updated_at");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [page, setPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  function resetSelection() {
    setSelectedIds([]);
  }

  const categoriesQuery = useQuery<BlogCategory[]>({
    queryKey: ["adminCategories"],
    queryFn: () => listCategories(),
  });

  const postsQuery = useQuery<{ posts: BlogPost[]; count: number }, Error>({
    queryKey: ["adminPosts"],
    queryFn: () =>
      listPosts({
        data: {
          page: 1,
          page_size: 50,
        },
      }),
  });

  const pageSize = 12;
  const posts = postsQuery.data?.posts ?? [];

  const filteredPosts = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return posts
      .filter((post) => {
        if (normalizedSearch) {
          const title = (post.title_en || post.title_ne || "").toLowerCase();
          const slug = post.slug.toLowerCase();
          if (!title.includes(normalizedSearch) && !slug.includes(normalizedSearch)) {
            return false;
          }
        }

        if (status === "published") {
          if (!post.published) return false;
        }

        if (status === "draft") {
          if (post.published) return false;
        }

        if (categoryId) {
          return post.category_id === categoryId;
        }

        return true;
      })
      .sort((a, b) => {
        let compareValue = 0;

        if (sortBy === "updated_at") {
          compareValue =
            new Date(a.updated_at).getTime() -
            new Date(b.updated_at).getTime();
        } else if (sortBy === "published_at") {
          const aValue = a.published_at ? new Date(a.published_at).getTime() : 0;
          const bValue = b.published_at ? new Date(b.published_at).getTime() : 0;
          compareValue = aValue - bValue;
        } else if (sortBy === "views") {
          compareValue = (a.views_count ?? 0) - (b.views_count ?? 0);
        } else if (sortBy === "title") {
          const aTitle = (a.title_en || a.title_ne || "").toLowerCase();
          const bTitle = (b.title_en || b.title_ne || "").toLowerCase();
          compareValue = aTitle.localeCompare(bTitle);
        }

        return sortOrder === "asc" ? compareValue : -compareValue;
      });
  }, [posts, search, status, categoryId, sortBy, sortOrder]);

  const totalCount = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const displayedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  const trashMutation = useMutation({
    mutationFn: (id: string) =>
      trashPosts({
        data: {
          ids: [id],
        },
      }),

    onSuccess() {
      toast.success("Post moved to trash");

      queryClient.invalidateQueries({
        queryKey: ["adminPosts"],
      });
    },

    onError(error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Move to trash failed",
      );
    },
  });

  const bulkPublishMutation = useMutation({
    mutationFn: (ids: string[]) =>
      updatePosts({ data: { ids, published: true } }),
    onSuccess() {
      toast.success("Posts published successfully");
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
      setSelectedIds([]);
    },
    onError(error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Bulk publish failed",
      );
    },
  });

  const bulkUnpublishMutation = useMutation({
    mutationFn: (ids: string[]) =>
      updatePosts({ data: { ids, published: false } }),
    onSuccess() {
      toast.success("Posts unpublished successfully");
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
      setSelectedIds([]);
    },
    onError(error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Bulk unpublish failed",
      );
    },
  });

  const bulkTrashMutation = useMutation({
    mutationFn: (ids: string[]) =>
      trashPosts({ data: { ids } }),
    onSuccess() {
      toast.success("Posts moved to trash");
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
      setSelectedIds([]);
    },
    onError(error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Bulk delete failed",
      );
    },
  });



  async function signOut() {
    await queryClient.cancelQueries();

    queryClient.clear();

    await supabase.auth.signOut();

    router.navigate({
      to: "/auth",
      replace: true,
    });
  }

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(displayedPosts.map((post) => post.id));
      return;
    }
    setSelectedIds([]);
  }

  function toggleSelect(id: string, checked: boolean) {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, id])] : current.filter((item) => item !== id),
    );
  }

  const total = posts.length;

  const published = posts.filter(
    (post) => post.published
  ).length;

  const drafts = total - published;

  const selectedCount = selectedIds.length;
  const allSelected = displayedPosts.length > 0 && displayedPosts.every((post) => selectedIds.includes(post.id));
  const anySelected = selectedCount > 0;

  const latest = [...posts]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )[0];


  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050816] px-4 py-6 text-slate-100 md:px-6 md:py-8">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_36%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">


        <aside className="rounded-[1.75rem] border border-cyan-400/15 bg-slate-950/80 p-5 backdrop-blur-xl">


          <div className="flex items-center gap-3 border-b border-white/10 pb-4">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-200">
              <Shield className="h-5 w-5"/>
            </div>


            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">
                newsroom
              </p>

              <h1 className="text-xl font-black text-white">
                Command Center
              </h1>
            </div>

          </div>


          <div className="mt-5 space-y-3">

            <SidebarLink
              to="/admin"
              label="Dashboard"
              icon={BarChart3}
              active
            />

            <SidebarLink
              to="/admin/new"
              label="New Post"
              icon={Plus}
            />

            <SidebarLink
              to="/admin/trash"
              label="Trash"
              icon={Trash2}
            />

            <SidebarLink
              to="/"
              label="Public Site"
              icon={ArrowRight}
            />

          </div>


          <div className="mt-6 space-y-3">

            <StatMini
              label="Posts"
              value={total}
            />

            <StatMini
              label="Published"
              value={published}
            />

            <StatMini
              label="Drafts"
              value={drafts}
            />

          </div>


          <button
            onClick={signOut}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-cyan-400/10"
          >

            <LogOut className="h-4 w-4"/>

            Sign out

          </button>


        </aside>

                <div className="space-y-6">


          <header className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-6 backdrop-blur-xl">


            <div className="flex flex-wrap items-start justify-between gap-4">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">

                  <Sparkles className="h-3.5 w-3.5"/>

                  AI newsroom

                </div>


                <h2 className="mt-4 text-3xl font-black text-white">
                  Blog Operations Dashboard
                </h2>


                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                  Manage posts, drafts and published content from one place.
                </p>


              </div>


              <Link
                to="/admin/new"
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100"
              >

                <Plus className="h-4 w-4"/>

                New Post

              </Link>


            </div>



            <div className="mt-6 grid gap-4 md:grid-cols-3">


              <DashboardCard
                label="Total Stories"
                value={total}
                icon={BookOpenText}
              />


              <DashboardCard
                label="Live Now"
                value={published}
                icon={Eye}
              />


              <DashboardCard
                label="Draft Queue"
                value={drafts}
                icon={EyeOff}
              />


            </div>


          </header>





          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">


            <div className="overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-slate-950/80">


              <div className="space-y-4 border-b border-white/10 px-6 py-4">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-xs uppercase tracking-wider text-cyan-200">
                  Content Stream
                </p>

                <p className="text-sm text-slate-400">
                  Recent posts
                </p>

              </div>

              <CalendarClock className="h-5 w-5 text-cyan-300"/>

            </div>

            <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-5">

              <div className="lg:col-span-2">
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                    resetSelection();
                  }}
                  placeholder="Search posts..."
                  className="bg-slate-950/80 text-slate-100 placeholder:text-slate-500"
                />
              </div>

              <div>
                <Select value={status} onValueChange={(value) => { setStatus(value as "all" | "published" | "draft"); setPage(1); resetSelection(); }}>
                  <SelectTrigger className="w-full bg-slate-950/80 text-slate-100">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={sortBy} onValueChange={(value) => { setSortBy(value as "updated_at" | "published_at" | "views" | "title"); setPage(1); }}>
                  <SelectTrigger className="w-full bg-slate-950/80 text-slate-100">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated_at">Updated date</SelectItem>
                    <SelectItem value="published_at">Publish date</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={sortOrder} onValueChange={(value) => { setSortOrder(value as "asc" | "desc"); setPage(1); resetSelection(); }}>
                  <SelectTrigger className="w-full bg-slate-950/80 text-slate-100">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest first</SelectItem>
                    <SelectItem value="asc">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2 min-w-[280px]">
                <Select value={categoryId ?? ""} onValueChange={(value) => { setCategoryId(value || null); setPage(1); resetSelection(); }}>
                  <SelectTrigger className="w-full bg-slate-950/80 text-slate-100">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categoriesQuery.data?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>





              {postsQuery.isLoading && (

                <div className="p-8 text-center text-slate-400">
                  Loading posts...
                </div>

              )}





              {!postsQuery.isLoading && posts.length === 0 && (

                <div className="p-12 text-center">

                  <p className="text-lg font-semibold text-white">
                    No posts found
                  </p>

                </div>

              )}






              {filteredPosts.length > 0 && (

                <>

                  <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">
                        {selectedCount > 0 ? `${selectedCount} selected` : "Bulk actions"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Manage multiple posts at once.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!anySelected || bulkPublishMutation.isLoading || bulkUnpublishMutation.isLoading || bulkTrashMutation.isLoading}
                        onClick={() => bulkPublishMutation.mutate(selectedIds)}
                      >
                        Publish
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!anySelected || bulkPublishMutation.isLoading || bulkUnpublishMutation.isLoading || bulkTrashMutation.isLoading}
                        onClick={() => bulkUnpublishMutation.mutate(selectedIds)}
                      >
                        Unpublish
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!anySelected || bulkPublishMutation.isLoading || bulkUnpublishMutation.isLoading || bulkTrashMutation.isLoading}
                        onClick={() => {
                          if (window.confirm(`Delete ${selectedCount} selected post${selectedCount === 1 ? "" : "s"}?`)) {
                            bulkTrashMutation.mutate(selectedIds);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>

                  </div>

                  <div className="overflow-x-auto">


                  <table className="w-full min-w-[800px] text-sm">


                    <thead className="bg-white/5 text-xs uppercase text-slate-400">

                      <tr>

                        <th className="px-6 py-4 text-left">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={(checked) => toggleSelectAll(checked === true)}
                          />
                        </th>

                        <th className="px-6 py-4 text-left">
                          Title
                        </th>

                        <th className="px-6 py-4 text-left">
                          Category
                        </th>

                        <th className="px-6 py-4 text-left">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left">
                          Views
                        </th>

                        <th className="px-6 py-4 text-left">
                          Updated
                        </th>

                        <th className="px-6 py-4 text-right">
                          Actions
                        </th>

                      </tr>

                    </thead>





                    <tbody>


                    {displayedPosts.map((post)=>(

                      <tr
                        key={post.id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >


                        <td className="px-6 py-4">
                          <Checkbox
                            checked={selectedIds.includes(post.id)}
                            onCheckedChange={(checked) => toggleSelect(post.id, checked === true)}
                          />
                        </td>
                        <td className="px-6 py-4">


                          <p className="font-semibold text-white">

                            {
                              post.title_en ||
                              post.title_ne ||
                              "Untitled"
                            }

                          </p>


                          <p className="text-xs text-slate-400">
                            /{post.slug}
                          </p>


                        </td>





                        <td className="px-6 py-4 text-slate-300">

                          {
                            post.category?.name_en ??
                            "Uncategorized"
                          }

                        </td>





                        <td className="px-6 py-4">

                          {
                            post.published ?

                            <Badge tone="emerald">
                              Published
                            </Badge>

                            :

                            <Badge tone="amber">
                              Draft
                            </Badge>
                          }


                        </td>





                        <td className="px-6 py-4">


                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">

                            <Eye className="h-3 w-3 text-cyan-300"/>

                            {
                              (
                                post.views_count ??
                                0
                              ).toLocaleString()
                            }

                          </span>


                        </td>





                        <td className="px-6 py-4 text-xs text-slate-400">


                          {
                            post.updated_at
                            ?
                            formatDate(
                              post.updated_at,
                              "en",
                              "short"
                            )
                            :
                            "-"
                          }


                        </td>





                        <td className="px-6 py-4">


                          <div className="flex justify-end gap-2">


                            <Link
                              to="/admin/edit/$id"
                              params={{
                                id: post.id
                              }}
                              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5"
                            >

                              <Edit3 className="h-4 w-4"/>

                            </Link>





                            <button
                              onClick={()=>{

                                const ok =
                                  window.confirm(
                                    "Delete this post?"
                                  );

                                if(ok){
                                  trashMutation.mutate(
                                    post.id
                                  );
                                }

                              }}

                              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/20"
                            >

                              <Trash2 className="h-4 w-4"/>

                            </button>


                          </div>


                        </td>



                      </tr>


                    ))}


                    </tbody>


                  </table>


                </div>

                <div className="border-t border-white/10 bg-slate-950/80 px-6 py-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-400">
                      Showing {posts.length} of {totalCount.toLocaleString()} posts
                    </p>

                    <Pagination className="justify-end">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();
                              resetSelection();
                              setPage((current) => Math.max(1, current - 1));
                            }}
                            disabled={page <= 1}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              isActive={pageNumber === page}
                              onClick={(event) => {
                                event.preventDefault();
                                resetSelection();
                                setPage(pageNumber);
                              }}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();
                              resetSelection();
                              setPage((current) => Math.min(totalPages, current + 1));
                            }}
                            disabled={page >= totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>

                </>

              )}


            </div>

                        <div className="space-y-6">


              <div className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-5">


                <p className="text-xs uppercase tracking-wider text-cyan-200">
                  Latest Signal
                </p>



                {
                  latest ?

                  <div className="mt-4 space-y-3">


                    <h3 className="text-lg font-bold text-white">

                      {
                        latest.title_en ||
                        latest.title_ne ||
                        "Untitled"
                      }

                    </h3>



                    <p className="text-sm text-slate-400">

                      {
                        latest.excerpt_en ||
                        latest.excerpt_ne ||
                        "No summary available"
                      }

                    </p>



                    <div className="flex flex-wrap gap-2">


                      <Chip>

                        {
                          latest.category?.name_en ??
                          "Uncategorized"
                        }

                      </Chip>



                      <Chip>

                        {
                          latest.published
                          ?
                          "Published"
                          :
                          "Draft"
                        }

                      </Chip>



                      <Chip>

                        {
                          latest.updated_at
                          ?
                          formatDate(
                            latest.updated_at,
                            "en",
                            "short"
                          )
                          :
                          "-"
                        }

                      </Chip>


                    </div>


                  </div>


                  :

                  <p className="mt-3 text-sm text-slate-400">
                    No content available
                  </p>


                }


              </div>





              <div className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/80 p-5">


                <p className="text-xs uppercase tracking-wider text-cyan-200">
                  Quick Actions
                </p>



                <div className="mt-4 grid gap-3">


                  <Link
                    to="/admin/new"
                    className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100"
                  >

                    Create Article

                    <ArrowRight className="h-4 w-4"/>

                  </Link>




                  <Link
                    to="/blog"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
                  >

                    Open Blog

                    <ArrowRight className="h-4 w-4"/>

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
}:{
  to:
    | "/admin"
    | "/admin/new"
    | "/";

  label:string;

  icon:LucideIcon;

  active?:boolean;

}){


  return (

    <Link

      to={to}

      className={cn(
        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition",

        active

        ?

        "border-cyan-400/30 bg-cyan-400/10 text-cyan-100"

        :

        "border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-400/10"

      )}

    >


      <span className="flex items-center gap-3">


        <Icon className="h-4 w-4"/>

        {label}


      </span>



      <ArrowRight className="h-3.5 w-3.5"/>


    </Link>

  );

}







function DashboardCard({
  label,
  value,
  icon:Icon,

}:{
  label:string;
  value:number;
  icon:LucideIcon;

}){


  return (

    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">


      <div className="flex items-center justify-between">


        <div>


          <p className="text-xs uppercase tracking-wider text-slate-400">

            {label}

          </p>


          <p className="mt-2 text-3xl font-black text-white">

            {value}

          </p>


        </div>



        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-200">


          <Icon className="h-5 w-5"/>


        </div>


      </div>


    </div>

  );

}







function StatMini({
  label,
  value,

}:{
  label:string;
  value:number;

}){


  return (

    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">


      <p className="text-xs uppercase tracking-wider text-slate-400">

        {label}

      </p>



      <p className="mt-2 text-2xl font-black text-white">

        {value}

      </p>


    </div>

  );

}







function Badge({

 tone,

 children,

}:{

 tone:"emerald"|"amber";

 children:string;

}){


 return (

  <span

    className={cn(

      "rounded-full px-3 py-1 text-xs font-bold",

      tone==="emerald"

      ?

      "bg-emerald-400/15 text-emerald-200"

      :

      "bg-amber-400/15 text-amber-200"

    )}

  >

    {children}

  </span>

 );

}







function Chip({

 children,

}:{

 children:ReactNode;

}){


 return (

  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">

    {children}

  </span>

 );

}
