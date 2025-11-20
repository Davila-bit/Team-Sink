FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Enable pnpm via corepack
RUN corepack enable

# Install production dependencies first for better layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy application source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "index.js"]
