"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { results } from "@/data/results";
import { computeTop3, computeTop3FromType, kiroFeatures, type KiroFeature } from "@/data/kiroFeatures";
import Image from "next/image";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "ENFP";
  const result = results[type] || results["ENFP"];

  const [top3, setTop3] = useState<KiroFeature[]>([]);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  useEffect(() => {
    const featureParam = searchParams.get("f");
    if (featureParam) {
      const features = featureParam
        .split(",")
        .map((id) => kiroFeatures[id])
        .filter(Boolean);
      if (features.length > 0) {
        setTop3(features);
        return;
      }
    }

    try {
      const saved = sessionStorage.getItem("kiro-mbti-result");
      if (saved) {
        const data = JSON.parse(saved);
        const features = computeTop3(data.mbtiScores, data.profile);
        setTop3(features);
        return;
      }
    } catch {
      // fallback below
    }

    setTop3(computeTop3FromType(type));
  }, [type, searchParams]);

  const handleRetry = () => {
    router.push("/");
  };

  const bestMatchResult = results[result.bestMatch];
  const challengeMatchResult = results[result.challengeMatch];

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-6 max-w-lg mx-auto w-full">
      <style>{`
        @keyframes ghostFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(2.2); }
          50% { opacity: 1; transform: scale(2.5); }
        }
      `}</style>
      <div className="animate-fade-in w-full">
        <div className="result-card bg-background p-5 space-y-5">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold" style={{ color: "#c084fc" }}>
              我的 Kiro MBTI 是？
            </h2>
            <div className="relative w-56 h-56 mx-auto mt-4 -mb-2">
              <div
                className="absolute inset-0 w-full h-full rounded-full pointer-events-none blur-3xl"
                style={{
                  background: "radial-gradient(circle, rgba(124,92,252,0.5) 0%, rgba(124,92,252,0.25) 40%, rgba(100,60,255,0.1) 65%, transparent 85%)",
                  transform: "scale(2.2)",
                  animation: "glowPulse 4s ease-in-out infinite",
                }}
              />
              <div
                className="absolute inset-0 w-full h-full rounded-full pointer-events-none blur-2xl"
                style={{
                  background: "radial-gradient(circle, rgba(160,120,255,0.3) 0%, transparent 60%)",
                  transform: "scale(1.4)",
                  animation: "glowPulse 4s ease-in-out 2s infinite",
                }}
              />
              <Image
                src={`/kiro_characters/${type}.png`}
                alt={`${result.type} Kiro character`}
                fill
                className="object-contain"
                style={{
                  animation: "ghostFloat 3s ease-in-out infinite",
                  filter: "drop-shadow(0 0 6px rgba(124, 92, 252, 0.9)) drop-shadow(0 0 20px rgba(124, 92, 252, 0.6)) drop-shadow(0 0 50px rgba(124, 92, 252, 0.35))",
                }}
                priority
              />
            </div>
            <div>
              <h1
                className="text-2xl font-bold font-mono tracking-wider"
                style={{
                  background: `linear-gradient(135deg, var(--accent), var(--accent-secondary))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {result.type}
              </h1>
              <h2 className="text-xl font-bold mt-2">{result.title}</h2>
              <p className="text-white/50 mt-1 text-sm">{result.subtitle}</p>
            </div>
          </div>

          <div className="animate-fade-in-delay-1">
            <div className="relative px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <span className="absolute -top-3 left-4 text-2xl text-accent/40">&ldquo;</span>
              <p className="text-white/80 text-center italic leading-relaxed text-sm">
                {result.quote}
              </p>
              <span className="absolute -bottom-3 right-4 text-2xl text-accent/40">&rdquo;</span>
            </div>
          </div>

          <div className="animate-fade-in-delay-1">
            <p className="text-white/70 leading-relaxed text-center text-sm">
              {result.description}
            </p>
          </div>

          <div className="animate-fade-in-delay-2 space-y-4 pt-4">
            <h3 className="text-base font-bold text-accent uppercase tracking-wider">
              Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.strengths.map((s) => (
                <span
                  key={s}
                  className="px-3.5 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {top3.length > 0 && (
            <div className="animate-fade-in-delay-3 space-y-3 pt-4">
              <h3 className="text-base font-bold text-accent uppercase tracking-wider">
                最適合你的 Kiro 功能 Top 3
              </h3>
              <div className="space-y-2">
                {top3.map((feature, i) => (
                  <div key={feature.id}>
                    <button
                      onClick={() =>
                        setExpandedFeature(
                          expandedFeature === feature.id ? null : feature.id
                        )
                      }
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-accent/5 to-accent-secondary/5 border border-white/10 hover:border-accent/30 transition-all cursor-pointer"
                    >
                      <span className="text-xs font-mono text-accent/60 font-bold">
                        #{i + 1}
                      </span>
                      <span className="relative shrink-0 w-9 h-9 rounded-lg overflow-hidden">
                        <Image
                          src={feature.icon}
                          alt={feature.name}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </span>
                      <span className="font-bold text-white text-base flex-1 text-left">
                        {feature.name}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`text-white/30 transition-transform ${
                          expandedFeature === feature.id ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {expandedFeature === feature.id && (
                      <div className="mx-4 mt-1 px-4 py-3 rounded-b-xl bg-white/5 border border-t-0 border-white/10">
                        <p className="text-sm text-white/60 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="animate-fade-in-delay-4 space-y-4 pt-4">
            <h3 className="text-base font-bold text-accent uppercase tracking-wider">
              速配指數
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-3">
                <div className="text-sm text-accent font-bold">最速配</div>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0 w-16 h-16">
                    <Image
                      src={`/kiro_characters/${result.bestMatch}.png`}
                      alt={`${result.bestMatch} Kiro character`}
                      fill
                      sizes="96px"
                      className="object-contain"
                      style={{
                        filter:
                          "drop-shadow(0 0 6px rgba(124, 92, 252, 0.55)) drop-shadow(0 0 18px rgba(124, 92, 252, 0.3))",
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono text-accent">
                      {result.bestMatch}
                    </div>
                    <div className="text-sm text-white/60">
                      {bestMatchResult?.title}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  {result.bestMatchComment}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-accent-secondary/5 border border-accent-secondary/20 space-y-3">
                <div className="text-sm text-accent-secondary font-bold">
                  最不對盤
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0 w-16 h-16">
                    <Image
                      src={`/kiro_characters/${result.challengeMatch}.png`}
                      alt={`${result.challengeMatch} Kiro character`}
                      fill
                      sizes="96px"
                      className="object-contain"
                      style={{
                        filter:
                          "drop-shadow(0 0 6px rgba(192, 132, 252, 0.5)) drop-shadow(0 0 18px rgba(192, 132, 252, 0.25))",
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono text-accent-secondary">
                      {result.challengeMatch}
                    </div>
                    <div className="text-sm text-white/60">
                      {challengeMatchResult?.title}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  {result.challengeMatchComment}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="animate-fade-in-delay-4 w-full max-w-md mx-auto mt-6">
        <button
          onClick={handleRetry}
          className="w-full py-3.5 px-6 rounded-xl font-medium cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md"
          style={{
            background: "rgba(144, 70, 255, 0.06)",
            border: "1px solid rgba(144, 70, 255, 0.2)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          再測一次
        </button>
      </div>

      <div className="pt-6 text-xs text-white/20">Powered by Kiro</div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white/40">結果計算中…</div>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
