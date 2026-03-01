# 네이버 부동산 분석 프로젝트 (NaverRealEstateAnalyze)

> 부동산 매니저/관계자를 위한 네이버 부동산 매물 실시간 수집 및 분석 대시보드

**프로젝트 시작일**: 2026-02-23
**상태**: 기획 중

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목표
**공식 API를 사용하지 않고**, 네이버 부동산 웹사이트(land.naver.com)를 직접 스크래핑하여 매물 데이터를 실시간으로 수집하고, 부동산 매니저/관계자에게 **업무 효율성을 극대화**하는 전문적인 분석 툴을 제공

### 1.2 타겟 사용자
| 사용자 유형 | 니즈 | 기대 효과 |
|-----------|------|---------|
| **부동산 중개사** | 새 매물 알림, 지역별 시세 파악 | 고객 응대 속도 향상 |
| **부동산 투자자** | 실시간 매물 추적, 가격 분석 | 빠른 투자 결정 지원 |
| **건설회사 관계자** | 경쟁 매물 모니터링, 시장 동향 | 시장 분석 시간 단축 |
| **임대사업자** | 전월세 시세 추적 | 수익률 분석 자동화 |

### 1.3 핵심 가치 (Core Values)
⚡ **실시간 수집**: 네이버에 등록된 매물 즉시 수집
📋 **그리드 뷰**: 엑셀처럼 보기 편한 테이블 형식
⚡ **빠른 검색**: 다양한 필터로 즉시 결과 표시
📥 **엑셀 다운로드**: 원하는 형식으로 데이터 내보내기

### 1.4 주요 기능

#### 📋 매물 그리드 뷰 (핵심)
- **엑셀 스타일 테이블**: 한눈에 보기 쉬운 그리드 형식
- **컬럼 선택**: 필요한 정보만 선택해서 표시
- **정렬**: 가격, 면적, 등록일 등으로 정렬
- **행 선택**: 대량 매물 선택 가능 (체크박스)
- **가상 스크롤**: 수천 건 데이터도 부드럽게 표시

#### ⚡ 빠른 검색 (핵심)
- **다중 필터**: 지역, 가격대, 면적, 층수, 매물유형 등
- **즉시 반응**: 검색 조건 변경 시 실시간 필터링
- **저장된 검색**: 자주 쓰는 검색 조건 저장/불러오기
- **고급 검색**: 특정 단지명, 중개사명, 번지 검색

#### 📥 엑셀 다운로드 (핵심)
- **전체 다운로드**: 현재 검색 결과 전체 엑셀 변환
- **선택 다운로드**: 체크한 매물만 다운로드
- **서식 선택**: 다양한 엑셀 템플릿 제공
  - 기본형: 매물 기본 정보
  - 상세형: 모든 정보 포함
  - 비교형: 매물 비교표 형식
  - 고객용: 고객 제용용 깔끔한 양식
- **자동 포맷**: 다운로드 시 엑셀 서식 자동 적용

#### 🔄 실시간 매물 수집
- 네이버 부동산 매매/전월세 매물 자동 수집
- 관심 지역/단지 설정 및 수집
- 수집 주기 설정 (실시간, 10분, 30분, 1시간 등)
- 수집 로그 및 상태 모니터링

### 1.5 주의사항
⚠️ **로봇 배제 표준 (robots.txt) 준수 필요**
⚠️ **서버 과부하 방지**: 요청 간격 조정, 속도 제한
⚠️ **저작권**: 수집한 데이터는 업무 참고용으로만 사용

---

## 2. 기술 스택

### 2.1 Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 15.x | React SSR 프레임워크 |
| **React** | 19.x | UI 라이브러리 |
| **TypeScript** | 5.x | 정적 타이핑 |
| **Tailwind CSS** | 4.x | 스타일링 |
| **Zustand** | 최신 | 상태 관리 (가볍고 간단) |
| **React Query** | 최신 | 서버 상태 관리 및 데이터 캐싱 |
| **Recharts** | 최신 | 차트 시각화 |
| **Lucide React** | 최신 | 아이콘 |

### 2.2 Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| **Node.js** | 20.x LTS | 런타임 |
| **Next.js API Routes** | - | REST API |
| **Puppeteer** | 최신 | 헤드리스 브라우저 자동화 |
| **Cheerio** | 최신 | HTML 파싱 (가벼운 스크래핑) |
| **Playwright** | 최신 | (옵션) Puppeteer 대안 |
| **Axios** | 최신 | HTTP 요청 |
| **MariaDB** | 11.x | 데이터베이스 |
| **Prisma** | 최신 | ORM |
| **Bull** | 최신 | 큐 시스템 (스크래핑 작업 관리) |
| **node-cron** | 최신 | 스케줄러 (주기적 수집) |

