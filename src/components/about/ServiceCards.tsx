"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

export default function ServiceCards() {
  const t = useTranslations("about.services");
  const locale = useLocale();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn direction="right">
            <Link
              href={`/${locale}/portfolio?tab=cinematic`}
              className="hover-lift group block rounded-2xl overflow-hidden bg-primary flex flex-col hover:ring-2 hover:ring-accent transition-all"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/about/cinematic.JPEG"
                  alt={t("cinematic.title")}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-10 md:p-14">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t("cinematic.title")}
                </h3>
                <p className="text-gray-400">
                  {t("cinematic.description")}
                </p>
                <span className="text-accent text-sm font-medium mt-4 block group-hover:underline">
                  {t("cinematic.cta")} &rarr;
                </span>
              </div>
            </Link>
          </FadeIn>
          <FadeIn direction="left" delay={0.15}>
            <Link
              href={`/${locale}/portfolio?tab=fpv`}
              className="hover-lift group block rounded-2xl overflow-hidden bg-primary flex flex-col hover:ring-2 hover:ring-accent transition-all"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/about/fpv.png"
                  alt={t("fpv.title")}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-10 md:p-14">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t("fpv.title")}
                </h3>
                <p className="text-gray-400">
                  {t("fpv.description")}
                </p>
                <span className="text-accent text-sm font-medium mt-4 block group-hover:underline">
                  {t("fpv.cta")} &rarr;
                </span>
              </div>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
