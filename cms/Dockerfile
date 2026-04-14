# ---- development ----
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# ---- dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_WEBSITE_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_WEBSITE_URL=$NEXT_PUBLIC_WEBSITE_URL
# Dummy values satisfy fail-fast checks at build time; real values are injected at runtime
ENV PAYLOAD_SECRET=build-placeholder
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV CMS_SERVER_URL=https://build.placeholder.local
RUN npm run build

# ---- production ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder                        /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
