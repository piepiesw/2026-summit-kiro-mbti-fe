"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { results } from "@/data/results";
import { computeTop3, computeTop3FromType, kiroFeatures, type KiroFeature } from "@/data/kiroFeatures";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "ENFP";
  const result = results[type] || results["ENFP"];

  const [top3, setTop3] = useState<KiroFeature[]>([]);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);

    // 1) URL에 기능 ID가 있으면 그대로 사용 (QR/공유 링크)
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

    // 2) sessionStorage (같은 기기에서 퀴즈 직접 푼 경우)
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

    // 3) MBTI 타입만으로 계산
    setTop3(computeTop3FromType(type));
  }, [type, searchParams]);

  const handleRetry = () => {
    router.push("/");
  };

  const bestMatchResult = results[result.bestMatch];
  const challengeMatchResult = results[result.challengeMatch];

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-14 xl:py-16 max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto w-full">
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
      {/* Result Card */}
      <div className="animate-fade-in w-full">
        <div className="result-card bg-background p-8 md:p-12 lg:p-14 xl:p-16 space-y-6 md:space-y-8 lg:space-y-10">
          {/* Type badge */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: "#c084fc" }}>
              나의 Kiro MBTI는?
            </h2>
            <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] mx-auto mt-6 md:mt-10 lg:mt-12 -mb-4 md:-mb-6 lg:-mb-8">
              {/* Purple glow behind character */}
              <div
                className="absolute inset-0 w-full h-full rounded-full pointer-events-none blur-3xl"
                style={{
                  background: "radial-gradient(circle, rgba(124,92,252,0.5) 0%, rgba(124,92,252,0.25) 40%, rgba(100,60,255,0.1) 65%, transparent 85%)",
                  transform: "scale(2.2)",
                  animation: "glowPulse 4s ease-in-out infinite",
                }}
              />
              {/* Secondary glow layer for depth */}
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
                className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-mono tracking-wider"
                style={{
                  background: `linear-gradient(135deg, var(--accent), var(--accent-secondary))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {result.type}
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2">{result.title}</h2>
              <p className="text-white/50 mt-1 md:text-lg lg:text-xl">{result.subtitle}</p>
            </div>
          </div>

          {/* Quote */}
          <div className="animate-fade-in-delay-1">
            <div className="relative px-6 py-4 lg:px-8 lg:py-5 rounded-xl bg-white/5 border border-white/10">
              <span className="absolute -top-3 left-4 text-2xl lg:text-3xl text-accent/40">&ldquo;</span>
              <p className="text-white/80 text-center italic leading-relaxed md:text-lg lg:text-xl">
                {result.quote}
              </p>
              <span className="absolute -bottom-3 right-4 text-2xl lg:text-3xl text-accent/40">&rdquo;</span>
            </div>
          </div>

          {/* Description */}
          <div className="animate-fade-in-delay-1">
            <p className="text-white/70 leading-relaxed text-center md:text-lg lg:text-xl">
              {result.description}
            </p>
          </div>

          {/* Strengths */}
          <div className="animate-fade-in-delay-2 space-y-4 pt-4 lg:pt-6">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-accent uppercase tracking-wider">
              Strengths
            </h3>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {result.strengths.map((s) => (
                <span
                  key={s}
                  className="px-5 py-2 md:px-6 md:py-2.5 lg:px-7 lg:py-3 rounded-full bg-accent/10 text-accent text-base md:text-lg lg:text-xl font-medium border border-accent/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Kiro Top 3 추천 기능 */}
          {top3.length > 0 && (
            <div className="animate-fade-in-delay-3 space-y-3 pt-4 lg:pt-6">
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-accent uppercase tracking-wider">
                당신에게 맞는 Kiro 기능 Top 3
              </h3>
              <div className="space-y-2 lg:space-y-3">
                {top3.map((feature, i) => (
                  <div key={feature.id}>
                    <button
                      onClick={() =>
                        setExpandedFeature(
                          expandedFeature === feature.id ? null : feature.id
                        )
                      }
                      className="w-full flex items-center gap-4 p-4 lg:p-5 rounded-xl bg-gradient-to-br from-accent/5 to-accent-secondary/5 border border-white/10 hover:border-accent/30 transition-all cursor-pointer"
                    >
                      <span className="text-xs font-mono text-accent/60 font-bold">
                        #{i + 1}
                      </span>
                      <span className="text-xl">{feature.emoji}</span>
                      <span className="font-bold text-white text-lg lg:text-xl flex-1 text-left">
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
                        <p className="text-sm lg:text-base text-white/60 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 lg:p-5 rounded-xl bg-gradient-to-r from-accent/10 to-accent-secondary/10 border border-accent/30 text-center">
                <p className="text-base lg:text-lg font-bold text-white">
                  StoryLane 부스에서 이 기능들을 직접 체험해보세요!
                </p>
              </div>
            </div>
          )}

          {/* 궁합 */}
          <div className="animate-fade-in-delay-4 space-y-4 pt-4 lg:pt-6">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-accent uppercase tracking-wider">
              궁합
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              {/* Best Match */}
              <div className="p-5 lg:p-6 rounded-2xl bg-accent/5 border border-accent/20 space-y-4">
                <div className="text-sm lg:text-base text-accent font-bold">잘 맞는 조합</div>
                <div className="flex items-center gap-4 lg:gap-5">
                  <span className="text-3xl lg:text-4xl">{bestMatchResult?.emoji}</span>
                  <div>
                    <div className="text-lg lg:text-xl font-bold font-mono text-accent">
                      {result.bestMatch}
                    </div>
                    <div className="text-sm lg:text-base text-white/60">
                      {bestMatchResult?.title}
                    </div>
                  </div>
                </div>
                <p className="text-sm lg:text-base text-white/50 leading-relaxed">
                  {result.bestMatchComment}
                </p>
              </div>
              {/* Challenge Match */}
              <div className="p-5 lg:p-6 rounded-2xl bg-accent-secondary/5 border border-accent-secondary/20 space-y-4">
                <div className="text-sm lg:text-base text-accent-secondary font-bold">
                  안 맞는 조합
                </div>
                <div className="flex items-center gap-4 lg:gap-5">
                  <span className="text-3xl lg:text-4xl">
                    {challengeMatchResult?.emoji}
                  </span>
                  <div>
                    <div className="text-lg lg:text-xl font-bold font-mono text-accent-secondary">
                      {result.challengeMatch}
                    </div>
                    <div className="text-sm lg:text-base text-white/60">
                      {challengeMatchResult?.title}
                    </div>
                  </div>
                </div>
                <p className="text-sm lg:text-base text-white/50 leading-relaxed">
                  {result.challengeMatchComment}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {currentUrl && (
            <div className="animate-fade-in-delay-4 flex flex-col items-center space-y-2 pt-6 lg:pt-8">
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-accent uppercase tracking-wider">
                QR로 결과 가져가기
              </h3>
              <div className="p-3 lg:p-4 bg-white rounded-xl">
                <QRCodeSVG value={currentUrl} size={120} className="lg:!w-[160px] lg:!h-[160px]" />
              </div>
              <p className="text-xs text-white/30">
                카메라로 스캔하면 이 결과를 바로 볼 수 있어요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="animate-fade-in-delay-4 w-full max-w-md lg:max-w-lg mx-auto mt-8 lg:mt-10">
        <button
          onClick={handleRetry}
          className="w-full py-4 px-8 lg:py-5 lg:px-10 rounded-2xl font-medium lg:text-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md"
          style={{
            background: "rgba(144, 70, 255, 0.06)",
            border: "1px solid rgba(144, 70, 255, 0.2)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          다시 테스트하기
        </button>
      </div>

      {/* Footer */}
      <div className="pt-6 text-xs text-white/20">Powered by Kiro</div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white/40">결과 계산 중...</div>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
