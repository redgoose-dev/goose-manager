ARG IMAGE_TAG=alpine

# Build stage
FROM oven/bun:${IMAGE_TAG} AS builder
WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile
RUN bun run build
RUN rm -rf node_modules
RUN bun install --production
RUN rm -rf /tmp/* /root/.bun/cache


# Runtime stage
FROM oven/bun:${IMAGE_TAG}
WORKDIR /app

USER bun

COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/dist ./dist
COPY --from=builder --chown=bun:bun /app/server ./server
COPY --from=builder --chown=bun:bun /app/.env ./.env
COPY --from=builder --chown=bun:bun /app/package.json ./package.json

EXPOSE 80

CMD [ "bun", "run", "server/main.js" ]
