FROM node:20-alpine AS audit

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts && npm audit --audit-level=high

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache chromium \
    && npm install --production

ENV CHROME_PATH=/usr/bin/chromium

COPY src/ ./src/

RUN npm link

ENTRYPOINT ["doc-convert"]
CMD ["--help"]