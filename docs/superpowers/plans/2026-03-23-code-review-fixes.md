# Flylens Code Review Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 17 issues identified in the Flylens website code review, improving performance, security, i18n, code quality, and SEO.

**Architecture:** 5 independent agent groups that can be executed in parallel. Each group touches non-overlapping files. Conflict zones have been resolved by merging Groups 2+3 into a single agent and absorbing small overlapping tasks.

**Tech Stack:** Next.js 16, React 19, next-intl 4, Tailwind CSS 3, Sanity, Cloudflare R2, Resend, framer-motion 12

---

## Agent A: Performance — Static Rendering & Imports (Issues #3, #4, #5, #13, #17)

**Files touched:** All components with `dynamic()` imports, `src/app/[locale]/page.tsx`, `src/components/home/HeroSection.tsx`, `src/components/layout/Navbar.tsx`

**IMPORTANT execution order:** Task A1 and A2 both modify `HeroSection.tsx` and `page.tsx`. Execute A1 first, then A2 (which will read the already-modified files), then A3.

### Task A1: Move Hero Image Randomization Client-Side (Issue #3)

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/home/HeroSection.tsx`

The home page uses `noStore()` to force dynamic rendering for random hero image selection. This kills SSG. Fix: move randomization into the HeroSection client component (it already uses `useTranslations` which is a client hook in this context).

- [ ] **Step 1: Add `"use client"` directive and randomization to `HeroSection.tsx`**

In `src/components/home/HeroSection.tsx`:
1. Add `"use client";` as the very first line of the file
2. Add `useState` and `useEffect` to the react import: `import { useState, useEffect } from "react";`
3. Add the heroImages array at module level (before the component function):
   ```tsx
   const heroImages = Array.from({ length: 13 }, (_, i) => `/images/hero/hero-${i}.jpg`);
   ```
4. Remove the `heroImage` prop — change the function signature from `{ heroImage?: string }` to `{}`  (no props), i.e., `export default function HeroSection() {`
5. Inside the component body (before the return), add:
   ```tsx
   const [heroImage, setHeroImage] = useState(heroImages[0]);
   useEffect(() => {
     setHeroImage(heroImages[Math.floor(Math.random() * heroImages.length)]);
   }, []);
   ```
6. The existing `src={heroImage || "/images/hero.jpg"}` can be simplified to just `src={heroImage}` since it will always have a value now.

- [ ] **Step 2: Also fix the hero image alt text (Issue #17)**

While in `HeroSection.tsx`, change the hero `<Image>` `alt` from `alt=""` to use the translation system. Add a translation key call:
```tsx
alt={t("heroAlt")}
```
The `t` function (`useTranslations("home")`) is already available in this component.

**Note for Group D agent:** The corresponding translation keys `"heroAlt"` must be added to `messages/en.json` and `messages/nl.json` under the `"home"` section. Add:
- `en.json`: `"heroAlt": "Aerial drone footage by Flylens"`
- `nl.json`: `"heroAlt": "Luchtopnames door Flylens"`

- [ ] **Step 3: Clean up `page.tsx`**

In `src/app/[locale]/page.tsx`:
1. Remove `import { unstable_noStore as noStore } from "next/cache";`
2. Remove the `noStore();` call (line 26)
3. Remove `const heroImages = Array.from(...)` (line 17)
4. Remove `const heroImage = heroImages[...]` (line 27)
5. Change `<HeroSection heroImage={heroImage} />` to `<HeroSection />`

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds. Home page should show as static (circle icon) in build output, not dynamic (lambda).

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/page.tsx src/components/home/HeroSection.tsx
git commit -m "perf: move hero image randomization client-side to enable SSG

Also adds internationalized alt text to hero image (Issue #17)."
```

### Task A2: Remove All Unnecessary `dynamic()` Imports (Issues #4, #5)

**Files:**
- Modify: `src/components/home/HeroSection.tsx` (already modified by A1 — read current state first)
- Modify: `src/components/home/HomeIntro.tsx`
- Modify: `src/components/home/QuickLinks.tsx`
- Modify: `src/components/home/StockPlatforms.tsx`
- Modify: `src/components/home/WhatWeDeliver.tsx`
- Modify: `src/components/portfolio/PortfolioGrid.tsx`
- Modify: `src/app/[locale]/portfolio/page.tsx`
- Modify: `src/app/[locale]/about/page.tsx`
- Modify: `src/app/[locale]/contact/page.tsx`
- Modify: `src/app/[locale]/client-work/page.tsx`
- Modify: `src/app/[locale]/page.tsx` (already modified by A1 — read current state first)
- Modify: `src/components/layout/Navbar.tsx`

Replace all `dynamic()` imports of `FadeIn`, `PageTransition`, `StaggerChildren`, `StaggerItem`, and `LanguageSwitcher` with normal static imports. These are small components with `{ ssr: true }` that gain nothing from code-splitting.

- [ ] **Step 1: Replace dynamic imports in every file**

**IMPORTANT:** Read each file before editing — Task A1 may have already modified some files.

For each file in the list above, apply these replacements:

| Dynamic import pattern | Static import replacement |
|---|---|
| `const FadeIn = dynamic(() => import("@/components/animations/FadeIn"), { ssr: true });` | `import FadeIn from "@/components/animations/FadeIn";` |
| `const FadeIn = dynamic(() => import("@/components/animations/FadeIn"));` | `import FadeIn from "@/components/animations/FadeIn";` |
| `const PageTransition = dynamic(() => import("@/components/animations/PageTransition"), { ssr: true });` | `import PageTransition from "@/components/animations/PageTransition";` |
| `const PageTransition = dynamic(() => import("@/components/animations/PageTransition"));` | `import PageTransition from "@/components/animations/PageTransition";` |
| `const StaggerChildren = dynamic(() => import("@/components/animations/StaggerChildren"), { ssr: true });` | `import StaggerChildren from "@/components/animations/StaggerChildren";` |
| `const StaggerItem = dynamic(() => import("@/components/animations/StaggerChildren").then(mod => mod.StaggerItem), { ssr: true });` | `import { StaggerItem } from "@/components/animations/StaggerChildren";` |
| `const LanguageSwitcher = dynamic(() => import("./LanguageSwitcher"));` | `import LanguageSwitcher from "./LanguageSwitcher";` |

Also remove any `import dynamic from "next/dynamic";` lines that are no longer used in each file.

Specific files that use dynamic imports (verify each before editing):
- `HeroSection.tsx`: FadeIn
- `HomeIntro.tsx`: FadeIn
- `QuickLinks.tsx`: FadeIn
- `StockPlatforms.tsx`: FadeIn, StaggerChildren, StaggerItem
- `WhatWeDeliver.tsx`: FadeIn, StaggerChildren, StaggerItem
- `PortfolioGrid.tsx`: StaggerChildren, StaggerItem
- `portfolio/page.tsx`: PageTransition, FadeIn
- `about/page.tsx`: PageTransition, FadeIn
- `contact/page.tsx`: PageTransition, FadeIn
- `client-work/page.tsx`: PageTransition, FadeIn
- `[locale]/page.tsx`: PageTransition
- `Navbar.tsx`: LanguageSwitcher

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "perf: replace unnecessary dynamic() imports with static imports"
```

### Task A3: Remove Redundant `loading="eager"` on Logo (Issue #13)

**Files:**
- Modify: `src/components/layout/Navbar.tsx` (already modified by A2 — read current state first)

- [ ] **Step 1: Remove `loading="eager"` from the logo Image**

In `src/components/layout/Navbar.tsx`, the `<Image>` component for the logo has both `priority` and `loading="eager"`. Remove `loading="eager"` — `priority` already implies eager loading in Next.js.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "fix: remove redundant loading=eager, priority already implies it"
```

---

## Agent B: Performance — Video, Caching & GROQ Security (Issues #1, #2, #6)

**Files touched:** `src/components/video/ProtectedVideoPlayer.tsx`, `src/components/portfolio/PortfolioCard.tsx`, `src/app/api/video/route.ts`, `src/app/[locale]/portfolio/page.tsx`, `src/components/portfolio/PortfolioGrid.tsx`, `src/app/[locale]/client-work/page.tsx`

**Note:** This agent combines the original Groups 2 and 3 because both touch `portfolio/page.tsx`. Execute tasks sequentially.

### Task B1: Remove Video Proxy — Serve Directly from R2 (Issue #1)

**Files:**
- Modify: `src/components/video/ProtectedVideoPlayer.tsx`
- Modify: `src/components/portfolio/PortfolioCard.tsx`
- Delete: `src/app/api/video/route.ts`

The video proxy routes all traffic through the Next.js server, doubling latency. The "protection" (blocking right-click) provides zero actual security. Serve directly from R2.

- [ ] **Step 1: Update `ProtectedVideoPlayer.tsx`**

In `src/components/video/ProtectedVideoPlayer.tsx`, change the video `src` from:
```tsx
src={`/api/video?file=${encodeURIComponent(videoFileName)}`}
```
To:
```tsx
src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${encodeURIComponent(videoFileName)}`}
```

- [ ] **Step 2: Update `PortfolioCard.tsx` video element**

In `src/components/portfolio/PortfolioCard.tsx`, change the `<video>` element's `src` from:
```tsx
src={`/api/video?file=${encodeURIComponent(videoFileName)}#t=0.5`}
```
To:
```tsx
src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${encodeURIComponent(videoFileName)}#t=0.5`}
```

- [ ] **Step 3: Delete the video proxy route**

Delete the file: `src/app/api/video/route.ts`

- [ ] **Step 4: Update `.env.local` (if it exists)**

If `.env.local` or `.env` exists and contains `R2_PUBLIC_URL`, rename it to `NEXT_PUBLIC_R2_PUBLIC_URL`. If no env file exists locally, skip this step — the user will need to update their deployment environment variables manually.

**Manual action required by user:** Update `R2_PUBLIC_URL` to `NEXT_PUBLIC_R2_PUBLIC_URL` in Vercel/deployment platform. If CORS is not configured on the R2 bucket, add a CORS policy allowing the site's domain (e.g., `flylens.be`).

- [ ] **Step 5: Commit**

```bash
git add src/components/video/ProtectedVideoPlayer.tsx src/components/portfolio/PortfolioCard.tsx
git rm src/app/api/video/route.ts
git commit -m "perf: serve videos directly from R2 CDN, remove proxy bottleneck

