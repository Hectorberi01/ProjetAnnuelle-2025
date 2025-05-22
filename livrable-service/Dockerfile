FROM node:23-slim AS builder

WORKDIR /app

# Copier les fichiers nécessaires à l'installation et la compilation
COPY package*.json tsconfig.json ./
RUN npm install --force

# Copier le reste du code source
COPY . .

# Compiler
RUN npm run build

# Étape 2 : Runtime propre (production)
FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev 
##--force

COPY --from=builder /app/dist ./dist

EXPOSE 3009
CMD ["node", "dist/index.js"]
