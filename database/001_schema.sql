-- ============================================================
-- SkillGap Analytics Platform - Schema Migration 001
-- Requires: PostgreSQL 14+ with pgvector extension
-- ============================================================

-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- DEPARTMENTS (lookup table)
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EMPLOYEES
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    department_id   UUID REFERENCES departments(id) ON DELETE SET NULL,
    role            TEXT NOT NULL,
    seniority       TEXT CHECK (seniority IN ('Junior', 'Mid', 'Senior', 'Lead', 'Principal')) DEFAULT 'Mid',
    hire_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Pre-computed UMAP 3D coordinates for visualization
    pos_x           FLOAT,
    pos_y           FLOAT,
    pos_z           FLOAT,
    -- Skill embedding for semantic similarity (OpenAI text-embedding-3-small = 1536d)
    embedding       vector(1536),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL UNIQUE,
    category    TEXT CHECK (category IN ('Technical', 'Soft', 'Leadership', 'Domain', 'Tool')) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EMPLOYEE_SKILLS (relational junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS employee_skills (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id         UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    skill_id            UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level   SMALLINT NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
    assessed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assessed_by         TEXT,               -- HR manager name or system
    notes               TEXT,
    UNIQUE (employee_id, skill_id)
);

-- ============================================================
-- KNOWLEDGE_BASE (RAG document store with pgvector)
-- ============================================================
CREATE TABLE IF NOT EXISTS knowledge_base (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content     TEXT NOT NULL,              -- Raw chunk text
    source      TEXT NOT NULL,              -- e.g., 'hr_policy_v2.pdf', 'job_description'
    doc_type    TEXT DEFAULT 'document',    -- 'policy', 'jd', 'review', 'report'
    embedding   vector(1536) NOT NULL,      -- OpenAI text-embedding-3-small
    metadata    JSONB DEFAULT '{}',         -- arbitrary extra fields
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- ANN index for employee embeddings (IVFFLAT for cosine similarity)
CREATE INDEX IF NOT EXISTS employees_embedding_idx
    ON employees USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- ANN index for knowledge base embeddings
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx
    ON knowledge_base USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Standard indexes
CREATE INDEX IF NOT EXISTS employees_department_id_idx ON employees (department_id);
CREATE INDEX IF NOT EXISTS employee_skills_employee_id_idx ON employee_skills (employee_id);
CREATE INDEX IF NOT EXISTS employee_skills_skill_id_idx ON employee_skills (skill_id);
CREATE INDEX IF NOT EXISTS knowledge_base_doc_type_idx ON knowledge_base (doc_type);

-- ============================================================
-- AUTO-UPDATE updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employees_updated_at_trigger
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
