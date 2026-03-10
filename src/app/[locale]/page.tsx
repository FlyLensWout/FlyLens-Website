import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/home/HeroSection";
import StockPlatforms from "@/components/home/StockPlatforms";
import QuickLinks from "@/components/home/QuickLinks";
import PageTransition from "@/components/animations/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flylens - A New Angle on the World",
  description: "Professional drone stock videography by Flylens. Aerial landscapes and cinematic footage available on Shutterstock, Adobe Stock, Pond5, and Dreamstime.",
};

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <PageTransition>
      <div>
        <HeroSection />
        <StockPlatforms />
        <QuickLinks />
      </div>
    </PageTransition>
  );
}
