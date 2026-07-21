# syntax=docker/dockerfile:1

ARG IMAGE_TAG=alpine

# Build stage
FROM oven/bun:${IMAGE_TAG} AS builder
WORKDIR /app

COPY package.json bun.lock ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY . .

RUN bun run build
RUN rm -rf node_modules
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --production --frozen-lockfile
RUN rm -rf /tmp/* /root/.bun/cache


# Runtime stage
FROM oven/bun:${IMAGE_TAG}
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/package.json ./package.json

EXPOSE 80

CMD [ "bun", "run", "preview" ]
# CMD [ "tail", "-f", "/dev/null" ] # for test
