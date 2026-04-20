# Kiro MBTI Backend API Spec

백엔드 개발자를 위한 API 및 DB 명세서입니다.

---

## 변경 이력 (2026-04-20)

> **백엔드 작업자 참고**: 아래 변경사항을 반영해주세요.

### 1. `role` 값에 `other` 추가

프로필 질문 1번(직업군)에 **"기타" 선택지**가 추가되었습니다.
DB 컬럼명 `role`은 그대로 유지하되, **허용 값에 `other`가 추가**됩니다.

- **DB 스키마 변경 불필요** — `role VARCHAR(20)` 그대로 사용
- Lambda에 `role` enum 검증이 있다면 `other` 값 추가 필요
- 기존 데이터 마이그레이션 불필요

---

## 변경 이력 (2026-04-16)

> **백엔드 작업자 참고**: 아래 변경사항을 반영해주세요.

### 1. `ai_style` 컬럼 값 변경 (Breaking Change)

기존 프로필 질문 3번("AI 도구를 쓸 때 나는?")이 **"AI한테 가장 많이 시키는 일은?"**으로 교체되었습니다.
DB 컬럼명 `ai_style`은 그대로 유지하되, **저장되는 값이 완전히 변경**됩니다.

| 구분 | 기존 값 | 새 값 |
|------|---------|-------|
| 선택지 1 | `autonomous` (목표만 주고 결과를 받는다) | `writing` (문서 작성) |
| 선택지 2 | `interactive` (단계별로 확인하며 같이 진행한다) | `search` (자료 검색/요약) |
| 선택지 3 | `manual` (참고만 하고 직접 작업한다) | `coding` (코드 작성) |
| 선택지 4 | — | `brainstorming` (아이디어 브레인스토밍) |
| 선택지 5 | — | `translation` (번역/외국어) |
| 선택지 6 | — | `none` (아직 안 써봤다) |

- **DB 스키마 변경 불필요** — `ai_style VARCHAR(20)` 그대로 사용
- Lambda에 `ai_style` enum 검증이 있다면 새 값으로 업데이트 필요
- 기존 데이터(`autonomous`, `interactive`, `manual`)는 마이그레이션 불필요 (이벤트 시작 전 변경)

### 2. MBTI 질문 12개 전면 교체

모든 질문과 선택지 텍스트가 변경되었습니다. **답변 값(`E`/`I`/`S`/`N`/`T`/`F`/`J`/`P`)과 축 매핑은 동일**하므로 백엔드 로직 변경은 불필요합니다.

### 3. 변경 없는 항목
- `role`, `ai_frequency`, `ai_expectation` — 값/구조 모두 동일
- DB 스키마 — 변경 없음
- API 엔드포인트/응답 형식 — 변경 없음

---

## 아키텍처

```
[프론트엔드 (S3 + CloudFront)]
        │
        │ POST /api/results
        ▼
[API Gateway + Lambda]
        │
        ▼
[RDS MySQL]  (RDS Proxy 권장 — 이벤트 트래픽 커넥션 풀링)
```

---

## API

### `POST /api/results` — 퀴즈 결과 저장

프론트엔드에서 퀴즈 완료 시 호출합니다.

#### Request Body

```json
{
  "mbti_type": "ENFP",
  "role": "developer",
  "ai_frequency": "daily",
  "ai_style": "coding",
  "ai_expectation": "spec",
  "q1": "E",
  "q2": "I",
  "q3": "E",
  "q4": "S",
  "q5": "N",
  "q6": "N",
  "q7": "T",
  "q8": "F",
  "q9": "T",
  "q10": "J",
  "q11": "P",
  "q12": "J"
}
```

#### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `mbti_type` | `string(4)` | Y | MBTI 결과 (예: `"ENFP"`, `"ISTJ"`) |
| `role` | `string` | Y | 프로필: 직업군 |
| `ai_frequency` | `string` | Y | 프로필: AI 사용 빈도 |
| `ai_style` | `string` | Y | 프로필: AI 주요 활용처 |
| `ai_expectation` | `string` | Y | 프로필: AI 기대 기능 |
| `q1` ~ `q12` | `string(1)` | Y | MBTI 개별 질문 답변 |

