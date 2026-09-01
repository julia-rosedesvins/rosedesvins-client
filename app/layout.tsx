import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { PostHogProvider } from "@/providers/PostHogProvider";
import ChunkErrorRecovery from "@/components/ChunkErrorRecovery";
import { ResetGoogleTranslateOutsideIf } from "@/app/if/google-translate/ResetGoogleTranslateOutsideIf";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  buildCanonical,
} from "@/lib/seo/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} : réservez vos domaines viticoles`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: buildCanonical('/'),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} : réservez vos domaines viticoles`,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} : réservez vos domaines viticoles`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: '/assets/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning={true}>
      {/* Do not add a manual <head>: Next.js Metadata API owns it. A custom
          <head> blocks streamed <title> from being hoisted, so the title
          leaks as visible text after the footer. */}
      <Script id="dom-guard" strategy="beforeInteractive">
        {`(function() {
            var orig = Node.prototype.removeChild;
            Node.prototype.removeChild = function(child) {
              if (child.parentNode !== this) { return child; }
              return orig.apply(this, arguments);
            };
            var origInsert = Node.prototype.insertBefore;
            Node.prototype.insertBefore = function(newNode, refNode) {
              if (refNode && refNode.parentNode !== this) { return newNode; }
              return origInsert.apply(this, arguments);
            };
          })();`}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5FK4PCW5');`}
        </Script>
        {/* End Google Tag Manager */}
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5FK4PCW5"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ChunkErrorRecovery />
        <ResetGoogleTranslateOutsideIf />
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#3A7B59',
                color: '#fff',
              },
            },
            error: {
              style: {
                background: '#dc2626',
                color: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
