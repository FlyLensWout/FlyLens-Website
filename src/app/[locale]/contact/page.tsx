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
                <div className="mt-10 pt-8 border-t border-primary/10 space-y-4">
                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-primary">{t("location")}</p>
                      <p className="text-primary/60">Knokke-Heist, België</p>
                    </div>
                  </div>
                  {/* VAT */}
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-primary">{t("vat")}</p>
                      <p className="text-primary/60">BE1022.445.326</p>
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
