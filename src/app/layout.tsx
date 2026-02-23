import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://solar-web-app-bay.vercel.app'),
  title: '쨍하고 | 태양광 시공업체 비교 플랫폼',
  description: '주민이 만든 우리 동네 태양광 비교 서비스. 에너지공단 인증 업체 엄선, 무료 견적 비교, 사후 관리 보증까지 한눈에 확인하세요.',
  openGraph: {
    title: '쨍하고 | 태양광 시공업체 무료 비교 1위',
    description: '사기 걱정 없는 우리 동네 태양광 시공. 직접 발로 뛰어 검증한 업체들의 견적을 30초 만에 비교해 드립니다.',
    url: 'https://solar-web-app-bay.vercel.app',
    siteName: '쨍하고',
    images: [
      {
        url: '/og-image.png', // 실제 이미지가 있다면 경로 확인 필요, 없다면 기본 생성 유도
        width: 1200,
        height: 630,
        alt: '쨍하고 태양광 비교 서비스',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '쨍하고 | 태양광 시공업체 비교',
    description: '주민이 직접 검증한 태양광 업체들을 무료로 비교하세요.',
  },
  keywords: ['태양광', '태양광 설치', '태양광 시공업체', '태양광 견적', '태양광 비교'],
  robots: 'index, follow',
  verification: {
    google: 't_zmG-zLH9GcJHoi3mPdIT_2B28Fx82zXRAADhHc5Ag',
    other: {
      'naver-site-verification': ['4cc478d7630438a75188276deb12a2d5e50a0b77'],
    },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white`}
      >
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
