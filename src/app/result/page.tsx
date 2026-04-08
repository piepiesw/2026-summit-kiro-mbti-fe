"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { results } from "@/data/results";
import { computeTop3, type KiroFeature } from "@/data/kiroFeatures";
import { QRCodeSVG } from "qrcode.react";

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
    try {
      const saved = sessionStorage.getItem("kiro-mbti-result");
      if (saved) {
        const data = JSON.parse(saved);
        const features = computeTop3(data.mbtiScores, data.profile);
        setTop3(features);
      }
    } catch {
      // fallback: no profile data
    }
  }, []);

  const handleRetry = () => {
    router.push("/");
  };

  const handleShare = async () => {
    const featureNames = top3.map((f) => `${f.emoji} ${f.name}`).join(", ");
    const shareText = `나의 Kiro MBTI는 ${result.type} "${result.title}"! ${result.emoji}\n\n추천 Kiro 기능: ${featureNames}\n\nAI 시대, 당신은 어떤 타입?\n`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Kiro MBTI", text: shareText });
      } catch {
        await navigator.clipboard.writeText(shareText);
        alert("결과가 복사되었습니다!");
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("결과가 복사되었습니다!");
    }
  };

  const bestMatchResult = results[result.bestMatch];
  const challengeMatchResult = results[result.challengeMatch];

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full">
      {/* Result Card */}
      <div className="animate-fade-in w-full">
        <div className="result-card bg-background p-8 space-y-6">
          {/* Type badge */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-sm text-white/50">나의 유형</span>
            </div>
            <div className="text-6xl">{result.emoji}</div>
            <div>
              <h1
                className="text-3xl font-bold font-mono tracking-wider"
                style={{
                  background: `linear-gradient(135deg, var(--accent), var(--accent-secondary))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {result.type}
              </h1>
              <h2 className="text-2xl font-bold mt-2">{result.title}</h2>
              <p className="text-white/50 mt-1">{result.subtitle}</p>
            </div>
          </div>

          {/* Quote */}
          <div className="animate-fade-in-delay-1">
            <div className="relative px-6 py-4 rounded-xl bg-white/5 border border-white/10">
              <span className="absolute -top-3 left-4 text-2xl text-accent/40">&ldquo;</span>
              <p className="text-white/80 text-center italic leading-relaxed">
                {result.quote}
              </p>
              <span className="absolute -bottom-3 right-4 text-2xl text-accent/40">&rdquo;</span>
            </div>
          </div>

          {/* Description */}
          <div className="animate-fade-in-delay-1">
            <p className="text-white/70 leading-relaxed text-center">
              {result.description}
            </p>
          </div>

          {/* Strengths */}
          <div className="animate-fade-in-delay-2 space-y-3">
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider">
              Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.strengths.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm border border-accent/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Kiro Top 3 추천 기능 */}
          {top3.length > 0 && (
            <div className="animate-fade-in-delay-3 space-y-3">
              <h3 className="text-sm font-bold text-accent uppercase tracking-wider">
                당신에게 맞는 Kiro 기능 Top 3
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
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-accent/5 to-accent-secondary/5 border border-white/10 hover:border-accent/30 transition-all cursor-pointer"
                    >
                      <span className="text-xs font-mono text-accent/60 font-bold">
                        #{i + 1}
                      </span>
                      <span className="text-xl">{feature.emoji}</span>
                      <span className="font-bold text-white text-lg flex-1 text-left">
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
              <p className="text-sm text-accent text-center pt-2">
                StoryLane 부스에서 이 기능들을 직접 체험해보세요!
              </p>
            </div>
          )}

          {/* 궁합 */}
          <div className="animate-fade-in-delay-4 space-y-3">
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider">
              궁합
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Best Match */}
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-2">
                <div className="text-xs text-accent font-bold">찰떡 궁합</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{bestMatchResult?.emoji}</span>
                  <div>
                    <div className="font-bold font-mono text-accent">
                      {result.bestMatch}
                    </div>
                    <div className="text-xs text-white/50">
                      {bestMatchResult?.title}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  {result.bestMatchComment}
                </p>
              </div>
              {/* Challenge Match */}
              <div className="p-4 rounded-xl bg-accent-secondary/5 border border-accent-secondary/20 space-y-2">
                <div className="text-xs text-accent-secondary font-bold">
                  다른 매력의 조합
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {challengeMatchResult?.emoji}
                  </span>
                  <div>
                    <div className="font-bold font-mono text-accent-secondary">
                      {result.challengeMatch}
                    </div>
                    <div className="text-xs text-white/50">
                      {challengeMatchResult?.title}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  {result.challengeMatchComment}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {currentUrl && (
            <div className="animate-fade-in-delay-4 flex flex-col items-center space-y-2 pt-2">
              <h3 className="text-sm font-bold text-accent uppercase tracking-wider">
                QR로 결과 가져가기
              </h3>
              <div className="p-3 bg-white rounded-xl">
                <QRCodeSVG value={currentUrl} size={120} />
              </div>
              <p className="text-xs text-white/30">
                카메라로 스캔하면 이 결과를 바로 볼 수 있어요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="animate-fade-in-delay-4 w-full space-y-3 mt-8">
        <button
          onClick={handleShare}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary text-background font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          결과 공유하기
        </button>
        <button
          onClick={handleRetry}
          className="w-full py-4 px-8 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-medium hover:bg-white/10 transition-colors cursor-pointer"
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