BREAKING: Rename env var R2_PUBLIC_URL to NEXT_PUBLIC_R2_PUBLIC_URL.
User must update deployment environment variables and ensure R2 CORS is configured."
```

### Task B2: Fix Portfolio Shuffle vs ISR Conflict (Issue #2)

**Files:**
- Modify: `src/app/[locale]/portfolio/page.tsx`
- Modify: `src/components/portfolio/PortfolioGrid.tsx`

- [ ] **Step 1: Remove shuffle from server page**

In `src/app/[locale]/portfolio/page.tsx`:
1. Delete the entire `shuffle` function (lines 24-31)
2. In `getPortfolioItems`, change `return shuffle(items);` to `return items;`

- [ ] **Step 2: Add shuffle to `PortfolioGrid.tsx` client component**

In `src/components/portfolio/PortfolioGrid.tsx`:
1. Add `useMemo` to the react import: `import { useMemo } from "react";`
2. Add the shuffle function at module level (before the component):
   ```tsx
   function shuffle<T>(array: T[]): T[] {
     const shuffled = [...array];
     for (let i = shuffled.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
     }
     return shuffled;
   }
   ```
3. Inside the component, before the early return, add:
   ```tsx
   const shuffledItems = useMemo(() => shuffle(items), [items]);
   ```
4. Change `items.length === 0` check to `shuffledItems.length === 0`
5. In the render, use `shuffledItems` instead of `items`:
   ```tsx
   {shuffledItems.map((item) => (
   ```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/portfolio/page.tsx src/components/portfolio/PortfolioGrid.tsx
git commit -m "fix: move portfolio shuffle to client-side to work correctly with ISR"
```

### Task B3: Use Parameterized GROQ Queries (Issue #6)

**Files:**
- Modify: `src/app/[locale]/portfolio/page.tsx` (already modified by B2 — read current state first)
- Modify: `src/app/[locale]/client-work/page.tsx`

- [ ] **Step 1: Fix portfolio query**

In `src/app/[locale]/portfolio/page.tsx`, change the GROQ query in `getPortfolioItems` from string interpolation to parameterized:

Change:
```tsx
`*[_type == "portfolio"] {
  _id,
  "title": title.${locale},
  "description": description.${locale},
  videoFileName,
  tags
}`
```
To:
```tsx
`*[_type == "portfolio"] {
  _id,
  "title": title[$locale],
  "description": description[$locale],
  videoFileName,
  tags
}`,
{ locale }
```

The second argument `{ locale }` is passed to `sanityClient.fetch()` as the params object.

- [ ] **Step 2: Fix client work query**

In `src/app/[locale]/client-work/page.tsx`, apply the same parameterization:

Change:
```tsx
`*[_type == "clientWork"] | order(date desc) {
  _id,
  "title": title.${locale},
  "description": description.${locale},
  videoFileName,
  clientName,
  date,
  "images": images[].asset->url
}`
```
To:
```tsx
`*[_type == "clientWork"] | order(date desc) {
  _id,
  "title": title[$locale],
  "description": description[$locale],
  videoFileName,
  clientName,
  date,
  "images": images[].asset->url
}`,
{ locale }
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/portfolio/page.tsx src/app/[locale]/client-work/page.tsx
git commit -m "security: use parameterized GROQ queries to prevent injection"
```

---

## Agent C: Security — Contact API Hardening (Issues #7, #9)

**Files touched:** `src/app/api/contact/route.ts`

### Task C1: Add Rate Limiting and JSON Parse Safety

**Files:**
- Modify: `src/app/api/contact/route.ts`

- [ ] **Step 1: Rewrite the contact route with rate limiting and safe JSON parsing**

Replace the entire contents of `src/app/api/contact/route.ts` with:

```tsx
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || now > record.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  record.count++;
  return record.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let name: unknown, email: unknown, message: unknown;
  try {
    const body = await request.json();
    name = body.name;
    email = body.email;
    message = body.message;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (typeof name !== "string" || name.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Name must be at most ${MAX_NAME_LENGTH} characters` },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  if (typeof message !== "string" || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be at most ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Flylens Website <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `Nieuw contactbericht van ${name}`,
      replyTo: email,
      text: `Naam: ${name}\nEmail: ${email}\n\nBericht:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/contact/route.ts
git commit -m "security: add rate limiting and JSON parse error handling to contact API"
```

---

## Agent D: i18n & Accessibility (Issues #8, #10, #17-translations)

**Files touched:** `src/app/[locale]/error.tsx`, `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/app/studio/layout.tsx` (new), `messages/en.json`, `messages/nl.json`

**IMPORTANT execution order:** Execute Task D1 first (translations + error page), then D2 (layout restructuring). D1 modifies `messages/*.json` which D2 does not touch. D2 modifies layout files.

### Task D1: Internationalize Error Page + Add Hero Alt Translation (Issues #8, #17)

**Files:**
- Modify: `src/app/[locale]/error.tsx`
- Modify: `messages/en.json`
- Modify: `messages/nl.json`

- [ ] **Step 1: Add translations to both locale files**

In `messages/en.json`, add these keys inside the root object (e.g., after the `"footer"` section, before the closing `}`):

```json
"error": {
  "title": "Something went wrong",
  "description": "An unexpected error occurred. Please try again.",
  "tryAgain": "Try again"
}
```

Also add `"heroAlt": "Aerial drone footage by Flylens"` inside the `"home"` object (needed by Agent A's hero alt text fix).

In `messages/nl.json`, add:

```json
"error": {
  "title": "Er is iets misgegaan",
  "description": "Er is een onverwachte fout opgetreden. Probeer het opnieuw.",
  "tryAgain": "Opnieuw proberen"
}
```

Also add `"heroAlt": "Luchtopnames door Flylens"` inside the `"home"` object.

- [ ] **Step 2: Update error.tsx to use translations**

Replace the entire contents of `src/app/[locale]/error.tsx` with:

```tsx
"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          {t("title")}
        </h2>
        <p className="text-primary/60 mb-6">
          {t("description")}
        </p>
        <button
          onClick={() => reset()}
          className="btn-press px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-hover transition-colors"
        >
          {t("tryAgain")}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/error.tsx messages/en.json messages/nl.json
git commit -m "i18n: internationalize error page and add hero alt text translations"
```

### Task D2: Dynamic `lang` Attribute on HTML (Issue #10)

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Create: `src/app/studio/layout.tsx`

The root layout hardcodes `<html lang="nl">`. In Next.js App Router, the root layout owns the `<html>` tag. To make lang dynamic per locale, the `<html>` and `<body>` tags must move into the `[locale]/layout.tsx`, and the root layout must become a pass-through.

The `/studio` route lives outside `[locale]` and needs its own layout with `<html>`/`<body>`.

- [ ] **Step 1: Update root layout to pass-through**

Replace the entire contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Flylens",
    default: "Flylens - A New Angle on the World",
  },
  description:
    "Professional drone stock videography by Flylens. Aerial landscapes and cinematic footage.",
  openGraph: {
    type: "website",
    siteName: "Flylens",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

Note: `globals.css` is imported here so it applies to all routes (including studio).

- [ ] **Step 2: Move `<html>` and `<body>` into locale layout**

Replace the entire contents of `src/app/[locale]/layout.tsx` with:

```tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
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

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-white text-primary min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#33C6F2] focus:text-[#02172D] focus:rounded focus:font-semibold"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create studio layout**

Create `src/app/studio/layout.tsx`:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds. Both `/nl` and `/en` routes should work, and `/studio` should still load Sanity Studio.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/[locale]/layout.tsx src/app/studio/layout.tsx
git commit -m "a11y: set dynamic html lang attribute based on active locale"
```

---

## Agent E: Code Quality, CSS, SEO & UX Polish (Issues #11, #12, #14, #15, #16)

**Files touched:** `src/app/globals.css`, `src/lib/sanity/client.ts`, `package.json`, `src/app/[locale]/loading.tsx` (new), `src/app/[locale]/portfolio/loading.tsx` (new), `src/app/[locale]/client-work/loading.tsx` (new), `src/app/sitemap.ts` (new), `src/app/robots.ts` (new)

### Task E1: Remove `will-change` from Base State (Issue #11)

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Remove `will-change: transform` entirely from `.hover-lift`**

In `src/app/globals.css`, change the `.hover-lift` rules from:
```css
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  will-change: transform;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}
```
To:
```css
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}
```

Simply remove `will-change: transform;` entirely. Modern browsers handle compositor layer promotion automatically for simple transforms. Adding `will-change` on hover is too late to be useful, so just remove it.

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "perf: remove unnecessary will-change to reduce GPU memory usage"
```

### Task E2: Sanity Client — Throw on Missing Env Var (Issue #12)

**Files:**
- Modify: `src/lib/sanity/client.ts`

- [ ] **Step 1: Replace placeholder fallback with early error**

Replace the entire contents of `src/lib/sanity/client.ts` with:

```tsx
import { createClient } from "@sanity/client";

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable");
}

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/sanity/client.ts
git commit -m "fix: throw early on missing Sanity project ID instead of using placeholder"
```

### Task E3: Fix `@types/react` Version Mismatch (Issue #14)

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (auto-updated by npm)

- [ ] **Step 1: Update types packages**

Run:
```bash
npm install --save-dev @types/react@^19 @types/react-dom@^19
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "fix: update @types/react to v19 to match React 19 runtime"
```

### Task E4: Add `loading.tsx` Components (Issue #15)

**Files:**
- Create: `src/app/[locale]/loading.tsx`
- Create: `src/app/[locale]/portfolio/loading.tsx`
- Create: `src/app/[locale]/client-work/loading.tsx`

- [ ] **Step 1: Create generic loading spinner**

Create `src/app/[locale]/loading.tsx`:
```tsx
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
```

- [ ] **Step 2: Create portfolio loading skeleton**

Create `src/app/[locale]/portfolio/loading.tsx`:
```tsx
export default function PortfolioLoading() {
  return (
    <div className="pt-8 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-9 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-72 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create client-work loading skeleton**

Create `src/app/[locale]/client-work/loading.tsx`:
```tsx
export default function ClientWorkLoading() {
  return (
    <div className="pt-8 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-9 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-72 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>
        <div className="space-y-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-2">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/loading.tsx src/app/[locale]/portfolio/loading.tsx src/app/[locale]/client-work/loading.tsx
git commit -m "ux: add loading skeletons for page transitions"
```

### Task E5: Add Sitemap and Robots.txt (Issue #16)

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create `sitemap.ts`**

Create `src/app/sitemap.ts`:
```tsx
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://flylens.be";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["nl", "en"];
  const routes = ["", "/portfolio", "/about", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "/portfolio" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
```

- [ ] **Step 2: Create `robots.ts`**

Create `src/app/robots.ts`:
```tsx
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://flylens.be";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/studio/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "seo: add sitemap.xml and robots.txt generation"
```

---

## Agent Assignment Summary

| Agent | Issues Fixed | Key Files | Can Run In Parallel |
|-------|-------------|-----------|-------------------|
| **A** | #3, #4, #5, #13, #17 | HeroSection, Navbar, all dynamic imports, page.tsx (home) | Yes |
| **B** | #1, #2, #6 | Video player, PortfolioCard, portfolio/page, client-work/page, PortfolioGrid, api/video | Yes |
| **C** | #7, #9 | api/contact/route.ts | Yes |
| **D** | #8, #10, #17-translations | error.tsx, layout.tsx (root + locale), studio layout, messages/*.json | Yes |
| **E** | #11, #12, #14, #15, #16 | globals.css, sanity client, package.json, loading.tsx files, sitemap, robots | Yes |

**Cross-agent dependencies:**
- Agent A (Task A1) adds `t("heroAlt")` to HeroSection. Agent D (Task D1) adds the `"heroAlt"` translation keys to messages files. These agents touch different files so no conflict, but both changes are needed for the alt text to work. If Agent A finishes before Agent D, the site will show missing translation warnings until Agent D completes. This is acceptable — it resolves once both agents finish.

**No other cross-agent file conflicts exist.**
