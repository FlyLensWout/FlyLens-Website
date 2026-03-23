import { getTranslations, setRequestLocale } from "next-intl/server";
import { sanityClient } from "@/lib/sanity/client";
import Image from "next/image";
import VideoPlayer from "@/components/video/ProtectedVideoPlayer";
import dynamic from "next/dynamic";
const PageTransition = dynamic(() => import("@/components/animations/PageTransition"), { ssr: true });
const FadeIn = dynamic(() => import("@/components/animations/FadeIn"), { ssr: true });
import type { Metadata } from "next";

export const revalidate = 60; // revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Client Work",
};

interface SanityClientWorkItem {
  _id: string;
  title: string;
  description: string;
  videoFileName?: string;
  clientName: string;
  date: string;
  images?: string[];
}

async function getClientWorkItems(locale: string) {
  const items: SanityClientWorkItem[] = await sanityClient.fetch(
    `*[_type == "clientWork"] | order(date desc) {
      _id,
      "title": title.${locale},
      "description": description.${locale},
      videoFileName,
      clientName,
      date,
      "images": images[].asset->url
    }`
  );

  return items;
}

export default async function ClientWorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("clientWork");

  let items: SanityClientWorkItem[] = [];
  try {
    items = await getClientWorkItems(locale);
  } catch (error) {
    console.error("Failed to fetch client work items:", error);
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="pt-8 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
              <p className="text-primary/60 text-lg mb-12">{t("subtitle")}</p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-12 flex flex-col items-center">
                <svg
                  className="w-16 h-16 text-primary/20 mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-primary/40 mb-2">
                  {t("comingSoon")}
                </h2>
                <p className="text-primary/30">{t("comingSoonText")}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
              <p className="text-primary/60 text-lg">{t("subtitle")}</p>
            </div>
          </FadeIn>
          <div className="space-y-16">
            {items.map((item) => (
              <FadeIn key={item._id}>
                <article
                  className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                >
                  {item.videoFileName && (
                    <VideoPlayer
                      videoFileName={item.videoFileName}
                      title={item.title}
                    />
                  )}
                  {item.images &&
                    item.images.length > 0 &&
                    !item.videoFileName && (
                      <div className="relative aspect-video">
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                      {item.clientName && (
                        <span className="text-sm text-accent">
                          {item.clientName}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
