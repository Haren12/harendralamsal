import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, GraduationCap, Briefcase, Heart, Target, Compass } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { skills } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Harendra Lamsal — Web Developer from Nepal" },
      { name: "description", content: "My story, journey, mission, and how I came to build websites and write about the web." },
      { property: "og:title", content: "About Harendra Lamsal" },
      { property: "og:description", content: "My story, journey, mission, and how I came to build websites." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useI18n();
  const ne = lang === "ne";

  return (
    <>
      <section className="hero-bg">
        <div className="container-page py-16 md:py-24">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-6 bg-accent" /> {ne ? "मेरो बारेमा" : "About me"}
          </p>
          <h1 className={cn("mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance", ne && "font-nepali")}>
            {ne
              ? "नेपालका एक डेभलपर, जसले वेबलाई अलि सजिलो बनाउन खोज्छ।"
              : "A developer from Nepal trying to make the web a little better."}
          </h1>
          <p className={cn("mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground", ne && "font-nepali")}>
            {ne
              ? "म हरेन्द्र लम्साल हुँ — एक स्व-प्रशिक्षित वेब डेभलपर, ब्लगर र डिजिटल क्रिएटर। मैले विगत ६ वर्षदेखि नेपाल र विश्वभरका व्यवसायहरूलाई आधुनिक वेबसाइट निर्माण गर्न मद्दत गर्दै आएको छु।"
              : "I'm Harendra Lamsal — a self-taught web developer, blogger, and digital creator. For the past 6+ years I've helped businesses in Nepal and worldwide ship modern, fast websites."}
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-20 md:grid-cols-[1fr_1.6fr]">
        <Side title={ne ? "मेरो कथा" : "My story"} icon={Heart} />
        <Prose>
          {ne
            ? "मैले सुर्खेत, नेपालको एउटा सानो कोठाबाट HTML र CSS सिक्न सुरु गरें। पहिलो वेबसाइट मेरो विद्यालयको लागि — पूर्णतया मेरो कल्पना अनुसार। त्यतिखेर थाहा थिएन कि यो काम मेरो जीवनको दिशा बन्नेछ। आज, म दर्जनौं व्यवसायलाई अनलाइन ल्याउन सघाएको छु।"
            : "I started learning HTML and CSS from a tiny room in Surkhet, Nepal. My first website was for my school — entirely my own clumsy creation. I had no idea then that this would become my career. Today I've helped dozens of businesses come online, and along the way I started writing about everything I learned. The blog is, honestly, my favorite part."}
        </Prose>

        <Side title={ne ? "क्यारियर यात्रा" : "Career journey"} icon={Briefcase} />
        <ol className="relative space-y-6 border-l-2 border-accent/40 pl-6">
          {[
            { year: "2019", t: ne ? "पहिलो फ्रिल्यान्स प्रोजेक्ट" : "First freelance project", d: ne ? "सुर्खेतको स्थानीय व्यवसायको लागि WordPress साइट।" : "A WordPress site for a local Surkhet business." },
            { year: "2021", t: ne ? "पूर्णकालीन फ्रिल्यान्सर" : "Full-time freelancer", d: ne ? "नेपाल र अस्ट्रेलियाका क्लाइन्टहरूका लागि काम।" : "Working with clients across Nepal and Australia." },
            { year: "2023", t: ne ? "ब्लग सुरु" : "Started the blog", d: ne ? "अंग्रेजी र नेपाली दुवैमा लेख्न थालें।" : "Began publishing in both English and Nepali." },
            { year: "2025", t: ne ? "टिमको रूपमा बढ्दै" : "Building a small team", d: ne ? "अब छोटो टिमसँग ठूला परियोजनाहरू ल्याउँदै।" : "Now taking on larger builds with a tight collaborator network." },
          ].map((s) => (
            <li key={s.year}>
              <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-background" />
              <p className="text-xs font-bold uppercase tracking-wider text-accent">{s.year}</p>
              <p className={cn("mt-1 text-base font-semibold", ne && "font-nepali")}>{s.t}</p>
              <p className={cn("mt-1 text-sm text-muted-foreground", ne && "font-nepali")}>{s.d}</p>
            </li>
          ))}
        </ol>

        <Side title={ne ? "मिशन र भिजन" : "Mission & vision"} icon={Target} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card title={ne ? "मिशन" : "Mission"}>
            {ne
              ? "नेपाली व्यवसायहरूलाई विश्वस्तरीय वेब अनुभव दिनु — सजिलो भाषामा, उचित मूल्यमा।"
              : "Bring world-class web experiences to Nepali businesses — in plain language, at fair prices."}
          </Card>
          <Card title={ne ? "भिजन" : "Vision"}>
            {ne
              ? "नेपालबाट प्रकाशित स्रोतले विश्वभरका डेभलपरहरूलाई मद्दत गर्ने एउटा भविष्य।"
              : "A future where resources published from Nepal help developers across the world."}
          </Card>
        </div>

        <Side title={ne ? "सीप र विशेषज्ञता" : "Skills & expertise"} icon={Compass} />
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
              {s.name}
            </span>
          ))}
        </div>

        <Side title={ne ? "उपलब्धिहरू" : "Achievements"} icon={GraduationCap} />
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            ne ? "५०+ क्लाइन्ट परियोजना सम्पन्न" : "50+ client projects shipped",
            ne ? "२००+ लेख प्रकाशित" : "200+ articles published",
            ne ? "WordPress समुदायमा वक्ता" : "Speaker at WordPress meetups",
            ne ? "नेपाली ब्लग थिम 'Kavi' का सर्जक" : "Creator of 'Kavi' Nepali blog theme",
          ].map((a) => (
            <li key={a} className={cn("surface-card flex items-start gap-3 p-4", ne && "font-nepali")}>
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span className="text-sm font-medium">{a}</span>
            </li>
          ))}
        </ul>

        <Side title={ne ? "व्यक्तिगत रुचि" : "Personal interests"} icon={Heart} />
        <Prose>
          {ne
            ? "जब म कोडिङ गर्दिनँ, म पहाड चढ्न, पुस्तक पढ्न, र सुर्खेतको शान्त सन्ध्या हेर्न मन पराउँछु। चिया अनिवार्य छ।"
            : "When I'm not coding, you'll find me hiking, reading, or watching quiet evenings in Surkhet. Tea is non-negotiable."}
        </Prose>
      </section>

      <section className="container-page pb-24">
        <div className="rounded-3xl border border-border bg-surface p-8 text-center md:p-14">
          <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", ne && "font-nepali")}>
            {ne ? "साथ काम गरौं?" : "Want to work together?"}
          </h2>
          <p className={cn("mx-auto mt-3 max-w-xl text-muted-foreground", ne && "font-nepali")}>
            {ne ? "तपाईंको परियोजनाको बारेमा सुन्न मन छ।" : "I'd love to hear about your project."}
          </p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)]">
            {ne ? "सम्पर्क गर्नुहोस्" : "Get in touch"}
          </Link>
        </div>
      </section>
    </>
  );
}

function Side({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="md:sticky md:top-24 md:self-start">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
        <Icon className="h-4 w-4 text-accent" />
        <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
      </div>
    </div>
  );
}
function Prose({ children }: { children: React.ReactNode }) {
  const { lang } = useI18n();
  return <p className={cn("max-w-2xl text-base leading-relaxed text-muted-foreground", lang === "ne" && "font-nepali")}>{children}</p>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  const { lang } = useI18n();
  return (
    <div className="surface-card p-6">
      <h3 className={cn("text-base font-bold", lang === "ne" && "font-nepali")}>{title}</h3>
      <p className={cn("mt-2 text-sm leading-relaxed text-muted-foreground", lang === "ne" && "font-nepali")}>{children}</p>
    </div>
  );
}
