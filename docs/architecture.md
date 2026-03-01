# 🏗️ 프로젝트 아키텍처 & 배포 가이드

> 최종 업데이트: 2026-03-01

---

## 📁 프로젝트 구조

```
imapplepieTemplate001/
├── src/
│   ├── server/              # 백엔드 API (Hono + Bun)
│   │   └── index.ts         # 메인 서버 (API + 정적 파일 서빙)
│   ├── lib/
│   │   ├── api.ts           # 🔑 공통 API_BASE URL 설정
│   │   ├── db/
│   │   │   └── prisma.ts    # Prisma 클라이언트
│   │   └── scraper/
│   │       ├── naver-client.ts   # 네이버 부동산 API 클라이언트
│   │       └── token-manager.ts  # 토큰 관리
│   ├── pages/               # 페이지 컴포넌트
│   ├── components/          # 공통 컴포넌트
│   ├── stores/              # Zustand 상태 관리
│   │   ├── authStore.ts     # 인증 상태
│   │   └── themeStore.ts    # 테마 설정
│   └── index.css            # 글로벌 CSS & 테마 변수
├── prisma/
│   └── schema.prisma        # DB 스키마
├── public/                  # 정적 에셋 (로고 등)
├── dist/                    # ⚡ Vite 빌드 결과물 (gitignore)
├── vite.config.ts           # Vite 설정 (프록시 포함)
├── package.json             # 스크립트 & 의존성
└── docker-compose.yml       # PostgreSQL 도커
```

---

## 🛠️ 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| **프론트엔드** | React + TypeScript | 18.x |
| **빌드 도구** | Vite | 6.x |
| **스타일링** | Tailwind CSS | 3.x |
| **상태 관리** | Zustand | 5.x |
| **라우팅** | React Router | 6.x |
| **백엔드** | Hono (Bun 런타임) | 4.x |
| **DB** | PostgreSQL + Prisma | Prisma 6.x |
| **차트** | Recharts + Chart.js | - |
| **지도** | Leaflet | 1.9.x |

---

## 🔗 프론트엔드-백엔드 통합 구조

### 핵심: `src/lib/api.ts`

```typescript
export const API_BASE = import.meta.env.VITE_API_BASE || '';
```

- **프로덕션**: `API_BASE = ''` → 같은 서버에서 서빙되므로 상대 경로
- **개발**: Vite 프록시가 `/api/*` 요청을 `localhost:3001`로 전달

### Vite 프록시 설정 (`vite.config.ts`)

```typescript
server: {
    proxy: {
        '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
        },
    },
}
```

### 서버 정적 파일 서빙 (`src/server/index.ts`)

프로덕션 모드(`NODE_ENV=production`)에서:
1. `dist/assets/*` → Vite 빌드된 JS/CSS 파일 서빙
2. `*` (API가 아닌 경로) → `dist/index.html` 반환 (SPA 폴백)

---

## 🚀 실행 방법

### 개발 모드 (2개 서버 분리)

```bash
# 방법 1: 터미널 2개로 각각 실행
npm run dev        # 프론트엔드 (http://localhost:5173)
npm run dev:api    # 백엔드 API (http://localhost:3001)

# 방법 2: 한 번에 실행
npm run dev:all    # 프론트 + 백엔드 동시 실행
```

### 프로덕션 모드 (단일 서버)

```bash
npm run build:all  # 프론트엔드 빌드 + Prisma 생성
npm start          # 단일 서버 (http://localhost:3001)
```

### 포트 커스텀

```bash
PORT=8080 npm start  # 포트 변경
```

---

## 🗄️ 데이터베이스

### Docker로 PostgreSQL 실행

```bash
docker compose up -d
```

### Prisma 명령어

```bash
npx prisma generate    # Prisma 클라이언트 생성
npx prisma db push     # 스키마를 DB에 적용
npx prisma studio      # DB 브라우저 열기
npx prisma migrate dev # 마이그레이션 생성 & 적용
```

### 환경 변수 (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

---

