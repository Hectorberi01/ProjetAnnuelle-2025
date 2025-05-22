# Étape 1 : Builder le projet
FROM node:23-slim AS builder

WORKDIR /app

# Copier fichiers nécessaires au build
COPY package*.json tsconfig.json ./
RUN npm install --force

# Copier le reste du code (src, etc.)
COPY . .

# Compiler TypeScript → dist/
RUN npm run build

# Étape 2 : Créer l'image finale
FROM node:23-slim

WORKDIR /app

# Copier uniquement les fichiers nécessaires à l'exécution
COPY package*.json ./
RUN npm install --omit=dev 
#--force

# Copier uniquement les fichiers compilés
COPY dist ./dist

# Exposer le port (à adapter si nécessaire)
EXPOSE 3009

# Lancer le code compilé
CMD ["node", "dist/index.js"]

