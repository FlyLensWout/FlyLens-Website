import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function HeroSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/30 to-primary z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          {t("heroTitle1")}
          <br />
          <span className="text-accent">{t("heroTitle2")}</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10">
          {t("heroSubtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/portfolio`}
            className="px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-hover transition-colors"
          >
            {t("viewPortfolio")}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="px-8 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors"
          >
            {t("contactUs")}
          </Link>
        </div>
      </div>
    </section>
  );
}
