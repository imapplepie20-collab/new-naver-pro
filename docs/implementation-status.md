# 네이버 부동산 분석 프로젝트 구현 현황

## 상태 설명
- **미구현**: 아직 시작하지 않음
- **구현중**: 코드 작성 중
- **테스트중**: 기능 구현 완료, 테스트 중
- **완료**: 기능 완료 및 배포 가능

---

## 데이터 아키텍처

### 공용 데이터 (중앙 DB)
- 지역 정보 (Region): 전국 5,339개 지역
- 인증 토큰 (NaverToken): 네이버 API 토큰
- 매물 캐시 (Property, Complex): 일시적 캐시 (TTL)

### 실시간 데이터 (API 조회)
- 매물 목록: 네이버 API 실시간 조회
- 단지 목록: 네이버 API 실시간 조회

### 개인 데이터 (사용자별)
- 저장한 매물 (SavedProperty)
- 검색 조건 (SearchCondition)
- 가격 알림 (PriceAlert)
- 메모 (Note)

---

## 1. 인증 & 사용자 관리

| 기능 | 상태 | 설명 | 비고 |
|------|------|------|------|
| 사용자 모델 | 완료 | User, OAuth 준비 | `User` 테이블 |
| 저장한 매물 | 완료 | 찜 기능, 캐시 정보 저장 | `/api/user/saved-properties` |
| 검색 조건 저장 | 완료 | 자주 쓰는 필터 저장 | `/api/user/search-conditions` |
| 가격 알림 | 완료 | 목표가 도달 시 알림 | `/api/user/price-alerts` |
| 매물 메모 | 완료 | 개인 메모 저장 | `Note` 테이블 |
| 사용자 요약 | 완료 | 저장/알림/조건 수 조회 | `/api/user/summary` |

### 토큰 관리

| 기능 | 상태 | 설명 | 비고 |
|------|------|------|------|
| 토큰 발급 (Puppeteer) | 완료 | 네이버 부동산 접속 → 토큰 자동 획득 | 봇 감지 우회 + 쿠키 저장 |
| 토큰 저장 (DB) | 완료 | DB에 토큰 + 쿠키 저장 및 만료 관리 | `NaverToken` 테이블 |
| 토큰 갱신 API | 완료 | `/api/token/refresh` | 자동 쿠키 추출 포함 |
| 429 방지 | 완료 | 쿠키 + 모든 헤더 + Referer 전달 | axios withCredentials + 전체 헤더 |
| 만료된 토큰 자동 갱신 | 완료 | 토큰 만료 시 자동 재발급 | TokenManager.getToken() |

---

## 2. 지역 관리

| 기능 | 상태 | 설명 | 비고 |
|------|------|------|------|
| 전국 지역 DB 저장 | 완료 | 5,339개 지역 (시/도 → 시/군/구 → 읍/면/동) | GPS 좌표 포함 |
| 지역 목록 API | 완료 | DB에서만 조회 (네피버 API 의존 제거) | `/api/regions?cortarNo=xxx` |
| 지역 계층 구조 관리 | 완료 | 시/군/구 읍면동 계층 | `/api/regions/tree` |

---

## 3. 매물 크롤링

| 기능 | 상태 | 설명 | 비고 |
|------|------|------|------|
| 아파트·오피스텔 단지 | 완료 | complexes API + 좌표 boundary 자동 계산 | `/api/complexes` |
| 빌라·주택 매물 | 완료 | articles API (VL) | `/api/articles` |
| 원룸·투룸 매물 | 완료 | articles API (ONEROOM) | `/api/articles` |
| 상가·업무·공장·토지 | 완료 | articles API | `/api/articles` |

---

## 4. 데이터 처리

| 기능 | 상태 | 설명 | 비고 |
|------|------|------|------|
| 매물 캐시 | 완료 | `Property` 테이블에 TTL 기반 캐시 | upsert로 중복 방지 |
| 단지 정보 캐시 | 완료 | `Complex` 테이블에 캐시 | complexes API 결과 자동 저장 |
| 가격 변동 분석 | 완료 | 시계열 데이터 분석 | `/api/statistics/price-trend` |
| 지역별 평균 가격 | 완료 | 집계 및 통계 API 제공 | `/api/statistics/regions` |

