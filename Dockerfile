# ---------- Dependencies Layer ----------
FROM oven/bun:1 AS dependencies

WORKDIR /app

COPY package.json bun.lock bunfig.toml ./

RUN bun install --frozen-lockfile

# ---------- Builder Layer ----------
FROM oven/bun:1 AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN bun run build

# ---------- Runtime Layer ----------
FROM oven/bun:1 AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/migrations ./migrations

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD ["bun", "run", ".output/server/index.mjs"]