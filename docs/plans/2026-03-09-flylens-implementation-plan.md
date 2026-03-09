# Flylens Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a professional bilingual (NL/EN) website for Flylens drone stock videography business with portfolio, client work showcase, and contact functionality.

**Architecture:** Next.js 14 App Router with `[locale]` dynamic segment for i18n via next-intl. Sanity CMS for portfolio and client work content. Mux for protected video hosting with signed URLs and watermarks. Static pages (about, homepage) hardcoded. Contact form via server action + email service.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, next-intl, Sanity, Mux, Resend (email), Vercel

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- Create: `app/globals.css`
- Create: `.env.local.example`
- Create: `.gitignore`

**Step 1: Initialize Next.js project**

```bash
cd /Users/runewittevrongel/Documents/programmeren/flylens
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

Select: Yes to all defaults. This creates the base Next.js project with Tailwind.

**Step 2: Install dependencies**

```bash
npm install next-intl @sanity/client next-sanity @mux/mux-player-react @mux/mux-node resend
npm install -D @types/node
```

**Step 3: Create `.env.local.example`**

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Mux
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_SIGNING_KEY_ID=
MUX_SIGNING_KEY_PRIVATE=

# Resend
RESEND_API_KEY=

# Contact form recipient
CONTACT_EMAIL=
```

**Step 4: Configure Tailwind with brand colors**

Update `tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#02172D",
        accent: "#33C6F2",
        "accent-hover": "#2AB0D9",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 5: Set up global CSS**

Update `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  background-color: #02172D;
  color: #ffffff;
}

/* Disable right-click on video elements */
.video-protected {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
```

**Step 6: Move logo files to public**

```bash
cp -r logo/ public/logo/
```

**Step 7: Init git and commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind and dependencies"
```

---

## Task 2: Internationalization Setup (next-intl)

**Files:**
- Create: `src/i18n/request.ts`
- Create: `src/i18n/routing.ts`
- Create: `messages/en.json`
- Create: `messages/nl.json`
- Create: `middleware.ts`
- Modify: `next.config.ts`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`

**Step 1: Create i18n routing config**

Create `src/i18n/routing.ts`:
```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
});
```

**Step 2: Create i18n request config**

Create `src/i18n/request.ts`:
```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "nl" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

**Step 3: Create middleware**

Create `middleware.ts` (project root):
```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|logo|.*\\..*).*)"],
};
```

**Step 4: Update next.config.ts**

```ts
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "image.mux.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
```

**Step 5: Create base translation files**

Create `messages/nl.json`:
```json
{
  "nav": {
    "home": "Home",
    "portfolio": "Portfolio",
    "clientWork": "Klantenwerk",
    "about": "Over ons",
    "contact": "Contact"
  },
  "home": {
    "slogan": "A new angle on the world",
    "heroSubtitle": "Professionele drone stock videografie",
    "stockPlatforms": "Bekijk onze video's op",
    "viewPortfolio": "Bekijk portfolio",
    "contactUs": "Neem contact op"
  },
  "portfolio": {
    "title": "Portfolio",
    "subtitle": "Een selectie van onze drone videografie",
    "noVideos": "Binnenkort meer video's beschikbaar."
  },
  "clientWork": {
    "title": "Klantenwerk",
    "subtitle": "Projecten die we voor klanten hebben gerealiseerd",
    "comingSoon": "Binnenkort beschikbaar",
    "comingSoonText": "We werken aan onze eerste klantenprojecten. Neem contact op als u geïnteresseerd bent in onze diensten."
  },
  "about": {
    "title": "Over Flylens",
    "subtitle": "De piloot achter de lens"
  },
  "contact": {
    "title": "Contact",
    "subtitle": "Neem contact met ons op",
    "name": "Naam",
    "email": "E-mail",
    "message": "Bericht",
    "send": "Verstuur",
    "success": "Bericht succesvol verstuurd!",
    "error": "Er is iets misgegaan. Probeer het later opnieuw."
  },
  "footer": {
    "rights": "Alle rechten voorbehouden",
    "stockPlatforms": "Stock platforms",
    "followUs": "Volg ons"
  }
}
```

