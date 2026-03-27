"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";

const heroImages = Array.from({ length: 13 }, (_, i) => `/images/hero/hero-${i}.jpg`);
const DEFAULT_HERO = heroImages[0];

export default function HeroSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  const [heroImage, setHeroImage] = useState(DEFAULT_HERO);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHeroImage(heroImages[Math.floor(Math.random() * heroImages.length)]);
    setMounted(true);
  }, []);

  return (
    <section className="relative text-white py-32 md:py-48 overflow-hidden">
      {/* Background image — hidden until client picks random image to avoid hydration flash */}
      <div className={mounted ? "opacity-100 transition-opacity duration-300" : "opacity-0"}>
        <Image
          src={heroImage}
          alt={t("heroAlt")}
          fill
          sizes="100vw"
          quality={75}
          className="object-cover object-[center_40%]"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <FadeIn delay={0.2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            {t("heroTitle1")}{" "}
            <span className="text-accent">{t("heroTitle2")}</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.4}>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            {t("heroSubtitle")}
          </p>
        </FadeIn>
        <FadeIn delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/portfolio`}
              className="btn-press px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-hover transition-colors"
            >
              {t("viewPortfolio")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="btn-press px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              {t("contactUs")}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
