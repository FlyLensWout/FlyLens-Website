import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import PageTransition from "@/components/animations/PageTransition";
import FadeIn from "@/components/animations/FadeIn";
import Applications from "@/components/about/Applications";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Flylens - Professional drone stock videography",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <PageTransition>
      <div className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Photo */}
            <FadeIn direction="right">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/images/wout-wybo.jpg"
                  alt="Wout Wybo - FlyLens"
                  width={640}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </FadeIn>

            {/* Bio text */}
            <FadeIn direction="left" delay={0.2}>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t("title")}</h1>
                <p className="text-primary/60 text-lg mb-8">{t("subtitle")}</p>
                <div className="space-y-4">
                  <p className="text-primary/70 leading-relaxed">
                    {t("bio1")}
                  </p>
                  <p className="text-primary/70 leading-relaxed">
                    {t("bio2")}
                  </p>
                  <p className="text-primary/70 leading-relaxed">
                    {t("bio3")}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <Applications />
    </PageTransition>
  );
}