Create `messages/en.json`:
```json
{
  "nav": {
    "home": "Home",
    "portfolio": "Portfolio",
    "clientWork": "Client Work",
    "about": "About",
    "contact": "Contact"
  },
  "home": {
    "slogan": "A new angle on the world",
    "heroSubtitle": "Professional drone stock videography",
    "stockPlatforms": "Watch our videos on",
    "viewPortfolio": "View portfolio",
    "contactUs": "Get in touch"
  },
  "portfolio": {
    "title": "Portfolio",
    "subtitle": "A selection of our drone videography",
    "noVideos": "More videos coming soon."
  },
  "clientWork": {
    "title": "Client Work",
    "subtitle": "Projects we have delivered for clients",
    "comingSoon": "Coming soon",
    "comingSoonText": "We are working on our first client projects. Get in touch if you are interested in our services."
  },
  "about": {
    "title": "About Flylens",
    "subtitle": "The pilot behind the lens"
  },
  "contact": {
    "title": "Contact",
    "subtitle": "Get in touch with us",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "send": "Send",
    "success": "Message sent successfully!",
    "error": "Something went wrong. Please try again later."
  },
  "footer": {
    "rights": "All rights reserved",
    "stockPlatforms": "Stock platforms",
    "followUs": "Follow us"
  }
}
```

**Step 6: Create locale layout**

Create `src/app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "nl" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-primary text-white min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Step 7: Create placeholder home page**

Create `src/app/[locale]/page.tsx`:
```tsx
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-accent">{t("slogan")}</h1>
    </div>
  );
}
```

**Step 8: Remove default src/app/page.tsx and layout.tsx**

Delete the files that were in `src/app/` (not under `[locale]`) to avoid conflicts.

**Step 9: Run dev server and verify**

```bash
npm run dev
```

Visit `http://localhost:3000` - should redirect to `/nl` and show slogan.
Visit `http://localhost:3000/en` - should show English.

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: add next-intl i18n setup with NL/EN translations"
```

---

## Task 3: Layout Components (Navbar + Footer)

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/LanguageSwitcher.tsx`

**Step 1: Create LanguageSwitcher**

Create `src/components/layout/LanguageSwitcher.tsx`:
```tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => switchLocale("nl")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "nl"
            ? "bg-accent text-primary font-semibold"
            : "text-gray-400 hover:text-white"
        }`}
      >
        NL
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "en"
            ? "bg-accent text-primary font-semibold"
            : "text-gray-400 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
```

**Step 2: Create Navbar**

Create `src/components/layout/Navbar.tsx`:
```tsx
"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/portfolio`, label: t("portfolio") },
    { href: `/${locale}/client-work`, label: t("clientWork") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="/logo/logo zonder slogan/wit zonder slogan.png"
              alt="Flylens"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-accent transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-gray-300 hover:text-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

**Step 3: Create Footer**

Create `src/components/layout/Footer.tsx`:
```tsx
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

const stockPlatforms = [
  { name: "Shutterstock", url: "https://submit.shutterstock.com/nl/FlyLens" },
  { name: "Adobe Stock", url: "https://stock.adobe.com/contributor/211750229/FlyLens" },
  { name: "Pond5", url: "https://www.pond5.com/nl/artist/flylensw180" },
  { name: "Dreamstime", url: "https://nl.dreamstime.com/flylensw_info" },
];

const socials = [
  { name: "Instagram", url: "https://www.instagram.com/flylensw/", icon: "instagram" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/wout-wybo-253860367/", icon: "linkedin" },
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-primary border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/logo/logo zonder slogan/wit zonder slogan.png"
              alt="Flylens"
              width={150}
              height={50}
              className="h-10 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm">A new angle on the world</p>
          </div>

          {/* Stock Platforms */}
          <div>
            <h3 className="text-sm font-semibold text-accent mb-4">{t("stockPlatforms")}</h3>
            <ul className="space-y-2">
              {stockPlatforms.map((platform) => (
                <li key={platform.name}>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {platform.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-accent mb-4">{t("followUs")}</h3>
            <ul className="space-y-2">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Flylens. {t("rights")}.
        </div>
      </div>
    </footer>
  );
}
```

**Step 4: Verify layout renders**

```bash
npm run dev
```

Check navbar displays with logo, nav links, language switcher. Check footer shows stock platforms and social links. Test mobile hamburger menu.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Navbar, Footer, and LanguageSwitcher components"
```

---

## Task 4: Homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/StockPlatforms.tsx`

**Step 1: Create HeroSection**

Create `src/components/home/HeroSection.tsx`:
```tsx
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/70 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <Image
          src="/logo/logo met slogan/wit met slogan.png"
          alt="Flylens - A new angle on the world"
          width={400}
          height={200}
          className="mx-auto mb-8 w-64 sm:w-80 md:w-96 h-auto"
          priority
        />
        <p className="text-lg sm:text-xl text-gray-300 mb-10">
          {t("heroSubtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/portfolio`}
            className="px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-hover transition-colors"
          >
            {t("viewPortfolio")}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="px-8 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors"
          >
            {t("contactUs")}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Create StockPlatforms section**

