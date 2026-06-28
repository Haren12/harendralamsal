import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Menu, X, Languages } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/about", key: "nav.about" },
  { to: "/services", key: "nav.services" },
  { to: "/portfolio", key: "nav.portfolio" },
  { to: "/blog", key: "nav.blog" },
  { to: "/resources", key: "nav.resources" },
  { to: "/contact", key: "nav.contact" },
] as const;

function LangSwitcher() {
  const { lang, setLang } = useI18n();
  const opts: { value: Lang; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "ne", label: "ने" },
  ];
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold"
    >
      <Languages className="ml-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      {opts.map((o) => (
        <button
          key={o.value}
          onClick={() => setLang(o.value)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            lang === o.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
            o.value === "ne" && "font-nepali",
          )}
          aria-pressed={lang === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3.5 md:flex md:justify-between">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)] ring-1 ring-border">
            <img
              src={"/harendra_portrait.png"}
              alt="Harendra Lamsal"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[15px] font-bold tracking-tight text-foreground">
              Harendra Lamsal
            </span>
            <span
              className={cn(
                "truncate text-[11px] text-muted-foreground",
                lang === "ne" && "font-nepali",
              )}
            >
              {lang === "ne" ? "वेब डेभलपर र ब्लगर" : "Web Developer & Blogger"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {({ isActive }) => (
                <>
                  <span className={lang === "ne" ? "font-nepali" : ""}>{t(n.key)}</span>
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LangSwitcher />
          <Link
            to="/auth"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <Lock className="h-3.5 w-3.5" />
            Admin
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
          >
            <span className={lang === "ne" ? "font-nepali" : ""}>{t("nav.hire")}</span>
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <span className={lang === "ne" ? "font-nepali" : ""}>{t(n.key)}</span>
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 px-1">
              <LangSwitcher />
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground"
              >
                <Lock className="h-3.5 w-3.5" />
                Admin
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
              >
                <span className={lang === "ne" ? "font-nepali" : ""}>{t("nav.hire")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
