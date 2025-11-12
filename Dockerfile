# ---------- Dependencies Layer ----------
FROM oven/bun:1 AS dependencies

# Development Dependencies
RUN mkdir -p /tmp/dev
COPY package.json bun.lock bunfig.toml /tmp/dev
RUN cd /tmp/dev && bun install --frozen-lockfile

# Production Dependencies
RUN mkdir -p /tmp/prod
COPY package.json bun.lock bunfig.toml /tmp/prod
RUN cd /tmp/prod && bun install --production --frozen-lockfile

# ---------- Builder Layer ----------
FROM oven/bun:1 AS builder

WORKDIR /app

COPY --from=dependencies /tmp/dev/node_modules ./node_modules

COPY . .

RUN bun run build

# ---------- Runtime Layer ----------
FROM oven/bun:1 AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/migrations ./migrations
COPY --from=dependencies /tmp/prod/node_modules ./node_modules

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD ["bun", "run", "server.ts"]