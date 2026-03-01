# 구현 기록 (CHANGELOG)

## 2026-02-24

### 백엔드 API 서버 구축

#### 1. 의존성 추가
```bash
npm install hono
npm install -D bun npm-run-all
```

#### 2. 파일 생성
- **`src/server/index.ts`** - Hono 기반 API 서버

#### 3. 구현된 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 헬스 체크 |
| GET | `/api/token/status` | 토큰 상태 확인 |
| POST | `/api/token/refresh` | 토큰 강제 갱신 |
| GET | `/api/regions` | 지역 목록 조회 |
| GET | `/api/regions/tree` | 지역 트리 구조 조회 |
| GET | `/api/articles` | 매물 목록 조회 |
| GET | `/api/complexes` | 단지 목록 조회 |

#### 4. npm 스크립트 추가
```json
{
  "scripts": {
    "dev": "vite",
    "dev:api": "bun run src/server/index.ts",
    "dev:all": "npm-run-all --parallel dev dev:api",
    ...
  }
}
```

#### 5. 실행 방법

**프론트엔드만 실행:**
```bash
npm run dev
# http://localhost:5173
```

**API 서버만 실행:**
```bash
npm run dev:api
# http://localhost:3001
```

**프론트엔드 + API 서버 동시 실행:**
```bash
npm run dev:all
```

#### 6. API 사용 예시

**토큰 상태 확인:**
```bash
curl http://localhost:3001/api/token/status
```

**토큰 갱신:**
```bash
curl -X POST http://localhost:3001/api/token/refresh
```

**지역 목록 조회 (최상위):**
```bash
curl http://localhost:3001/api/regions
```

**지역 목록 조회 (자식):**
```bash
curl http://localhost:3001/api/regions?cortarNo=1100000000
```

**매물 목록 조회:**
```bash
curl "http://localhost:3001/api/articles?cortarNo=1111000000&realEstateType=VL&tradeType=A1"
```

**단지 목록 조회:**
```bash
curl "http://localhost:3001/api/complexes?cortarNo=1111000000&realEstateType=APT"
```

---

## 다음 단계 (TODO)

- [ ] 지역 선택 모달 컴포넌트 구현
- [ ] 프론트엔드와 API 연결
- [ ] 매물 상세 조회 API
- [ ] 지역별 매물 통계 API
- [ ] 스케줄링/배치 처리 (Bull Queue + Redis)
