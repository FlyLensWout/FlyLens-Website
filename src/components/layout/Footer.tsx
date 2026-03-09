import { useTranslations } from "next-intl";
import Image from "next/image";

const stockPlatforms = [
  { name: "Shutterstock", url: "https://submit.shutterstock.com/nl/FlyLens" },
  { name: "Adobe Stock", url: "https://stock.adobe.com/contributor/211750229/FlyLens" },
  { name: "Pond5", url: "https://www.pond5.com/nl/artist/flylensw180" },
  { name: "Dreamstime", url: "https://nl.dreamstime.com/flylensw_info" },
];

const socials = [
  { name: "Instagram", url: "https://www.instagram.com/flylensw/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/wout-wybo-253860367/" },
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-primary border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/logo/logo zonder slogan/wit zonder slogan.png"
              alt="Flylens"
              width={150}
              height={50}
              className="h-10 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm">A new angle on the world</p>
          </div>

          {/* Stock Platforms */}
          <div>
            <h3 className="text-sm font-semibold text-accent mb-4">{t("stockPlatforms")}</h3>
            <ul className="space-y-2">
              {stockPlatforms.map((platform) => (
                <li key={platform.name}>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {platform.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-accent mb-4">{t("followUs")}</h3>
            <ul className="space-y-2">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Flylens. {t("rights")}.
        </div>
      </div>
    </footer>
  );
}
