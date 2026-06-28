// Seed content for Harendra Lamsal's site.
// Each item carries both English and Nepali variants.

export type Bi = { en: string; ne: string };

export interface Skill {
  name: string;
  level: number; // 0-100
  category: "Frontend" | "Backend" | "Design" | "SEO" | "Tools";
}

export const skills: Skill[] = [
  { name: "HTML", level: 98, category: "Frontend" },
  { name: "CSS", level: 95, category: "Frontend" },
  { name: "JavaScript", level: 92, category: "Frontend" },
  { name: "React", level: 88, category: "Frontend" },
  { name: "Next.js", level: 85, category: "Frontend" },
  { name: "WordPress", level: 95, category: "Backend" },
  { name: "PHP", level: 82, category: "Backend" },
  { name: "SEO", level: 90, category: "SEO" },
  { name: "Web Design", level: 88, category: "Design" },
  { name: "Website Optimization", level: 90, category: "SEO" },
  { name: "Content Strategy", level: 85, category: "SEO" },
  { name: "AI Tools", level: 87, category: "Tools" },
];

export interface Service {
  slug: string;
  title: Bi;
  description: Bi;
  benefits: Bi[];
  priceFrom: string;
  icon: string; // lucide icon name
}

export const services: Service[] = [
  {
    slug: "website-development",
    title: { en: "Website Development", ne: "वेबसाइट डेभलपमेन्ट" },
    description: {
      en: "Modern, fast, custom-built websites using React, Next.js, or WordPress — tailored to your goals.",
      ne: "तपाईंको लक्ष्य अनुरूप React, Next.js वा WordPress मा निर्मित आधुनिक र छिटो वेबसाइट।",
    },
    benefits: [
      { en: "Mobile-first responsive design", ne: "मोबाइल-फस्ट रेस्पन्सिभ डिजाइन" },
      { en: "SEO-ready from day one", ne: "पहिलो दिनदेखि SEO-तयार" },
      { en: "Core Web Vitals optimized", ne: "Core Web Vitals अनुकूलित" },
    ],
    priceFrom: "$499",
    icon: "Code2",
  },
  {
    slug: "wordpress-design",
    title: { en: "WordPress Website Design", ne: "WordPress वेबसाइट डिजाइन" },
    description: {
      en: "Beautiful, easy-to-manage WordPress sites with proper themes, plugins, and security baked in.",
      ne: "उचित थिम, प्लगइन र सुरक्षा सहितको सुन्दर र व्यवस्थापन गर्न सजिलो WordPress साइट।",
    },
    benefits: [
      { en: "Custom theme or premium starter", ne: "कस्टम थिम वा प्रिमियम स्टार्टर" },
      { en: "WooCommerce ready", ne: "WooCommerce तयार" },
      { en: "Training included", ne: "तालिम समावेश" },
    ],
    priceFrom: "$399",
    icon: "LayoutTemplate",
  },
  {
    slug: "website-redesign",
    title: { en: "Website Redesign", ne: "वेबसाइट रिडिजाइन" },
    description: {
      en: "Refresh your outdated site with a modern look, better UX, and improved conversion.",
      ne: "पुरानो साइटलाई आधुनिक रूप, राम्रो UX र सुधारिएको कन्भर्जनसहित ताजा बनाउनुहोस्।",
    },
    benefits: [
      { en: "UX audit & wireframes", ne: "UX अडिट र वायरफ्रेम" },
      { en: "Brand-aligned visual refresh", ne: "ब्रान्ड-सम्बद्ध भिजुअल रिफ्रेस" },
      { en: "Zero-downtime migration", ne: "शून्य-डाउनटाइम माइग्रेसन" },
    ],
    priceFrom: "$349",
    icon: "Wand2",
  },
  {
    slug: "seo-optimization",
    title: { en: "SEO Optimization", ne: "SEO अनुकूलन" },
    description: {
      en: "Technical, on-page, and content SEO to help your site rank and bring real organic traffic.",
      ne: "तपाईंको साइटलाई र्‍याङ्क गर्न र वास्तविक अर्ग्यानिक ट्राफिक ल्याउन प्राविधिक, अन-पेज र सामग्री SEO।",
    },
    benefits: [
      { en: "Full technical audit", ne: "पूर्ण प्राविधिक अडिट" },
      { en: "Keyword & content strategy", ne: "कीवर्ड र सामग्री रणनीति" },
      { en: "Monthly performance reports", ne: "मासिक प्रदर्शन रिपोर्ट" },
    ],
    priceFrom: "$249",
    icon: "TrendingUp",
  },
  {
    slug: "website-maintenance",
    title: { en: "Website Maintenance", ne: "वेबसाइट मर्मतसम्भार" },
    description: {
      en: "Keep your site secure, updated, backed up, and fast — every single month.",
      ne: "तपाईंको साइटलाई सुरक्षित, अद्यावधिक, ब्याकअप गरिएको र छिटो — प्रत्येक महिना।",
    },
    benefits: [
      { en: "Daily backups", ne: "दैनिक ब्याकअप" },
      { en: "Security & malware monitoring", ne: "सुरक्षा र म्यालवेयर अनुगमन" },
      { en: "Priority support", ne: "प्राथमिकता सहयोग" },
    ],
    priceFrom: "$49/mo",
    icon: "ShieldCheck",
  },
  {
    slug: "speed-optimization",
    title: { en: "Speed Optimization", ne: "गति अनुकूलन" },
    description: {
      en: "Make your site load in under 2 seconds with proven Core Web Vitals techniques.",
      ne: "प्रमाणित Core Web Vitals प्रविधिले तपाईंको साइट २ सेकेन्ड भन्दा कममा लोड गर्नुहोस्।",
    },
    benefits: [
      { en: "Image & asset optimization", ne: "तस्बिर र एसेट अनुकूलन" },
      { en: "Caching & CDN setup", ne: "क्यासिङ र CDN सेटअप" },
      { en: "Lighthouse 90+ guaranteed", ne: "Lighthouse ९०+ ग्यारेन्टी" },
    ],
    priceFrom: "$199",
    icon: "Zap",
  },
  {
    slug: "content-strategy",
    title: { en: "Content Strategy", ne: "सामग्री रणनीति" },
    description: {
      en: "Plan, write, and structure content that ranks on Google and resonates with readers.",
      ne: "Google मा र्‍याङ्क गर्ने र पाठकहरूसँग जोडिने सामग्री योजना, लेखन र संरचना।",
    },
    benefits: [
      { en: "Editorial calendar", ne: "सम्पादकीय क्यालेन्डर" },
      { en: "Topic clusters & internal links", ne: "विषय क्लस्टर र आन्तरिक लिङ्क" },
      { en: "Bilingual EN/NE content", ne: "द्विभाषी अंग्रेजी/नेपाली सामग्री" },
    ],
    priceFrom: "$299",
    icon: "PenLine",
  },
  {
    slug: "technical-consultation",
    title: { en: "Technical Consultation", ne: "प्राविधिक परामर्श" },
    description: {
      en: "1:1 consulting calls to unblock your project, audit code, or pick the right stack.",
      ne: "तपाईंको परियोजना अघि बढाउन, कोड अडिट गर्न वा सही स्ट्याक छनोट गर्न १:१ परामर्श कल।",
    },
    benefits: [
      { en: "60-min strategy call", ne: "६० मिनेट रणनीति कल" },
      { en: "Written follow-up notes", ne: "लिखित फलो-अप नोट्स" },
      { en: "Code review optional", ne: "वैकल्पिक कोड समीक्षा" },
    ],
    priceFrom: "$99/hr",
    icon: "MessageCircleQuestion",
  },
];

