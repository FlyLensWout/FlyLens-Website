import { getTranslations, setRequestLocale } from "next-intl/server";
import { sanityClient } from "@/lib/sanity/client";
import { getSignedPlaybackToken, getSignedThumbnailToken } from "@/lib/mux";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import PageTransition from "@/components/animations/PageTransition";
import FadeIn from "@/components/animations/FadeIn";
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
  muxPlaybackId: string;
  tags: string[];
}

async function getPortfolioItems(locale: string) {
  const items: SanityPortfolioItem[] = await sanityClient.fetch(
    `*[_type == "portfolio"] | order(order asc) {
      _id,
      "title": title.${locale},
      "description": description.${locale},
      muxPlaybackId,
      tags
    }`
  );

  const itemsWithTokens = await Promise.all(
    items.map(async (item) => ({
      ...item,
      token: await getSignedPlaybackToken(item.muxPlaybackId),
      thumbnailUrl: `https://image.mux.com/${item.muxPlaybackId}/thumbnail.webp?token=${await getSignedThumbnailToken(item.muxPlaybackId)}`,
    }))
  );

  return itemsWithTokens;
}

export default async function PortfolioPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolio");

  let items: Awaited<ReturnType<typeof getPortfolioItems>> = [];
  try {
    items = await getPortfolioItems(locale);
  } catch {
    // Sanity not configured yet - show empty state
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
