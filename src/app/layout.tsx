import type { Metadata } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import GlobalLogoScene from "@/components/GlobalLogoScene";
import LoadingScreen from "@/components/LoadingScreen";
import SmoothScroll from "@/components/SmoothScroll";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DAO Studio — Define · Amplify · Own",
  description:
    "DAO Studio is a digital marketing agency in Dubai. We define brands, amplify their reach, and help them own their category.",
  metadataBase: new URL("https://dao.studio"),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "DAO Studio — Define · Amplify · Own",
    description:
      "Digital Marketing Agency — Dubai, UAE. DAO Marketing Management LLC.",
    siteName: "DAO Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink relative">
        <SmoothScroll />
        <LoadingScreen />
        <GlobalLogoScene />
        <Nav />
        <main className="relative z-10 flex-1">{children}</main>
        <footer className="relative z-10 bg-ink text-cream mt-32">
          <div className="section-pad flex flex-col gap-10 max-w-7xl mx-auto w-full">
            <div className="flex flex-col tablet:flex-row gap-10 justify-between">
              <div className="flex flex-col gap-3 max-w-md">
                <span className="font-display text-3xl tracking-tight text-gold">
                  DAO
                </span>
                <p className="font-mono text-xs text-bone-mid">
                  DEFINE · AMPLIFY · OWN
                </p>
                <p className="text-sm text-bone-mid mt-2">
                  DAO Marketing Management LLC
                  <br />
                  Dubai, United Arab Emirates
                </p>
              </div>
              <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest">
                <a href="mailto:hello@dao.studio" className="hover:text-gold">
                  hello@dao.studio
                </a>
                <a href="/contact" className="hover:text-gold">
                  Start a project →
                </a>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-bone-dim pt-6 border-t border-bone-dim">
              <span>© {new Date().getFullYear()} DAO Studio</span>
              <span>Dubai, UAE</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