export type ProjectCategory =
  | "Business Websites"
  | "E-commerce"
  | "Personal Websites"
  | "School Websites"
  | "Landing Pages"
  | "WordPress Projects";

export interface Project {
  slug: string;
  name: string;
  description: Bi;
  category: ProjectCategory;
  tech: string[];
  liveUrl?: string;
  caseStudyUrl?: string;
  cover: string; // tailwind gradient class for placeholder
  year: number;
}

export const projects: Project[] = [
  {
    slug: "annapurna-traders",
    name: "Annapurna Traders",
    description: {
      en: "A modern, fast WordPress site for a Kathmandu-based wholesale business — built for trust and lead generation.",
      ne: "विश्वास र लिड जेनेरेसनको लागि बनाइएको काठमाडौंस्थित होलसेल व्यवसायको लागि आधुनिक WordPress साइट।",
    },
    category: "Business Websites",
    tech: ["WordPress", "Elementor", "SEO"],
    liveUrl: "#",
    caseStudyUrl: "#",
    cover: "from-[oklch(0.27_0.08_256)] to-[oklch(0.45_0.1_256)]",
    year: 2025,
  },
  {
    slug: "himal-mart",
    name: "Himal Mart",
    description: {
      en: "WooCommerce store with 800+ SKUs, integrated khalti payments, and a custom delivery tracker.",
      ne: "८०० भन्दा बढी SKU, खल्ती पेमेन्ट र कस्टम डेलिभरी ट्र्याकरसहितको WooCommerce स्टोर।",
    },
    category: "E-commerce",
    tech: ["WordPress", "WooCommerce", "PHP"],
    liveUrl: "#",
    caseStudyUrl: "#",
    cover: "from-[oklch(0.68_0.18_45)] to-[oklch(0.5_0.15_30)]",
    year: 2025,
  },
  {
    slug: "lamsal-portfolio",
    name: "Designer Portfolio",
    description: {
      en: "Minimal Next.js portfolio for an Australia-based designer, scoring 100 on Lighthouse across the board.",
      ne: "अस्ट्रेलिया-आधारित डिजाइनरको लागि न्यूनतम Next.js पोर्टफोलियो, Lighthouse मा १०० स्कोर।",
    },
    category: "Personal Websites",
    tech: ["Next.js", "Tailwind", "Framer Motion"],
    liveUrl: "#",
    caseStudyUrl: "#",
    cover: "from-[oklch(0.35_0.06_256)] to-[oklch(0.6_0.1_220)]",
    year: 2024,
  },
  {
    slug: "shree-jana-school",
    name: "Shree Jana School",
    description: {
      en: "Bilingual school website with notice board, syllabus downloads, and a teacher directory.",
      ne: "सूचना पाटी, पाठ्यक्रम डाउनलोड र शिक्षक डाइरेक्टरीसहितको द्विभाषी विद्यालय वेबसाइट।",
    },
    category: "School Websites",
    tech: ["WordPress", "Custom Plugin", "PHP"],
    liveUrl: "#",
    caseStudyUrl: "#",
    cover: "from-[oklch(0.5_0.1_220)] to-[oklch(0.7_0.15_180)]",
    year: 2024,
  },
  {
    slug: "trek-with-us",
    name: "Trek With Us — Landing",
    description: {
      en: "High-converting landing page for a Surkhet-based trekking company. 4.7% form conversion.",
      ne: "सुर्खेत-आधारित ट्रेकिङ कम्पनीको लागि उच्च-कन्भर्जन ल्यान्डिङ पेज। ४.७% फर्म कन्भर्जन।",
    },
    category: "Landing Pages",
    tech: ["React", "Tailwind", "Analytics"],
    liveUrl: "#",
    caseStudyUrl: "#",
    cover: "from-[oklch(0.55_0.15_30)] to-[oklch(0.72_0.18_60)]",
    year: 2025,
  },
  {
    slug: "kavi-blog",
    name: "Kavi — Nepali Blog Theme",
    description: {
      en: "Open-source WordPress theme purpose-built for Devanagari typography and Nepali bloggers.",
      ne: "देवनागरी टाइपोग्राफी र नेपाली ब्लगरहरूको लागि बनाइएको खुला-स्रोत WordPress थिम।",
    },
    category: "WordPress Projects",
    tech: ["WordPress", "PHP", "Typography"],
    liveUrl: "#",
    caseStudyUrl: "#",
    cover: "from-[oklch(0.3_0.05_256)] to-[oklch(0.55_0.12_300)]",
    year: 2024,
  },
];

