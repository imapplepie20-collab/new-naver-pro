# 세션 컨텍스트 - 부동산 매물 검색 시스템

## 중요: 단지 클릭 동작 (2026-02-25 수정)
- **매물 검색 페이지** (`RealEstate.tsx`)에서 단지 클릭 시 → **임시 매물 페이지**로 이동
- 단지 카드 클릭은 `handleComplexClick(complex)` 함수 호출
- 기존 `fetchComplexArticles` 함수는 삭제됨 (더 이상 같은 페이지에서 매물을 보여주지 않음)

## 중요: "검색 페이지 복귀" 기능 (2026-02-25 추가)
- 임시 매물 페이지와 정규 매물 페이지의 "단지 목록" 버튼은 **검색 페이지(`/real-estate`)로 복귀**
- 검색 페이지에서 단지 목록을 가져오면 `localStorage`에 상태 저장 (`complexListState` 키)
- 검색 페이지 진입 시 `localStorage`에서 단지 목록 상태 복원 (지역, 필터, 단지 목록)
- 이를 통해 검색 페이지를 벗어났다가 다시 돌아와도 이전 검색 결과가 유지됨

## 사용자 흐름 명확화
```
[검색 페이지 /real-estate]
    ↓ 지역 선택 + 검색
    ↓ 단지 목록 표시 (localStorage에 상태 저장됨)
    ↓
[단지 클릭] → [임시 매물 페이지 /real-estate/apartment-temp-properties]
    ↓ 매물 저장/삭제
    ↓
["단지 목록" 버튼 클릭] → [검색 페이지로 복귀, 단지 목록 상태 복원됨]
    ↓ 다른 단지 클릭 가능
    ↓
[임시 매물에서 "정규 매물로 저장"] → [정규 매물 페이지 /real-estate/regular-properties]
    ↓ DB 기반 영구 저장
    ↓
["단지 목록" 버튼 클릭] → [검색 페이지로 복귀, 단지 목록 상태 복원됨]
```

**핵심 개념**:
- "단지 목록"은 별도 페이지가 아니라 **검색 페이지의 단지 목록 상태**
- 임시/정규 매물 페이지에서 "단지 목록" 버튼을 클릭하면 **검색 페이지 복귀**
- 검색 페이지는 `localStorage`에 저장된 상태를 복원하여 이전 검색 결과를 그대로 보여줌
- 정규 매물 목록은 DB에 영구 저장되므로 사이드바 메뉴에 별도 표시

## 프로젝트 개요
네이버 부동산 데이터를 스크래핑하여 매물 검색/관리 시스템 구축

## 기술 스택
- **프론트엔드**: React 19, TypeScript, Vite, React Router
- **백엔드**: Hono, Bun, Prisma, PostgreSQL
- **UI**: HUD 테마 (커스텀), Tailwind CSS, Lucide Icons
- **상태 관리**: Zustand, localStorage

## 사용자 흐름

```
1. 매물 검색 (/real-estate)
   ↓ 지역 선택, 필터 설정
   ↓ 단지 목록 표시
   ↓
2. 단지 클릭 → 임시 매물 페이지 (/real-estate/apartment-temp-properties)
   ↓ 매물 목록 출력
   ↓ 저장/삭제 가능
   ↓
3. 매물 목록 (/real-estate/regular-properties)
   ↓ 저장된 매물 관리
   ↓ 엑셀 다운로드
```

## 페이지 구조

### 1. 매물 검색 페이지 (`/real-estate`)
- **파일**: `src/pages/real-estate/RealEstate.tsx`
- **기능**:
  - 지역 선택 (RegionSelectorModal)
  - 매물 유형 선택 (아파트, 오피스텔, 빌라, 원룸, 투룸, 상가)
  - 거래 방식 (매매, 전세, 월세)
  - 가격/면적 필터
  - 단지 목록 표시 (아파트/오피스텔)
  - 단지 클릭 시 임시 매물 페이지로 이동

