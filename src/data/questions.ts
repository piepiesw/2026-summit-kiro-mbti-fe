// ===== PART 1: 인사이트 수집 (프로필 질문) =====

export interface ProfileChoice {
  text: string;
  value: string;
}

export interface ProfileQuestion {
  id: string;
  question: string;
  statLabel: string; // 통계 라벨
  choices: ProfileChoice[];
}

export const profileQuestions: ProfileQuestion[] = [
  {
    id: "role",
    question: "你的職業是什麼？",
    statLabel: "職業",
    choices: [
      { text: "開發者 / 工程師", value: "developer" },
      { text: "PM / 產品企劃", value: "pm" },
      { text: "設計師", value: "designer" },
      { text: "資料分析師", value: "data" },
      { text: "行銷 / 商務 / 業務", value: "business" },
      { text: "學生 / 求職者", value: "student" },
      { text: "其他", value: "other" },
    ],
  },
  {
    id: "ai_frequency",
    question: "你多常使用 AI 助理？",
    statLabel: "使用 AI 的頻率",
    choices: [
      { text: "每天都用", value: "daily" },
      { text: "一週 2–3 次", value: "weekly" },
      { text: "偶爾用用", value: "sometimes" },
      { text: "很少用 / 幾乎沒用過", value: "rarely" },
    ],
  },
  {
    id: "ai_style",
    question: "你最常用 AI 做什麼？",
    statLabel: "AI主要的使用情境",
    choices: [
      { text: "撰寫文件", value: "writing" },
      { text: "搜尋 / 摘要資訊", value: "search" },
      { text: "寫程式", value: "coding" },
      { text: "腦力激盪想點子", value: "brainstorming" },
      { text: "翻譯 / 外語處理", value: "translation" },
      { text: "還沒試過", value: "none" },
    ],
  },
  {
    id: "ai_expectation",
    question: "你最希望 AI 幫你做什麼？",
    statLabel: "期望 AI 能力",
    choices: [
      { text: "自己搞定那些繁瑣的工作，從頭到尾不用我管", value: "autonomous" },
      { text: "把複雜的任務有系統地整理好", value: "spec" },
      { text: "把我腦中的想法馬上變成看得到的東西", value: "vibe" },
      { text: "自動處理每天重複的瑣事", value: "hooks" },
    ],
  },
];

// ===== PART 2: MBTI 검사 (12문항) =====

export type Axis = "EI" | "SN" | "TF" | "JP";
export type AxisDirection = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export interface MBTIChoice {
  text: string;
  direction: AxisDirection;
}

export interface MBTIQuestion {
  id: number;
  question: string;
  axis: Axis;
  choices: [MBTIChoice, MBTIChoice];
}

export const mbtiQuestions: MBTIQuestion[] = [
  // ===== E/I 축: 외향 vs 내향 =====
  {
    id: 1,
    question: "忙了一整天，下班回家的路上你在想什麼？",
    axis: "EI",
    choices: [
      { text: "「呼，今天好累！找個人吃飯好了。」", direction: "E" },
      { text: "「好累喔，只想趕快回家一個人靜一靜。」", direction: "I" },
    ],
  },
  {
    id: 2,
    question: "午餐時間到了，你想怎麼過？",
    axis: "EI",
    choices: [
      { text: "想跟大家一起吃，聊東聊西。", direction: "E" },
      { text: "跟大家吃也行，但說實話⋯比較想一個人安靜吃。", direction: "I" },
    ],
  },
  {
    id: 3,
    question: "團隊來了新人，你的第一反應是？",
    axis: "EI",
    choices: [
      { text: "「喔，新人耶！好好奇，想去打個招呼。」", direction: "E" },
      { text: "「先觀察一下，之後自然熟就好。」", direction: "I" },
    ],
  },

  // ===== S/N 축: 감각 vs 직관 =====
  {
    id: 4,
    question: "學一個新工具的時候，你會⋯",
    axis: "SN",
    choices: [
      { text: "先看說明書或教學，照著步驟一步一步來。", direction: "S" },
      { text: "先大概看一下整體架構，然後直接點來點去憑感覺摸索。", direction: "N" },
    ],
  },
  {
    id: 5,
    question: "規劃新專案的時候，你從哪裡開始？",
    axis: "SN",
    choices: [
      { text: "從手上有的資源和實際可行的範圍開始。", direction: "S" },
      { text: "先想像最終目標的樣子，再往回推。", direction: "N" },
    ],
  },
  {
    id: 6,
    question: "你會不會常常想：「一定要這樣做嗎？」",
    axis: "SN",
    choices: [
      { text: "不太會欸，能用就好啊。", direction: "S" },
      { text: "超常的，總覺得一定有更好的方法。", direction: "N" },
    ],
  },

  // ===== T/F 축: 사고 vs 감정 =====
  {
    id: 7,
    question: "團隊意見分歧，氣氛有點緊張，你心裡在想什麼？",
    axis: "TF",
    choices: [
      { text: "最後還是要看哪邊的證據比較強吧——重點是哪個才是對的。", direction: "T" },
      { text: "每個人都有自己的道理⋯希望最後能找到大家都能接受的方向。", direction: "F" },
    ],
  },
  {
    id: 8,
    question: "同事請你給他的作品真實回饋，你看到了明顯的問題。",
    axis: "TF",
    choices: [
      { text: "誠實的回饋才是真的幫忙——我會直接說哪裡不行。", direction: "T" },
      { text: "他也沒有錯，但怎麼說也很重要——我會先想想怎麼說。", direction: "F" },
    ],
  },
  {
    id: 9,
    question: "同事跟你說他下個月要離職了，你的第一個念頭是？",
    axis: "TF",
    choices: [
      { text: "交接什麼時候？他的工作誰來接？", direction: "T" },
      { text: "真的假的？好捨不得⋯他一直都很努力耶。", direction: "F" },
    ],
  },

  // ===== J/P 축: 판단 vs 인식 =====
  {
    id: 10,
    question: "週一早上，你用什麼心態開始這一週？",
    axis: "JP",
    choices: [
      { text: "這週要做的事在腦中排好了，我才安心。", direction: "J" },
      { text: "大概有個底，走一步算一步吧。", direction: "P" },
    ],
  },
  {
    id: 11,
    question: "截止日就在眼前，你現在的狀態是？",
    axis: "JP",
    choices: [
      { text: "差不多做完了，剩最後檢查而已。", direction: "J" },
      { text: "現在才是真正開始。我就是 deadline 前最有效率。", direction: "P" },
    ],
  },
  {
    id: 12,
    question: "行程突然改了，你的計劃全被打亂，你的反應是？",
    axis: "JP",
    choices: [
      { text: "蛤，認真？⋯我全部要重做欸，現在才說？", direction: "J" },
      { text: "沒差啦，本來就會有變動，跟著調整就好。", direction: "P" },
    ],
  },
];
