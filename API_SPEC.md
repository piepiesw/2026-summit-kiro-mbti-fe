# Kiro MBTI Backend API Spec

백엔드 개발자를 위한 API 및 DB 명세서입니다.

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
  "ai_style": "interactive",
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
| `ai_style` | `string` | Y | 프로필: AI 사용 스타일 |
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

**ai_frequency**
| 값 | 화면 텍스트 |
|----|------------|
| `daily` | 매일 쓴다 |
| `weekly` | 주 2~3회 |
| `sometimes` | 가끔 |
| `rarely` | 거의 안 쓴다 |

**ai_style**
| 값 | 화면 텍스트 |
|----|------------|
| `autonomous` | 목표만 주고 결과를 받는다 |
| `interactive` | 단계별로 확인하며 같이 진행한다 |
| `manual` | 참고만 하고 직접 작업한다 |

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
| `q1` | E/I | 어려운 문제를 해결할 때 나는? | `E` | 주변 사람들과 이야기하면서 답을 찾는다 |
| | | | `I` | 혼자 조용히 생각을 정리하는 게 낫다 |
| `q2` | E/I | 새로운 도구를 접하면? | `E` | 일단 이것저것 눌러보고 써본다 |
| | | | `I` | 가이드나 설명서를 먼저 읽어본다 |
| `q3` | E/I | 회의에서 나는? | `E` | 아이디어를 먼저 말하고 반응을 보며 발전시킨다 |
| | | | `I` | 충분히 정리된 후에 발언한다 |
| `q4` | S/N | 업무 보고를 할 때 나는? | `S` | 구체적인 수치와 사실 위주로 정리한다 |
| | | | `N` | 큰 그림과 방향성 위주로 설명한다 |
| `q5` | S/N | 계획을 세울 때 나는? | `S` | 현실적으로 가능한 범위부터 따진다 |
| | | | `N` | 이상적인 결과를 먼저 그리고 역산한다 |
| `q6` | S/N | 정보를 받아들일 때 나는? | `S` | 검증된 데이터와 사례를 신뢰한다 |
| | | | `N` | 패턴과 가능성을 읽는 편이다 |
| `q7` | T/F | 팀에서 의견 충돌이 생기면? | `T` | 논리적으로 더 나은 쪽을 선택해야 한다 |
| | | | `F` | 팀 분위기와 구성원 의견을 조율하는 게 중요하다 |
| `q8` | T/F | 피드백을 줄 때 나는? | `T` | 개선점을 명확하고 직접적으로 전달한다 |
| | | | `F` | 좋은 점을 먼저 말하고 부드럽게 제안한다 |
| `q9` | T/F | 결정을 내릴 때 가장 중요한 것은? | `T` | 효율성과 결과 |
| | | | `F` | 관련된 사람들에게 미치는 영향 |
| `q10` | J/P | 일을 시작할 때 나는? | `J` | 할 일 목록을 먼저 만들고 순서대로 진행한다 |
| | | | `P` | 일단 시작하고 흐름에 따라 유연하게 한다 |
| `q11` | J/P | 마감이 다가오면 나는? | `J` | 이미 거의 끝나있다. 미리미리 하는 편 |
| | | | `P` | 마감 직전에 집중력이 폭발한다 |
| `q12` | J/P | 팀 프로젝트에서 내 역할은? | `J` | 일정과 역할 분담을 정리하는 사람 |
| | | | `P` | 분위기 보면서 필요한 곳에 바로 투입되는 사람 |

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
