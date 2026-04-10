-- ============================================================
-- SkillGap Analytics Platform - RLS Policies Migration 002
-- All tables are locked to the 'hr' role via JWT claim
-- ============================================================

-- Enable RLS on all application tables
ALTER TABLE departments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees       ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills          ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper: extract role from JWT
-- Works with Supabase Auth (auth.jwt() ->> 'role')
-- and custom JWTs with app_metadata.role
-- ============================================================
CREATE OR REPLACE FUNCTION is_hr_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'hr'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'hr'
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'hr'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- DEPARTMENTS — HR read/write, no delete
-- ============================================================
CREATE POLICY "hr_select_departments"
    ON departments FOR SELECT
    USING (is_hr_user());

CREATE POLICY "hr_insert_departments"
    ON departments FOR INSERT
    WITH CHECK (is_hr_user());

CREATE POLICY "hr_update_departments"
    ON departments FOR UPDATE
    USING (is_hr_user());

-- ============================================================
-- EMPLOYEES — HR full access
-- ============================================================
CREATE POLICY "hr_select_employees"
    ON employees FOR SELECT
    USING (is_hr_user());

CREATE POLICY "hr_insert_employees"
    ON employees FOR INSERT
    WITH CHECK (is_hr_user());

CREATE POLICY "hr_update_employees"
    ON employees FOR UPDATE
    USING (is_hr_user());

CREATE POLICY "hr_delete_employees"
    ON employees FOR DELETE
    USING (is_hr_user());

-- ============================================================
-- SKILLS — HR full access
-- ============================================================
CREATE POLICY "hr_select_skills"
    ON skills FOR SELECT
    USING (is_hr_user());

CREATE POLICY "hr_insert_skills"
    ON skills FOR INSERT
    WITH CHECK (is_hr_user());

CREATE POLICY "hr_update_skills"
    ON skills FOR UPDATE
    USING (is_hr_user());

-- ============================================================
-- EMPLOYEE_SKILLS — HR full access
-- ============================================================
CREATE POLICY "hr_select_employee_skills"
    ON employee_skills FOR SELECT
    USING (is_hr_user());

CREATE POLICY "hr_insert_employee_skills"
    ON employee_skills FOR INSERT
    WITH CHECK (is_hr_user());

CREATE POLICY "hr_update_employee_skills"
    ON employee_skills FOR UPDATE
    USING (is_hr_user());

CREATE POLICY "hr_delete_employee_skills"
    ON employee_skills FOR DELETE
    USING (is_hr_user());

-- ============================================================
-- KNOWLEDGE_BASE — HR read-only; service role writes
-- ============================================================
CREATE POLICY "hr_select_knowledge_base"
    ON knowledge_base FOR SELECT
    USING (is_hr_user());

-- Service role (backend) can insert/update/delete — bypasses RLS
-- This is enforced by using SUPABASE_SERVICE_KEY in the backend,
-- which grants role = 'service_role' that bypasses all RLS.

-- ============================================================
-- GRANT service_role bypass (Supabase-specific)
-- In vanilla Postgres, grant superuser or use BYPASSRLS
-- ============================================================
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
-- ALTER TABLE knowledge_base FORCE ROW LEVEL SECURITY;
