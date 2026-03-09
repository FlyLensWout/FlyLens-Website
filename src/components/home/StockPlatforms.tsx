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
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          {t("stockPlatforms")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
                {platform.name}
              </h3>
              <span className="inline-block mt-4 text-accent text-sm font-medium group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
