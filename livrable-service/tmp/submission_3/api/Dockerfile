FROM node:21-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

RUN npm i

COPY . .

RUN npm run build

FROM node:21-alpine AS prod

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY .env ./

COPY server.crt /etc/ssl/certs/server.crt
COPY server.key /etc/ssl/private/server.key

CMD npm run start:migrate:prod
