import type { AxisDirection } from "./questions";

export interface KiroFeature {
  id: string;
  emoji: string;
  icon: string;
  name: string;
  description: string;
}

export const kiroFeatures: Record<string, KiroFeature> = {
  steering: {
    id: "steering",
    emoji: "📏",
    icon: "/kiro_functions/hero-img-15.png",
    name: "Steering",
    description: "將專案的技術堆疊、程式撰寫慣例與架構規則定義在 Markdown 檔案中，AI 就會在每次對話中自動遵循。不必每次重新說明相同的脈絡，整個團隊都能產生一致的程式碼。",
  },
  powers: {
    id: "powers",
    emoji: "⚡",
    icon: "/kiro_functions/hero-img-2.png",
    name: "Powers",
    description: "透過 MCP 協定連接 Stripe、Supabase、Figma 等外部工具，並在需要時才動態載入。可節省約 40% 的上下文視窗，同時讓 AI 自動挑選正確的工具來使用。",
  },
  agent: {
    id: "agent",
    emoji: "🤖",
    icon: "/kiro_functions/hero-img-4.png",
    name: "Kiro Web (Autonomous)",
    description: "在隔離的沙盒中以非同步方式執行複雜任務，完成後還會自動建立 PR。開發者只需專注在程式碼審查，實作就交給 Agent 處理。",
  },
  specs: {
    id: "specs",
    emoji: "📐",
    icon: "/kiro_functions/hero-img-9.png",
    name: "Specs",
    description: "一句自然語言會自動拆解成需求 → 技術設計 → 可執行的任務，並包含以 EARS 表示法撰寫的驗收標準，把模糊的請求變成有系統的開發計畫。",
  },
  vibe: {
    id: "vibe",
    emoji: "🎨",
    icon: "/kiro_functions/hero-img-3.png",
    name: "Vibe Coding",
    description: "有靈感時，就用自然語言像聊天一樣寫出程式碼。可自由帶入程式碼、圖片與檔案快速做原型，變更內容可先用 diff 確認後再套用。",
  },
  hooks: {
    id: "hooks",
    emoji: "🔄",
    icon: "/kiro_functions/hero-img-1.png",
    name: "Hooks",
    description: "自動回應檔案儲存、任務完成等 IDE 事件，執行測試產生、安全掃描與文件更新。把重複性的品質檢查自動化，從源頭杜絕失誤。",
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