### 2.3 인프라 & 배포
| 기술 | 용도 |
|------|------|
| **Docker** | 컨테이너화 |
| **Vercel** | 프론트엔드 배포 (또는 전체 스택) |
| **GitHub Actions** | CI/CD |

---

## 3. 왜 이 기술 스택인가?

### 3.1 웹 스크래핑 기술 선택

#### Puppeteer vs Cheerio vs Playwright

| 기술 | 장점 | 단점 | 사용 케이스 |
|------|------|------|-----------|
| **Puppeteer** | JavaScript 렌더링 필요한 페이지 처리 가능 | 무겁고 리소스 많이 사용 | 동적 콘텐츠, 복잡한 페이지 |
| **Cheerio** | 가볍고 빠름, jQuery 문법 | JavaScript 렌더링 불가 | 정적 HTML 파싱 |
| **Playwright** | 브라우저 간 호환성 좋음 | Puppeteer보다 무거움 | 복잡한 스크래핑 |

**추천 조합**:
- **1차**: Cheerio + Axios (가볍고 빠른 정적 HTML 파싱)
- **2차**: Puppeteer (JavaScript 렌더링이 필요한 경우)

### 3.2 Next.js 선택 이유
✅ **SSR/SSG 지원**: SEO 최적화 (부동산 검색 엔진)
✅ **API Routes**: 백엔드 별도 구축 없이 전체 스택 개발 가능
✅ **서버리스 함수**: 스크래핑 작업을 서버리스로 실행 가능
✅ **파일 기반 라우팅**: 직관적인 페이지 구조

### 3.3 MariaDB 선택 이유
✅ **오픈 소스**: 무료이며 MySQL과 호환
✅ **안정성**: 대규모 데이터 처리에 검증됨
✅ **JSON 지원**: 비정형 스크래핑 데이터 저장에 유용

### 3.4 Prisma 선택 이유
✅ **타입 안전성**: TypeScript와 완벽한 통합
✅ **마이그레이션**: 데이터베이스 스키마 관리 용이
✅ **생산성**: 직관적인 API로 빠른 개발

### 3.5 Bull 선택 이유
✅ **작업 큐**: 대규모 스크래핑 작업 관리
✅ **재시도 로직**: 실패한 스크래핑 자동 재시도
✅ **동시성 제어**: 서버 부하 방지

---

## 4. 현재 템플릿과의 차이점

| 구분 | 현재 템플릿 | 네이버 부동산 프로젝트 |
|------|-----------|---------------------|
| 프레임워크 | Vite (SPA) | Next.js (SSR) |
| 라우팅 | React Router | App Router |
| API | 별도 필요 | API Routes 내장 |
| 데이터베이스 | 없음 | MariaDB + Prisma |
| 상태 관리 | 없음 | Zustand + React Query |

---

## 5. 프로젝트 구조 (예상)

```
NaverRealEstateAnalyze/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # 대시보드 라우트 그룹
│   ├── api/                  # API Routes
│   │   ├── properties/       # 매물 관련 API
│   │   ├── analysis/         # 분석 관련 API
│   │   └── scraper/          # 스크래핑 제어 API
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                   # 재사용 UI 컴포넌트
│   ├── charts/               # 차트 컴포넌트
│   └── features/             # 기능별 컴포넌트
├── lib/
│   ├── scraper/              # 🆕 스크래핑 모듈
│   │   ├── naver-land.ts     # 네이버 부동산 스크래핑
│   │   ├── parser.ts         # HTML/JSON 파서
│   │   ├── crawler.ts        # 크롤러 코어
│   │   └── queue.ts          # 작업 큐 관리
│   ├── db/                   # Prisma 클라이언트
│   └── utils/                # 유틸리티
├── prisma/
│   ├── schema.prisma         # 데이터베이스 스키마
│   └── migrations/           # 마이그레이션
├── stores/                   # Zustand stores
├── jobs/                     # 🆕 스크래핑 스케줄 작업
│   ├── hourly-scraper.ts     # 시간별 수집
│   └── daily-scraper.ts      # 일일 수집
├── public/                   # 정적 파일
└── docs/                     # 프로젝트 문서
```

