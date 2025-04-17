-- ENUM pour le type d’évaluation
CREATE TYPE evaluation_type AS ENUM ('DELIVERABLE', 'REPORT', 'PRESENTATION');

-- Table Notation (équivalent de EvaluationGrid)
CREATE TABLE notation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    projectId INTEGER NOT NULL,
    type evaluation_type NOT NULL,
    isIndividual BOOLEAN NOT NULL,
    weight FLOAT NOT NULL CHECK (weight >= 0 AND weight <= 1),
    isPublished BOOLEAN DEFAULT FALSE,
    globalComment TEXT
);

-- Table Criterion (critères de la grille)
CREATE TABLE criterion (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    maxPoints FLOAT NOT NULL CHECK (maxPoints > 0),
    weight FLOAT NOT NULL CHECK (weight >= 0 AND weight <= 1),
    gridId INTEGER NOT NULL,
    CONSTRAINT fk_grid FOREIGN KEY (gridId) REFERENCES notation(id) ON DELETE CASCADE
);
