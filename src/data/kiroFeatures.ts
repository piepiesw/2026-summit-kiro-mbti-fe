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
    description: "프로젝트의 기술 스택, 코딩 컨벤션, 아키텍처 규칙을 마크다운 파일로 정의하면, AI가 모든 대화에서 자동으로 따릅니다. 매번 같은 맥락을 설명할 필요 없이 팀 전체가 일관된 코드를 생성할 수 있어요.",
  },
  powers: {
    id: "powers",
    emoji: "⚡",
    name: "Powers",
    description: "Stripe, Supabase, Figma 등 외부 도구를 MCP 프로토콜로 연결하고, 필요한 순간에만 동적으로 로딩합니다. 컨텍스트 윈도우를 약 40% 절약하면서도 AI가 정확한 도구를 알아서 골라 씁니다.",
  },
  agent: {
    id: "agent",
    emoji: "🤖",
    name: "Autonomous Agent",
    description: "복잡한 작업을 격리된 샌드박스에서 비동기로 실행하고, 완료되면 PR까지 자동 생성합니다. 개발자는 코드 리뷰에만 집중하고, 구현은 에이전트에게 맡길 수 있어요.",
  },
  specs: {
    id: "specs",
    emoji: "📐",
    name: "Specs",
    description: "자연어 한 줄이 요구사항 → 기술 설계 → 실행 가능한 태스크로 자동 분해됩니다. EARS 표기법의 수락 기준까지 포함되어, 모호한 요청이 체계적인 개발 계획으로 바뀌어요.",
  },
  vibe: {
    id: "vibe",
    emoji: "🎨",
    name: "Vibe Coding",
    description: "아이디어가 떠오르면 자연어로 대화하듯 코드를 만들어보세요. 코드, 이미지, 파일을 자유롭게 넘기면서 빠르게 프로토타이핑하고, 변경사항은 diff로 확인 후 적용할 수 있습니다.",
  },
  hooks: {
    id: "hooks",
    emoji: "🔄",
    name: "Hooks",
    description: "파일 저장, 태스크 완료 등 IDE 이벤트에 자동으로 반응하여 테스트 생성, 보안 스캔, 문서 업데이트를 실행합니다. 반복적인 품질 체크를 자동화해서 실수를 원천 차단해요.",
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
  writing: { specs: 2 },
  search: { steering: 2 },
  coding: { agent: 2 },
  brainstorming: { vibe: 2 },
  translation: { powers: 2 },
  none: {},
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

export function computeTop3FromType(type: string): KiroFeature[] {
  const scores: Record<string, number> = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  };
  for (const letter of type) {
    scores[letter] = 1;
  }
  return computeTop3(scores, {});
}
