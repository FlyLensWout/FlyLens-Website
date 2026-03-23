import { useTranslations } from "next-intl";
import FadeIn from "@/components/animations/FadeIn";

export default function HomeIntro() {
  const t = useTranslations("home.intro");

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <p className="text-lg text-primary/70 leading-relaxed mb-6">
            {t("paragraph1")}
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-lg text-primary/70 leading-relaxed">
            {t("paragraph2")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