---

## 6. 데이터베이스 설계 (초안)

### 6.1 주요 테이블

```prisma
// 매물 정보
model Property {
  id          Int      @id @autoIncrement
  title       String
  price       Int      // 매매가 (만원)
  area        Float    // 면적 (㎡)
  floor       String   // 층수
  address     String
  latitude    Float?
  longitude   Float?
  propertyType String // 아파트, 빌라, 오피스텔
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([address])
  @@index([price])
}

// 지역 정보
model Region {
  id        Int      @id @autoIncrement
  name      String   // 예: 서울시 강남구
  code      String   @unique // 행정구역코드
  avgPrice  Int?     // 지역 평균가
}

// 가격 히스토리
model PriceHistory {
  id          Int      @id @autoIncrement
  propertyId  Int
  price       Int
  recordedAt  DateTime
}
```

---

## 7. 네이버 부동산 데이터 접근 분석

> 네이버 부동산은 **네이버 지도 기반 지도 서비스**로, 지도 이동 시 해당 영역의 매물을 동적으로 로드합니다. 데이터 접근 방법을 체계적으로 분석하고 정리합니다.

### 7.1 서비스 구조 이해

#### 네이버 부동산 특징
- **지도 기반 렌더링**: 네이버 지도 SDK를 확장한 구조
- **영역 기반 로딩**: 지도 bounds(위경도 영역)에 따른 매물 로드
- **비동기 데이터 호출**: AJAX/XHR로 실시간 매물 데이터 요청
- **클라이언트 사이드 렌더링**: JavaScript로 매물 마커/리스트 생성

#### 데이터 로딩 플로우
```
사용자 접속
    ↓
지도 초기화 (네이버 지도 SDK)
    ↓
지역 설정 (cortarNo 또는 위경도)
    ↓
매물 리스트 API 호출
    ↓
마커 표시 + 리스트 렌더링
    ↓
지도 이동/확대/축소
    ↓
새로운 영역 매물 API 호출
```

### 7.2 타겟 URL 구조

#### 메인 URL
```
https://land.naver.com/                                   # 메인
https://land.naver.com/article/articleList.nhn           # 매물 리스트
https://land.naver.com/article/articleInfo.nhn           # 매물 상세
```

#### URL 파라미터 분석
| 파라미터 | 설명 | 예시 |
|---------|------|------|
| `cortarNo` | 행정구역코드 (법정동) | 1168000000 (서울 강남구) |
| `articleNo` | 매물 고유 번호 | 1234567890 |
| `tradeType` | 매물 유형 | A1(매매), B1(전세), C1(월세) |
| `priceType` | 가격 타입 | - |
| `lat`, `lng` | 위도, 경도 (지도 중심) | 37.5665, 126.9780 |
| `zoom` | 지도 줌 레벨 | 1~14 |

### 7.3 데이터 접근 방법 분석

#### 방법 1: 내부 API 호출 (가장 권장)

**분석 대상**: 네이버 부동산 개발자 도구 Network 탭

1. **매물 리스트 API**
```typescript
// 예상 엔드포인트 (실제 분석 필요)
GET https://land.naver.com/article/ajax/getArticleList.nhn

Headers:
  User-Agent: Mozilla/5.0...
  Referer: https://land.naver.com/
  X-Requested-With: XMLHttpRequest

Query Params:
  cortarNo: 1168000000           // 행정구역코드
  tradeType: A1                  // A1=매매, B1=전세, C1=월세
  page: 1                        // 페이지 번호
  limit: 20                      // 페이지당 건수
```

2. **매물 상세 API**
```typescript
GET https://land.naver.com/article/ajax/getArticleInfo.nhn

Query Params:
  articleNo: 1234567890          // 매물 번호
```

3. **지역 기반 검색 API**
```typescript
GET https://land.naver.com/region/ajax/getRegionList.nhn

Query Params:
  cortarNo: 1168000000           // 상위 지역 코드
```

#### 방법 2: Puppeteer로 지도 시뮬레이션

Puppeteer로 실제 브라우저를 띄워 지도를 조작하고 데이터 추출

