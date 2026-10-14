# Reinigungsbuddy – statische Astro-Seite, ausgeliefert mit nginx.
# Coolify: Build Pack „Dockerfile", Port 80. Build-Variablen: SITE_URL, optional PUBLIC_FORM_ENDPOINT.

# ---- Build ----
FROM node:22-bookworm-slim AS build
WORKDIR /app
ARG SITE_URL=https://reinigungs-buddy.de
ARG PUBLIC_FORM_ENDPOINT=
ENV SITE_URL=$SITE_URL \
    PUBLIC_FORM_ENDPOINT=$PUBLIC_FORM_ENDPOINT \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    ASTRO_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Baut die Seite und führt die QA-Checks aus (bricht bei Fehlern ab)
RUN npm run build

# ---- Auslieferung ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