---

## 5. API 서버

| 기능 | 상태 | 설명 | 비고 |
|------|------|------|------|
| 매물 목록 조회 API | 완료 | 필터링, 페이징 | `/api/articles` |
| 매물 상세 조회 API | 완료 | 단일 매물 상세 (DB) | `/api/articles/:articleNo` |
| 매물 정보 갱신 API | 완료 | 네이버 API에서 재조회 | `/api/articles/:articleNo/refresh` |
| 지역별 매물 통계 API | 완료 | 평균가, 거래량 등 | `/api/statistics/regions` |
| 단지별 매물 통계 API | 완료 | 단지 기준 통계 | `/api/statistics/complexes/:complexNo` |
| 단지별 매물 API | 완료 | 단지 기준 매물 목록 | `/api/complexes` |
| 대시보드 통계 API | 완료 | 전체 현황 요약 | `/api/statistics/overview` |
| 매물타입별 통계 API | 완료 | 유형별 분포 | `/api/statistics/types` |
| 가격 추이 API | 완료 | 월별 평균가 추이 | `/api/statistics/price-trend` |
| **사용자 매물 저장 API** | 완료 | 찜하기 | `/api/user/saved-properties` |
| **사용자 검색 조건 API** | 완료 | 필터 저장 | `/api/user/search-conditions` |
| **사용자 가격 알림 API** | 완료 | 알림 설정 | `/api/user/price-alerts` |
| **사용자 요약 API** | 완료 | 개인 정보 요약 | `/api/user/summary` |

---

## 6. 사용자 인터페이스

| 기능 | 상태 | 설명 | 비고 |
|------|------|------|------|
| 대시보드 | 완료 | 전체 현황 + 사용자 요약 + 가격 추이 차트 | 실제 API 연결 완료 |
| 매물 검색 | 완료 | 지역, 매물타입, 거래방식 선택 + 찜하기 | 실제 API 연결 + 반응형 |
| 지역 선택 모달 | 완료 | 시/도 → 시/군/구 → 읍/면/동 계층 선택 | `RegionSelectorModal.tsx` |
| 지도 뷰 | 완료 | 네이버 지도 API 기반 매물 위치 표시 | `PropertyMapView.tsx` |
| 차트/그래프 | 완료 | 가격 추이 SVG 차트 | `PriceTrendChart.tsx` |
| **찜하기 기능** | 완료 | 매물 저장 Heart 버튼 | `/api/user/saved-properties` |

---

## 7. 스케줄링 & 배치

| 기능 | 상태 | 설명 | 비고 |
|------|------|------|------|
| 주기적 크롤링 | 미구현 | Bull Queue로 작업 관리 | |
| 크롤링 대기열 | 미구현 | Redis + Bull | |
| 에러 처리 및 재시도 | 구현중 | 실패 시 재시도 로직 | API 레벨 에러 처리 완료 |
| 크롤링 로그 | 미구현 | `ScrapLog` 테이블 | |

---

## 주의사항

### 토큰 관리
- 토큰 만료 시간: 약 24시간 (23시간으로 설정)
- **쿠키 필수**: Puppeteer로 추출한 쿠키를 함께 전달해야 429 방지
- Puppeteer 봇 감지 우회:
  - User-Agent: Chrome 131
  - navigator.webdriver = undefined
  - window.chrome 랜덤 값
  - plugins, languages 설정
- **API 요청 시 필수 헤더**:
  - authorization: Bearer {token}
  - Cookie: {쿠키 문자열}
  - Referer: https://new.land.naver.com/...
  - User-Agent, Accept, Accept-Language
  - Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site, Priority

### 지역 데이터
- **전국 5,339개 지역 DB 저장 완료**
- **GPS 좌표 포함**: centerLat, centerLon
- **depth 필드**: 0(시/도), 1(시/군/구), 2(읍/면/동)
- **네이버 API 의존 제거**: `/api/regions`는 DB에서만 조회

### 매물타입
- APT: 아파트
- OPST: 오피스텔
- VL: 빌라/연립
- DDDGG: 단독/다가구
- JWJT: 전원주택
- SGJT: 상가주택
- ONEROOM: 원룸
- TWOROOM: 투룸
- SG: 상가
- SMS: 사무실
- GJCG: 공장/창고
- APTHGJ: 지식산업센터
- GM: 건물
- TJ: 토지

