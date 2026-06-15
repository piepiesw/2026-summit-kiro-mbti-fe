import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GhostBurst from "@/components/GhostBurst";
import NightSky from "@/components/NightSky";
import HomeButton from "@/components/HomeButton";
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
  title: "我的 Kiro MBTI 是？ | Kiro",
  description:
    "AI 時代，你是哪一型？用 16 道問題找出你的 MBTI！",
  openGraph: {
    title: "我的 Kiro MBTI 是？ | Kiro",
    description: "AI 時代，你是哪一型？用 16 道問題快速測測看！",
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
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <NightSky />
        <GhostBurst />
        <HomeButton />
        {children}
      </body>
    </html>
  );
}
