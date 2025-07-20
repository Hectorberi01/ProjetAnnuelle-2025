FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copie le dossier dist compilé (doit exister localement)
COPY dist ./dist

EXPOSE 3005

CMD ["node", "dist/index.js"]



