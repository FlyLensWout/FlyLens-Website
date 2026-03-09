import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="pt-8 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>
        <div className="p-8 rounded-xl border border-white/10 bg-white/5">
          <ContactForm />
        </div>
        <div className="mt-8 text-center space-y-2">
          <a
            href="https://www.instagram.com/flylensw/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline block"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/wout-wybo-253860367/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline block"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
