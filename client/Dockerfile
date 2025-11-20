FROM node:20-alpine AS build

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

FROM nginx:1.27-alpine AS production

# Replace default nginx site with SPA-friendly config
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
