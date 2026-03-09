import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Flylens - Professional drone stock videography",
};

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Photo placeholder - replace with actual photo */}
          <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
            <Image
              src="/logo/icoon/kleur icoon met bg.png"
              alt="Flylens"
              width={300}
              height={300}
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Bio text - hardcoded, developer managed */}
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Flylens is a professional drone videography company specializing in
              capturing stunning aerial footage of landscapes, nature, and
              architecture. Our footage is available on major stock platforms
              worldwide.
            </p>
            <p className="text-gray-300 leading-relaxed">
              With a passion for aerial cinematography and an eye for
              composition, we deliver high-quality 4K footage that brings a new
              perspective to every scene.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
