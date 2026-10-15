# Reinigungsbuddy – Astro-Seite (statisch, nginx) + kleiner Anfrage-Server (Node) in einem Container.
# Coolify: Build Pack „Dockerfile", Port 80, Persistent Storage auf /data.
# Build-Variable: SITE_URL. Laufzeit-Variablen (Formular): siehe README, Abschnitt „Anfrageformular".

# ---- Website bauen ----
FROM node:22-bookworm-slim AS build
WORKDIR /app
ARG SITE_URL=https://reinigungs-buddy.de
ENV SITE_URL=$SITE_URL \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    ASTRO_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Baut die Seite und führt die QA-Checks aus (bricht bei Fehlern ab)
RUN npm run build

# ---- Anfrage-Server: Abhängigkeiten ----
FROM node:22-alpine AS server
WORKDIR /srv
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server/server.mjs ./

# ---- Auslieferung ----
FROM nginx:1.27-alpine
RUN apk add --no-cache nodejs
COPY --from=server /srv /srv
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint-rb.sh
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod +x /docker-entrypoint-rb.sh && mkdir -p /data
ENV DATA_DIR=/data NODE_ENV=production
VOLUME ["/data"]
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/api/health >/dev/null || exit 1
ENTRYPOINT ["/docker-entrypoint-rb.sh"]