export const projectCategories: ProjectCategory[] = [
  "Business Websites",
  "E-commerce",
  "Personal Websites",
  "School Websites",
  "Landing Pages",
  "WordPress Projects",
];

export type PostCategory =
  | "Website Development"
  | "WordPress"
  | "SEO"
  | "Artificial Intelligence"
  | "Blogging"
  | "Freelancing"
  | "Digital Marketing"
  | "Technology News"
  | "Tutorials"
  | "Personal Thoughts";

export interface Post {
  slug: string;
  title: Bi;
  excerpt: Bi;
  body: Bi; // markdown-ish prose
  category: PostCategory;
  tags: string[];
  date: string; // ISO
  readingMinutes: number;
  lang: "en" | "ne" | "both";
  cover: string; // tailwind gradient class
}

export const postCategories: PostCategory[] = [
  "Website Development",
  "WordPress",
  "SEO",
  "Artificial Intelligence",
  "Blogging",
  "Freelancing",
  "Digital Marketing",
  "Technology News",
  "Tutorials",
  "Personal Thoughts",
];

export const posts: Post[] = [
  {
    slug: "core-web-vitals-2026",
    title: {
      en: "Core Web Vitals in 2026: What actually moves the needle",
      ne: "२०२६ मा Core Web Vitals: वास्तवमा के काम गर्छ",
    },
    excerpt: {
      en: "A practical breakdown of LCP, INP, and CLS — with the three fixes that gave my client sites a 40% speed boost.",
      ne: "LCP, INP र CLS को व्यावहारिक विश्लेषण — र मेरा क्लाइन्ट साइटहरूलाई ४०% गति वृद्धि दिएका तीन समाधान।",
    },
    body: {
      en: "Core Web Vitals are still the single biggest free SEO lever. Here's what to focus on this year and what to stop worrying about. Start with images — they account for 60–80% of LCP issues on most sites…",
      ne: "Core Web Vitals अझै पनि सबैभन्दा ठूलो निःशुल्क SEO लेभर हो। यो वर्ष के मा ध्यान दिने र के मा चिन्ता गर्न छाड्ने…",
    },
    category: "SEO",
    tags: ["Performance", "Core Web Vitals", "Lighthouse"],
    date: "2026-06-12",
    readingMinutes: 7,
    lang: "en",
    cover: "from-[oklch(0.27_0.08_256)] to-[oklch(0.5_0.12_220)]",
  },
  {
    slug: "wordpress-block-theme-guide",
    title: {
      en: "Should you switch to a WordPress block theme?",
      ne: "के तपाईंले WordPress ब्लक थिममा सर्ने हो?",
    },
    excerpt: {
      en: "Block themes are mature, finally. Here's an honest take from a developer who's built sites on both.",
      ne: "ब्लक थिमहरू अहिले परिपक्व भएका छन्। दुवैमा साइट बनाएको डेभलपरबाट इमानदार विचार।",
    },
    body: {
      en: "After shipping a dozen sites on both classic and block themes in the last year, here's my honest comparison…",
      ne: "गत वर्ष क्लासिक र ब्लक दुवै थिममा दर्जनौं साइट बनाएपछि, यो मेरो इमानदार तुलना हो…",
    },
    category: "WordPress",
    tags: ["WordPress", "Block Themes", "Gutenberg"],
    date: "2026-05-28",
    readingMinutes: 9,
    lang: "en",
    cover: "from-[oklch(0.68_0.18_45)] to-[oklch(0.55_0.15_30)]",
  },
  {
    slug: "nepali-blog-seo-tips",
    title: {
      en: "Nepali Blog SEO: 7 mistakes I see every day",
      ne: "नेपाली ब्लग SEO: हरेक दिन देख्ने ७ गल्तीहरू",
    },
    excerpt: {
      en: "Most Nepali blogs leave 50% of their organic traffic on the table. Here's how to fix that.",
      ne: "धेरैजसो नेपाली ब्लगहरूले आफ्नो ५०% अर्ग्यानिक ट्राफिक छुटाउँछन्। यसरी सुधार्नुहोस्।",
    },
    body: {
      en: "Writing in Devanagari brings its own SEO challenges — encoding, slug handling, hreflang, and more…",
      ne: "देवनागरीमा लेख्दा आफ्नै SEO चुनौतीहरू आउँछन् — एन्कोडिङ, स्लग ह्यान्डलिङ, hreflang र अरू धेरै…",
    },
    category: "SEO",
    tags: ["Nepali", "SEO", "Devanagari"],
    date: "2026-05-14",
    readingMinutes: 6,
    lang: "both",
    cover: "from-[oklch(0.35_0.08_256)] to-[oklch(0.6_0.15_60)]",
  },
  {
    slug: "ai-tools-for-developers-2026",
    title: {
      en: "The 8 AI tools I actually use as a web developer",
      ne: "वेब डेभलपरको रूपमा मैले प्रयोग गर्ने ८ AI उपकरण",
    },
    excerpt: {
      en: "Beyond ChatGPT — here's the AI stack that's saving me 10+ hours every week.",
      ne: "ChatGPT भन्दा बाहिर — हप्तामा १०+ घण्टा बचाउने AI स्ट्याक।",
    },
    body: {
      en: "AI hype is loud, but a few tools really do change my workflow. Here's the short list, what I use each for, and what I gave up on…",
      ne: "AI को होहल्ला धेरै छ, तर केही उपकरणहरूले मेरो कार्यप्रवाह वास्तवमै परिवर्तन गर्छन्…",
    },
    category: "Artificial Intelligence",
    tags: ["AI", "Productivity", "Tools"],
    date: "2026-04-30",
    readingMinutes: 8,
    lang: "en",
    cover: "from-[oklch(0.5_0.15_300)] to-[oklch(0.7_0.18_60)]",
  },
  {
    slug: "freelancing-in-nepal",
    title: {
      en: "Freelancing from Nepal: the unvarnished truth",
      ne: "नेपालबाट फ्रिल्यान्सिङ: नचिटिक्क सत्य",
    },
    excerpt: {
      en: "Payments, taxes, finding clients, and the mindset shifts no one talks about.",
      ne: "भुक्तानी, कर, क्लाइन्ट खोज्ने, र कसैले नभन्ने मानसिकता परिवर्तन।",
    },
    body: {
      en: "I've been freelancing from Nepal for years. Here's what's gotten easier, what's still painful, and what I'd do differently…",
      ne: "मैले वर्षौंदेखि नेपालबाट फ्रिल्यान्सिङ गरिरहेको छु। यो सजिलो भएको छ, यो अझै गाह्रो छ, र मैले फरक तरिकाले के गर्थें…",
    },
    category: "Freelancing",
    tags: ["Freelancing", "Nepal", "Business"],
    date: "2026-04-08",
    readingMinutes: 11,
    lang: "both",
    cover: "from-[oklch(0.4_0.08_256)] to-[oklch(0.65_0.18_45)]",
  },
  {
    slug: "starting-a-blog-2026",
    title: {
      en: "How to start a blog in 2026 (and actually keep writing)",
      ne: "२०२६ मा ब्लग कसरी सुरु गर्ने (र लेखिरहने)",
    },
    excerpt: {
      en: "Platform, niche, publishing cadence, and the one habit that keeps most bloggers going.",
      ne: "प्लेटफर्म, निच, प्रकाशन गति, र धेरैजसो ब्लगरलाई जारी राख्ने एक बानी।",
    },
    body: {
      en: "Starting is easy. Continuing is the hard part. Here's the lightweight system that's kept me publishing for years…",
      ne: "सुरु गर्न सजिलो छ। जारी राख्न गाह्रो छ। मलाई वर्षौंदेखि प्रकाशन गराइरहेको हल्का प्रणाली…",
    },
    category: "Blogging",
    tags: ["Blogging", "Writing", "Habits"],
    date: "2026-03-22",
    readingMinutes: 6,
    lang: "en",
    cover: "from-[oklch(0.32_0.06_256)] to-[oklch(0.55_0.1_220)]",
  },
];