Create `src/components/home/StockPlatforms.tsx`:
```tsx
import { useTranslations } from "next-intl";

const platforms = [
  {
    name: "Shutterstock",
    url: "https://submit.shutterstock.com/nl/FlyLens",
    description: "Stock video marketplace",
  },
  {
    name: "Adobe Stock",
    url: "https://stock.adobe.com/contributor/211750229/FlyLens",
    description: "Creative asset marketplace",
  },
  {
    name: "Pond5",
    url: "https://www.pond5.com/nl/artist/flylensw180",
    description: "Video & media marketplace",
  },
  {
    name: "Dreamstime",
    url: "https://nl.dreamstime.com/flylensw_info",
    description: "Stock photography & video",
  },
];

export default function StockPlatforms() {
  const t = useTranslations("home");

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          {t("stockPlatforms")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-accent/50 hover:bg-accent/5 transition-all"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
                {platform.name}
              </h3>
              <p className="text-gray-400 text-sm mt-2">{platform.description}</p>
              <span className="inline-block mt-4 text-accent text-sm font-medium">
                &rarr;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Update homepage**

Update `src/app/[locale]/page.tsx`:
```tsx
import HeroSection from "@/components/home/HeroSection";
import StockPlatforms from "@/components/home/StockPlatforms";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StockPlatforms />
    </>
  );
}
```

**Step 4: Add metadata**

Create `src/app/[locale]/metadata.ts` or add to page:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flylens - A New Angle on the World",
  description: "Professional drone stock videography by Flylens. Aerial landscapes and cinematic footage available on Shutterstock, Adobe Stock, Pond5, and Dreamstime.",
};
```

**Step 5: Verify and commit**

```bash
npm run dev
```

Check hero section with logo, CTA buttons, stock platform cards.

```bash
git add -A
git commit -m "feat: add homepage with hero section and stock platform links"
```

---

## Task 5: Sanity CMS Setup

**Files:**
- Create: `src/lib/sanity/client.ts`
- Create: `src/lib/sanity/schemas/portfolio.ts`
- Create: `src/lib/sanity/schemas/clientWork.ts`
- Create: `src/lib/sanity/schemas/index.ts`
- Create: `sanity.config.ts`
- Create: `sanity.cli.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`

**Step 1: Install Sanity Studio dependencies**

```bash
npm install sanity @sanity/vision styled-components
```

**Step 2: Create a Sanity project**

Go to https://www.sanity.io/manage and create a new project called "flylens". Note the project ID.

**Step 3: Create Sanity client**

Create `src/lib/sanity/client.ts`:
```ts
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
```

**Step 4: Create portfolio schema**

Create `src/lib/sanity/schemas/portfolio.ts`:
```ts
import { defineType, defineField } from "sanity";

export const portfolio = defineType({
  name: "portfolio",
  title: "Portfolio",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
    }),
    defineField({
      name: "muxPlaybackId",
      title: "Mux Playback ID",
      type: "string",
      description: "The Mux playback ID for the video preview",
    }),
    defineField({
      name: "thumbnailUrl",
      title: "Thumbnail URL",
      type: "url",
      description: "Mux thumbnail URL (auto-generated from playback ID)",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
```

**Step 5: Create client work schema**

