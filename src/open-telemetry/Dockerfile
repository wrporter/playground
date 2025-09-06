FROM node:22-alpine AS base

USER root

###############################################################################
# Install dependencies and build application
###############################################################################
FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --loglevel=warn

COPY . .
#RUN npm run ci

RUN npm prune --omit=dev

###############################################################################
# Production image
###############################################################################
FROM base AS production

WORKDIR /app

# Build version metadata
ARG APP_ID
ARG BUILD_BRANCH
ARG BUILD_SHA
ARG BUILD_VERSION
ARG BUILD_DATE
ENV APP_ID=$APP_ID
ENV BUILD_BRANCH=$BUILD_BRANCH
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_VERSION=$BUILD_VERSION
ENV BUILD_DATE=$BUILD_DATE

ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/serve.js ./build/main.js
#COPY --from=builder /app/build ./build

CMD ["node", "--require=./otel.cjs", "./build/main.js"]