export interface Testimonial {
  name: string;
  role: Bi;
  quote: Bi;
  initial: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Sushma Karki",
    role: { en: "Founder, Annapurna Traders", ne: "संस्थापक, अन्नपूर्ण ट्रेडर्स" },
    quote: {
      en: "Harendra rebuilt our entire site in two weeks. We've doubled our inbound leads — and I can actually update the site myself now.",
      ne: "हरेन्द्रले हाम्रो पूरै साइट दुई हप्तामा फेरि बनाउनुभयो। हाम्रा इन्बाउन्ड लिडहरू दोब्बर भएका छन् — र म आफैंले साइट अपडेट गर्न सक्छु।",
    },
    initial: "SK",
  },
  {
    name: "Mark Davies",
    role: { en: "Independent Designer, Sydney", ne: "स्वतन्त्र डिजाइनर, सिड्नी" },
    quote: {
      en: "Best Next.js developer I've worked with. Communicated clearly, delivered ahead of schedule, and the Lighthouse score is perfect.",
      ne: "मैले काम गरेका मध्ये सबैभन्दा राम्रो Next.js डेभलपर। स्पष्ट सञ्चार, समय अघि नै काम पूरा, र Lighthouse स्कोर पनि सही।",
    },
    initial: "MD",
  },
  {
    name: "Bishnu Adhikari",
    role: { en: "Principal, Shree Jana School", ne: "प्रधानाध्यापक, श्री जना विद्यालय" },
    quote: {
      en: "He understood exactly what a school needs — simple to manage, fast on slow connections, and bilingual. Highly recommended.",
      ne: "उहाँले विद्यालयलाई के चाहिन्छ ठ्याक्कै बुझ्नुभयो — व्यवस्थापन गर्न सजिलो, सुस्त इन्टरनेटमा छिटो, र द्विभाषी।",
    },
    initial: "BA",
  },
];

