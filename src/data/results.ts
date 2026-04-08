export interface MBTIResult {
  type: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  strengths: string[];
  color: string;
}

export const results: Record<string, MBTIResult> = {
  ISTJ: {
    type: "ISTJ",
    emoji: "🏗️",
    title: "시스템 아키텍트",
    subtitle: "코드에도 설계도가 필요한 법이죠",
    description:
      "당신은 체계적이고 꼼꼼한 개발자입니다. 문서 없이 코딩을 시작하는 건 상상할 수 없고, 모든 것은 검증된 패턴 위에 세워져야 한다고 믿습니다. AI 도구도 정확한 스펙을 주고 결과를 검증하는 방식을 선호합니다.",
    strengths: ["체계적 설계", "꼼꼼한 코드 리뷰", "안정적 아키텍처"],
    color: "#1e3a5f",
  },
  ISFJ: {
    type: "ISFJ",
    emoji: "🛡️",
    title: "팀의 수호자",
    subtitle: "조용히 팀을 살리는 든든한 존재",
    description:
      "당신은 팀원들이 편하게 일할 수 있는 환경을 만드는 데 진심인 개발자입니다. 코드 리뷰도 따뜻하게, 문서도 다음 사람이 보기 쉽게. AI 도구도 팀 전체의 생산성 향상 관점에서 바라봅니다.",
    strengths: ["팀 케어", "읽기 좋은 코드", "세심한 문서화"],
    color: "#2d5a3f",
  },
  INFJ: {
    type: "INFJ",
    emoji: "🔮",
    title: "비전 설계자",
    subtitle: "큰 그림을 보는 조용한 리더",
    description:
      "당신은 기술의 방향성과 비전을 먼저 생각하는 개발자입니다. 코드 한 줄에도 의미를 담고, 사용자의 경험을 깊이 고민합니다. AI와 함께 더 의미 있는 제품을 만들고 싶어합니다.",
    strengths: ["제품 비전", "사용자 공감", "의미 있는 설계"],
    color: "#4a2d6f",
  },
  INTJ: {
    type: "INTJ",
    emoji: "🧠",
    title: "마스터마인드",
    subtitle: "완벽한 아키텍처를 설계하는 전략가",
    description:
      "당신은 최적의 아키텍처를 설계하는 데 열정을 쏟는 개발자입니다. 모든 기술적 결정에는 논리적 근거가 있어야 하고, AI 도구도 효율성과 정확성 기준으로 냉정하게 평가합니다.",
    strengths: ["전략적 설계", "효율 최적화", "기술 리더십"],
    color: "#1a1a4e",
  },
  ISTP: {
    type: "ISTP",
    emoji: "🔧",
    title: "디버깅 장인",
    subtitle: "문제의 근본 원인을 찾아내는 해결사",
    description:
      "당신은 문제를 깊이 파고들어 해결하는 타입입니다. 복잡한 버그 앞에서 오히려 눈이 빛나고, 하나씩 원인을 좁혀가는 과정을 즐깁니다. AI 도구는 정확한 정보를 줄 때만 신뢰합니다.",
    strengths: ["문제 해결력", "깊은 분석", "실용적 접근"],
    color: "#3d2b1f",
  },
  ISFP: {
    type: "ISFP",
    emoji: "🎨",
    title: "코드 아티스트",
    subtitle: "아름다운 코드와 UI를 만드는 감성 개발자",
    description:
      "당신은 코드에도 미적 감각이 필요하다고 믿는 개발자입니다. 변수명 하나도 예쁘게, UI도 감성적으로. AI 도구는 내 창의성을 확장해주는 도구로 활용합니다.",
    strengths: ["UI/UX 감각", "클린 코드", "창의적 해결"],
    color: "#5a2d4f",
  },
  INFP: {
    type: "INFP",
    emoji: "🚀",
    title: "인디 해커",
    subtitle: "세상을 바꾸는 사이드 프로젝트를 꿈꾸는 이상주의자",
    description:
      "당신은 기술로 세상에 의미 있는 변화를 만들고 싶은 개발자입니다. 사이드 프로젝트 아이디어가 항상 넘치고, 사용자의 감정에 공감하는 제품을 만들고 싶어합니다.",
    strengths: ["아이디어 발상", "사용자 공감", "끈기 있는 개발"],
    color: "#2d4a6f",
  },
  INTP: {
    type: "INTP",
    emoji: "🧪",
    title: "알고리즘 탐험가",
    subtitle: "문제의 본질을 파고드는 이론가",
    description:
      "당신은 '왜?'라는 질문을 멈출 수 없는 개발자입니다. 단순히 돌아가는 코드가 아니라 최적의 알고리즘을 찾아 헤매고, AI의 작동 원리도 궁금해서 들여다봅니다.",
    strengths: ["알고리즘 설계", "본질 파악", "혁신적 해결"],
    color: "#1f3d5a",
  },
  ESTP: {
    type: "ESTP",
    emoji: "⚡",
    title: "핫픽스 히어로",
    subtitle: "장애 상황에서 빛나는 행동파",
    description:
      "당신은 긴급 상황에서 진가를 발휘하는 개발자입니다. '일단 해보자!' 마인드로 빠르게 실행하고, 프로덕션 장애도 두렵지 않습니다. AI 도구도 일단 써보고 판단합니다.",
    strengths: ["빠른 실행력", "위기 대처", "실전 경험"],
    color: "#5a1a1a",
  },
  ESFP: {
    type: "ESFP",
    emoji: "🎉",
    title: "해커톤 스타",
    subtitle: "24시간 안에 뭐든 만들어내는 에너자이저",
    description:
      "당신은 에너지 넘치는 개발자입니다. 해커톤에서 빛나고, 프로토타입을 순식간에 만들어내며, 새로운 도구를 써보는 것 자체가 즐거움입니다. AI는 최고의 해커톤 파트너!",
    strengths: ["빠른 프로토타이핑", "팀 에너지", "창의적 활용"],
    color: "#6f4a2d",
  },
  ENFP: {
    type: "ENFP",
    emoji: "📢",
    title: "테크 에반젤리스트",
    subtitle: "새 기술에 열광하는 전파자",
    description:
      "당신은 새 기술을 발견하면 흥분을 감추지 못하는 개발자입니다. 블로그, 발표, 스터디까지 열정적으로 전파하며, AI 시대의 가능성에 가장 설레는 타입입니다.",
    strengths: ["기술 전파", "커뮤니티 활동", "트렌드 리딩"],
    color: "#4a6f2d",
  },
  ENTP: {
    type: "ENTP",
    emoji: "💡",
    title: "사이드 프로젝트 수집가",
    subtitle: "아이디어가 넘치는 혁신가",
    description:
      "당신은 '이거 만들면 재밌겠다'가 입버릇인 개발자입니다. GitHub 레포가 수십 개이고, 새 도구마다 사이드 프로젝트를 시작합니다. AI와 함께라면 더 많은 아이디어를 실현할 수 있어 흥분됩니다.",
    strengths: ["아이디어 발산", "빠른 학습", "혁신적 실험"],
    color: "#2d6f4a",
  },
  ESTJ: {
    type: "ESTJ",
    emoji: "👔",
    title: "테크 리드",
    subtitle: "체계적으로 팀을 이끄는 리더",
    description:
      "당신은 프로젝트를 체계적으로 관리하고 팀을 이끄는 개발자입니다. 일정 관리, 코드 컨벤션, 배포 프로세스까지 빈틈없이 챙기며, AI 도구 도입도 ROI를 따져보고 결정합니다.",
    strengths: ["프로젝트 관리", "팀 리딩", "프로세스 최적화"],
    color: "#1a3d5a",
  },
  ESFJ: {
    type: "ESFJ",
    emoji: "🤝",
    title: "온보딩 마스터",
    subtitle: "팀원을 잘 챙기는 따뜻한 시니어",
    description:
      "당신은 새 팀원이 오면 가장 먼저 다가가는 개발자입니다. 페어 프로그래밍도 좋아하고, 모두가 편한 도구와 프로세스를 만드는 데 진심입니다. AI가 팀 전체의 온보딩을 도와줄 수 있다면 적극 활용합니다.",
    strengths: ["팀원 온보딩", "페어 프로그래밍", "DX 개선"],
    color: "#3d5a1a",
  },
  ENFJ: {
    type: "ENFJ",
    emoji: "🌟",
    title: "CTO 재목",
    subtitle: "기술과 사람을 모두 아우르는 리더",
    description:
      "당신은 기술적 비전과 팀 관리를 동시에 해내는 개발자입니다. 사람들에게 영감을 주고, 기술이 사람을 위해 존재해야 한다고 믿습니다. AI 시대에 팀을 이끌 준비가 되어 있습니다.",
    strengths: ["비전 제시", "팀 영감", "기술 리더십"],
    color: "#4a2d2d",
  },
  ENTJ: {
    type: "ENTJ",
    emoji: "👑",
    title: "스타트업 CEO",
    subtitle: "비전과 실행력을 갖춘 지휘관",
    description:
      "당신은 비전을 세우고 팀을 동원해 실현하는 타입입니다. 기술적 결정도 빠르고, 새 도구의 가치를 바로 파악합니다. AI는 당신의 실행 속도를 배로 만들어줄 무기입니다.",
    strengths: ["전략 수립", "빠른 의사결정", "실행력"],
    color: "#2d1a4a",
  },
};
