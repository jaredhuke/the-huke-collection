import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/config";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Randy & John Huke`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Randy Huke", "John Huke", "Huke Collection", "Austin artist",
    "abstract painting", "works on paper", "sculpture", "Visual Conversations",
    "Lonesome Dove lithographs", "contemporary art", "original art for sale",
  ],
  authors: [{ name: "Randy Huke" }, { name: "John Huke" }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Randy & John Huke`,
    description: site.description,
    url: site.url,
    locale: "en_US",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Randy & John Huke`,
    description: site.description,
    images: ["/og.jpg"],
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "art",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en-US",
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#randy-huke`,
      name: "Randy Huke",
      jobTitle: "Artist",
      nationality: "American",
      description:
        "Austin-based painter and film set decorator whose work moves between exuberant color and searching abstraction.",
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#john-huke`,
      name: "John Huke",
      alternateName: "John Campbell Huke",
      jobTitle: "Artist",
      nationality: "American",
      birthDate: "1948-09-11",
      deathDate: "2016-12-14",
      description:
        "Austin artist, sculptor, printmaker, and filmmaker; production designer on films including Lonesome Dove.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