### 2. 임시 매물 페이지 (`/real-estate/apartment-temp-properties`)
- **파일**: `src/pages/real-estate/ApartmentTempPropertyList.tsx`
- **기능**:
  - localStorage 기반 임시 저장 (단지별로 분리)
  - 매물 목록 그리드/리스트 뷰
  - 정렬 (가격순, 면적순, 최신순, 층수순)
  - 개별/일괄 삭제
  - "정규 매물로 저장" 버튼
  - "단지 목록" 버튼 → 검색 페이지로 이동 (상태 복원)
  - 엑셀 다운로드 (필드 선택 모달)

### 3. 매물 목록 페이지 (`/real-estate/regular-properties`)
- **파일**: `src/pages/real-estate/ApartmentRegularPropertyList.tsx`
- **기능**:
  - DB 기반 저장 매물 관리 (영구 저장, 비휘발성)
  - 통계 카드 (총 매물, 매매/전세/월세 수)
  - 단지명 필터
  - 정렬 (저장일, 가격, 면적, 단지명)
  - 개별/일괄 삭제
  - "단지 목록" 버튼 → 검색 페이지로 이동 (상태 복원)
  - 엑셀 다운로드

## API 엔드포인트

### 주요 API
| 엔드포인트 | 설명 |
|-----------|------|
| `GET /api/regions` | 지역 목록 |
| `GET /api/complexes` | 단지 목록 |
| `GET /api/articles` | 매물 목록 |
| `POST /api/user/saved-properties` | 매물 저장 |
| `DELETE /api/user/saved-properties/:articleNo` | 매물 삭제 |
| `GET /api/user/saved-properties` | 저장 매물 목록 |

### API 응답 구조 주의사항
- `/api/complexes` 응답이 배열로 올 수 있음 → 서버에서 `{ complexMarkerList: [...] }` 로 감싸서 반환 처리 완료

## 컴포넌트

### 공통 컴포넌트
- `HudCard` - HUD 스타일 카드
- `Button` - 버튼 (variant: primary, outline, ghost, secondary)
- `RegionSelectorModal` - 지역 선택 모달
- `ExcelExportModal` - 엑셀 다운로드 필드 선택 모달

### 부동산 전용 컴포넌트
- `PropertyMapView` - 지도 뷰 (지도 미구현 상태)

## 사이드바 메뉴 구조

```
Real Estate
├── 매물 검색 (/real-estate)
└── 매물 목록 (/real-estate/regular-properties)
```

- **아파트 단지** `/real-estate/apartments` - 중간 단계라 메뉴 제외
- **오피스텔 단지** `/real-estate/officetels` - 중간 단계라 메뉴 제외
- **임시 매물** `/real-estate/apartment-temp-properties` - 중간 단계라 메뉴 제외

## 라우팅 설정 (App.tsx)

```tsx
<Route path="real-estate" element={<RealEstate />} />
<Route path="real-estate/apartments" element={<ComplexListPage propertyType="APT" />} />
<Route path="real-estate/officetels" element={<ComplexListPage propertyType="OPST" />} />
<Route path="real-estate/apartment-temp-properties" element={<ApartmentTempPropertyList />} />
<Route path="real-estate/regular-properties" element={<ApartmentRegularPropertyList />} />
```

## 미구현 기능
- [ ] 단지 지도 뷰 컴포넌트 (현재 "준비 중" 메시지 표시)

## 최근 수정 사항 (2026-02-25)
1. 단지 목록 페이지 (`ComplexListPage.tsx`) 생성
2. 엑셀 다운로드 필드 선택 모달 (`ExcelExportModal.tsx`) 생성
3. 임시 매물 페이지 (`ApartmentTempPropertyList.tsx`) 생성
4. 정규 매물 페이지 (`ApartmentRegularPropertyList.tsx`) 생성
5. 사이드바 메뉴 구조 변경 (중간 단계 메뉴 제거)
6. `/api/complexes` 응답 처리 수정 (배열 감싸기)
7. 단지 클릭 시 임시 매물 페이지로 이동하도록 경로 수정
8. **"단지 목록으로 가기" 버튼 경로 수정**: `/real-estate/apartments` → `/real-estate`
9. **단지 목록 상태 localStorage 저장/복원 기능 추가** (`complexListState` 키)

