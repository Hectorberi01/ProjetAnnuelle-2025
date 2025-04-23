# Dockerfile

FROM node:23-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Compiler le code TypeScript
RUN npm run build

# Exposer le port (modifie selon le service)
EXPOSE 3008

# Lancer le service
CMD ["npm", "run", "start"]