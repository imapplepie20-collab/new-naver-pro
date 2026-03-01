# ============================================
# Railway 배포용 Dockerfile (Bun 런타임)
# ============================================

# Stage 1: Install dependencies & build
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies with bun
RUN bun install --frozen-lockfile || bun install

# Generate Prisma client
RUN bunx prisma generate

# Copy source code
COPY . .

# Build frontend (Vite)
RUN bun run build

# Stage 2: Production image (full, not slim - Puppeteer needs Chromium)
FROM oven/bun:1

WORKDIR /app

# Install Chromium and dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-ipafont-gothic \
  fonts-wqy-zenhei \
  fonts-thai-tlwg \
  fonts-khmeros \
  fonts-freefont-ttf \
  libxss1 \
  openssl \
  ca-certificates \
  curl \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.node.json ./
COPY --from=builder /app/global-theme.json ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Run prisma migrations and start server
CMD ["sh", "-c", "bunx prisma db push --skip-generate && bun run src/server/index.ts"]