#### 프로필 필드 허용 값

**role**
| 값 | 화면 텍스트 |
|----|------------|
| `developer` | 개발자/엔지니어 |
| `pm` | PM/기획자 |
| `designer` | 디자이너 |
| `data` | 데이터 분석가 |
| `business` | 마케터/비즈니스 |
| `student` | 학생/취준생 |
| `other` | 기타 |

**ai_frequency**
| 값 | 화면 텍스트 |
|----|------------|
| `daily` | 매일 쓴다 |
| `weekly` | 주 2~3회 |
| `sometimes` | 가끔 |
| `rarely` | 거의 안 쓴다 |

**ai_style** (AI 주요 활용처)
| 값 | 화면 텍스트 |
|----|------------|
| `writing` | 문서 작성 |
| `search` | 자료 검색/요약 |
| `coding` | 코드 작성 |
| `brainstorming` | 아이디어 브레인스토밍 |
| `translation` | 번역/외국어 |
| `none` | 아직 안 써봤다 |

**ai_expectation**
| 값 | 화면 텍스트 |
|----|------------|
| `autonomous` | 처음부터 끝까지 알아서 해주는 것 |
| `spec` | 체계적으로 계획을 세워주는 것 |
| `vibe` | 자유롭게 아이디어를 바로 구현하는 것 |
| `hooks` | 반복 작업을 자동으로 처리하는 것 |

#### MBTI 질문별 답변 값

| 필드 | 축 | 질문 | 값 | 답변 내용 |
|------|-----|------|----|-----------|
| `q1` | E/I | 하루 종일 열심히 일한 날, 퇴근길에 드는 생각은? | `E` | 아 오늘 힘들었다! 누구 만나서 밥이라도 먹을까? |
| | | | `I` | 힘들다, 빨리 집 가서 혼자 쉬고 싶다 |
| `q2` | E/I | 점심시간이다. 오늘은 어떻게 보내고 싶나? | `E` | 사람들이랑 같이 먹으면서 이런저런 얘기 하고 싶다 |
| | | | `I` | 같이 먹긴 하지만... 사실은 혼자 조용히 먹고 싶다 |
| `q3` | E/I | 팀에 새로운 사람이 왔을 때, 드는 생각은? | `E` | 오 새로운 사람이다! 어떤 사람인지 궁금하고 얘기해보고 싶다 |
| | | | `I` | 어떤 사람인지 좀 지켜보면서 자연스럽게 알아가고 싶다 |
| `q4` | S/N | 새로운 도구 사용법을 익힐 때, 나는? | `S` | 일단 매뉴얼이나 가이드를 보면서 하나씩 따라 해본다 |
| | | | `N` | 대충 전체 구조를 파악하고 이것저것 눌러보면서 감을 잡는다 |
| `q5` | S/N | 새 프로젝트 계획을 세울 때, 어디서부터 시작하나요? | `S` | 지금 가진 리소스와 현실적인 범위부터 따져본다 |
| | | | `N` | 최종 목표를 먼저 그려놓고 거기서부터 역산한다 |
| `q6` | S/N | 일하다 보면 '이걸 꼭 이렇게 해야 하나?' 싶을 때가 있나요? | `S` | 별로 없다. 잘 돌아가고 있으면 그게 답이니까 |
| | | | `N` | 자주 그렇다. 더 나은 방법이 있을 것 같아서 자꾸 생각이 난다 |
| `q7` | T/F | 팀에서 의견이 둘로 갈려서 분위기가 팽팽하다. 이때 드는 생각은? | `T` | 결국 근거가 확실한 쪽으로 가야지, 어느 쪽이 맞는지가 중요하다 |
| | | | `F` | 다 이유가 있겠지... 어떻게든 다 괜찮은 방향이면 좋겠다 |
| `q8` | T/F | 동료가 작업물에 대해 의견을 물어왔다. 솔직히 아쉬운 점이 보인다. | `T` | 솔직하게 말해주는 게 진짜 도움이지, 아쉬운 점을 알려준다 |
| | | | `F` | 맞는 말인데 듣는 건 다르니까... 말 고르는 게 먼저다 |
| `q9` | T/F | 같은 팀 동료가 다음 달에 퇴사한다고 했다. 먼저 드는 생각은? | `T` | 인수인계 언제 하지? 남은 업무는 누가 맡아야 하나 |
| | | | `F` | 아 진짜? 갑자기 섭섭하네... 그동안 고생 많았는데 |
| `q10` | J/P | 월요일 아침, 한 주를 시작하는 나의 마음가짐은? | `J` | 이번 주 할 일이 머릿속에 정리돼 있어야 마음이 편하다 |
| | | | `P` | 대충 감은 있고, 그때그때 상황 보면서 하면 된다 |
| `q11` | J/P | 마감이 코앞이다. 지금 나의 상태는? | `J` | 이미 거의 끝나있다. 마무리 점검만 남은 상태 |
| | | | `P` | 지금부터가 진짜다. 마감 압박에 집중력이 터지는 타입 |
| `q12` | J/P | 갑자기 일정이 바뀌어서 계획이 틀어졌다. 드는 생각은? | `J` | 아 짜증나... 다시 정리해야 되잖아, 왜 이제 말해 |
| | | | `P` | 뭐 어때, 그럴 수도 있지. 바뀐 대로 하면 되지 |

