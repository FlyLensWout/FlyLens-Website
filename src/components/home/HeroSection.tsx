import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="relative text-white py-32 md:py-48 overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-primary/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          {t("heroTitle1")}{" "}
          <span className="text-accent">{t("heroTitle2")}</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
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
            className="px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            {t("contactUs")}
          </Link>
        </div>
      </div>
    </section>
  );
}
