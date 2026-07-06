import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPostsByCategory } from "@/lib/blog.functions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();

  const getPosts = useServerFn(listPostsByCategory);

  const postsQ = useQuery({
    queryKey: ["categoryPosts", slug],
    queryFn: () => getPosts({ data: { slug } }),
  });

  return (
    <div className="container-page py-20">
      <h1>Category: {slug}</h1>

      <p>Total Posts: {postsQ.data?.length ?? 0}</p>
    </div>
  );
}
