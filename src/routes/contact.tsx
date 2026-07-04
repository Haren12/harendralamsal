import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Github,
  Facebook,
  Linkedin,
  Send,
  Smartphone,
} from "lucide-react";
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
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(3, "Please write a message").max(2000),
});

type ContactForm = z.infer<typeof schema>;

const contactEmail = "harendralamsal4140@gmail.com";
const contactPhone = "+9779823587535";
const whatsappPhone = "9779823587535";

function fallbackMessage(data: ContactForm) {
  return [
    "New project inquiry",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone/WhatsApp: ${data.phone}` : null,
    `Subject: ${data.subject}`,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");
}

function fallbackLinks(data: ContactForm) {
  const message = fallbackMessage(data);
  return {
    whatsapp: `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
    email: `mailto:${contactEmail}?subject=${encodeURIComponent(`Project inquiry: ${data.subject}`)}&body=${encodeURIComponent(message)}`,
    sms: `sms:${contactPhone}?body=${encodeURIComponent(message)}`,
  };
}

function ContactPage() {
  const { lang } = useI18n();
  const ne = lang === "ne";
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [fallback, setFallback] = useState<ContactForm | null>(null);
  const [busy, setBusy] = useState(false);

  // Server-side send (Resend/Twilio/WhatsApp Cloud API) + UI fallback links
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    const data = parsed.data;
    setFallback(data);
    setBusy(true);

    try {
      // Dynamically import to avoid bundling server-only code into the client bundle.
      const { sendContactLead } = await import("@/lib/contact.functions");

      const result = await sendContactLead({ data });
      const anySuccess = Boolean(result?.smsSent || result?.emailSent || result?.whatsappSent);

      if (result?.issues?.length) {
        toast.error(
          ne
            ? `केही समस्याहरू आयो: ${result.issues.join("، ")}`
            : `Some providers failed: ${result.issues.join(", ")}`,
        );
      }

      if (anySuccess) {
        toast.success(
          ne
            ? "सन्देश पठाइयो। तपाईंको अनुरोधको जवाफ चाँडै आउँछ।"
            : "Message sent. You’ll receive a response soon.",
        );
      } else {
        toast.error(
          ne
            ? "प्रोभाइडरहरू उपलब्ध छैनन्। तलका विकल्पबाट सम्पर्क गर्नुहोस्।"
            : "No providers configured. Use the options below to contact.",
        );
      }
    } catch (err) {
      toast.error(ne ? "पठाउन सकेन। तलका विकल्प प्रयोग गर्नुहोस्।" : "Could not send. Use the options below.");
    } finally {
      setBusy(false);

      // Best-effort: keep current UX by trying WhatsApp link open in a new tab.
      const links = fallbackLinks(data);
      window.open(links.whatsapp, "_blank", "noopener,noreferrer");
    }
  }

  function clearForm() {
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setFallback(null);
    toast.success(ne ? "फर्म खाली गरियो।" : "Form cleared.");
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
                { Icon: Github, href: "https://github.com/harendralamsal", label: "GitHub" },
                {
                  Icon: Facebook,
                  href: "https://www.facebook.com/harendra.lamsala",
                  label: "Facebook",
                },
                {
                  Icon: Linkedin,
                  href: "https://www.linkedin.com/in/harendra-lamsal-728a6122b",
                  label: "LinkedIn",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/70 text-muted-foreground shadow-[var(--shadow-card)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent hover:shadow-[var(--shadow-glow)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-4">
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
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={ne ? "फोन / WhatsApp" : "Phone / WhatsApp"}>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={40}
                  className="input"
                />
              </Field>
              <Field label={ne ? "विषय" : "Subject"}>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  maxLength={120}
                  required
                  className="input"
                />
              </Field>
            </div>
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
              disabled={busy}
              className="tech-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
            >
              <span className={ne ? "font-nepali" : ""}>
                {busy ? (ne ? "पठाउँदैछ…" : "Sending…") : ne ? "WhatsApp बाट पठाउनुहोस्" : "Send via WhatsApp"}
              </span>
              <Send className="h-4 w-4" />
            </button>
          </form>

          {fallback && (
            <div className="surface-card border-accent/30 bg-accent/5 p-5">
              <p className={cn("text-sm font-bold text-foreground", ne && "font-nepali")}>
                {ne
                  ? "WhatsApp नखुलेमा अर्को विकल्प छान्नुहोस्"
                  : "If WhatsApp did not open, choose another option"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <FallbackButton href={fallbackLinks(fallback).whatsapp} icon={MessageCircle}>
                  WhatsApp
                </FallbackButton>
                <FallbackButton href={fallbackLinks(fallback).email} icon={Mail}>
                  Email
                </FallbackButton>
                <FallbackButton href={fallbackLinks(fallback).sms} icon={Smartphone}>
                  SMS
                </FallbackButton>
                <button
                  type="button"
                  onClick={clearForm}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                >
                  {ne ? "फर्म खाली गर्नुहोस्" : "Clear form"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.625rem;
          border: 1px solid var(--color-border);
          background: color-mix(in oklab, var(--color-card) 76%, transparent);
          color: var(--color-foreground);
          backdrop-filter: blur(16px);
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

function FallbackButton({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="tech-button inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
    >
      <Icon className="h-4 w-4" />
      {children}
    </a>
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
          "grid h-10 w-10 place-items-center rounded-xl border border-border shadow-[var(--shadow-card)]",
          accent
            ? "bg-accent text-accent-foreground shadow-[var(--shadow-glow)]"
            : "bg-primary/10 text-primary",
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
