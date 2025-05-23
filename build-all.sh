#!/bin/bash

# Liste des dossiers à parcourir
SERVICES=(
  "api-gateway"
  "auth-service"
  "grade-service"
  "group-service"
  "livrable-service"
  "notation-service"
  "project-service"
  "promotion-service"
  "report-service"
  "soutenance-service"
  "user-service"
)

echo "📦 Building all services..."

for service in "${SERVICES[@]}"; do
  echo "-------------------------------------"
  echo "🔧 Building $service"
  echo "-------------------------------------"
  
  if [ -f "$service/package.json" ]; then
    cd "$service"
    npm install
    npm run build
    cd ..
  else
    echo "⚠️  Skipping $service: no package.json found"
  fi
done

echo "✅ All builds completed."
