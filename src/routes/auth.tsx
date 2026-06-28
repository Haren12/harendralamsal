import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/blog.functions";
import { cn } from "@/lib/utils";

type AuthSearch = {
  message?: "registration-disabled";
};

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    message: search.message === "registration-disabled" ? "registration-disabled" : undefined,
  }),
  beforeLoad: ({ search }) => {
    if ((search as Record<string, unknown>).mode === "signup") {
      throw redirect({
        to: "/auth",
        search: { message: "registration-disabled" },
        replace: true,
      });
    }
  },
  head: () => ({
    meta: [{ title: "Sign in — Admin" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(6).max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const checkAdmin = useServerFn(checkIsAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const registrationDisabled = search.message === "registration-disabled";

  useEffect(() => {
    let active = true;

    if (registrationDisabled) {
      toast.info("Public registration is disabled. Please contact the administrator.");
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active || !data.session) return;
      try {
        const admin = await checkAdmin();
        if (admin.isAdmin) {
          navigate({ to: "/admin" });
          return;
        }
      } catch {
        // Treat a failed admin check like a non-admin session on the login screen.
      }
      await supabase.auth.signOut();
      if (active) {
        toast.error("Your account is not authorized for the admin dashboard.");
      }
    });

    return () => {
      active = false;
    };
  }, [checkAdmin, navigate, registrationDisabled]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const admin = await checkAdmin();
      if (!admin.isAdmin) {
        await supabase.auth.signOut();
        toast.error("Your account is not authorized for the admin dashboard.");
        return;
      }

      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="surface-card w-full max-w-md p-8">
        <h1 className="text-2xl font-black tracking-tight">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with an existing administrator account to manage blog posts.
        </p>
        {registrationDisabled && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm font-medium text-foreground">
            Public registration is disabled. Please contact the administrator.
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={160}
              className="input w-full"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={72}
              className="input w-full"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className={cn(
              "w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.01] disabled:opacity-60",
            )}
          >
            {busy ? "Please wait…" : "Sign in"}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to site
        </Link>
      </div>

      <style>{`
        .input {
          border-radius: 0.625rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.7rem 0.9rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-accent) 20%, transparent);
        }
      `}</style>
    </section>
  );
}
