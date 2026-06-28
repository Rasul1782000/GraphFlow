FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json tsconfig*.json nest-cli.json ./
RUN npm ci

COPY src/ ./src/
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
RUN addgroup --system --gid 1001 graphflow && \
    adduser --system --uid 1001 --ingroup graphflow graphflow

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

USER graphflow
EXPOSE 4000

ENV NODE_ENV=production
CMD ["node", "dist/main"]
