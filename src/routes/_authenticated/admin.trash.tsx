import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
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
import {
  adminDeletePosts,
  adminListPosts,
  adminRestorePosts,
  listCategoriesPublic,
} from "@/lib/blog.functions";
import type { BlogCategory, BlogPost } from "@/lib/blog.types";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/trash")({
  head: () => ({
    meta: [
      { title: "Trash — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TrashAdminPage,
});

function TrashAdminPage() {
  const queryClient = useQueryClient();
  const listPosts = useServerFn(adminListPosts);
  const restorePosts = useServerFn(adminRestorePosts);
  const deletePosts = useServerFn(adminDeletePosts);
  const listCategories = useServerFn(listCategoriesPublic);

  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"all" | "published" | "draft">("all");
  const [categoryId, setCategoryId] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<"updated_at" | "published_at">("updated_at");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [page, setPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const pageSize = 12;

  const categoriesQuery = useQuery<BlogCategory[]>({
    queryKey: ["adminCategories"],
    queryFn: () => listCategories(),
  });

  const postsQuery = useQuery<{ posts: BlogPost[]; count: number }, Error>({
    queryKey: ["adminTrashPosts", search, status, categoryId, sortBy, sortOrder, page],
    queryFn: () =>
      listPosts({
        data: {
          page,
          page_size: pageSize,
          trash: true,
          search: search || undefined,
          status,
          category_id: categoryId ?? undefined,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      }),
    keepPreviousData: true,
  });

  const posts = postsQuery.data?.posts ?? [];
  const totalCount = postsQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);

  function resetSelection() {
    setSelectedIds([]);
  }

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(posts.map((post) => post.id));
      return;
    }
    setSelectedIds([]);
  }

  function toggleSelect(id: string, checked: boolean) {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, id])] : current.filter((item) => item !== id),
    );
  }

  const selectedCount = selectedIds.length;
  const allSelected = posts.length > 0 && posts.every((post) => selectedIds.includes(post.id));
  const anySelected = selectedCount > 0;

  const restoreMutation = useMutation({
    mutationFn: (ids: string[]) => restorePosts({ data: { ids } }),
    onSuccess() {
      toast.success("Posts restored successfully");
      queryClient.invalidateQueries({ queryKey: ["adminTrashPosts"] });
      setSelectedIds([]);
    },
    onError(error) {
      toast.error(error instanceof Error ? error.message : "Restore failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deletePosts({ data: { ids } }),
    onSuccess() {
      toast.success("Posts permanently deleted");
      queryClient.invalidateQueries({ queryKey: ["adminTrashPosts"] });
      setSelectedIds([]);
    },
    onError(error) {
      toast.error(error instanceof Error ? error.message : "Permanent delete failed");
    },
  });

  return (
    <section className="container-page py-10 md:py-14">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/admin" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 inline-block h-4 w-4" /> Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-black tracking-tight">Trash</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Restore deleted posts or remove them permanently from the system.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={!anySelected || restoreMutation.isLoading}
            onClick={() => restoreMutation.mutate(selectedIds)}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Restore
          </Button>
          <Button
            variant="destructive"
            disabled={!anySelected || deleteMutation.isLoading}
            onClick={() => {
              if (window.confirm(`Permanently delete ${selectedCount} selected post${selectedCount === 1 ? "" : "s"}?`)) {
                deleteMutation.mutate(selectedIds);
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete permanently
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-950/80 p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
              resetSelection();
            }}
            placeholder="Search trash..."
            className="bg-slate-900/80 text-slate-100"
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as "all" | "published" | "draft");
              setPage(1);
              resetSelection();
            }}
          >
            <SelectTrigger className="w-full bg-slate-900/80 text-slate-100">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={categoryId ?? ""}
            onValueChange={(value) => {
              setCategoryId(value || null);
              setPage(1);
              resetSelection();
            }}
          >
            <SelectTrigger className="w-full bg-slate-900/80 text-slate-100">
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

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 text-left">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleSelectAll(checked === true)}
                  />
                </th>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Deleted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedIds.includes(post.id)}
                      onCheckedChange={(checked) => toggleSelect(post.id, checked === true)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">{post.title_en || post.title_ne || "Untitled"}</p>
                    <p className="text-xs text-slate-400">/{post.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{post.category?.name_en ?? "Uncategorized"}</td>
                  <td className="px-6 py-4">
                    <Badge tone={post.published ? "emerald" : "amber"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {post.deleted_at ? formatDate(post.deleted_at, "en", "short") : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => restoreMutation.mutate([post.id])}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> Restore
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (window.confirm("Permanently delete this post?")) {
                            deleteMutation.mutate([post.id]);
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">Showing {posts.length} of {totalCount.toLocaleString()} trashed posts</p>
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
    </section>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "emerald" | "amber";
  children: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-bold",
        tone === "emerald"
          ? "bg-emerald-400/15 text-emerald-200"
          : "bg-amber-400/15 text-amber-200",
      )}
    >
      {children}
    </span>
  );
}
