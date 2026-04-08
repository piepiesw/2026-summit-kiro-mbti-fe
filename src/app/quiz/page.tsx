"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  profileQuestions,
  mbtiQuestions,
  type AxisDirection,
} from "@/data/questions";

type Phase = "profile" | "mbti";

const TOTAL = profileQuestions.length + mbtiQuestions.length;

export default function QuizPage() {
  const router = useRouter();

  // Phase & index
  const [phase, setPhase] = useState<Phase>("profile");
  const [profileIndex, setProfileIndex] = useState(0);
  const [mbtiIndex, setMbtiIndex] = useState(0);

  // Collected data
  const [profileAnswers, setProfileAnswers] = useState<Record<string, string>>(
    {}
  );
  const [mbtiAnswers, setMbtiAnswers] = useState<AxisDirection[]>([]);

  // 점수는 항상 answers 배열에서 계산 (별도 state 없음 → 꼬일 수 없음)
  const computeScores = (answers: AxisDirection[]) => {
    const scores: Record<AxisDirection, number> = {
      E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
    };
    answers.forEach((dir) => { scores[dir]++; });
    return scores;
  };

  // Animation
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState<"in" | "out">("in");

  // Progress
  const globalIndex =
    phase === "profile"
      ? profileIndex
      : profileQuestions.length + mbtiIndex;
  const progressPercent = ((globalIndex + 1) / TOTAL) * 100;

  // Transition helper
  const transition = useCallback((onDone: () => void) => {
    setAnimating(true);
    setSlideDir("out");
    setTimeout(() => {
      onDone();
      setSlideDir("in");
      setTimeout(() => setAnimating(false), 50);
    }, 300);
  }, []);

  // ---- Profile choice handler ----
  const handleProfileChoice = useCallback(
    (value: string) => {
      if (animating) return;
      const current = profileQuestions[profileIndex];
      const newAnswers = { ...profileAnswers, [current.id]: value };
      setProfileAnswers(newAnswers);

      transition(() => {
        if (profileIndex + 1 >= profileQuestions.length) {
          setPhase("mbti");
        } else {
          setProfileIndex(profileIndex + 1);
        }
      });
    },
    [animating, profileIndex, profileAnswers, transition]
  );

  // ---- MBTI choice handler ----
  const handleMBTIChoice = useCallback(
    (dir: AxisDirection) => {
      if (animating) return;
      const newAnswers = [...mbtiAnswers, dir];
      setMbtiAnswers(newAnswers);

      transition(() => {
        if (mbtiIndex + 1 >= mbtiQuestions.length) {
          const scores = computeScores(newAnswers);
          const type = [
            scores.E >= scores.I ? "E" : "I",
            scores.S >= scores.N ? "S" : "N",
            scores.T >= scores.F ? "T" : "F",
            scores.J >= scores.P ? "J" : "P",
          ].join("");

          // Save to sessionStorage (for result page)
          const localPayload = {
            profile: { ...profileAnswers },
            mbtiAnswers: newAnswers,
            mbtiScores: scores,
            type,
          };
          sessionStorage.setItem("kiro-mbti-result", JSON.stringify(localPayload));

          // Submit to API (flat structure)
          const apiPayload: Record<string, string> = {
            mbti_type: type,
            role: profileAnswers.role,
            ai_frequency: profileAnswers.ai_frequency,
            ai_style: profileAnswers.ai_style,
            ai_expectation: profileAnswers.ai_expectation,
          };
          newAnswers.forEach((dir, i) => {
            apiPayload[`q${i + 1}`] = dir;
          });
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiPayload),
          }).catch(() => {});

          router.push(`/result?type=${type}`);
        } else {
          setMbtiIndex(mbtiIndex + 1);
        }
      });
    },
    [animating, mbtiAnswers, mbtiIndex, profileAnswers, router, transition]
  );

  // ---- Go back handler ----
  const handleGoBack = useCallback(() => {
    if (animating) return;
    if (phase === "profile" && profileIndex === 0) return; // 첫 질문이면 무시

    transition(() => {
      if (phase === "mbti" && mbtiIndex === 0) {
        // MBTI 첫 문항 → 프로필 마지막 문항으로
        setPhase("profile");
        setProfileIndex(profileQuestions.length - 1);
      } else if (phase === "mbti") {
        // MBTI 이전 문항으로: 답변만 제거 (점수는 자동 계산)
        setMbtiAnswers((prev) => prev.slice(0, -1));
        setMbtiIndex(mbtiIndex - 1);
      } else {
        // 프로필 이전 문항으로
        setProfileIndex(profileIndex - 1);
      }
    });
  }, [animating, phase, profileIndex, mbtiIndex, mbtiAnswers, transition]);

  const canGoBack = !(phase === "profile" && profileIndex === 0);

  // ---- Render ----
  const isProfile = phase === "profile";
  const partLabel = isProfile ? "PART 1 — 나에 대해" : "PART 2 — MBTI 검사";

  return (
    <main className="flex-1 flex flex-col items-center justify-between px-6 py-8 max-w-lg mx-auto w-full">
      {/* Progress */}
      <div className="w-full space-y-3">
        <div className="flex justify-between items-center text-sm text-white/40">
          <span className="font-mono">
            {globalIndex + 1} / {TOTAL}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-secondary rounded-full progress-glow transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {/* Part label */}
        <div className="text-xs text-white/30 text-center">{partLabel}</div>
      </div>

      {/* Question area */}
      <div
        className={`flex-1 flex flex-col items-center justify-center w-full ${
          slideDir === "in" ? "animate-slide-in" : "animate-slide-out"
        }`}
        key={`${phase}-${isProfile ? profileIndex : mbtiIndex}`}
      >
        {isProfile ? (
          // ===== PROFILE QUESTION =====
          <>
            <div className="text-center space-y-2 mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-mono">
                {profileQuestions[profileIndex].statLabel}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
                {profileQuestions[profileIndex].question}
              </h2>
            </div>
            <div className="w-full grid gap-3">
              {profileQuestions[profileIndex].choices.map((c, i) => (
                <button
                  key={c.value}
                  onClick={() => handleProfileChoice(c.value)}
                  disabled={animating}
                  className="choice-card w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 hover:border-accent/30 transition-all cursor-pointer disabled:cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-base leading-relaxed">{c.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          // ===== MBTI QUESTION =====
          <>
            <div className="text-center space-y-2 mb-10">
              <span className="text-sm text-accent font-mono">
                Q{mbtiQuestions[mbtiIndex].id}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
                {mbtiQuestions[mbtiIndex].question}
              </h2>
            </div>
            <div className="w-full space-y-4">
              {mbtiQuestions[mbtiIndex].choices.map((c, i) => (
                <button
                  key={c.direction}
                  onClick={() => handleMBTIChoice(c.direction)}
                  disabled={animating}
                  className={`choice-card w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all cursor-pointer disabled:cursor-default ${
                    i === 0
                      ? "hover:border-accent/30"
                      : "hover:border-accent-secondary/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0
                          ? "bg-accent/10 text-accent"
                          : "bg-accent-secondary/10 text-accent-secondary"
                      }`}
                    >
                      {i === 0 ? "A" : "B"}
                    </span>
                    <span className="text-lg leading-relaxed">{c.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Back button */}
      {canGoBack && (
        <button
          onClick={handleGoBack}
          disabled={animating}
          className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all cursor-pointer disabled:cursor-default"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm">이전 질문</span>
        </button>
      )}

      {/* Footer */}
      <div className="text-xs text-white/20 pt-4">Kiro Developer MBTI</div>
    </main>
  );
}
