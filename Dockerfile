# Optimized for Bun Runtime Servers (Docker, Local, etc.)
# Note: database migrations are handled by the entrypoint.ts script
# final image size could be larger compared to .nitro builds due to the dependencies layer

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
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/entrypoint.ts ./entrypoint.ts
COPY --from=dependencies /tmp/prod/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "run", "entrypoint.ts"]