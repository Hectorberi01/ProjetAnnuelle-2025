# Dockerfile

FROM node:23-slim

# Définir le répertoire de travail
WORKDIR /app

# Pour compiler bcrypt
RUN apt-get update && apt-get install -y build-essential python3 && rm -rf /var/lib/apt/lists/*


# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Ajouter cette ligne SI tu veux aussi le CLI en global (optionnel)
RUN npm install -g @nestjs/cli

# Copier tout le code source
COPY . .

# Compiler le code TypeScript
RUN npm run build

# Exposer le port (modifie selon le service)
EXPOSE 3000

# Lancer le service
CMD ["npm", "run", "start"]