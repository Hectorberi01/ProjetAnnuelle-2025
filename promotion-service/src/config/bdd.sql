-- Création de la table promotions
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- PostgreSQL, sinon use UUID() ou AUTO_INCREMENT selon SGBD
    nom VARCHAR(100) NOT NULL,
    annee VARCHAR(10) NOT NULL, -- Exemple : "2024-2025"
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);