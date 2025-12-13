# ---------- Dependencies Layer ----------
FROM oven/bun:1-slim AS dependencies

RUN mkdir -p /tmp/dev

COPY package.json bun.lock bunfig.toml /tmp/dev

RUN cd /tmp/dev && bun install --frozen-lockfile

# ---------- Builder Layer ----------
FROM oven/bun:1-slim AS builder

WORKDIR /app

COPY --from=dependencies /tmp/dev/node_modules ./node_modules

COPY . .

RUN bun run build

# ---------- Runtime Layer ----------
FROM oven/bun:1-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/migrations ./migrations

EXPOSE 3000

CMD ["bun", "run", ".output/server/index.mjs"]