Create `src/lib/sanity/schemas/clientWork.ts`:
```ts
import { defineType, defineField } from "sanity";

export const clientWork = defineType({
  name: "clientWork",
  title: "Client Work",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "nl", title: "Nederlands", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
    }),
    defineField({
      name: "muxPlaybackId",
      title: "Mux Playback ID",
      type: "string",
      description: "Optional: Mux playback ID for project video",
    }),
    defineField({
      name: "images",
      title: "Project Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Project Date",
      type: "date",
    }),
  ],
  orderings: [
    {
      title: "Date, New",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
```

**Step 6: Create schema index**

Create `src/lib/sanity/schemas/index.ts`:
```ts
import { portfolio } from "./portfolio";
import { clientWork } from "./clientWork";

export const schemaTypes = [portfolio, clientWork];
```

**Step 7: Create Sanity config**

Create `sanity.config.ts`:
```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/lib/sanity/schemas";

export default defineConfig({
  name: "flylens",
  title: "Flylens CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
```

**Step 8: Create Studio route**

Create `src/app/studio/[[...tool]]/page.tsx`:
```tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Sanity CMS with portfolio and client work schemas"
```

---

## Task 6: Mux Video Integration

**Files:**
- Create: `src/lib/mux.ts`
- Create: `src/components/video/ProtectedVideoPlayer.tsx`
- Create: `src/app/api/mux/sign/route.ts`

**Step 1: Create Mux client**

Create `src/lib/mux.ts`:
```ts
import Mux from "@mux/mux-node";

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export function getSignedPlaybackUrl(playbackId: string): string {
  const token = Mux.JWT.signPlaybackId(playbackId, {
    keyId: process.env.MUX_SIGNING_KEY_ID!,
    keySecret: process.env.MUX_SIGNING_KEY_PRIVATE!,
    type: "video",
    expiration: "1h",
  });
  return token;
}

export function getSignedThumbnailUrl(playbackId: string): string {
  const token = Mux.JWT.signPlaybackId(playbackId, {
    keyId: process.env.MUX_SIGNING_KEY_ID!,
    keySecret: process.env.MUX_SIGNING_KEY_PRIVATE!,
    type: "thumbnail",
    expiration: "1h",
  });
  return `https://image.mux.com/${playbackId}/thumbnail.webp?token=${token}`;
}
```

**Step 2: Create signing API route**

Create `src/app/api/mux/sign/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { getSignedPlaybackUrl } from "@/lib/mux";

export async function POST(request: NextRequest) {
  const { playbackId } = await request.json();

  if (!playbackId) {
    return NextResponse.json({ error: "Missing playbackId" }, { status: 400 });
  }

  const token = getSignedPlaybackUrl(playbackId);

  return NextResponse.json({ token });
}
```

**Step 3: Create ProtectedVideoPlayer**

Create `src/components/video/ProtectedVideoPlayer.tsx`:
```tsx
"use client";

import MuxPlayer from "@mux/mux-player-react";

interface ProtectedVideoPlayerProps {
  playbackId: string;
  token: string;
  title?: string;
  poster?: string;
}

