# Kiro MBTI

AWS Summit 2026 이벤트용 Kiro MBTI 진단 웹앱입니다.
프로필 질문 4개 + MBTI 질문 12개 → 16가지 유형별 결과와 Kiro 추천 기능 Top 3를 제공합니다.

## Tech Stack

- **Next.js 16** (App Router, static export)
- **React 19** / **TypeScript 5**
- **Tailwind CSS 4**
- **Recharts** (대시보드 차트)
- **qrcode.react** (결과 공유용 QR)
- 배포: **S3 + CloudFront** (`out/` 정적 빌드)
- 백엔드: API Gateway + Lambda + RDS MySQL (별도 레포)

## Project Structure

```
src/
  app/
    page.tsx          홈/인트로
    quiz/page.tsx     프로필 + MBTI 질문 플로우
    result/           결과 페이지 (유형별 설명 + 추천 기능)
    dashboard/        실시간 참여 통계 대시보드
  components/         NightSky, GhostBurst, HomeButton
  data/
    questions.ts      프로필(4) + MBTI(12) 질문 정의
    results.ts        16가지 MBTI 유형별 결과 카피
    kiroFeatures.ts   Kiro 기능 정의 + Top 3 스코어링 로직
    sampleStats.ts    대시보드 샘플 데이터
API_SPEC.md           백엔드 API/DB 명세서
```

## Getting Started

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 환경 변수

`.env.local`:

```
NEXT_PUBLIC_API_URL=https://<api-gateway-domain>
```

퀴즈 완료 시 `${NEXT_PUBLIC_API_URL}/api/results`로 결과를 POST 합니다.

## Build & Deploy

```bash
npm run build
```

- `out/` 디렉토리에 정적 파일이 생성됩니다 (Next.js static export)
- `cf-distribution.json`, `cf-function.js`로 CloudFront 설정을 관리합니다
- S3 버킷에 `out/` 내용을 업로드 → CloudFront 무효화

## API

`POST /api/results`로 퀴즈 결과 저장. 상세 스펙은 [API_SPEC.md](./API_SPEC.md) 참고.
