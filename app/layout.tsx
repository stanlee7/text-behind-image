import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Anton, Pacifico, Playfair_Display, Noto_Sans_KR } from "next/font/google"; // Added Noto_Sans_KR
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const anton = Anton({ weight: "400", subsets: ['latin'], variable: '--font-anton' });
const pacifico = Pacifico({ weight: "400", subsets: ['latin'], variable: '--font-pacifico' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], weight: ['100', '300', '400', '500', '700', '900'], variable: '--font-noto-sans-kr' }); // Initialized

export const metadata: Metadata = {
  title: "누끼 텍스트 - 1초 만에 만드는 인물 뒤 텍스트 디자인",
  description: "복잡한 포토샵 없이, AI가 자동으로 인물을 인식해 텍스트를 뒤로 넣어줍니다. 유튜브 썸네일, 인스타 피드를 1초 만에 완성하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${anton.variable} ${pacifico.variable} ${playfair.variable} ${notoSansKR.variable} antialiased font-sans`}
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3338008832521664"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
