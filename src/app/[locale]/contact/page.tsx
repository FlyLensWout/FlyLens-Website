import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";
import PageTransition from "@/components/animations/PageTransition";
import FadeIn from "@/components/animations/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <PageTransition>
      <div className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Info */}
            <FadeIn direction="right">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
                <p className="text-primary/60 text-lg mb-8">{t("subtitle")}</p>
                <p className="text-primary/70 leading-relaxed mb-4">
                  {t("description")}
                </p>
                <p className="text-primary/70 leading-relaxed mb-10">
                  {t("description2")}
                </p>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-primary">Email</p>
                      <a href="mailto:flylensw@gmail.com" className="text-primary/60 hover:text-accent transition-colors">
                        flylensw@gmail.com
                      </a>
                    </div>
                  </div>
                  {/* Instagram */}
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth={2} />
                      <circle cx="12" cy="12" r="5" strokeWidth={2} />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-primary">Instagram</p>
                      <a
                        href="https://www.instagram.com/flylensw/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/60 hover:text-accent transition-colors"
                      >
                        @flylensw
                      </a>
                    </div>
                  </div>
                  {/* LinkedIn */}
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-primary">LinkedIn</p>
                      <a
                        href="https://www.linkedin.com/in/wout-wybo-253860367/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/60 hover:text-accent transition-colors"
                      >
                        Wout Wybo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right: Form */}
            <FadeIn direction="left" delay={0.15}>
              <div className="bg-gray-50 rounded-2xl p-8">
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
