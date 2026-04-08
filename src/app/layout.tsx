import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "나의 개발자 MBTI는? | Kiro",
  description:
    "AI 시대, 당신은 어떤 개발자? 12개 질문으로 알아보는 나의 개발자 MBTI!",
  openGraph: {
    title: "나의 개발자 MBTI는? | Kiro",
    description: "AI 시대, 당신은 어떤 개발자? 12개 질문으로 알아보세요!",
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
        {children}
      </body>
    </html>
  );
}
