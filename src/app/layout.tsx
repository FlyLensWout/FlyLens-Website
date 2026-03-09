import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Flylens",
    default: "Flylens - A New Angle on the World",
  },
  description:
    "Professional drone stock videography by Flylens. Aerial landscapes and cinematic footage.",
  openGraph: {
    type: "website",
    siteName: "Flylens",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={`${inter.className} bg-white text-primary min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
