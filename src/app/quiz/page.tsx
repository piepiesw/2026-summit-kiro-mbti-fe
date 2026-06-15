"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  profileQuestions,
  mbtiQuestions,
  type AxisDirection,
} from "@/data/questions";
import { computeTop3 } from "@/data/kiroFeatures";

type Phase = "profile" | "mbti";

const TOTAL = profileQuestions.length + mbtiQuestions.length;

export default function QuizPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("profile");
  const [profileIndex, setProfileIndex] = useState(0);
  const [mbtiIndex, setMbtiIndex] = useState(0);

  const [profileAnswers, setProfileAnswers] = useState<Record<string, string>>(
    {}
  );
  const [mbtiAnswers, setMbtiAnswers] = useState<AxisDirection[]>([]);

  const computeScores = (answers: AxisDirection[]) => {
    const scores: Record<AxisDirection, number> = {
      E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
    };
    answers.forEach((dir) => { scores[dir]++; });
    return scores;
  };

  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState<"in" | "out">("in");

  const globalIndex =
    phase === "profile"
      ? profileIndex
      : profileQuestions.length + mbtiIndex;
  const progressPercent = ((globalIndex + 1) / TOTAL) * 100;

  const transition = useCallback((onDone: () => void) => {
    setAnimating(true);
    setSlideDir("out");
    setTimeout(() => {
      onDone();
      setSlideDir("in");
      setTimeout(() => setAnimating(false), 50);
    }, 300);
  }, []);

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

  const handleMBTIChoice = useCallback(
    (dir: AxisDirection) => {
      if (animating) return;
      const newAnswers = [...mbtiAnswers, dir];
      setMbtiAnswers(newAnswers);

      const isLast = mbtiIndex + 1 >= mbtiQuestions.length;

      if (isLast) {
        setAnimating(true);
        setSlideDir("out");

        const scores = computeScores(newAnswers);
        const type = [
          scores.E >= scores.I ? "E" : "I",
          scores.S >= scores.N ? "S" : "N",
          scores.T >= scores.F ? "T" : "F",
          scores.J >= scores.P ? "J" : "P",
        ].join("");

        sessionStorage.setItem("kiro-mbti-result", JSON.stringify({
          profile: { ...profileAnswers },
          mbtiAnswers: newAnswers,
          mbtiScores: scores,
          type,
        }));

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

        const top3 = computeTop3(scores, profileAnswers);
        const featureIds = top3.map((f) => f.id).join(",");

        setTimeout(() => {
          router.push(`/result?type=${type}&f=${featureIds}`);
        }, 300);
      } else {
        transition(() => {
          setMbtiIndex(mbtiIndex + 1);
        });
      }
    },
    [animating, mbtiAnswers, mbtiIndex, profileAnswers, router, transition]
  );

  const handleGoBack = useCallback(() => {
    if (animating) return;
    if (phase === "profile" && profileIndex === 0) return;

    transition(() => {
      if (phase === "mbti" && mbtiIndex === 0) {
        setPhase("profile");
        setProfileIndex(profileQuestions.length - 1);
      } else if (phase === "mbti") {
        setMbtiAnswers((prev) => prev.slice(0, -1));
        setMbtiIndex(mbtiIndex - 1);
      } else {
        setProfileIndex(profileIndex - 1);
      }
    });
  }, [animating, phase, profileIndex, mbtiIndex, mbtiAnswers, transition]);

  const canGoBack = !(phase === "profile" && profileIndex === 0);

  const isProfile = phase === "profile";
  const partLabel = isProfile ? "PART 1 — 關於你" : "PART 2 — MBTI 測驗";

  const currentChoicesCount = isProfile
    ? profileQuestions[profileIndex].choices.length
    : 2;
  const isDense = currentChoicesCount >= 6;

  const profileChoicePadding = isDense ? "p-2.5" : "p-3";
  const profileChoiceGap = "gap-2.5";
  const profileChoiceText = "text-sm";
  const profileHeaderMargin = isDense ? "mb-3" : "mb-4";
  const profileQuestionSize = isDense ? "text-base" : "text-lg";
  const profileGridGap = isDense ? "gap-2" : "gap-2.5";
  const profileLetterSize = isDense
    ? "w-6 h-6 text-[10px]"
    : "w-6 h-6 text-xs";

  return (
    <main className="h-dvh flex flex-col items-center justify-between px-4 py-3 max-w-lg mx-auto w-full overflow-hidden">
      {/* Progress */}
      <div className="w-full space-y-2 shrink-0">
        <div className="flex justify-between items-center text-xs text-white/40">
          <span className="font-mono">
            {globalIndex + 1} / {TOTAL}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-secondary rounded-full progress-glow transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-[10px] text-white/30 text-center">{partLabel}</div>
      </div>

      {/* Question area */}
      <div
        className={`flex-1 min-h-0 flex flex-col items-center justify-center w-full py-2 ${
          slideDir === "in" ? "animate-slide-in" : "animate-slide-out"
        }`}
        key={`${phase}-${isProfile ? profileIndex : mbtiIndex}`}
      >
        {isProfile ? (
          <>
            <div className={`text-center space-y-1.5 ${profileHeaderMargin} shrink-0`}>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-mono">
                {profileQuestions[profileIndex].statLabel}
              </span>
              <h2 className={`${profileQuestionSize} font-bold leading-snug break-keep`}>
                {profileQuestions[profileIndex].question}
              </h2>
            </div>
            <div className={`w-full grid ${profileGridGap} min-h-0`}>
              {profileQuestions[profileIndex].choices.map((c, i) => (
                <button
                  key={c.value}
                  onClick={() => handleProfileChoice(c.value)}
                  disabled={animating}
                  className={`choice-card w-full ${profileChoicePadding} rounded-lg bg-white/5 border border-white/10 text-left hover:bg-white/10 hover:border-accent/30 transition-all cursor-pointer disabled:cursor-default`}
                >
                  <div className={`flex items-center ${profileChoiceGap}`}>
                    <span className={`shrink-0 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold ${profileLetterSize}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`${profileChoiceText} leading-relaxed`}>{c.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center space-y-3 mb-6 shrink-0">
              <span className="inline-block text-sm text-accent font-mono font-bold tracking-wider">
                Q{mbtiQuestions[mbtiIndex].id}
              </span>
              <h2 className="text-lg font-bold leading-snug break-keep">
                {mbtiQuestions[mbtiIndex].question}
              </h2>
            </div>
            <div className="w-full space-y-3">
              {mbtiQuestions[mbtiIndex].choices.map((c, i) => (
                <button
                  key={c.direction}
                  onClick={() => handleMBTIChoice(c.direction)}
                  disabled={animating}
                  className="choice-card w-full p-3 rounded-xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all cursor-pointer disabled:cursor-default"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={
                        i === 0
                          ? { background: "rgba(144, 70, 255, 0.15)", color: "#9046FF" }
                          : { background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }
                      }
                    >
                      {i === 0 ? "A" : "B"}
                    </span>
                    <span className="text-sm leading-relaxed">{c.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Back button + footer */}
      <div className="shrink-0 flex flex-col items-center gap-1.5">
        {canGoBack ? (
          <button
            onClick={handleGoBack}
            disabled={animating}
            className="flex items-center gap-1.5 py-1.5 px-4 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all cursor-pointer disabled:cursor-default"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs">上一題</span>
          </button>
        ) : (
          <div className="h-7" aria-hidden />
        )}
        <div className="text-[10px] text-white/20">Kiro MBTI</div>
      </div>
    </main>
  );
}
