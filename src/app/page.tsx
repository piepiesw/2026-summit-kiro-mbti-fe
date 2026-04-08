"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Logo / Title */}
        <div className="animate-fade-in space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            AWS Summit Seoul 2025
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            나의{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              개발자 MBTI
            </span>
            는?
          </h1>

          <p className="text-lg text-white/60 leading-relaxed">
            AI 시대, 당신은 어떤 타입의 개발자인가요?
            <br />
            12개 질문으로 알아보세요!
          </p>
        </div>

        {/* Preview cards */}
        <div className="animate-fade-in-delay-1 grid grid-cols-4 gap-3 px-4">
          {[
            { emoji: "🧠", label: "E / I" },
            { emoji: "📋", label: "S / N" },
            { emoji: "💡", label: "T / F" },
            { emoji: "📅", label: "J / P" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs text-white/50 font-mono">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="animate-fade-in-delay-2 space-y-4">
          <button
            onClick={() => router.push("/quiz")}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary text-background font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            테스트 시작하기
          </button>
          <p className="text-sm text-white/30">약 2분 소요</p>
        </div>

        {/* Footer */}
        <div className="animate-fade-in-delay-3 pt-4">
          <p className="text-xs text-white/20">
            Powered by Kiro
          </p>
        </div>
      </div>
    </main>
  );
}
