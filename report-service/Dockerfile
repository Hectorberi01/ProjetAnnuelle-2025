# Étape 1 : Build du TypeScript
FROM node:23-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build

# Étape 2 : Runtime propre (production)
FROM node:23-slim

WORKDIR /app

# Copier seulement les fichiers nécessaires
COPY package*.json ./
RUN npm install --omit=dev
## --force

# Copier les fichiers compilés depuis le builder
COPY --from=builder /app/dist ./dist

EXPOSE 3006
CMD ["node", "dist/index.js"]