```typescript
const browser = await puppeteer.launch({ headless: false })
const page = await browser.newPage()

// 네이버 부동산 접속
await page.goto('https://land.naver.com/article/articleList.nhn?cortarNo=1168000000')

// 네트워크 요청 인터셉트
await page.on('response', async (response) => {
  const url = response.url()
  if (url.includes('getArticleList')) {
    const data = await response.json()
    // 매물 데이터 저장
  }
})

// 지도 이동 시뮬레이션
await page.evaluate(() => {
  // 지도 객체 조작
})
```

#### 방법 3: HTML 파싱 (Cheerio)

지도 초기 로딩 시 서버에서 렌더링하는 HTML에서 데이터 추출

```typescript
const response = await axios.get('https://land.naver.com/article/articleList.nhn?cortarNo=1168000000')
const $ = cheerio.load(response.data)

// 매물 리스트 추출
$('.item').each((i, el) => {
  const title = $(el).find('.title').text()
  const price = $(el).find('.price').text()
  // ...
})
```

### 7.4 API 분석 절차

#### 1단계: Network 탭 분석
1. Chrome 개발자 도구 열기 (F12)
2. Network 탭 선택
3. 네이버 부동산 접속 후 지도 조작
4. XHR/Fetch 필터링
5. 매물 관련 API 요청 찾기

#### 2단계: Request/Response 분석
```javascript
// Request Headers 복사
{
  "User-Agent": "Mozilla/5.0...",
  "Referer": "https://land.naver.com/",
  "Cookie": "...",
  "Authorization": "..." // 있는 경우
}

// Request Parameters 분석
{
  "cortarNo": "1168000000",
  "tradeType": "A1",
  "page": "1"
}

// Response 구조 분석
{
  "result": "success",
  "data": {
    "articleList": [
      {
        "articleNo": "1234567890",
        "title": "강남역 테헤란로...",
        "price": "150,000만",
        "area": "34.59㎡",
        "floor": "5/15층",
        "latitude": 37.1234,
        "longitude": 127.1234,
        ...
      }
    ],
    "totalCount": 1523,
    "page": 1,
    "totalPage": 77
  }
}
```

#### 3단계: 파라미터 매핑
| 파라미터 | 타입 | 필수여부 | 설명 |
|---------|------|---------|------|
| cortarNo | String | O | 행정구역코드 |
| tradeType | String | O | 매물유형 (A1/B1/C1) |
| page | Number | X | 페이지 (기본값 1) |
| limit | Number | X | 페이지당 건수 (기본값 20) |

#### 4단계: 응답 데이터 구조 정의
```typescript
interface NaverArticleResponse {
  result: string
  data: {
    articleList: NaverArticle[]
    totalCount: number
    page: number
    totalPage: number
  }
}

interface NaverArticle {
  articleNo: string           // 매물 고유 ID
  title: string               // 매물 제목
  price: number               // 가격 (만원)
  area: number                // 면적 (㎡)
  floor: string               // 층수
  buildYear?: number          // 건축년도
  latitude?: number           // 위도
  longitude?: number          // 경도
  address: string             // 주소
  agentName: string           // 중개사명
  agentPhone: string          // 중개사 전화번호
  images: string[]            // 이미지 URL 배열
  description?: string        // 상세 설명
  tags?: string[]             // 태그 (예: 역세권, 새아파트)
  registeredAt: string        // 등록일
  updatedAt?: string          // 수정일
}
```

### 7.5 데이터 수집 전략

#### 전략 1: 행정구역 기반 수집
```typescript
// 전국 행정구역 코드 순회
const regions = await getRegionCodes()
for (const region of regions) {
  const articles = await fetchArticles(region.code, 'A1')
  await saveArticles(articles)
  await delay(2000)  // 2초 딜레이
}
```

#### 전략 2: 지도 영역 기반 수집
```typescript
// 위경도 그리드 방식
const grid = generateGeoBounds(seoul)
for (const bounds of grid) {
  const articles = await fetchArticlesByBounds(bounds)
  await saveArticles(articles)
}
```

#### 전략 3: 증분 수집 (새 매물만)
```typescript
// 마지막 수집 시간 이후 매물만
const lastFetchTime = await getLastFetchTime()
const newArticles = await fetchArticlesSince(lastFetchTime)
```

---

## 8. 스크래핑 구현 전략

### 7.1 타겟 URL 구조
```
https://land.naver.com/article/articleList.nhn?cortarNo=1168000000  # 강남구 아파트
https://land.naver.com/article/articleInfo.nhn?articleNo=1234567   # 매물 상세
```

### 7.2 스크래핑 방법

