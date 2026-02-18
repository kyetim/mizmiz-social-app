import type { Metadata, Viewport } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { ChunkErrorBoundary } from "@/components/shared/chunk-error-boundary";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16a34a" },
    { media: "(prefers-color-scheme: dark)", color: "#15803d" },
  ],
};

export const metadata: Metadata = {
  title: "MIZMIZ - Modern Sosyal Medya Platformu",
  description:
    "Kullanıcıların içerik paylaşabileceği ve etkileşime girebileceği modern sosyal medya platformu",
  keywords: ["sosyal medya", "içerik paylaşımı", "topluluk", "blog"],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MIZMIZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${roboto.variable} antialiased`}
      >
        <Providers>
          <ChunkErrorBoundary>{children}</ChunkErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
