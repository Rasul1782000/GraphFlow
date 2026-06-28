FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json tsconfig.json next.config.mjs ./
RUN npm ci

COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
RUN addgroup --system --gid 1001 graphflow && \
    adduser --system --uid 1001 --ingroup graphflow graphflow

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER graphflow
EXPOSE 3000

ENV NODE_ENV=production
CMD ["node_modules/.bin/next", "start"]
