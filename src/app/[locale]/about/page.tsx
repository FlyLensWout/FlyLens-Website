import { getTranslations, setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
const PageTransition = dynamic(() => import("@/components/animations/PageTransition"));
const FadeIn = dynamic(() => import("@/components/animations/FadeIn"), { ssr: true });
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
            {/* Photo placeholder */}
            <FadeIn direction="right">
              <div className="aspect-[4/5] rounded-2xl bg-gray-50 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-primary/20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
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
    </PageTransition>
  );
}
