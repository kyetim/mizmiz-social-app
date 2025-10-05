import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

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

export const metadata: Metadata = {
  title: "MIZMIZ - Modern Sosyal Medya Platformu",
  description: "Kullanıcıların içerik paylaşabileceği ve etkileşime girebileceği modern sosyal medya platformu",
  keywords: ["sosyal medya", "içerik paylaşımı", "topluluk", "blog"],
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