#### Response

```json
// 성공
{ "status": "ok" }

// 실패
{ "status": "error", "message": "..." }
```

---

## DB Schema

```sql
CREATE TABLE quiz_results (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  mbti_type       CHAR(4) NOT NULL,

  -- 프로필 응답
  role            VARCHAR(20) NOT NULL,
  ai_frequency    VARCHAR(20) NOT NULL,
  ai_style        VARCHAR(20) NOT NULL,
  ai_expectation  VARCHAR(20) NOT NULL,

  -- MBTI 개별 질문 답변
  q1              CHAR(1) NOT NULL,
  q2              CHAR(1) NOT NULL,
  q3              CHAR(1) NOT NULL,
  q4              CHAR(1) NOT NULL,
  q5              CHAR(1) NOT NULL,
  q6              CHAR(1) NOT NULL,
  q7              CHAR(1) NOT NULL,
  q8              CHAR(1) NOT NULL,
  q9              CHAR(1) NOT NULL,
  q10             CHAR(1) NOT NULL,
  q11             CHAR(1) NOT NULL,
  q12             CHAR(1) NOT NULL,

  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_type (mbti_type),
  INDEX idx_created (created_at)
);
```

---

## 대시보드 쿼리 예시 (참고용)

```sql
-- 총 참여자 수
SELECT COUNT(*) FROM quiz_results;

-- MBTI 유형별 분포
SELECT mbti_type, COUNT(*) as cnt FROM quiz_results GROUP BY mbti_type ORDER BY cnt DESC;

-- Q1 질문별 응답 수
SELECT q1, COUNT(*) as cnt FROM quiz_results GROUP BY q1;

-- 직업군별 분포
SELECT role, COUNT(*) as cnt FROM quiz_results GROUP BY role ORDER BY cnt DESC;

-- 시간대별 참여 추이
SELECT HOUR(created_at) as h, COUNT(*) as cnt FROM quiz_results GROUP BY h ORDER BY h;

-- 특정 유형의 Q7 답변 분포
SELECT q7, COUNT(*) FROM quiz_results WHERE mbti_type = 'INTJ' GROUP BY q7;
```

---

## 참고

- 이벤트성 대규모 트래픽 예상 → **RDS Proxy** 사용 권장
- CORS: 프론트엔드 CloudFront 도메인 허용 필요
- Lambda 런타임/언어는 백엔드 팀 자유 선택
