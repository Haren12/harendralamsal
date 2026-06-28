import { Link } from "@tanstack/react-router";
import { Github, Facebook, Linkedin, Youtube, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { postCategories } from "@/lib/content";
import { cn } from "@/lib/utils";


export function Footer() {
  const { t, lang } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 overflow-hidden rounded-xl bg-[image:var(--gradient-primary)] ring-1 ring-border">
              <img src={"/harendra_portrait.png"} alt="Harendra Lamsal" className="h-full w-full object-cover" />
            </span>
            <span className="text-base font-bold tracking-tight">Harendra Lamsal</span>
          </div>
          <p
            className={cn(
              "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground",
              lang === "ne" && "font-nepali",
            )}
          >
            {t("hero.tagline")}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            <span className={lang === "ne" ? "font-nepali" : ""}>{t("footer.builtIn")}</span> 🇳🇵
          </p>
        </div>

        <div>
          <h4 className={cn("text-sm font-semibold", lang === "ne" && "font-nepali")}>
            {t("footer.quickLinks")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { to: "/about", k: "nav.about" as const },
              { to: "/services", k: "nav.services" as const },
              { to: "/portfolio", k: "nav.portfolio" as const },
              { to: "/blog", k: "nav.blog" as const },
              { to: "/resources", k: "nav.resources" as const },
              { to: "/contact", k: "nav.contact" as const },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={cn(
                    "text-muted-foreground transition-colors hover:text-foreground",
                    lang === "ne" && "font-nepali",
                  )}
                >
                  {t(l.k)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={cn("text-sm font-semibold", lang === "ne" && "font-nepali")}>
            {t("footer.categories")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {postCategories.slice(0, 6).map((c) => (
              <li key={c}>
                <Link
                  to="/blog"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={cn("text-sm font-semibold", lang === "ne" && "font-nepali")}>
            {t("footer.social")}
          </h4>
          <div className="mt-4 flex gap-2">
            {[
              { Icon: Github, label: "GitHub", href: "#" },
              {
                Icon: Facebook,
                label: "Facebook",
                href: "https://www.facebook.com/harendra.lamsala",
              },
              {
                Icon: Linkedin,
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/harendra-lamsal-728a6122b",
              },
              { Icon: Youtube, label: "YouTube", href: "#" },
              { Icon: Mail, label: "Email", href: "mailto:harendralamsal4140@gmail.com" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            harendralamsal4140@gmail.com
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div
          className={cn(
            "container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row",
          )}
        >
          <p>
            © {year} Harendra Lamsal. <span className={lang === "ne" ? "font-nepali" : ""}>{t("footer.rights")}</span>
          </p>
          <p className="text-[11px] uppercase tracking-wider">
            <span className="text-accent">●</span> Available for projects
          </p>
        </div>
      </div>
    </footer>
  );
}
