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
      { text: "기타", value: "other" },
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
    question: "AI한테 가장 많이 시키는 일은?",
    statLabel: "AI 주요 활용처",
    choices: [
      { text: "문서 작성", value: "writing" },
      { text: "자료 검색/요약", value: "search" },
      { text: "코드 작성", value: "coding" },
      { text: "아이디어 브레인스토밍", value: "brainstorming" },
      { text: "번역/외국어", value: "translation" },
      { text: "아직 안 써봤다", value: "none" },
    ],
  },
  {
    id: "ai_expectation",
    question: "AI가 나한테 해줬으면 하는 건?",
    statLabel: "AI 기대 기능",
    choices: [
      { text: "귀찮은 일을 처음부터 끝까지 알아서 해주는 것", value: "autonomous" },
      { text: "복잡한 일을 체계적으로 정리해주는 것", value: "spec" },
      { text: "머릿속 아이디어를 바로 눈에 보이게 만들어주는 것", value: "vibe" },
      { text: "매일 반복하는 귀찮은 작업을 자동으로 처리해주는 것", value: "hooks" },
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
    question: "하루 종일 열심히 일한 날, 퇴근길에 드는 생각은?",
    axis: "EI",
    choices: [
      { text: "아 오늘 힘들었다! 누구 만나서 밥이라도 먹을까?", direction: "E" },
      { text: "힘들다, 빨리 집 가서 혼자 쉬고 싶다", direction: "I" },
    ],
  },
  {
    id: 2,
    question: "점심시간이다. 오늘은 어떻게 보내고 싶나?",
    axis: "EI",
    choices: [
      { text: "사람들이랑 같이 먹으면서 이런저런 얘기 하고 싶다", direction: "E" },
      { text: "같이 먹긴 하지만... 사실은 혼자 조용히 먹고 싶다", direction: "I" },
    ],
  },
  {
    id: 3,
    question: "팀에 새로운 사람이 왔을 때, 드는 생각은?",
    axis: "EI",
    choices: [
      { text: "오 새로운 사람이다! 어떤 사람인지 궁금하고 얘기해보고 싶다", direction: "E" },
      { text: "어떤 사람인지 좀 지켜보면서 자연스럽게 알아가고 싶다", direction: "I" },
    ],
  },

  // ===== S/N 축: 감각 vs 직관 =====
  {
    id: 4,
    question: "새로운 도구 사용법을 익힐 때, 나는?",
    axis: "SN",
    choices: [
      { text: "일단 매뉴얼이나 가이드를 보면서 하나씩 따라 해본다", direction: "S" },
      { text: "대충 전체 구조를 파악하고 이것저것 눌러보면서 감을 잡는다", direction: "N" },
    ],
  },
  {
    id: 5,
    question: "새 프로젝트 계획을 세울 때, 어디서부터 시작하나요?",
    axis: "SN",
    choices: [
      { text: "지금 가진 리소스와 현실적인 범위부터 따져본다", direction: "S" },
      { text: "최종 목표를 먼저 그려놓고 거기서부터 역산한다", direction: "N" },
    ],
  },
  {
    id: 6,
    question: "일하다 보면 '이걸 꼭 이렇게 해야 하나?' 싶을 때가 있나요?",
    axis: "SN",
    choices: [
      { text: "별로 없다. 잘 돌아가고 있으면 그게 답이니까", direction: "S" },
      { text: "자주 그렇다. 더 나은 방법이 있을 것 같아서 자꾸 생각이 난다", direction: "N" },
    ],
  },

  // ===== T/F 축: 사고 vs 감정 =====
  {
    id: 7,
    question: "팀에서 의견이 둘로 갈려서 분위기가 팽팽하다. 이때 드는 생각은?",
    axis: "TF",
    choices: [
      { text: "결국 근거가 확실한 쪽으로 가야지, 어느 쪽이 맞는지가 중요하다", direction: "T" },
      { text: "다 이유가 있겠지... 어떻게든 다 괜찮은 방향이면 좋겠다", direction: "F" },
    ],
  },
  {
    id: 8,
    question: "동료가 작업물에 대해 의견을 물어왔다. 솔직히 아쉬운 점이 보인다.",
    axis: "TF",
    choices: [
      { text: "솔직하게 말해주는 게 진짜 도움이지, 아쉬운 점을 알려준다", direction: "T" },
      { text: "맞는 말인데 듣는 건 다르니까... 말 고르는 게 먼저다", direction: "F" },
    ],
  },
  {
    id: 9,
    question: "같은 팀 동료가 다음 달에 퇴사한다고 했다. 먼저 드는 생각은?",
    axis: "TF",
    choices: [
      { text: "인수인계 언제 하지? 남은 업무는 누가 맡아야 하나", direction: "T" },
      { text: "아 진짜? 갑자기 섭섭하네... 그동안 고생 많았는데", direction: "F" },
    ],
  },

  // ===== J/P 축: 판단 vs 인식 =====
  {
    id: 10,
    question: "월요일 아침, 한 주를 시작하는 나의 마음가짐은?",
    axis: "JP",
    choices: [
      { text: "이번 주 할 일이 머릿속에 정리돼 있어야 마음이 편하다", direction: "J" },
      { text: "대충 감은 있고, 그때그때 상황 보면서 하면 된다", direction: "P" },
    ],
  },
  {
    id: 11,
    question: "마감이 코앞이다. 지금 나의 상태는?",
    axis: "JP",
    choices: [
      { text: "이미 거의 끝나있다. 마무리 점검만 남은 상태", direction: "J" },
      { text: "지금부터가 진짜다. 마감 압박에 집중력이 터지는 타입", direction: "P" },
    ],
  },
  {
    id: 12,
    question: "갑자기 일정이 바뀌어서 계획이 틀어졌다. 드는 생각은?",
    axis: "JP",
    choices: [
      { text: "아 짜증나... 다시 정리해야 되잖아, 왜 이제 말해", direction: "J" },
      { text: "뭐 어때, 그럴 수도 있지. 바뀐 대로 하면 되지", direction: "P" },
    ],
  },
];
