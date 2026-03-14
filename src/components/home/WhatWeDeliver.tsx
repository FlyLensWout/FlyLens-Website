import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
const FadeIn = dynamic(() => import("@/components/animations/FadeIn"), { ssr: true });
const StaggerChildren = dynamic(() => import("@/components/animations/StaggerChildren"), { ssr: true });
const StaggerItem = dynamic(() => import("@/components/animations/StaggerChildren").then(mod => mod.StaggerItem), { ssr: true });

const deliverables = [
  { key: "stockVideos", icon: "🎬" },
  { key: "droneFootage", icon: "🚁" },
  { key: "resolution4k", icon: "📺" },
  { key: "socialMedia", icon: "📱" },
  { key: "stockPlatforms", icon: "🌐" },
  { key: "customWork", icon: "🎯" },
];

export default function WhatWeDeliver() {
  const t = useTranslations("home.whatWeDeliver");

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            {t("title")}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-primary/60 mb-12 max-w-xl mx-auto text-center">
            {t("subtitle")}
          </p>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverables.map((item) => (
            <StaggerItem key={item.key}>
              <div className="hover-lift bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="text-sm font-semibold text-primary">
                  {t(`${item.key}.title`)}
                </h3>
                <p className="text-sm text-primary/60">
                  {t(`${item.key}.description`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
