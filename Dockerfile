# ---- Stage 1: install dependencies ----
FROM node:18-alpine AS deps
WORKDIR /app
# Copy only manifests first so Docker can CACHE the npm install layer.
# Dependencies only reinstall when package*.json changes, not on every code edit.
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Stage 2: runtime ----
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Run as a non-root user for security (Alpine ships a 'node' user).
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node

EXPOSE 3000
# Container-level healthcheck: Docker marks the container unhealthy if this fails.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]