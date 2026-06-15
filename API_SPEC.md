# Kiro MBTI Backend API Spec

백엔드 개발자를 위한 API 및 DB 명세서입니다.

---

## 변경 이력 (2026-06-15)

> **백엔드 작업자 참고**: AWS Summit Taipei 2026 배포용 변경입니다.

### 1. 화면 텍스트 → 번체중문 (zh-TW)

질문/선택지 화면 텍스트가 번체중문으로 교체되었습니다. **API 키/허용 값/DB 스키마는 모두 동일**하므로 백엔드 로직 변경은 불필요합니다. 본 문서의 "화면 텍스트" 컬럼만 zh-TW 기준으로 업데이트되었습니다.

- DB 스키마 변경 불필요
- Lambda enum 검증값 변경 불필요
- 기존 데이터 마이그레이션 불필요

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

**role** — 你的職業是什麼？
| 값 | 화면 텍스트 (zh-TW) |
|----|------------|
| `developer` | 開發者 / 工程師 |
| `pm` | PM / 產品企劃 |
| `designer` | 設計師 |
| `data` | 資料分析師 |
| `business` | 行銷 / 商務 / 業務 |
| `student` | 學生 / 求職者 |
| `other` | 其他 |

**ai_frequency** — 你多常使用 AI 助理？
| 값 | 화면 텍스트 (zh-TW) |
|----|------------|
| `daily` | 每天都用 |
| `weekly` | 一週 2–3 次 |
| `sometimes` | 偶爾用用 |
| `rarely` | 很少用 / 幾乎沒用過 |

**ai_style** — 你最常用 AI 做什麼？
| 값 | 화면 텍스트 (zh-TW) |
|----|------------|
| `writing` | 撰寫文件 |
| `search` | 搜尋 / 摘要資訊 |
| `coding` | 寫程式 |
| `brainstorming` | 腦力激盪想點子 |
| `translation` | 翻譯 / 外語處理 |
| `none` | 還沒試過 |

**ai_expectation** — 你最希望 AI 幫你做什麼？
| 값 | 화면 텍스트 (zh-TW) |
|----|------------|
| `autonomous` | 自己搞定那些繁瑣的工作，從頭到尾不用我管 |
| `spec` | 把複雜的任務有系統地整理好 |
| `vibe` | 把我腦中的想法馬上變成看得到的東西 |
| `hooks` | 自動處理每天重複的瑣事 |

#### MBTI 질문별 답변 값

| 필드 | 축 | 질문 (zh-TW) | 값 | 답변 내용 (zh-TW) |
|------|-----|------|----|-----------|
| `q1` | E/I | 忙了一整天，下班回家的路上你在想什麼？ | `E` | 「呼，今天好累！找個人吃飯好了。」 |
| | | | `I` | 「好累喔，只想趕快回家一個人靜一靜。」 |
| `q2` | E/I | 午餐時間到了，你想怎麼過？ | `E` | 想跟大家一起吃，聊東聊西。 |
| | | | `I` | 跟大家吃也行，但說實話⋯比較想一個人安靜吃。 |
| `q3` | E/I | 團隊來了新人，你的第一反應是？ | `E` | 「喔，新人耶！好好奇，想去打個招呼。」 |
| | | | `I` | 「先觀察一下，之後自然熟就好。」 |
| `q4` | S/N | 學一個新工具的時候，你會⋯ | `S` | 先看說明書或教學，照著步驟一步一步來。 |
| | | | `N` | 先大概看一下整體架構，然後直接點來點去憑感覺摸索。 |
| `q5` | S/N | 規劃新專案的時候，你從哪裡開始？ | `S` | 從手上有的資源和實際可行的範圍開始。 |
| | | | `N` | 先想像最終目標的樣子，再往回推。 |
| `q6` | S/N | 你會不會常常想：「一定要這樣做嗎？」 | `S` | 不太會欸，能用就好啊。 |
| | | | `N` | 超常的，總覺得一定有更好的方法。 |
| `q7` | T/F | 團隊意見分歧，氣氛有點緊張，你心裡在想什麼？ | `T` | 最後還是要看哪邊的證據比較強吧——重點是哪個才是對的。 |
| | | | `F` | 每個人都有自己的道理⋯希望最後能找到大家都能接受的方向。 |
| `q8` | T/F | 同事請你給他的作品真實回饋，你看到了明顯的問題。 | `T` | 誠實的回饋才是真的幫忙——我會直接說哪裡不行。 |
| | | | `F` | 他也沒有錯，但怎麼說也很重要——我會先想想怎麼說。 |
| `q9` | T/F | 同事跟你說他下個月要離職了，你的第一個念頭是？ | `T` | 交接什麼時候？他的工作誰來接？ |
| | | | `F` | 真的假的？好捨不得⋯他一直都很努力耶。 |
| `q10` | J/P | 週一早上，你用什麼心態開始這一週？ | `J` | 這週要做的事在腦中排好了，我才安心。 |
| | | | `P` | 大概有個底，走一步算一步吧。 |
| `q11` | J/P | 截止日就在眼前，你現在的狀態是？ | `J` | 差不多做完了，剩最後檢查而已。 |
| | | | `P` | 現在才是真正開始。我就是 deadline 前最有效率。 |
| `q12` | J/P | 行程突然改了，你的計劃全被打亂，你的反應是？ | `J` | 蛤，認真？⋯我全部要重做欸，現在才說？ |
| | | | `P` | 沒差啦，本來就會有變動，跟著調整就好。 |

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
