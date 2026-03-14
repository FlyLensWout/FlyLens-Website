import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Flylens. {t("rights")}.
        </p>
      </div>
    </footer>
  );
}