export interface ResourceItem {
  name: string;
  description: Bi;
  url: string;
}

export interface ResourceGroup {
  title: Bi;
  items: ResourceItem[];
}

export const resourceGroups: ResourceGroup[] = [
  {
    title: { en: "Free Tools", ne: "निःशुल्क उपकरणहरू" },
    items: [
      {
        name: "Google PageSpeed Insights",
        description: {
          en: "Audit Core Web Vitals for any URL.",
          ne: "कुनै पनि URL को Core Web Vitals अडिट।",
        },
        url: "https://pagespeed.web.dev",
      },
      {
        name: "Squoosh",
        description: {
          en: "Browser-based image compression.",
          ne: "ब्राउजर-आधारित तस्बिर कम्प्रेसन।",
        },
        url: "https://squoosh.app",
      },
      {
        name: "Excalidraw",
        description: { en: "Quick wireframes & diagrams.", ne: "द्रुत वायरफ्रेम र चित्रहरू।" },
        url: "https://excalidraw.com",
      },
    ],
  },
  {
    title: { en: "Recommended Hosting", ne: "सिफारिस गरिएको होस्टिङ" },
    items: [
      {
        name: "Hostinger",
        description: {
          en: "Great budget WordPress hosting.",
          ne: "उत्कृष्ट बजेट WordPress होस्टिङ।",
        },
        url: "https://www.hostinger.com",
      },
      {
        name: "Cloudways",
        description: {
          en: "Managed VPS for serious sites.",
          ne: "गम्भीर साइटहरूका लागि व्यवस्थित VPS।",
        },
        url: "https://www.cloudways.com",
      },
      {
        name: "Vercel",
        description: { en: "Best-in-class for Next.js.", ne: "Next.js का लागि उत्कृष्ट।" },
        url: "https://vercel.com",
      },
    ],
  },
  {
    title: { en: "WordPress Resources", ne: "WordPress स्रोतहरू" },
    items: [
      {
        name: "Rank Math",
        description: { en: "Full-featured SEO plugin.", ne: "पूर्ण-सुविधा युक्त SEO प्लगइन।" },
        url: "https://rankmath.com",
      },
      {
        name: "WP Rocket",
        description: { en: "Caching that actually works.", ne: "वास्तवमै काम गर्ने क्यासिङ।" },
        url: "https://wp-rocket.me",
      },
      {
        name: "Elementor",
        description: { en: "Drag-and-drop page builder.", ne: "ड्र्याग-एन्ड-ड्रप पेज बिल्डर।" },
        url: "https://elementor.com",
      },
    ],
  },
  {
    title: { en: "SEO Resources", ne: "SEO स्रोतहरू" },
    items: [
      {
        name: "Ahrefs Blog",
        description: {
          en: "Deep, data-driven SEO articles.",
          ne: "गहिरो, डेटा-आधारित SEO लेखहरू।",
        },
        url: "https://ahrefs.com/blog",
      },
      {
        name: "Google Search Central",
        description: { en: "Straight from the source.", ne: "स्रोतबाटै सीधै।" },
        url: "https://developers.google.com/search",
      },
      {
        name: "Backlinko",
        description: { en: "Actionable SEO playbooks.", ne: "कार्ययोग्य SEO प्लेबुक।" },
        url: "https://backlinko.com",
      },
    ],
  },
  {
    title: { en: "Development Resources", ne: "डेभलपमेन्ट स्रोतहरू" },
    items: [
      {
        name: "MDN Web Docs",
        description: { en: "The web platform reference.", ne: "वेब प्लेटफर्म सन्दर्भ।" },
        url: "https://developer.mozilla.org",
      },
      {
        name: "web.dev",
        description: { en: "Google's modern web guide.", ne: "Google को आधुनिक वेब गाइड।" },
        url: "https://web.dev",
      },
      {
        name: "GitHub",
        description: { en: "Where code lives.", ne: "जहाँ कोड बस्छ।" },
        url: "https://github.com",
      },
    ],
  },
  {
    title: { en: "AI Tools", ne: "AI उपकरणहरू" },
    items: [
      {
        name: "ChatGPT",
        description: { en: "Workhorse general-purpose assistant.", ne: "सामान्य-उद्देश्य सहायक।" },
        url: "https://chat.openai.com",
      },
      {
        name: "Claude",
        description: { en: "Long-context writing partner.", ne: "लामो-सन्दर्भ लेखन साथी।" },
        url: "https://claude.ai",
      },
      {
        name: "Cursor",
        description: { en: "AI-first code editor.", ne: "AI-पहिलो कोड सम्पादक।" },
        url: "https://cursor.com",
      },
    ],
  },
];
