import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, MapPin, Github, Twitter, Linkedin, Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Harendra Lamsal" },
      {
        name: "description",
        content:
          "Get in touch about a web project, consulting, or just to say hi. Based in Nepal, available worldwide.",
      },
      { property: "og:title", content: "Contact — Harendra Lamsal" },
      { property: "og:description", content: "Get in touch about a project or consulting." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name too short").max(80),
  email: z.string().trim().email("Invalid email").max(160),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10, "Message too short").max(2000),
});

function ContactPage() {
  const { lang } = useI18n();
  const ne = lang === "ne";
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success(
        ne
          ? "सन्देश प्राप्त भयो! म छिट्टै जवाफ दिनेछु।"
          : "Message received! I'll get back to you shortly.",
      );
      setForm({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 700);
  }

  return (
    <>
      <section className="hero-bg">
        <div className="container-page py-16 md:py-24">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-6 bg-accent" /> {ne ? "सम्पर्क" : "Contact"}
          </p>
          <h1
            className={cn(
              "mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance",
              ne && "font-nepali",
            )}
          >
            {ne ? "कुरा गरौं।" : "Let's talk."}
          </h1>
          <p
            className={cn(
              "mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground",
              ne && "font-nepali",
            )}
          >
            {ne
              ? "परियोजना, परामर्श वा केवल नमस्कारका लागि — म २४ घण्टा भित्र जवाफ दिन्छु।"
              : "For projects, consulting, or just to say hi — I reply within 24 hours."}
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 md:grid-cols-[1fr_1.4fr] md:py-16">
        <aside className="space-y-4">
          <InfoCard
            icon={Mail}
            title={ne ? "इमेल" : "Email"}
            href="mailto:harendralamsal4140@gmail.com"
          >
            harendralamsal4140@gmail.com
          </InfoCard>
          <InfoCard icon={MessageCircle} title="WhatsApp" href="https://wa.me/9779823587535" accent>
            +977 9823587535
          </InfoCard>
          <InfoCard icon={MapPin} title={ne ? "स्थान" : "Location"}>
            {ne ? "सुर्खेत, नेपाल" : "Surkhet, Nepal"}
          </InfoCard>

          <div className="surface-card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {ne ? "फलो गर्नुहोस्" : "Follow"}
            </p>
            <div className="mt-3 flex gap-2">
              {[
                { Icon: Github, href: "#", label: "GitHub" },
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </aside>

        <form onSubmit={onSubmit} className="surface-card space-y-4 p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={ne ? "नाम" : "Name"}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={80}
                required
                className="input"
              />
            </Field>
            <Field label={ne ? "इमेल" : "Email"}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={160}
                required
                className="input"
              />
            </Field>
          </div>
          <Field label={ne ? "विषय" : "Subject"}>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              maxLength={120}
              required
              className="input"
            />
          </Field>
          <Field label={ne ? "सन्देश" : "Message"}>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              maxLength={2000}
              required
              className="input resize-y"
            />
          </Field>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            <span className={ne ? "font-nepali" : ""}>
              {ne ? "सन्देश पठाउनुहोस्" : "Send message"}
            </span>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>

      <style>{`
        .input {
          width: 100%;
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
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { lang } = useI18n();
  return (
    <label className="block">
      <span
        className={cn(
          "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
          lang === "ne" && "font-nepali",
        )}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  icon: Icon,
  title,
  href,
  children,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  href?: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  const inner = (
    <>
      <div
        className={cn(
          "grid h-10 w-10 place-items-center rounded-xl",
          accent ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{children}</p>
      </div>
    </>
  );
  return href ? (
    <a href={href} className="surface-card flex items-center gap-4 p-5">
      {inner}
    </a>
  ) : (
    <div className="surface-card flex items-center gap-4 p-5">{inner}</div>
  );
}