### 거래방식
- A1: 매매
- B1: 전세
- B2: 월세
- B3: 단기임대

### API 파라미터
- `ms`: 위도,경도,줌 레벨 (예: `37.2718,127.0135,16`)
- `a`: 매물타입 (콜론 구분, 예: `APT:OPST:PRE`)
- `b`: 거래방식 (콜론 구분, 예: `A1:B1:B2:B3`)
- `e`: 가격타입 (`RETAIL` 고정)

### 매물 조회 구조
- **아파트/오피스텔**: 지역 선택 → **단지(Complex)** 선택 → 매물 목록
  - 단지 API: `/api/complexes?cortarNo=xxx&realEstateType=APT`
  - 좌표 boundary 자동 계산 (centerLat, centerLon 기준)
- **빌라/주택/원룸/상가**: 지역 선택 → 바로 매물 목록
  - 매물 API: `/api/articles?cortarNo=xxx&realEstateType=VL`

---

## 변경 이력

### 2026-02-24 (늦은 오전)
- **데이터 아키텍처 재정의**: 공용 데이터 vs 개인 데이터 분리
- **사용자 기능 추가**: 찜하기, 검색 조건 저장, 가격 알림, 메모
- **User 모델 스키마**: User, SavedProperty, SearchCondition, PriceAlert, Note
- **사용자 API 구현**: `/api/user/*` 엔드포인트들
- **찜하기 UI**: 하트 아이콘 버튼, 토글 기능

### 2026-02-24 (오전)
- **가격 추이 차트 완료**: SVG 기반 가격 추이 시각화
- **PriceTrendChart 컴포넌트**: 월별 평균가, 변동률, 거래량 표시
- **가격 추이 API 추가**: `/api/statistics/price-trend`

### 2026-02-24 (아침)
- **지도 뷰 완료**: 네이버 지도 API 기반 매물 위치 표시
- **PropertyMapView 컴포넌트**: 마커, 매물 상세 사이드바, 반응형 지도
- **RealEstate 페이지 지도 통합**: "지도 보기" 버튼으로 토글

### 2026-02-24 (새벽)
- **대시보드 완료**: 전체 현황 요약, 매물타입별 분포, 지역별 통계
- **통계 API 추가**: `/api/statistics/overview`, `/api/statistics/types`
- **반응형 UI**: 데스크톱(테이블) / 모바일(카드 그리드) 레이아웃

### 2026-02-24 (심야)
- **지역 선택 모달 완료**: 시/도 → 시/군/구 → 읍/면/동 계층 선택
- **매물 검색 실제 API 연결**: mock 데이터 제거, 실제 백엔드 API 호출
- **RealEstate.tsx 개편**: 지역 선택, 매물 검색, 더보기 기능 구현

### 2026-02-24 (저녁)
- **전국 지역 DB 저장 완료**: 5,339개 지역 (시/도 → 시/군/구 → 읍/면/동)
- **GPS 좌표 포함**: 모든 지역에 centerLat, centerLon 저장
- **지역 API 네이버 의존 제거**: `/api/regions`는 DB에서만 조회

### 2026-02-24 (오후)
- **429 방지 완료**: 쿠키 추출 및 전달 로직 구현
- **전체 헤더 전달**: User-Agent, Referer, Sec-Fetch-* 등 모든 헤더 포함
- **complexes API 수정**: 좌표 boundary 자동 계산 추가
- **모든 매물타입 API 동작 확인**: 빌라, 원룸, 아파트 단지 모두 정상

### 2026-02-24 (오전)
- **API 서버 구축**: Hono + Bun 기반 백엔드 서버 생성 (`src/server/index.ts`)
- **토큰 관리 API**: `/api/token/status`, `/api/token/refresh` 구현 완료
- **지역 관리 API**: `/api/regions`, `/api/regions/tree` 구현 완료
- **매물 조회 API**: `/api/articles`, `/api/complexes` 구현 완료
- **DB 연동**: Region, Property 테이블 자동 저장 (upsert)
- **npm scripts**: `dev:api`, `dev:all` 추가
