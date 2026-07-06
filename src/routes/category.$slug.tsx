import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  return (
    <div className="container-page py-20">
      <h1>Category Page</h1>
    </div>
  );
}
