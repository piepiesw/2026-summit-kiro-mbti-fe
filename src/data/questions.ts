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
    question: "현재 하시는 일은?",
    statLabel: "직업군",
    choices: [
      { text: "개발자/엔지니어", value: "developer" },
      { text: "PM/기획자", value: "pm" },
      { text: "디자이너", value: "designer" },
      { text: "데이터 분석가", value: "data" },
      { text: "마케터/비즈니스", value: "business" },
      { text: "학생/취준생", value: "student" },
    ],
  },
  {
    id: "ai_frequency",
    question: "AI 어시스턴트를 얼마나 쓰시나요?",
    statLabel: "AI 사용 빈도",
    choices: [
      { text: "매일 쓴다", value: "daily" },
      { text: "주 2~3회", value: "weekly" },
      { text: "가끔", value: "sometimes" },
      { text: "거의 안 쓴다", value: "rarely" },
    ],
  },
  {
    id: "ai_style",
    question: "AI 도구를 쓸 때 나는?",
    statLabel: "AI 사용 스타일",
    choices: [
      { text: "목표만 주고 결과를 받는다", value: "autonomous" },
      { text: "단계별로 확인하며 같이 진행한다", value: "interactive" },
      { text: "참고만 하고 직접 작업한다", value: "manual" },
    ],
  },
  {
    id: "ai_expectation",
    question: "AI 도구에 가장 기대하는 것은?",
    statLabel: "기능 선호도",
    choices: [
      { text: "처음부터 끝까지 알아서 해주는 것", value: "autonomous" },
      { text: "체계적으로 계획을 세워주는 것", value: "spec" },
      { text: "자유롭게 아이디어를 바로 구현하는 것", value: "vibe" },
      { text: "반복 작업을 자동으로 처리하는 것", value: "hooks" },
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
    question: "어려운 문제를 해결할 때 나는?",
    axis: "EI",
    choices: [
      { text: "주변 사람들과 이야기하면서 답을 찾는다", direction: "E" },
      { text: "혼자 조용히 생각을 정리하는 게 낫다", direction: "I" },
    ],
  },
  {
    id: 2,
    question: "새로운 도구를 접하면?",
    axis: "EI",
    choices: [
      { text: "일단 이것저것 눌러보고 써본다", direction: "E" },
      { text: "가이드나 설명서를 먼저 읽어본다", direction: "I" },
    ],
  },
  {
    id: 3,
    question: "회의에서 나는?",
    axis: "EI",
    choices: [
      {
        text: "아이디어를 먼저 말하고 반응을 보며 발전시킨다",
        direction: "E",
      },
      { text: "충분히 정리된 후에 발언한다", direction: "I" },
    ],
  },

  // ===== S/N 축: 감각 vs 직관 =====
  {
    id: 4,
    question: "업무 보고를 할 때 나는?",
    axis: "SN",
    choices: [
      { text: "구체적인 수치와 사실 위주로 정리한다", direction: "S" },
      { text: "큰 그림과 방향성 위주로 설명한다", direction: "N" },
    ],
  },
  {
    id: 5,
    question: "계획을 세울 때 나는?",
    axis: "SN",
    choices: [
      { text: "현실적으로 가능한 범위부터 따진다", direction: "S" },
      { text: "이상적인 결과를 먼저 그리고 역산한다", direction: "N" },
    ],
  },
  {
    id: 6,
    question: "정보를 받아들일 때 나는?",
    axis: "SN",
    choices: [
      { text: "검증된 데이터와 사례를 신뢰한다", direction: "S" },
      { text: "패턴과 가능성을 읽는 편이다", direction: "N" },
    ],
  },

  // ===== T/F 축: 사고 vs 감정 =====
  {
    id: 7,
    question: "팀에서 의견 충돌이 생기면?",
    axis: "TF",
    choices: [
      { text: "논리적으로 더 나은 쪽을 선택해야 한다", direction: "T" },
      {
        text: "팀 분위기와 구성원 의견을 조율하는 게 중요하다",
        direction: "F",
      },
    ],
  },
  {
    id: 8,
    question: "피드백을 줄 때 나는?",
    axis: "TF",
    choices: [
      { text: "개선점을 명확하고 직접적으로 전달한다", direction: "T" },
      { text: "좋은 점을 먼저 말하고 부드럽게 제안한다", direction: "F" },
    ],
  },
  {
    id: 9,
    question: "결정을 내릴 때 가장 중요한 것은?",
    axis: "TF",
    choices: [
      { text: "효율성과 결과", direction: "T" },
      { text: "관련된 사람들에게 미치는 영향", direction: "F" },
    ],
  },

  // ===== J/P 축: 판단 vs 인식 =====
  {
    id: 10,
    question: "일을 시작할 때 나는?",
    axis: "JP",
    choices: [
      { text: "할 일 목록을 먼저 만들고 순서대로 진행한다", direction: "J" },
      { text: "일단 시작하고 흐름에 따라 유연하게 한다", direction: "P" },
    ],
  },
  {
    id: 11,
    question: "마감이 다가오면 나는?",
    axis: "JP",
    choices: [
      { text: "이미 거의 끝나있다. 미리미리 하는 편", direction: "J" },
      { text: "마감 직전에 집중력이 폭발한다", direction: "P" },
    ],
  },
  {
    id: 12,
    question: "팀 프로젝트에서 내 역할은?",
    axis: "JP",
    choices: [
      { text: "일정과 역할 분담을 정리하는 사람", direction: "J" },
      { text: "분위기 보면서 필요한 곳에 바로 투입되는 사람", direction: "P" },
    ],
  },
];
