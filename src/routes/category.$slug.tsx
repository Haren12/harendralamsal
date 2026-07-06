import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPostsByCategory } from "@/lib/blog.functions";
import { createFileRoute } from "@tanstack/react-router";
import { getCategoryBySlug } from "@/lib/blog.functions";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.slug} Articles | Harendra Lamsal`,
      },
      {
        name: "description",
        content: `Browse all articles in the ${params.slug} category.`,
      },
      {
        property: "og:title",
        content: `${params.slug} Articles`,
      },
      {
        property: "og:url",
        content: `/category/${params.slug}`,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `/category/${params.slug}`,
      },
    ],
  }),

  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();

  const getPosts = useServerFn(listPostsByCategory);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => getPosts({ data: { slug } }),
  });

  const getCategory = useServerFn(getCategoryBySlug);

const { data: category } = useQuery({
  queryKey: ["category-info", slug],
  queryFn: () => getCategory({ data: { slug } }),
});

  if (isLoading) {
    return (
      <div className="container-page py-20">
        Loading...
      </div>
    );
  }

  return (
  <div className="container-page py-20">
  <h1 className="text-4xl font-bold">
    {category?.name_en ?? slug}
  </h1>

  <p className="mt-2 text-gray-500">
    {posts?.length ?? 0} Articles
  </p>

  <div className="mt-10 space-y-6">
    {posts?.map((post) => (
      <div
        key={post.id}
        className="border rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold">
          {post.title_en}
        </h2>

        <p className="mt-2 text-gray-500">
          {post.excerpt_en}
        </p>
      </div>
    ))}
  </div>
</div>
  );
}