## 🎨 테마 시스템

### 테마 모드 (4가지)

| 모드 | 설명 | 기본값 |
|------|------|--------|
| **smart** | 시간대별 자동 전환 (낮=라이트, 밤=다크) | ✅ 기본 |
| light | 항상 밝은 테마 | |
| dark | 항상 어두운 테마 | |
| system | OS 설정 따름 | |

### 강조 색상 (10가지)

`시안`, `인디고`, `핑크`, `오렌지`, `그린`, `레드`, `틸`, `퍼플`, `앰버`, `슬레이트`

### CSS 변수

테마별 CSS 변수는 `src/index.css`에 정의:
- `.smart { }` — 스마트 테마 (라이트 기반)
- `.light { }` — 라이트 테마
- `.dark { }` — 다크 테마 (`:root`에 기본값)

---

## 📦 배포 (Railway 예시)

### 1. GitHub에 푸시

```bash
git add .
git commit -m "프로덕션 빌드 설정"
git push origin main
```

### 2. Railway 설정

1. [railway.app](https://railway.app) 가입 (GitHub 연동)
2. "New Project" → "Deploy from GitHub Repo"
3. "Add PostgreSQL" 클릭 → DB 자동 생성
4. 환경 변수 설정:
   - `DATABASE_URL` → Railway PostgreSQL 연결 문자열 (자동 제공)
   - `NODE_ENV` → `production`
   - `PORT` → Railway가 자동 설정

### 3. 빌드 & 시작 명령어

| 항목 | 설정값 |
|------|--------|
| **Build Command** | `npm run build:all` |
| **Start Command** | `npm start` |
| **Root Directory** | `/` |

---

## 🔧 유용한 명령어

```bash
# 서버 프로세스 전부 종료
lsof -ti:5173,3001 | xargs kill -9 2>/dev/null; echo "포트 정리 완료"

# Vite 캐시 초기화
rm -rf node_modules/.vite && npm run dev

# Prisma 스키마 변경 후
npx prisma generate && npx prisma db push

# 프로덕션 빌드 테스트 (로컬)
npm run build:all && npm start
```

---

## ⚠️ 트러블슈팅

### API 요청이 안 될 때
1. 백엔드 서버가 실행 중인지 확인: `lsof -i:3001`
2. Vite 프록시 설정 확인: `vite.config.ts`의 `proxy` 섹션
3. `src/lib/api.ts`의 `API_BASE` 값 확인

### 테마가 안 바뀔 때
- 브라우저 localStorage에 이전 설정이 캐시됨
- 해결: 개발자도구 → Application → Local Storage → `theme-storage` 삭제

### Docker DB 연결 실패
```bash
docker compose down && docker compose up -d  # 재시작
npx prisma db push                           # 스키마 재적용
```

### 빌드 에러: `@tailwind` 경고
- IDE 경고일 뿐, 빌드에는 영향 없음 (Tailwind CSS 정상 동작)

---

## 📝 API 엔드포인트 요약

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 헬스 체크 |
| GET | `/api/token/status` | 토큰 상태 |
| POST | `/api/token/refresh` | 토큰 갱신 |
| POST | `/api/token/manual` | 토큰 수동 입력 |
| GET | `/api/regions` | 지역 목록 |
| GET | `/api/regions/tree` | 지역 트리 |
| GET | `/api/complexes` | 단지 목록 (가격 포함) |
| GET | `/api/articles` | 매물 목록 |
| GET | `/api/articles/:articleNo` | 매물 상세 |
| GET | `/api/statistics/overview` | 전체 통계 |
| GET | `/api/statistics/regions` | 지역별 통계 |
| GET | `/api/statistics/types` | 타입별 통계 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/register` | 회원가입 |
| GET | `/api/auth/me` | 현재 유저 |
| GET | `/api/user/saved-properties` | 저장된 매물 |
| GET | `/api/global-theme` | 글로벌 테마 조회 |
| PUT | `/api/global-theme` | 글로벌 테마 저장 |
