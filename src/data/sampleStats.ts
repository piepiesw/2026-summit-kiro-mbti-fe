// 샘플 통계 데이터 (대시보드 미리보기용)

export const sampleStats = {
  totalResponses: 347,

  // MBTI 유형 분포
  typeDistribution: [
    { type: "ENFP", count: 42 },
    { type: "INFP", count: 38 },
    { type: "ENTP", count: 35 },
    { type: "INTJ", count: 30 },
    { type: "ENFJ", count: 28 },
    { type: "INTP", count: 27 },
    { type: "ISTJ", count: 24 },
    { type: "ENTJ", count: 22 },
    { type: "ISFJ", count: 20 },
    { type: "INFJ", count: 18 },
    { type: "ESTP", count: 16 },
    { type: "ESFP", count: 14 },
    { type: "ISTP", count: 12 },
    { type: "ESTJ", count: 11 },
    { type: "ISFP", count: 6 },
    { type: "ESFJ", count: 4 },
  ],

  // 축별 비율
  axisPercentages: {
    E: 58,
    I: 42,
    S: 35,
    N: 65,
    T: 52,
    F: 48,
    J: 44,
    P: 56,
  },

  // 프로필: 직업군
  roleDistribution: [
    { name: "개발자/엔지니어", value: 156, color: "#00d4aa" },
    { name: "PM/기획자", value: 52, color: "#7c5cfc" },
    { name: "디자이너", value: 38, color: "#ff6b8a" },
    { name: "데이터 분석가", value: 35, color: "#ffa94d" },
    { name: "마케터/비즈니스", value: 28, color: "#4dabf7" },
    { name: "학생/취준생", value: 38, color: "#69db7c" },
  ],

  // AI 사용 빈도
  aiFrequency: [
    { name: "매일", value: 124, color: "#00d4aa" },
    { name: "주 2~3회", value: 98, color: "#7c5cfc" },
    { name: "가끔", value: 78, color: "#ffa94d" },
    { name: "거의 안 씀", value: 47, color: "#ff6b8a" },
  ],

  // AI 사용 스타일
  aiStyle: [
    { name: "위임형 (Autonomous)", value: 98, color: "#00d4aa" },
    { name: "협업형 (Interactive)", value: 152, color: "#7c5cfc" },
    { name: "참고형 (Manual)", value: 97, color: "#ffa94d" },
  ],

  // AI 기대 기능
  aiExpectation: [
    { name: "알아서 해주는 것", value: 105, color: "#00d4aa" },
    { name: "계획 수립", value: 88, color: "#7c5cfc" },
    { name: "아이디어 구현", value: 92, color: "#ff6b8a" },
    { name: "반복 자동화", value: 62, color: "#ffa94d" },
  ],

  // Kiro 추천 기능 Top3 등장 빈도
  kiroFeatureHits: [
    { name: "Specs", count: 198, emoji: "📐" },
    { name: "Vibe Coding", count: 176, emoji: "🎨" },
    { name: "Autonomous Agent", count: 165, emoji: "🤖" },
    { name: "Hooks", count: 142, emoji: "🔄" },
    { name: "Steering", count: 128, emoji: "📏" },
    { name: "Powers", count: 112, emoji: "⚡" },
  ],

  // 시간대별 참여 (시뮬레이션: AWS Summit 하루)
  hourlyParticipation: [
    { hour: "09시", count: 8 },
    { hour: "10시", count: 22 },
    { hour: "11시", count: 38 },
    { hour: "12시", count: 25 },
    { hour: "13시", count: 18 },
    { hour: "14시", count: 45 },
    { hour: "15시", count: 52 },
    { hour: "16시", count: 48 },
    { hour: "17시", count: 42 },
    { hour: "18시", count: 30 },
    { hour: "19시", count: 19 },
  ],
};
