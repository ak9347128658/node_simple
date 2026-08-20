# ---- build stage: install production deps only ----
FROM node:20-alpine AS deps

WORKDIR /app

# Copy lockfile first so Docker cache is reused when only source changes
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- runtime stage: tiny final image ----
FROM node:20-alpine AS runner

# Non-root user — if the process is exploited it is not root inside the box
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/index.js"]