#### 방법 1: API 요청 모방 (추천)
```typescript
// 네이버 부동산 내부 API 직접 호출
const response = await axios.get('https://land.naver.com/article/ajax/getArticleList.nhn', {
  headers: {
    'User-Agent': 'Mozilla/5.0...',
    'Referer': 'https://land.naver.com/'
  },
  params: {
    cortarNo: '1168000000',  // 지역 코드
    page: 1
  }
})
```

#### 방법 2: Puppeteer (실행 필요 시)
```typescript
const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.goto('https://land.naver.com/article/articleList.nhn?cortarNo=1168000000')
const data = await page.evaluate(() => {
  // 페이지 데이터 추출
})
```

### 7.3 반감 우회 전략
| 기법 | 설명 |
|------|------|
| **User-Agent** | 일반 브라우저 흉내 |
| **Referer** | 네이버 부동산 사이트 Referer 포함 |
| **요청 간격** | 1~3초 딜레이로 과부하 방지 |
| **프록시 로테이션** | IP 차단 방지 (필요 시) |
| **쿠키 관리** | 세션 유지 |

### 7.4 에러 핸들링
```typescript
// 재시도 로직
async function scrapeWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await scrape(url)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await delay(2000 * (i + 1))  // 지수 백오프
    }
  }
}
```

---

## 8. 개발 로드맵

### Phase 1: 프로젝트 설정 (예정)
- [ ] Next.js 프로젝트 초기화
- [ ] TypeScript, Tailwind CSS 설정
- [ ] Prisma + MariaDB 연결
- [ ] 스크래핑 라이브러리 설치 (Puppeteer, Cheerio, Axios)

### Phase 2: 데이터베이스 설계 (예정)
- [ ] 스키마 설계 (매물, 지역, 가격 히스토리)
- [ ] Prisma 마이그레이션
- [ ] 인덱스 최적화

### Phase 3: 스크래핑 모듈 개발 (예정)
- [ ] 네이버 부동산 페이지 분석
- [ ] API 요청 모방 또는 Puppeteer 구현
- [ ] HTML/JSON 파싱 로직
- [ ] 에러 핸들링 및 재시도 로직
- [ ] 반감 우회 전략 구현

### Phase 4: 데이터 수집 파이프라인 (예정)
- [ ] Bull 큐 시스템 구축
- [ ] 스케줄러 설정 (node-cron)
- [ ] 수집된 데이터 저장 로직
- [ ] 중복 데이터 제거 로직

### Phase 5: 프론트엔드 개발 (예정)
- [ ] 메인 페이지 (지역 선택)
- [ ] 매물 목록 페이지
- [ ] 매물 상세 페이지
- [ ] 분석 대시보드 (차트, 지도)

### Phase 6: 운영 최적화 (예정)
- [ ] 스크래핑 성능 모니터링
- [ ] 에러 알림 시스템
- [ ] 데이터 자동 백업

---

## 9. 참고 자료

### 스크래핑 관련
- [Puppeteer 공식 문서](https://pptr.dev/)
- [Cheerio 공식 문서](https://cheerio.js.org/)
- [Playwright 공식 문서](https://playwright.dev/)
- [웹 스크래핑 가이드](https://www.scrapehero.com/)

### 백엔드/프레임워크
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Bull 공식 문서](https://docs.bullmq.io/)
- [MariaDB 공식 문서](https://mariadb.com/kb/en/documentation/)

### 프론트엔드
- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/)
- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Recharts 공식 문서](https://recharts.org/)

### 법적 고려사항
- [저작권법 및 데이터베이스](https://www.law.go.kr/)
- [robots.txt 파서](https://www.robotstxt.org/robotstxt.html)

---

## 10. 법적 주의사항

### 10.1 robots.txt 확인
네이버 부동산의 robots.txt를 확인하여 크롤링 허용 여부를 확인해야 함

### 10.2 서버 부하 방지
- 요청 간격 준수 (초당 1회 이하 권장)
- 과도한 요청 피하기
- 서버 부하로 인한 접속 차단 주의

### 10.3 데이터 사용
- 수집한 데이터는 **개인적 참고용**으로만 사용
- 상업적 용도 사용 시 법적 문제 발생 가능
- 원본 사이트의 저작권 존중

### 10.4 면책 조항
본 프로젝트는 학습 목적으로 개발되며, 스크래핑으로 인한 법적 문제에 대해 책임지지 않습니다.

---

**마지막 업데이트**: 2026-02-23
