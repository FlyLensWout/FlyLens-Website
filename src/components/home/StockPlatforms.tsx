import { useTranslations } from "next-intl";

const platforms = [
  {
    name: "Shutterstock",
    url: "https://submit.shutterstock.com/nl/FlyLens",
  },
  {
    name: "Adobe Stock",
    url: "https://stock.adobe.com/contributor/211750229/FlyLens",
  },
  {
    name: "Pond5",
    url: "https://www.pond5.com/nl/artist/flylensw180",
  },
  {
    name: "Dreamstime",
    url: "https://nl.dreamstime.com/flylensw_info",
  },
];

export default function StockPlatforms() {
  const t = useTranslations("home");

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          {t("stockPlatforms")}
        </h2>
        <p className="text-primary/60 mb-12 max-w-xl mx-auto text-center">
          {t("stockSubtitle")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-primary">
                {platform.name}
              </h3>
              <span className="text-sm font-medium text-primary/60">
                &rarr;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
