import { useTranslations } from "next-intl";
import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";

const platforms = [
  {
    name: "Shutterstock",
    url: "https://submit.shutterstock.com/nl/FlyLens",
    logo: "/images/platforms/shutterstock.svg",
  },
  {
    name: "Adobe Stock",
    url: "https://stock.adobe.com/contributor/211750229/FlyLens",
    logo: "/images/platforms/adobe-stock.svg",
  },
  {
    name: "Pond5",
    url: "https://www.pond5.com/nl/artist/flylensw180",
    logo: "/images/platforms/pond5.svg",
  },
  {
    name: "Dreamstime",
    url: "https://nl.dreamstime.com/flylensw_info",
    logo: "/images/platforms/dreamstime.svg",
  },
];

export default function StockPlatforms() {
  const t = useTranslations("home");

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            {t("stockPlatforms")}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-primary/60 mb-12 max-w-xl mx-auto text-center">
            {t("stockSubtitle")}
          </p>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <StaggerItem key={platform.name}>
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-lift bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <Image
                  src={platform.logo}
                  alt={platform.name}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-sm font-semibold text-primary">
                  {platform.name}
                </span>
                <span className="text-sm text-primary/60">
                  &rarr;
                </span>
              </a>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
