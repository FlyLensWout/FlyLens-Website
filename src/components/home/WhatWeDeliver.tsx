import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
const FadeIn = dynamic(() => import("@/components/animations/FadeIn"), { ssr: true });
const StaggerChildren = dynamic(() => import("@/components/animations/StaggerChildren"), { ssr: true });
const StaggerItem = dynamic(() => import("@/components/animations/StaggerChildren").then(mod => mod.StaggerItem), { ssr: true });

const deliverables = [
  "stockVideos",
  "droneFootage",
  "resolution4k",
  "socialMedia",
  "stockPlatforms",
  "customWork",
];

export default function WhatWeDeliver() {
  const t = useTranslations("home.whatWeDeliver");

  return (
    <section className="py-20 md:py-28 px-4 bg-primary">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t("title")}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-gray-400 mb-14 max-w-xl">
            {t("subtitle")}
          </p>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {deliverables.map((key) => (
            <StaggerItem key={key}>
              <div className="group">
                <div className="w-8 h-[2px] bg-accent mb-4 transition-all group-hover:w-12" />
                <h3 className="text-sm font-semibold text-white mb-2">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {t(`${key}.description`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
