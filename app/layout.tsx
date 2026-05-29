import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://www.archerandash.com'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  alternates: {
    canonical: 'https://www.archerandash.com/',
  },
  title: {
    default: "Archer and Ash | Modern Canvas Art & Wall Decor",
    template: "%s | Archer and Ash"
  },
  description: "Discover unique wall arts, posters, and canvas prints for modern living. Archer and Ash offers art pieces to elevate your home decor.",
  keywords: ["wall art", "canvas prints", "posters", "home decor", "modern art", "abstract art", "interior design"],
  authors: [{ name: "Archer and Ash" }],
  creator: "Archer and Ash",
  icons: {
    icon: "/images/logo.jpg",
    shortcut: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.archerandash.com",
    siteName: "Archer and Ash",
    title: "Archer and Ash | Modern Canvas Art & Wall Decor",
    description: "Discover unique wall arts, posters, and canvas prints for modern living.",
    images: [
      {
        url: "https://www.archerandash.com/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Archer and Ash"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Archer and Ash | Modern Canvas Art & Wall Decor",
    description: "Discover unique canvas prints and wall art for modern living.",
    creator: "@archerandash",
    images: ["https://www.archerandash.com/images/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '-4JYAmPNnn6z_lqUDuWI_QbjbFLHuHa4jr-nNyPadVA',
  },
};

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <div className="pt-16 min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '2504551413308453');
      fbq('track', 'PageView');`}
        </Script>
        <noscript dangerouslySetInnerHTML={{ __html: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2504551413308453&ev=PageView&noscript=1"/>' }} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JE6KDQ1DHQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JE6KDQ1DHQ');
          `}
        </Script>
      </body>
    </html>
  );
}
