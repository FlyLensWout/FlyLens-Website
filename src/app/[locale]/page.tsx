import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/home/HeroSection";
import HomeIntro from "@/components/home/HomeIntro";
import WhatWeDeliver from "@/components/home/WhatWeDeliver";
import StockPlatforms from "@/components/home/StockPlatforms";
import QuickLinks from "@/components/home/QuickLinks";
import PageTransition from "@/components/animations/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flylens - A New Angle on the World",
  description: "Professional drone stock videography by Flylens. Aerial landscapes and cinematic footage available on Shutterstock, Adobe Stock, Pond5, and Dreamstime.",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageTransition>
      <div>
        <HeroSection />
        <HomeIntro />
        <WhatWeDeliver />
        <StockPlatforms />
        <QuickLinks />
      </div>
    </PageTransition>
  );
}
