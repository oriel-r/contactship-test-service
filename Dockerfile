FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install

COPY src ./src
RUN npm run build

ARG APP_INTERNAL_PORT=3000
ENV APP_INTERNAL_PORT=${APP_INTERNAL_PORT}
EXPOSE ${APP_INTERNAL_PORT}

CMD ["node", "dist/main.js"]