export default function ProtectedVideoPlayer({
  playbackId,
  token,
  title,
  poster,
}: ProtectedVideoPlayerProps) {
  return (
    <div
      className="video-protected relative rounded-lg overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <MuxPlayer
        playbackId={playbackId}
        tokens={{ playback: token }}
        metadata={{ video_title: title }}
        poster={poster}
        streamType="on-demand"
        accentColor="#33C6F2"
        style={{ aspectRatio: "16/9", width: "100%" }}
        maxResolution="1080p"
      />
      {/* Watermark overlay */}
      <div className="absolute top-4 right-4 pointer-events-none opacity-50 z-10">
        <span className="text-white text-sm font-semibold tracking-wider bg-black/30 px-2 py-1 rounded">
          FLYLENS
        </span>
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Mux video integration with signed URLs and watermark"
```

---

## Task 7: Portfolio Page

**Files:**
- Create: `src/app/[locale]/portfolio/page.tsx`
- Create: `src/components/portfolio/PortfolioGrid.tsx`
- Create: `src/components/portfolio/PortfolioCard.tsx`

**Step 1: Create PortfolioCard**

Create `src/components/portfolio/PortfolioCard.tsx`:
```tsx
"use client";

import { useState } from "react";
import ProtectedVideoPlayer from "@/components/video/ProtectedVideoPlayer";
import Image from "next/image";

interface PortfolioCardProps {
  title: string;
  description: string;
  playbackId: string;
  token: string;
  thumbnailUrl: string;
  tags: string[];
}

export default function PortfolioCard({
  title,
  description,
  playbackId,
  token,
  thumbnailUrl,
  tags,
}: PortfolioCardProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-accent/30 transition-all">
      {playing ? (
        <ProtectedVideoPlayer
          playbackId={playbackId}
          token={token}
          title={title}
          poster={thumbnailUrl}
        />
      ) : (
        <div
          className="relative aspect-video cursor-pointer"
          onClick={() => setPlaying(true)}
        >
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
            <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create PortfolioGrid**

Create `src/components/portfolio/PortfolioGrid.tsx`:
```tsx
import PortfolioCard from "./PortfolioCard";

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  muxPlaybackId: string;
  token: string;
  thumbnailUrl: string;
  tags: string[];
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  noVideosText: string;
}

export default function PortfolioGrid({ items, noVideosText }: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">{noVideosText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <PortfolioCard
          key={item._id}
          title={item.title}
          description={item.description}
          playbackId={item.muxPlaybackId}
          token={item.token}
          thumbnailUrl={item.thumbnailUrl}
          tags={item.tags}
        />
      ))}
    </div>
  );
}
```

**Step 3: Create Portfolio page**

Create `src/app/[locale]/portfolio/page.tsx`:
```tsx
import { getTranslations } from "next-intl/server";
import { sanityClient } from "@/lib/sanity/client";
import { getSignedPlaybackUrl, getSignedThumbnailUrl } from "@/lib/mux";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";

async function getPortfolioItems(locale: string) {
  const items = await sanityClient.fetch(
    `*[_type == "portfolio"] | order(order asc) {
      _id,
      "title": title.${locale},
      "description": description.${locale},
      muxPlaybackId,
      tags,
      order
    }`
  );

  return items.map((item: { _id: string; title: string; description: string; muxPlaybackId: string; tags: string[] }) => ({
    ...item,
    token: getSignedPlaybackUrl(item.muxPlaybackId),
    thumbnailUrl: getSignedThumbnailUrl(item.muxPlaybackId),
  }));
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("portfolio");
  const items = await getPortfolioItems(locale);

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>
        <PortfolioGrid items={items} noVideosText={t("noVideos")} />
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add portfolio page with protected video grid"
```

---

## Task 8: Client Work Page

**Files:**
- Create: `src/app/[locale]/client-work/page.tsx`

**Step 1: Create Client Work page**

Create `src/app/[locale]/client-work/page.tsx`:
```tsx
import { getTranslations } from "next-intl/server";
import { sanityClient } from "@/lib/sanity/client";
import { getSignedPlaybackUrl, getSignedThumbnailUrl } from "@/lib/mux";
import Image from "next/image";
import ProtectedVideoPlayer from "@/components/video/ProtectedVideoPlayer";

async function getClientWorkItems(locale: string) {
  const items = await sanityClient.fetch(
    `*[_type == "clientWork"] | order(date desc) {
      _id,
      "title": title.${locale},
      "description": description.${locale},
      muxPlaybackId,
      clientName,
      date,
      "images": images[].asset->url
    }`
  );

  return items.map((item: { _id: string; title: string; description: string; muxPlaybackId?: string; clientName: string; date: string; images: string[] }) => ({
    ...item,
    token: item.muxPlaybackId ? getSignedPlaybackUrl(item.muxPlaybackId) : null,
    thumbnailUrl: item.muxPlaybackId ? getSignedThumbnailUrl(item.muxPlaybackId) : null,
  }));
}

export default async function ClientWorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("clientWork");
  const items = await getClientWorkItems(locale);

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-gray-400 text-lg mb-12">{t("subtitle")}</p>
          <div className="max-w-md mx-auto p-8 rounded-xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold text-accent mb-4">{t("comingSoon")}</h2>
            <p className="text-gray-400">{t("comingSoonText")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>
        <div className="space-y-16">
          {items.map((item: { _id: string; title: string; description: string; muxPlaybackId?: string; token?: string; thumbnailUrl?: string; clientName: string; date: string; images?: string[] }) => (
            <article key={item._id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              {item.muxPlaybackId && item.token && (
                <ProtectedVideoPlayer
                  playbackId={item.muxPlaybackId}
                  token={item.token}
                  title={item.title}
                  poster={item.thumbnailUrl || undefined}
                />
              )}
              {item.images && item.images.length > 0 && !item.muxPlaybackId && (
                <div className="relative aspect-video">
                  <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  {item.clientName && (
                    <span className="text-sm text-accent">{item.clientName}</span>
                  )}
                </div>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add client work page with coming soon state"
```

---

## Task 9: About Page

**Files:**
- Create: `src/app/[locale]/about/page.tsx`

**Step 1: Create About page**

Create `src/app/[locale]/about/page.tsx`:
```tsx
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Photo placeholder - replace with actual photo */}
          <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
            <Image
              src="/logo/icoon/kleur icoon met bg.png"
              alt="Flylens"
              width={300}
              height={300}
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Bio text - hardcoded, developer managed */}
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              {/* TODO: Replace with actual about text */}
              Flylens is a professional drone videography company specializing in
              capturing stunning aerial footage of landscapes, nature, and
              architecture. Our footage is available on major stock platforms
              worldwide.
            </p>
            <p className="text-gray-300 leading-relaxed">
              With a passion for aerial cinematography and an eye for
              composition, we deliver high-quality 4K footage that brings a new
              perspective to every scene.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add about page with placeholder content"
```

---

## Task 10: Contact Page with Form

**Files:**
- Create: `src/app/[locale]/contact/page.tsx`
- Create: `src/components/contact/ContactForm.tsx`
- Create: `src/app/api/contact/route.ts`

**Step 1: Create contact API route**

Create `src/app/api/contact/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "Flylens Website <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `Nieuw contactbericht van ${name}`,
      replyTo: email,
      text: `Naam: ${name}\nEmail: ${email}\n\nBericht:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
```

**Step 2: Create ContactForm component**

Create `src/components/contact/ContactForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          {t("name")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          {t("email")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "..." : t("send")}
      </button>
      {status === "success" && (
        <p className="text-green-400 text-center">{t("success")}</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-center">{t("error")}</p>
      )}
    </form>
  );
}
```

**Step 3: Create Contact page**

Create `src/app/[locale]/contact/page.tsx`:
```tsx
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>
        <div className="p-8 rounded-xl border border-white/10 bg-white/5">
          <ContactForm />
        </div>
        <div className="mt-8 text-center space-y-2">
          <a
            href="https://www.instagram.com/flylensw/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline block"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/wout-wybo-253860367/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline block"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add contact page with form and Resend email integration"
```

---

## Task 11: SEO & Metadata

**Files:**
- Modify: `src/app/[locale]/layout.tsx` (add metadata)
- Modify: each page file (add generateMetadata)

**Step 1: Add metadata generation to layout**

Add to `src/app/[locale]/layout.tsx`:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Flylens",
    default: "Flylens - A New Angle on the World",
  },
  description: "Professional drone stock videography by Flylens.",
  openGraph: {
    type: "website",
    siteName: "Flylens",
  },
};
```

**Step 2: Add metadata to each page**

Each page should export metadata or generateMetadata with appropriate title/description for that page.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add SEO metadata to all pages"
```

---

## Task 12: Final Polish & Testing

**Step 1: Run build**

```bash
npm run build
```

Fix any TypeScript or build errors.

**Step 2: Test all pages**

```bash
npm run dev
```

Verify:
- [ ] Homepage renders with hero, stock platform links
- [ ] Language switch works (NL/EN)
- [ ] Portfolio page loads (empty state if no Sanity data)
- [ ] Client work page shows "coming soon"
- [ ] About page renders
- [ ] Contact form submits (test with Resend)
- [ ] Navbar works on mobile
- [ ] Footer links are correct
- [ ] Video player shows watermark and blocks right-click

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: fix build errors and polish UI"
```
