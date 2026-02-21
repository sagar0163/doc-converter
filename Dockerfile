FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY src/ ./src/

RUN npm link

ENTRYPOINT ["doc-convert"]
CMD ["--help"]
