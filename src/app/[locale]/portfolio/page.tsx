import { getTranslations, setRequestLocale } from "next-intl/server";
import { sanityClient } from "@/lib/sanity/client";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import dynamic from "next/dynamic";
const PageTransition = dynamic(() => import("@/components/animations/PageTransition"), { ssr: true });
const FadeIn = dynamic(() => import("@/components/animations/FadeIn"), { ssr: true });
import type { Metadata } from "next";

export const revalidate = 60; // revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Drone videography portfolio by Flylens",
};

interface SanityPortfolioItem {
  _id: string;
  title: string;
  description: string;
  videoFileName: string;
  tags: string[];
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function getPortfolioItems(locale: string) {
  const items: SanityPortfolioItem[] = await sanityClient.fetch(
    `*[_type == "portfolio"] {
      _id,
      "title": title.${locale},
      "description": description.${locale},
      videoFileName,
      tags
    }`
  );

  return shuffle(items);
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");

  let items: SanityPortfolioItem[] = [];
  try {
    items = await getPortfolioItems(locale);
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);
  }

  return (
    <PageTransition>
      <div className="pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
              <p className="text-primary/60 text-lg">{t("subtitle")}</p>
            </div>
          </FadeIn>
          <PortfolioGrid items={items} noVideosText={t("noVideos")} />
        </div>
      </div>
    </PageTransition>
  );
}
