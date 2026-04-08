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
      { text: "마케터/비즈니스/세일즈", value: "business" },
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
    question: "팀에 새로운 사람이 합류했다.",
    axis: "EI",
    choices: [
      { text: "먼저 다가가서 이것저것 말을 건다", direction: "E" },
      { text: "상대가 적응할 시간을 주고 필요할 때 도와준다", direction: "I" },
    ],
  },
  {
    id: 2,
    question: "업무 중 막히는 부분이 생기면?",
    axis: "EI",
    choices: [
      { text: "이거 잘 하는 사람 누구지? 일단 찾아간다", direction: "E" },
      { text: "일단 혼자 파보고 정리되면 공유한다", direction: "I" },
    ],
  },
  {
    id: 3,
    question: "팀 회의에서 새로운 주제가 나왔다.",
    axis: "EI",
    choices: [
      { text: "떠오르는 생각을 바로 꺼내서 반응을 보며 발전시킨다", direction: "E" },
      { text: "머릿속으로 충분히 정리한 다음에 의견을 낸다", direction: "I" },
    ],
  },

  // ===== S/N 축: 감각 vs 직관 =====
  {
    id: 4,
    question: "팀에서 프로젝트 진행 상황을 공유해야 한다.",
    axis: "SN",
    choices: [
      { text: "완료 건수, 수치, 사실 위주로 정리한다", direction: "S" },
      { text: "전체 방향성과 앞으로의 흐름 위주로 설명한다", direction: "N" },
    ],
  },
  {
    id: 5,
    question: "새 프로젝트의 로드맵을 짜야 한다.",
    axis: "SN",
    choices: [
      { text: "지금 리소스로 가능한 범위부터 따진다", direction: "S" },
      { text: "최종 목표를 먼저 그리고 거기서 역산한다", direction: "N" },
    ],
  },
  {
    id: 6,
    question: "새로운 기술 트렌드가 화제다.",
    axis: "SN",
    choices: [
      { text: "도입 사례나 벤치마크 데이터부터 찾아본다", direction: "S" },
      { text: "이걸로 뭘 할 수 있을지 가능성부터 상상한다", direction: "N" },
    ],
  },

  // ===== T/F 축: 사고 vs 감정 =====
  {
    id: 7,
    question: "팀에서 두 가지 방향을 놓고 의견이 갈린다.",
    axis: "TF",
    choices: [
      { text: "데이터와 근거를 비교해서 더 나은 쪽을 밀어야 한다", direction: "T" },
      { text: "양쪽 입장을 듣고 모두가 납득할 수 있는 방향을 찾는다", direction: "F" },
    ],
  },
  {
    id: 8,
    question: "동료의 작업물을 리뷰해야 한다.",
    axis: "TF",
    choices: [
      { text: "고쳐야 할 부분을 명확하게 짚어준다", direction: "T" },
      { text: "잘한 점을 먼저 언급하고 개선점은 부드럽게 제안한다", direction: "F" },
    ],
  },
  {
    id: 9,
    question: "중요한 의사결정을 앞두고 있다. 가장 먼저 따지는 것은?",
    axis: "TF",
    choices: [
      { text: "효율성과 기대 결과", direction: "T" },
      { text: "이 결정이 팀원들에게 미칠 영향", direction: "F" },
    ],
  },

  // ===== J/P 축: 판단 vs 인식 =====
  {
    id: 10,
    question: "새로운 프로젝트를 시작해야 한다. 가장 먼저 하는 것은?",
    axis: "JP",
    choices: [
      { text: "할 일 목록부터 만들고 순서대로 진행한다", direction: "J" },
      { text: "일단 손부터 대보고 흐름에 따라 조정한다", direction: "P" },
    ],
  },
  {
    id: 11,
    question: "마감이 얼마 남지 않았다.",
    axis: "JP",
    choices: [
      { text: "이미 거의 끝나있다. 마무리만 남은 상태", direction: "J" },
      { text: "지금부터가 진짜다. 집중력이 폭발하는 타이밍", direction: "P" },
    ],
  },
  {
    id: 12,
    question: "팀 프로젝트가 시작됐다. 나는 자연스럽게 어떤 역할?",
    axis: "JP",
    choices: [
      { text: "일정표 만들고 역할을 나누는 사람", direction: "J" },
      { text: "상황 보면서 필요한 곳에 바로 뛰어드는 사람", direction: "P" },
    ],
  },
];
