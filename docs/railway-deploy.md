# 🚀 Railway 배포 가이드

> 마지막 업데이트: 2026-03-01

---

## 📋 프로젝트 정보

| 항목 | 값 |
|------|-----|
| **Railway 프로젝트** | new-naver-pro |
| **프로젝트 ID** | `1ff10d9f-f6ed-4549-8373-bd4373bd2a34` |
| **앱 서비스 ID** | `eeb1cc4b-8754-453b-af69-301b701e82e7` |
| **GitHub 저장소** | `imapplepie20-collab/new-naver-pro` |
| **런타임** | Bun (Dockerfile 기반) |
| **DB** | Railway PostgreSQL |
| **배포 URL** | https://web-production-e567c.up.railway.app |
| **Railway 대시보드** | https://railway.com/project/1ff10d9f-f6ed-4549-8373-bd4373bd2a34 |
| **상태** | ✅ 배포 완료, 헬스체크 정상 |

---

## 🛠️ 배포 과정 (전체 기록)

### Step 1: 배포 파일 생성

#### Dockerfile
Bun 런타임을 사용하는 2-stage 빌드:
- **Stage 1 (builder)**: 의존성 설치 → Prisma generate → Vite 빌드
- **Stage 2 (production)**: 빌드 결과물만 복사 → slim 이미지

```dockerfile
FROM oven/bun:1 AS builder    # 빌드용
FROM oven/bun:1-slim           # 운영용 (경량)
```

#### .dockerignore
`node_modules`, `dist`, `.git`, `.env` 등 불필요한 파일 제외

#### railway.toml
```toml
[build]
builder = "DOCKERFILE"        # Nixpacks 대신 Dockerfile 사용

[deploy]
healthcheckPath = "/api/health"
```

### Step 2: Git 저장소 변경 & Push

```bash
git remote set-url origin https://github.com/imapplepie20-collab/new-naver-pro.git
git add Dockerfile .dockerignore railway.toml
git commit -m "Railway 배포 설정 (Dockerfile + railway.toml)"
git push origin main
```

### Step 3: Railway CLI 설치 & 로그인

```bash
npm install -g @railway/cli
railway login --browserless
# → 페어링 코드로 브라우저 로그인
# → imapplepie20@gmail.com 계정
```

### Step 4: Railway 프로젝트 생성

```bash
railway init --name new-naver-pro
# → imapplepie20-collab's Projects 워크스페이스에 생성
```

### Step 5: PostgreSQL 추가

```bash
railway add --database postgres
# → PostgreSQL 자동 생성 및 연결
```

### Step 6: 앱 배포 (코드 업로드)

```bash
railway up --detach
# → Dockerfile 기반으로 빌드 & 배포
```

### Step 7: 환경변수 설정 (앱 서비스)

앱 서비스에 필요한 환경변수:

| 변수 | 값 | 설명 |
|------|-----|------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Railway 레퍼런스 변수 (자동 연결) |
| `NODE_ENV` | `production` | 프로덕션 모드 |
| `PORT` | Railway 자동 설정 | 서버 포트 |

### Step 8: 도메인 생성

Railway 대시보드 → 앱 서비스 → Settings → Networking → Generate Domain
→ `*.up.railway.app` 형태의 도메인 자동 생성

---

## 📌 주요 명령어 요약

```bash
# 로그인
railway login --browserless

# 프로젝트 연결 (이미 생성된 경우)
railway link

# 배포 (현재 코드를 Railway에 업로드)
railway up --detach

# 환경변수 확인
railway variables

# 환경변수 설정
railway variables set KEY=value

# 로그 확인
railway logs

# 상태 확인
railway status

# 도메인 생성
railway domain
```

---

## ⚠️ 주의사항

1. **Bun 런타임**: Railway의 기본 빌드(Nixpacks)는 Node.js만 지원 → **반드시 Dockerfile 사용**
2. **DATABASE_URL**: Railway PostgreSQL의 내부 도메인(`postgres.railway.internal`)을 사용해야 함
3. **PORT**: Railway가 자동으로 `PORT` 환경변수를 주입하므로 서버에서 `process.env.PORT`를 사용
4. **정적 파일**: 프로덕션에서 Hono 서버가 `dist/` 폴더의 빌드 결과물을 직접 서빙
5. **SPA 폴백**: API가 아닌 모든 경로는 `dist/index.html`로 폴백 처리

---

## 🔄 재배포 방법

코드 수정 후:

```bash
git add .
git commit -m "변경사항 설명"
git push origin main

# Railway CLI로 직접 배포
railway up --detach
```

또는 GitHub 연동 후 push 시 자동 배포 설정 가능
