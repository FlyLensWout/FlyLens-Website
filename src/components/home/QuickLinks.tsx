import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import dynamic from "next/dynamic";
const FadeIn = dynamic(() => import("@/components/animations/FadeIn"), { ssr: true });

export default function QuickLinks() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn direction="right">
            <Link
              href={`/${locale}/portfolio`}
              className="hover-lift group relative rounded-2xl overflow-hidden bg-primary p-10 md:p-14 flex flex-col justify-end hover:ring-2 hover:ring-accent transition-all block"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{t("portfolioCard")}</h3>
              <p className="text-gray-400">
                {t("portfolioCardDesc")}
              </p>
              <span className="text-accent text-sm font-medium mt-4 group-hover:underline">
                {t("viewPortfolio")} &rarr;
              </span>
            </Link>
          </FadeIn>
          <FadeIn direction="left" delay={0.15}>
            <Link
              href={`/${locale}/client-work`}
              className="hover-lift group relative rounded-2xl overflow-hidden bg-primary p-10 md:p-14 flex flex-col justify-end hover:ring-2 hover:ring-accent transition-all block"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{t("clientWorkCard")}</h3>
              <p className="text-gray-400">
                {t("clientWorkCardDesc")}
              </p>
              <span className="text-accent text-sm font-medium mt-4 group-hover:underline">
                {t("viewClientWork")} &rarr;
              </span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