## 중요: 임시/정규 매물 개념 (2026-02-25 추가)
- **임시 매물** = 네이버 API에서 실시간으로 가져온 매물 (일회성 조회)
- **정규 매물** = 사용자가 "저장" 버튼을 눌러 서버 DB에 영구 저장한 매물
- **"임시 → 정규"는 사용자가 만든 개념** (네이버의 개념 아님)
- **임시 매물에서 이미 가져온 매물이므로 정규 매물 페이지는 네이버 API 재조회 없음**
- **데이터 저장소**: 중앙 DB (SavedProperty 테이블, 사용자별 userId로 저장)

### 구현 완료 (2026-02-25)
- [x] 임시 매물 → 정규 매물 저장: 서버 API `/api/user/saved-properties/bulk` 호출
- [x] localStorage `regularArticles` 사용 제거 (서버 DB만 사용)
- [x] 저장 후 정규 매물 목록 페이지로 자동 이동
- [x] 정규 매물 페이지에서 서버 API `/api/user/saved-properties` 조회
- [x] 정규 매물 삭제 시 서버 API 호출 (개별/일괄)
- [x] **임시 매물 페이지 "전체 로드" 버튼 추가** (모든 페이지 한 번에 로드)
- [x] **저장 버튼 텍스트 변경**: 아이콘 전용 → "정규 매물로 저장" 텍스트 포함
- [x] **매물 유형 필터 추가**: 정규 매물 목록 페이지에 아파트/오피스텔 등 유형별 필터 추가
- [x] **매물 유형 컬럼 추가**: 임시/정규 매물 테이블에 매물 유형 컬럼 표시

## 인증 시스템 (2026-02-25 추가)

### 인증 API 엔드포인트
| 엔드포인트 | 설명 |
|-----------|------|
| `POST /api/auth/register` | 회원가입 |
| `POST /api/auth/login` | 로그인 |
| `GET /api/auth/me` | 현재 사용자 정보 조회 |
| `POST /api/auth/logout` | 로그아웃 |

### 인증 상태 관리
- **파일**: `src/stores/authStore.ts`
- **라이브러리**: Zustand + persist (localStorage)
- **저장 데이터**: user, token, isAuthenticated

### 인증 페이지
| 페이지 | 경로 | 설명 |
|--------|------|------|
| 로그인 | `/login` | 이메일/비밀번호 로그인 |
| 회원가입 | `/register` | 이름/이메일/비밀번호 회원가입 |

### 비밀번호 해시
- SHA-256 (Web Crypto API 사용) - 프로덕션에서는 bcrypt 권장

## 확인 필요事项
다음 흐름이 정상 작동하는지 확인 필요:

1. [ ] 매물 검색 페이지에서 지역 선택 → 단지 목록 표시
2. [ ] 단지 클릭 → 임시 매물 페이지로 이동 및 매물 출력
3. [ ] 임시 매물 페이지에서 저장 → 매물 목록 페이지에 저장된 매물 표시
4. [ ] 각 페이지에서 엑셀 다운로드 정상 작동

## 주요 파일 위치

| 파일 | 경로 |
|------|------|
| 매물 검색 페이지 | `src/pages/real-estate/RealEstate.tsx` |
| 단지 목록 페이지 | `src/pages/real-estate/ComplexListPage.tsx` |
| 임시 매물 페이지 | `src/pages/real-estate/ApartmentTempPropertyList.tsx` |
| 정규 매물 페이지 | `src/pages/real-estate/ApartmentRegularPropertyList.tsx` |
| 사이드바 | `src/components/layout/Sidebar.tsx` |
| 라우팅 | `src/App.tsx` |
| API 서버 | `src/server/index.ts` |
| 타입 정의 | `src/types/naver-land.ts` |
| 인증 스토어 | `src/stores/authStore.ts` |
