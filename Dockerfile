# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20

# ----- stage 1: install production npm packages only -----
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
# copy manifests first (better layer cache)
COPY package.json package-lock.json ./
# npm ci = clean install from lockfile (reproducible)
# --omit=dev = skip supertest and other test tools
RUN npm ci --omit=dev && npm cache clean --force

# ----- stage 2: the image you run -----
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# non-root user (safer)
RUN addgroup -S app && adduser -S app -G app

# reuse stage 1 packages
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
# only application source
COPY src ./src

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/server.js"]
