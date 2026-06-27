import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ne";

type Dict = Record<string, { en: string; ne: string }>;

export const dict: Dict = {
  // Nav
  "nav.about": { en: "About", ne: "मेरो बारेमा" },
  "nav.services": { en: "Services", ne: "सेवाहरू" },
  "nav.portfolio": { en: "Portfolio", ne: "पोर्टफोलियो" },
  "nav.blog": { en: "Blog", ne: "ब्लग" },
  "nav.resources": { en: "Resources", ne: "स्रोतहरू" },
  "nav.contact": { en: "Contact", ne: "सम्पर्क" },
  "nav.hire": { en: "Hire me", ne: "मलाई हायर गर्नुहोस्" },

  // Hero
  "hero.eyebrow": { en: "Website Developer · Blogger · Digital Creator", ne: "वेबसाइट डेभलपर · ब्लगर · डिजिटल क्रिएटर" },
  "hero.headline": { en: "Hi, I'm Harendra Lamsal.", ne: "नमस्ते, म हरेन्द्र लम्साल हुँ।" },
  "hero.subheadline": {
    en: "Website Developer, Blogger, and Digital Creator.",
    ne: "वेबसाइट डेभलपर, ब्लगर र डिजिटल क्रिएटर।",
  },
  "hero.description": {
    en: "I help businesses and individuals build modern websites, improve their online presence, and share practical knowledge through blogging.",
    ne: "म व्यवसाय र व्यक्तिहरूलाई आधुनिक वेबसाइट बनाउन, उनीहरूको अनलाइन उपस्थिति सुधार्न र ब्लगिङ मार्फत व्यावहारिक ज्ञान साझा गर्न मद्दत गर्छु।",
  },
  "hero.cta.portfolio": { en: "View Portfolio", ne: "पोर्टफोलियो हेर्नुहोस्" },
  "hero.cta.blog": { en: "Read Blog", ne: "ब्लग पढ्नुहोस्" },
  "hero.cta.contact": { en: "Contact Me", ne: "सम्पर्क गर्नुहोस्" },
  "hero.tagline": {
    en: "Building Websites. Sharing Knowledge. Creating Digital Experiences.",
    ne: "वेबसाइट निर्माण। ज्ञान साझेदारी। डिजिटल अनुभव सिर्जना।",
  },
  "hero.based": { en: "Based in Nepal · Available worldwide", ne: "नेपालमा आधारित · विश्वभर उपलब्ध" },

  // Sections
  "section.about.kicker": { en: "About me", ne: "मेरो बारेमा" },
  "section.about.title": { en: "Crafting the web from Nepal, for the world.", ne: "नेपालबाट विश्वका लागि वेब निर्माण।" },
  "section.about.body": {
    en: "I'm a self-taught developer who's spent the last several years shipping fast, clean websites for small businesses, creators, and schools — and writing about everything I learn along the way. My focus: thoughtful design, performant code, and content that actually helps readers.",
    ne: "म एक स्व-प्रशिक्षित डेभलपर हुँ जसले विगत केही वर्षदेखि साना व्यवसाय, क्रिएटर र विद्यालयहरूका लागि छिटो र सफा वेबसाइटहरू बनाउँदै आएको छु — र सिकेका सबै कुरा लेख्दै आएको छु। मेरो ध्यान: सोचपूर्ण डिजाइन, छिटो कोड र पाठकलाई वास्तवमै सहयोग गर्ने सामग्री।",
  },
  "section.skills.kicker": { en: "Skills", ne: "सीपहरू" },
  "section.skills.title": { en: "Tools I work with daily.", ne: "दैनिक प्रयोग गर्ने उपकरणहरू।" },
  "section.services.kicker": { en: "Services", ne: "सेवाहरू" },
  "section.services.title": { en: "How I can help you.", ne: "म तपाईंलाई कसरी सहयोग गर्न सक्छु।" },
  "section.projects.kicker": { en: "Featured work", ne: "विशेष कार्य" },
  "section.projects.title": { en: "Selected projects.", ne: "चयनित परियोजनाहरू।" },
  "section.projects.viewAll": { en: "View all projects", ne: "सबै परियोजना हेर्नुहोस्" },
  "section.blog.kicker": { en: "From the blog", ne: "ब्लगबाट" },
  "section.blog.title": { en: "Recent articles.", ne: "हालैका लेखहरू।" },
  "section.blog.readAll": { en: "Read all articles", ne: "सबै लेख पढ्नुहोस्" },
  "section.testimonials.kicker": { en: "Kind words", ne: "राम्रा शब्दहरू" },
  "section.testimonials.title": { en: "What clients say.", ne: "ग्राहकहरू के भन्छन्।" },
  "section.newsletter.kicker": { en: "Newsletter", ne: "न्युजलेटर" },
  "section.newsletter.title": { en: "Practical web tips, in your inbox.", ne: "व्यावहारिक वेब टिप्स, तपाईंको इनबक्समा।" },
  "section.newsletter.body": {
    en: "One short, useful email a week on web development, WordPress, SEO, and the tools I'm actually using. No spam, unsubscribe anytime.",
    ne: "हप्तामा एक छोटो, उपयोगी इमेल — वेब डेभलपमेन्ट, WordPress, SEO र मैले प्रयोग गर्ने उपकरणहरूको बारेमा। कुनै स्प्याम छैन।",
  },
  "section.newsletter.placeholder": { en: "your@email.com", ne: "your@email.com" },
  "section.newsletter.subscribe": { en: "Subscribe", ne: "सदस्यता लिनुहोस्" },
  "section.newsletter.success": { en: "Thanks! Please check your inbox to confirm.", ne: "धन्यवाद! कृपया पुष्टि गर्न आफ्नो इनबक्स जाँच्नुहोस्।" },
  "section.contact.kicker": { en: "Let's talk", ne: "कुरा गरौं" },
  "section.contact.title": { en: "Have a project in mind?", ne: "कुनै परियोजना छ?" },
  "section.contact.body": {
    en: "Tell me about what you're building. I read every message and reply within 24 hours.",
    ne: "तपाईंले बनाउन खोजेको कुराको बारेमा भन्नुहोस्। म प्रत्येक सन्देश पढ्छु र २४ घण्टा भित्र जवाफ दिन्छु।",
  },
  "section.contact.cta": { en: "Start a conversation", ne: "कुरा सुरु गर्नुहोस्" },

  // Footer
  "footer.quickLinks": { en: "Quick links", ne: "द्रुत लिङ्कहरू" },
  "footer.categories": { en: "Categories", ne: "श्रेणीहरू" },
  "footer.social": { en: "Follow", ne: "फलो गर्नुहोस्" },
  "footer.newsletter": { en: "Newsletter", ne: "न्युजलेटर" },
  "footer.rights": { en: "All rights reserved.", ne: "सर्वाधिकार सुरक्षित।" },
  "footer.builtIn": { en: "Built in Nepal", ne: "नेपालमा निर्मित" },

  // Common
  "common.readMore": { en: "Read more", ne: "थप पढ्नुहोस्" },
  "common.minRead": { en: "min read", ne: "मिनेट पठन" },
  "common.by": { en: "by", ne: "द्वारा" },
  "common.published": { en: "Published", ne: "प्रकाशित" },
  "common.viewProject": { en: "View project", ne: "परियोजना हेर्नुहोस्" },
  "common.caseStudy": { en: "Case study", ne: "केस स्टडी" },
  "common.liveDemo": { en: "Live demo", ne: "लाइभ डेमो" },
  "common.allCategories": { en: "All", ne: "सबै" },
  "common.search": { en: "Search articles…", ne: "लेख खोज्नुहोस्…" },
  "common.inquire": { en: "Inquire", ne: "सोध्नुहोस्" },
  "common.from": { en: "From", ne: "बाट" },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (stored === "en" || stored === "ne") setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (key: keyof typeof dict) => dict[key]?.[lang] ?? String(key);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function pick<T>(lang: Lang, en: T, ne: T): T {
  return lang === "ne" ? ne : en;
}
