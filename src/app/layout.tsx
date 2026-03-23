import type { Metadata } from "next";
import "./globals.css";

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
  return children;
}
