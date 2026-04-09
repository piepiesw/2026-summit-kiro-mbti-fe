import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GhostBurst from "@/components/GhostBurst";
import NightSky from "@/components/NightSky";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "나의 Kiro MBTI는? | Kiro",
  description:
    "AI 시대, 당신은 어떤 타입? 16개 질문으로 알아보는 나의 MBTI!",
  openGraph: {
    title: "나의 Kiro MBTI는? | Kiro",
    description: "AI 시대, 당신은 어떤 타입? 16개 질문으로 알아보세요!",
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
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NightSky />
        <GhostBurst />
        {children}
      </body>
    </html>
  );
}
