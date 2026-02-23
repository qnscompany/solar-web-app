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
  title: '쨍하고 | 충남 검증 태양광 시공업체 비교 플랫폼',
  description: '충청남도 태양광 시공업체를 한눈에 비교하세요. 에너지공단 인증, 무상 A/S, 보증보험 가입 업체만 엄선. 무료 견적 비교 서비스.',
  openGraph: {
    title: '쨍하고 | 우리 동네 검증 태양광 업체 비교',
    description: '사기 걱정 없이 믿을 수 있는 충남 태양광 시공업체만 모았습니다. 무료로 견적을 비교해보세요.',
    url: 'https://solar-web-app-bay.vercel.app',
    siteName: '쨍하고',
    locale: 'ko_KR',
    type: 'website',
  },
  keywords: ['태양광', '태양광 설치', '충남 태양광', '당진 태양광', '태양광 시공업체', '태양광 견적', '태양광 비교'],
  robots: 'index, follow',
  verification: {
    google: 't_zmG-zLH9GcJHoi3mPdIT_2B28Fx82zXRAADhHc5Ag',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
