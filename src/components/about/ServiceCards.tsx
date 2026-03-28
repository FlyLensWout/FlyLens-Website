"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";

export default function ServiceCards() {
  const t = useTranslations("about.services");

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn direction="right">
            <div className="rounded-2xl overflow-hidden bg-primary flex flex-col">
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
              </div>
            </div>
          </FadeIn>
          <FadeIn direction="left" delay={0.15}>
            <div className="rounded-2xl overflow-hidden bg-primary flex flex-col">
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
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
