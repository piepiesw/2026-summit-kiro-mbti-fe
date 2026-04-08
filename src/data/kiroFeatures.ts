import type { AxisDirection } from "./questions";

export interface KiroFeature {
  id: string;
  emoji: string;
  name: string;
  description: string;
}

export const kiroFeatures: Record<string, KiroFeature> = {
  steering: {
    id: "steering",
    emoji: "📏",
    name: "Steering",
    description: "마크다운으로 AI 행동 규칙을 프로젝트별로 설정",
  },
  powers: {
    id: "powers",
    emoji: "⚡",
    name: "Powers",
    description: "MCP 도구 + 전문지식을 문맥에 따라 동적 로딩",
  },
  agent: {
    id: "agent",
    emoji: "🤖",
    name: "Autonomous Agent",
    description: "샌드박스에서 비동기 작업, PR까지 자동 생성",
  },
  specs: {
    id: "specs",
    emoji: "📐",
    name: "Specs",
    description: "자연어 → 요구사항 → 설계 → 태스크 자동 분해",
  },
  vibe: {
    id: "vibe",
    emoji: "🎨",
    name: "Vibe Coding",
    description: "자연어 대화로 바로 코드 생성",
  },
  hooks: {
    id: "hooks",
    emoji: "🔄",
    name: "Hooks",
    description: "IDE 이벤트에 자동 트리거 (테스트 생성, 품질 체크)",
  },
};

// Scoring weights per MBTI axis direction
const mbtiWeights: Record<AxisDirection, Record<string, number>> = {
  // E/I
  E: { powers: 2, steering: 1 },
  I: { agent: 2, hooks: 1 },
  // S/N
  S: { specs: 2, steering: 1 },
  N: { vibe: 2, powers: 1 },
  // T/F
  T: { hooks: 2, steering: 1 },
  F: { steering: 2, powers: 1 },
  // J/P
  J: { specs: 2, hooks: 1 },
  P: { vibe: 2, agent: 1 },
};

// Profile answer weights
const profileStyleWeights: Record<string, Record<string, number>> = {
  autonomous: { agent: 2 },
  interactive: { specs: 2 },
  manual: { hooks: 2 },
};

const profileExpectationWeights: Record<string, Record<string, number>> = {
  autonomous: { agent: 3 },
  spec: { specs: 3 },
  vibe: { vibe: 3 },
  hooks: { hooks: 3 },
};

export function computeTop3(
  mbtiScores: Record<string, number>,
  profile: Record<string, string>
): KiroFeature[] {
  const featureScores: Record<string, number> = {
    steering: 0,
    powers: 0,
    agent: 0,
    specs: 0,
    vibe: 0,
    hooks: 0,
  };

  // Apply MBTI weights based on which direction won each axis
  const axes: [AxisDirection, AxisDirection][] = [
    ["E", "I"],
    ["S", "N"],
    ["T", "F"],
    ["J", "P"],
  ];

  for (const [a, b] of axes) {
    const scoreA = mbtiScores[a] || 0;
    const scoreB = mbtiScores[b] || 0;
    // Winner gets full weight, loser gets partial
    const winner = scoreA >= scoreB ? a : b;
    const weights = mbtiWeights[winner];
    for (const [feat, w] of Object.entries(weights)) {
      featureScores[feat] += w;
    }
  }

  // Apply profile weights
  const style = profile.ai_style;
  if (style && profileStyleWeights[style]) {
    for (const [feat, w] of Object.entries(profileStyleWeights[style])) {
      featureScores[feat] += w;
    }
  }

  const expectation = profile.ai_expectation;
  if (expectation && profileExpectationWeights[expectation]) {
    for (const [feat, w] of Object.entries(
      profileExpectationWeights[expectation]
    )) {
      featureScores[feat] += w;
    }
  }

  // Sort and return top 3
  const sorted = Object.entries(featureScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => kiroFeatures[id]);

  return sorted;
}
