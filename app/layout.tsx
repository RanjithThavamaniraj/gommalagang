import type { Metadata } from "next";
import { Anton, Fraunces, IBM_Plex_Mono, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const tamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: "400",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gommala Gang — Unfiltered AI",
  description:
    "The AI that skips corporate politeness and gets straight to the point. Chennai attitude, sharp wit, surprisingly good answers.",
  openGraph: {
    title: "Gommala Gang — Unfiltered AI",
    description:
      "The AI that skips corporate politeness and gets straight to the point.",
    images: ["/images/hero.png"],
  },
};

export const viewport = {
  themeColor: "#090909",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${fraunces.variable} ${plexMono.variable} ${tamil.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-ivory noise bg-concrete">
        {children}
      </body>
    </html>
  );
}
