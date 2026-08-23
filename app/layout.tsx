import type { Metadata } from "next";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lh-photography.github.io").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Chelmsford Photographer | Louie Harrington Photography",
  description: "Chelmsford and Danbury photographer Louie Harrington, covering football, sports, action, cars, portraits, weddings, family sessions and property photography across Essex.",
  keywords: [
    "Louie Harrington Photography",
    "Chelmsford photographer",
    "Danbury photographer",
    "Essex photographer",
    "sports photographer Chelmsford",
    "football photographer Essex",
    "car photography Chelmsford",
    "wedding photography Chelmsford",
    "family photographer Chelmsford",
    "property photography Essex",
    "action photographer Essex",
  ],
  authors: [{ name: "Louie Harrington" }],
  creator: "Louie Harrington Photography",
  publisher: "Louie Harrington Photography",
  category: "Photography",
  alternates: { canonical: `${siteUrl}/` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Chelmsford Photographer | Louie Harrington Photography",
    description: "Sports, cars, portraits, weddings and moments photographed around Chelmsford, Danbury and Essex.",
    type: "website",
    url: `${siteUrl}/`,
    siteName: "Louie Harrington Photography",
    locale: "en_GB",
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: "Louie Harrington Photography — Moments, honestly framed." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chelmsford Photographer | Louie Harrington Photography",
    description: "Sports, cars, portraits, weddings and moments photographed around Chelmsford, Danbury and Essex.",
    images: [`${siteUrl}/og.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/lh-favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#photography-business`,
      name: "Louie Harrington Photography",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/photos/logo.jpg`,
      image: `${siteUrl}/og.png`,
      description: "Photography in Chelmsford, Danbury and across Essex, specialising in sports, football, action, automotive, portraits, weddings, family sessions and property photography.",
      priceRange: "£25–£45+",
      areaServed: [
        { "@type": "City", name: "Chelmsford" },
        { "@type": "Place", name: "Danbury" },
        { "@type": "AdministrativeArea", name: "Essex" },
      ],
      serviceType: [
        "Sports photography",
        "Football photography",
        "Action and motorsport photography",
        "Automotive photography",
        "Portrait photography",
        "Wedding photography",
        "Family photography",
        "Property photography",
      ],
      founder: {
        "@type": "Person",
        name: "Louie Harrington",
      },
      sameAs: ["https://www.instagram.com/louie_photography55/"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Photography services",
        itemListElement: [
          {
            "@type": "Offer",
            price: "45",
            priceCurrency: "GBP",
            description: "Wedding coverage from £45",
            itemOffered: { "@type": "Service", name: "Wedding photography" },
          },
          {
            "@type": "Offer",
            price: "25",
            priceCurrency: "GBP",
            description: "One-hour car photography session",
            itemOffered: { "@type": "Service", name: "Automotive photography" },
          },
          {
            "@type": "Offer",
            price: "30",
            priceCurrency: "GBP",
            description: "Family or property photography",
            itemOffered: { "@type": "Service", name: "Family or property photography" },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Louie Harrington Photography",
      url: `${siteUrl}/`,
      inLanguage: "en-GB",
      publisher: { "@id": `${siteUrl}/#photography-business` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
