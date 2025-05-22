
# Dockerfile

# Image légère pour exécuter du code Node.js
FROM node:23-slim

WORKDIR /app

# Pour compiler bcrypt
RUN apt-get update && apt-get install -y build-essential python3 && rm -rf /var/lib/apt/lists/*

# Copier uniquement les fichiers nécessaires à l'exécution
COPY package*.json ./
RUN npm install --omit=dev 
#--force

# Copier uniquement les fichiers compilés
COPY dist ./dist

# Exposer le port (à adapter si nécessaire)
EXPOSE 3000

# Lancer le code compilé
CMD ["node", "dist/server.js"]
