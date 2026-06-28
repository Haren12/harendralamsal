import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/blog.functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedAdminLayout,
});

function AuthenticatedAdminLayout() {
  const checkAdmin = useServerFn(checkIsAdmin);
  const roleQ = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => checkAdmin(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  if (roleQ.isLoading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (roleQ.isError || !roleQ.data?.isAdmin) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-destructive">403</p>
        <h1 className="mt-3 text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-muted-foreground">Your account does not have admin privileges.</p>
      </div>
    );
  }

  return <Outlet />;
}
