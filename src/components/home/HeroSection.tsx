import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
const FadeIn = dynamic(() => import("@/components/animations/FadeIn"), { ssr: false });

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
        sizes="100vw"
        quality={85}
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-primary/70" />

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
