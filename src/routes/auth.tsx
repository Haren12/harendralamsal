import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Cpu, LockKeyhole, ShieldCheck, TerminalSquare, Waves } from "lucide-react";
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
        // treat as unauthenticated on the login screen
      }
      await supabase.auth.signOut();
      if (active) toast.error("Your account is not authorized for the admin dashboard.");
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
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#050816] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:36px_36px] opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-slate-950/75 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_30%)]" />
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure console
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Enter the newsroom command layer.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
              Sign in to access the editorial operations center, publish stories, tune SEO, and
              manage the live site from a futuristic control surface.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Cpu, title: "Realtime control", body: "Fast publishing and live updates." },
                {
                  icon: TerminalSquare,
                  title: "Operator interface",
                  body: "Designed like a premium SOC dashboard.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/8 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-200">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-slate-400">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-10 bottom-4 hidden rounded-[1.5rem] border border-cyan-400/20 bg-slate-900/70 px-4 py-3 text-[11px] text-slate-300 shadow-[0_0_40px_rgba(34,211,238,0.12)] lg:block">
            <p className="flex items-center gap-2">
              <Waves className="h-3.5 w-3.5 text-cyan-300" />
              Encrypted admin lane active
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.1),transparent_45%)]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/80">
                  Access panel
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                  Admin sign in
                </h2>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                <LockKeyhole className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              Use your administrator credentials to enter the control room. This interface is
              optimized for clarity, security, and fast content operations.
            </p>

            {registrationDisabled && (
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
                Public registration is disabled. Please contact the administrator.
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={160}
                  className="input-cyber w-full"
                  placeholder="operator@example.com"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={72}
                  className="input-cyber w-full"
                  placeholder="••••••••"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(59,130,246,0.18))] px-4 py-3 text-sm font-semibold text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_30px_rgba(34,211,238,0.16)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.14),0_0_40px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                {busy ? "Authenticating…" : "Enter control room"}
              </button>
            </form>

            <Link
              to="/"
              className="mt-6 inline-flex items-center text-xs text-slate-400 transition-colors hover:text-cyan-200"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .input-cyber {
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: rgba(2, 6, 23, 0.92);
          color: #e2e8f0;
          padding: 0.82rem 0.95rem;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
        }
        .input-cyber::placeholder {
          color: rgba(148, 163, 184, 0.55);
        }
        .input-cyber:focus {
          border-color: rgba(34, 211, 238, 0.55);
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.12), 0 0 30px rgba(34, 211, 238, 0.12);
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
}
