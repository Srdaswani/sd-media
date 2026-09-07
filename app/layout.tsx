import type { Metadata, Viewport } from "next";
// One variable font file carrying both the weight and width axes. Self-hosted,
// so there is no third-party connection blocking first paint and no request to
// Google on behalf of the visitor.
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import Nav from "@/components/Nav";
import Light from "@/components/Light";
import { site } from "@/content/site.config";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: `Sports photography and film in ${site.location}. Football, lacrosse, soccer, basketball, volleyball and portraits for athletes, teams and families.`,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    images: [{ url: site.portrait.src, width: 1200, height: 800 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbead8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0b0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Photographs come from Cloudinary's CDN. Opening that connection
            during HTML parse saves the DNS + TLS round trip on first image. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
      </head>
      <body>
        <Light />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <footer className="shell section-tight">
          <hr className="rule" style={{ marginBottom: "var(--s5)" }} />
          <p className="dense">
            {site.name} · {site.location} · ©{" "}
            {new Date().getFullYear()}
          </p>
        </footer>
      </body>
    </html>
  );
}
