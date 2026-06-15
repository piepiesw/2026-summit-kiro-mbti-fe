"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <style>{`
        @keyframes ghostFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[20%] w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(144, 70, 255, 0.06)" }} />
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(192, 132, 252, 0.04)" }} />
        <div className="absolute top-[60%] left-[60%] w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(107, 33, 168, 0.05)" }} />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-12">
        {/* Logo / Title */}
        <div className="animate-fade-in space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-white/70 backdrop-blur-md" style={{ background: "rgba(144, 70, 255, 0.08)", border: "1px solid rgba(144, 70, 255, 0.2)" }}>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ boxShadow: "0 0 8px rgba(144, 70, 255, 0.6)" }} />
            AWS Summit Taipei 2026
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            我的{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              Kiro MBTI
            </span>
            是？
          </h1>

          <p className="text-lg text-white/60 leading-relaxed">
            適合你的 Kiro 使用方式是什麼？
            <br />
            用 16 道問題找出來！
          </p>
        </div>

        {/* Kiro ghost + logo */}
        <div className="animate-fade-in-delay-1 relative flex flex-col items-center gap-6">
          {/* Purple glow behind ghost */}
          <div
            className="absolute top-0 left-1/2 w-[36rem] h-[36rem] rounded-full pointer-events-none blur-3xl"
            style={{
              transform: "translate(-50%, -20%)",
              background: "radial-gradient(circle, rgba(144,70,255,0.45) 0%, rgba(124,92,252,0.2) 40%, rgba(100,60,255,0.08) 65%, transparent 85%)",
              animation: "glowPulse 4s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-0 left-1/2 w-[28rem] h-[28rem] rounded-full pointer-events-none blur-2xl"
            style={{
              transform: "translate(-50%, -10%)",
              background: "radial-gradient(circle, rgba(160,120,255,0.25) 0%, transparent 55%)",
              animation: "glowPulse 4s ease-in-out 2s infinite",
            }}
          />
          <img
            src="/kiro_ghost.svg"
            alt="Kiro"
            className="relative w-56 h-56"
            style={{
              animation: "ghostFloat 3s ease-in-out infinite",
              filter: "drop-shadow(0 0 8px rgba(144, 70, 255, 0.9)) drop-shadow(0 0 24px rgba(144, 70, 255, 0.5)) drop-shadow(0 0 48px rgba(124, 92, 252, 0.3))",
            }}
          />
          <img
            src="/kiro_text.png"
            alt="KIRO"
            className="relative w-52"
          />
        </div>

        {/* CTA */}
        <div className="animate-fade-in-delay-2 space-y-4">
          <button
            onClick={() => router.push("/quiz")}
            className="group relative w-full max-w-md mx-auto py-4 px-8 rounded-2xl font-bold text-lg cursor-pointer overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #9046FF 0%, #b060ff 50%, #c084fc 100%)",
              color: "#fff",
              boxShadow: "0 4px 24px rgba(144, 70, 255, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <span className="relative z-10">開始測驗</span>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <p className="text-sm text-white/30">約需 2 分鐘</p>
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
