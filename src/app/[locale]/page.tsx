import HeroSection from "@/components/home/HeroSection";
import StockPlatforms from "@/components/home/StockPlatforms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flylens - A New Angle on the World",
  description: "Professional drone stock videography by Flylens. Aerial landscapes and cinematic footage available on Shutterstock, Adobe Stock, Pond5, and Dreamstime.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StockPlatforms />
    </>
  );
}
