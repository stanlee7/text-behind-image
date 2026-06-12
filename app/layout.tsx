import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Anton,
  Pacifico,
  Playfair_Display,
  Noto_Sans_KR,
  Black_Han_Sans,
  Do_Hyeon,
  Jua,
  Nanum_Pen_Script,
} from "next/font/google";
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
const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], weight: ['100', '300', '400', '500', '700', '900'], variable: '--font-noto-sans-kr' });

// Korean display fonts for thumbnails
const blackHanSans = Black_Han_Sans({ weight: "400", subsets: ['latin'], variable: '--font-black-han-sans' });
const doHyeon = Do_Hyeon({ weight: "400", subsets: ['latin'], variable: '--font-do-hyeon' });
const jua = Jua({ weight: "400", subsets: ['latin'], variable: '--font-jua' });
const nanumPen = Nanum_Pen_Script({ weight: "400", subsets: ['latin'], variable: '--font-nanum-pen' });

export const metadata: Metadata = {
  title: "누끼 텍스트 - 1초 만에 만드는 인물 뒤 텍스트 디자인",
  description: "복잡한 포토샵 없이, AI가 자동으로 인물을 인식해 텍스트를 뒤로 넣어줍니다. 유튜브 썸네일, 인스타 피드를 1초 만에 완성하세요.",
  keywords: ["누끼", "텍스트 뒤 이미지", "text behind image", "유튜브 썸네일", "썸네일 메이커", "배경 제거", "AI 누끼"],
  openGraph: {
    title: "누끼 텍스트 - 1초 만에 만드는 인물 뒤 텍스트 디자인",
    description: "AI가 자동으로 인물을 인식해 텍스트를 뒤로 넣어주는 무료 썸네일 도구",
    url: "https://text-behind-image-nine.vercel.app",
    siteName: "누끼 텍스트",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${anton.variable} ${pacifico.variable} ${playfair.variable} ${notoSansKR.variable} ${blackHanSans.variable} ${doHyeon.variable} ${jua.variable} ${nanumPen.variable} antialiased font-sans`}
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
