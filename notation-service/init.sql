-- Création des tables
CREATE TABLE IF NOT EXISTS grading_sheet (
    id UUID PRIMARY KEY,
    project_id VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('livrable', 'rapport', 'soutenance')),
    scope VARCHAR NOT NULL CHECK (scope IN ('group', 'individual')),
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS criterion (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    weight FLOAT NOT NULL,
    allow_comment BOOLEAN NOT NULL DEFAULT false,
    grading_sheet_id UUID NOT NULL,
    CONSTRAINT fk_grading_sheet
      FOREIGN KEY(grading_sheet_id) 
      REFERENCES grading_sheet(id)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grade_set (
    id UUID PRIMARY KEY,
    target_id VARCHAR NOT NULL,
    created_by VARCHAR NOT NULL,
    is_validated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    grading_sheet_id UUID NOT NULL,
    CONSTRAINT fk_grading_sheet
      FOREIGN KEY(grading_sheet_id) 
      REFERENCES grading_sheet(id)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS criterion_grade (
    id UUID PRIMARY KEY,
    grade FLOAT NOT NULL,
    comment VARCHAR,
    criterion_id VARCHAR NOT NULL,
    grade_set_id UUID NOT NULL,
    CONSTRAINT fk_grade_set
      FOREIGN KEY(grade_set_id) 
      REFERENCES grade_set(id)
      ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX idx_grading_sheet_project ON grading_sheet(project_id);
CREATE INDEX idx_criterion_grading_sheet ON criterion(grading_sheet_id);
CREATE INDEX idx_grade_set_grading_sheet ON grade_set(grading_sheet_id);
CREATE INDEX idx_grade_set_target ON grade_set(target_id);
CREATE INDEX idx_criterion_grade_grade_set ON criterion_grade(grade_set_id);