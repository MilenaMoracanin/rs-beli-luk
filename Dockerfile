FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

FROM base AS builder
COPY . .
RUN npm ci && npm install --no-save \
  lightningcss-linux-x64-gnu@1.32.0 \
  @tailwindcss/oxide-linux-x64-gnu@4.3.3 \
  --workspace=web && npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

RUN mkdir -p apps/web/data && chown -R nextjs:nodejs apps/web/data

USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
