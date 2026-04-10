-- ============================================================
-- SkillGap Analytics Platform - Seed Data Migration 003
-- Provides realistic HR data for development & demo
-- NOTE: Embeddings (vector columns) are populated by the
--       backend service via POST /api/v1/admin/compute-embeddings
-- ============================================================

-- ============================================================
-- DEPARTMENTS
-- ============================================================
INSERT INTO departments (id, name, description) VALUES
    ('11111111-0000-0000-0000-000000000001', 'Engineering',      'Software engineering and platform teams'),
    ('11111111-0000-0000-0000-000000000002', 'Data Science',     'ML, analytics, and BI teams'),
    ('11111111-0000-0000-0000-000000000003', 'Product',          'Product management and design'),
    ('11111111-0000-0000-0000-000000000004', 'Human Resources',  'People ops, talent, and culture')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- SKILLS (30 skills across 5 categories)
-- ============================================================
INSERT INTO skills (id, name, category, description) VALUES
    -- Technical
    ('22222222-0000-0000-0000-000000000001', 'Python',               'Technical',   'General-purpose programming language'),
    ('22222222-0000-0000-0000-000000000002', 'TypeScript',           'Technical',   'Typed JavaScript superset'),
    ('22222222-0000-0000-0000-000000000003', 'React',                'Technical',   'UI component library'),
    ('22222222-0000-0000-0000-000000000004', 'FastAPI',              'Technical',   'Async Python web framework'),
    ('22222222-0000-0000-0000-000000000005', 'PostgreSQL',           'Technical',   'Relational database system'),
    ('22222222-0000-0000-0000-000000000006', 'Docker',               'Technical',   'Container platform'),
    ('22222222-0000-0000-0000-000000000007', 'Kubernetes',           'Technical',   'Container orchestration'),
    ('22222222-0000-0000-0000-000000000008', 'GraphQL',              'Technical',   'API query language'),
    ('22222222-0000-0000-0000-000000000009', 'REST API Design',      'Technical',   'RESTful web service principles'),
    ('22222222-0000-0000-0000-000000000010', 'System Design',        'Technical',   'Large-scale distributed systems'),
    -- Data Science / ML
    ('22222222-0000-0000-0000-000000000011', 'Machine Learning',     'Technical',   'Supervised/unsupervised ML'),
    ('22222222-0000-0000-0000-000000000012', 'Deep Learning',        'Technical',   'Neural network architectures'),
    ('22222222-0000-0000-0000-000000000013', 'LLM Engineering',      'Technical',   'Fine-tuning and prompting LLMs'),
    ('22222222-0000-0000-0000-000000000014', 'Data Visualization',   'Technical',   'Charts, dashboards, and BI'),
    ('22222222-0000-0000-0000-000000000015', 'SQL Analytics',        'Technical',   'Advanced SQL for analytics'),
    -- Tools
    ('22222222-0000-0000-0000-000000000016', 'Git',                  'Tool',        'Version control system'),
    ('22222222-0000-0000-0000-000000000017', 'Figma',                'Tool',        'UI/UX design tool'),
    ('22222222-0000-0000-0000-000000000018', 'Jira',                 'Tool',        'Agile project management'),
    ('22222222-0000-0000-0000-000000000019', 'Notion',               'Tool',        'Knowledge management'),
    ('22222222-0000-0000-0000-000000000020', 'Slack',                'Tool',        'Team communication'),
    -- Soft skills
    ('22222222-0000-0000-0000-000000000021', 'Communication',        'Soft',        'Written and verbal communication'),
    ('22222222-0000-0000-0000-000000000022', 'Problem Solving',      'Soft',        'Analytical and creative thinking'),
    ('22222222-0000-0000-0000-000000000023', 'Adaptability',         'Soft',        'Flexibility in changing environments'),
    ('22222222-0000-0000-0000-000000000024', 'Collaboration',        'Soft',        'Cross-functional teamwork'),
    ('22222222-0000-0000-0000-000000000025', 'Time Management',      'Soft',        'Prioritization and delivery'),
    -- Leadership
    ('22222222-0000-0000-0000-000000000026', 'Team Leadership',      'Leadership',  'Leading engineering teams'),
    ('22222222-0000-0000-0000-000000000027', 'Technical Mentoring',  'Leadership',  'Coaching junior engineers'),
    ('22222222-0000-0000-0000-000000000028', 'Strategic Thinking',   'Leadership',  'Long-term planning and vision'),
    ('22222222-0000-0000-0000-000000000029', 'Stakeholder Mgmt',     'Leadership',  'Managing expectations upward'),
    ('22222222-0000-0000-0000-000000000030', 'OKR Setting',          'Leadership',  'Objectives and key results')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- EMPLOYEES (20 employees)
-- Embeddings and 3D positions are null; populated by backend job
-- ============================================================
INSERT INTO employees (id, full_name, email, department_id, role, seniority, hire_date) VALUES
    -- Engineering (8)
    ('33333333-0000-0000-0000-000000000001', 'Arjun Mehta',      'arjun.mehta@corp.com',     '11111111-0000-0000-0000-000000000001', 'Backend Engineer',         'Senior',    '2021-03-15'),
    ('33333333-0000-0000-0000-000000000002', 'Priya Sharma',     'priya.sharma@corp.com',    '11111111-0000-0000-0000-000000000001', 'Frontend Engineer',        'Mid',       '2022-07-01'),
    ('33333333-0000-0000-0000-000000000003', 'Rahul Gupta',      'rahul.gupta@corp.com',     '11111111-0000-0000-0000-000000000001', 'DevOps Engineer',          'Senior',    '2020-11-20'),
    ('33333333-0000-0000-0000-000000000004', 'Ananya Singh',     'ananya.singh@corp.com',    '11111111-0000-0000-0000-000000000001', 'Full Stack Engineer',      'Lead',      '2019-06-10'),
    ('33333333-0000-0000-0000-000000000005', 'Vikram Patel',     'vikram.patel@corp.com',    '11111111-0000-0000-0000-000000000001', 'Backend Engineer',         'Junior',    '2023-08-22'),
    ('33333333-0000-0000-0000-000000000006', 'Kavya Nair',       'kavya.nair@corp.com',      '11111111-0000-0000-0000-000000000001', 'Frontend Engineer',        'Mid',       '2022-01-05'),
    ('33333333-0000-0000-0000-000000000007', 'Harsh Agarwal',    'harsh.agarwal@corp.com',   '11111111-0000-0000-0000-000000000001', 'Platform Engineer',        'Principal', '2018-04-12'),
    ('33333333-0000-0000-0000-000000000008', 'Sneha Reddy',      'sneha.reddy@corp.com',     '11111111-0000-0000-0000-000000000001', 'Security Engineer',        'Senior',    '2021-09-30'),
    -- Data Science (5)
    ('33333333-0000-0000-0000-000000000009', 'Rohan Desai',      'rohan.desai@corp.com',     '11111111-0000-0000-0000-000000000002', 'Data Scientist',           'Senior',    '2020-05-18'),
    ('33333333-0000-0000-0000-000000000010', 'Meera Iyer',       'meera.iyer@corp.com',      '11111111-0000-0000-0000-000000000002', 'ML Engineer',              'Mid',       '2022-03-14'),
    ('33333333-0000-0000-0000-000000000011', 'Siddharth Kumar',  'sid.kumar@corp.com',       '11111111-0000-0000-0000-000000000002', 'LLM/AI Engineer',          'Senior',    '2021-11-01'),
    ('33333333-0000-0000-0000-000000000012', 'Pooja Venkat',     'pooja.venkat@corp.com',    '11111111-0000-0000-0000-000000000002', 'Data Analyst',             'Junior',    '2023-06-19'),
    ('33333333-0000-0000-0000-000000000013', 'Aditya Joshi',     'aditya.joshi@corp.com',    '11111111-0000-0000-0000-000000000002', 'BI Engineer',              'Mid',       '2022-09-07'),
    -- Product (4)
    ('33333333-0000-0000-0000-000000000014', 'Riya Kapoor',      'riya.kapoor@corp.com',     '11111111-0000-0000-0000-000000000003', 'Product Manager',          'Lead',      '2019-12-03'),
    ('33333333-0000-0000-0000-000000000015', 'Nikhil Bose',      'nikhil.bose@corp.com',     '11111111-0000-0000-0000-000000000003', 'UX Designer',              'Senior',    '2020-08-25'),
    ('33333333-0000-0000-0000-000000000016', 'Tanvi Shah',       'tanvi.shah@corp.com',      '11111111-0000-0000-0000-000000000003', 'Product Manager',          'Mid',       '2022-04-11'),
    ('33333333-0000-0000-0000-000000000017', 'Karan Malhotra',   'karan.malhotra@corp.com',  '11111111-0000-0000-0000-000000000003', 'Product Designer',         'Junior',    '2023-01-16'),
    -- HR (3)
    ('33333333-0000-0000-0000-000000000018', 'Divya Krishnan',   'divya.krishnan@corp.com',  '11111111-0000-0000-0000-000000000004', 'HR Business Partner',      'Senior',    '2019-02-28'),
    ('33333333-0000-0000-0000-000000000019', 'Amit Soni',        'amit.soni@corp.com',       '11111111-0000-0000-0000-000000000004', 'Talent Acquisition Lead',  'Mid',       '2021-07-19'),
    ('33333333-0000-0000-0000-000000000020', 'Lakshmi Rao',      'lakshmi.rao@corp.com',     '11111111-0000-0000-0000-000000000004', 'L&D Specialist',           'Senior',    '2020-10-05')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- EMPLOYEE_SKILLS (representative proficiency data)
-- ============================================================
INSERT INTO employee_skills (employee_id, skill_id, proficiency_level, assessed_by) VALUES
    -- Arjun (Senior Backend)
    ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 5, 'system'),
    ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000004', 5, 'system'),
    ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000005', 4, 'system'),
    ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000009', 4, 'system'),
    ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000022', 4, 'system'),
    -- Priya (Mid Frontend)
    ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 4, 'system'),
    ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', 5, 'system'),
    ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000017', 3, 'system'),
    ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000021', 4, 'system'),
    -- Rahul (Senior DevOps)
    ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006', 5, 'system'),
    ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000007', 5, 'system'),
    ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001', 3, 'system'),
    ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000010', 4, 'system'),
    -- Ananya (Lead Full Stack)
    ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001', 4, 'system'),
    ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000002', 5, 'system'),
    ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000003', 5, 'system'),
    ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000010', 3, 'system'),
    ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000026', 3, 'system'),
    -- Vikram (Junior Backend) - skill gaps here
    ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000001', 2, 'system'),
    ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000005', 2, 'system'),
    -- Kavya (Mid Frontend)
    ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000002', 4, 'system'),
    ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000003', 4, 'system'),
    ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000008', 3, 'system'),
    -- Harsh (Principal Platform)
    ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000006', 5, 'system'),
    ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000007', 5, 'system'),
    ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000010', 5, 'system'),
    ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000026', 5, 'system'),
    ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000028', 4, 'system'),
    -- Sneha (Senior Security)
    ('33333333-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000001', 3, 'system'),
    ('33333333-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000010', 4, 'system'),
    -- Rohan (Senior Data Scientist)
    ('33333333-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000001', 5, 'system'),
    ('33333333-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000011', 5, 'system'),
    ('33333333-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000015', 5, 'system'),
    ('33333333-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000014', 4, 'system'),
    -- Meera (Mid ML Engineer)
    ('33333333-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000011', 4, 'system'),
    ('33333333-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000012', 4, 'system'),
    ('33333333-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000001', 4, 'system'),
    -- Siddharth (Senior LLM)
    ('33333333-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000013', 5, 'system'),
    ('33333333-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000012', 5, 'system'),
    ('33333333-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000001', 5, 'system'),
    -- Pooja (Junior Analyst) - skill gap
    ('33333333-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000015', 2, 'system'),
    ('33333333-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000014', 2, 'system'),
    -- Aditya (Mid BI)
    ('33333333-0000-0000-0000-000000000013', '22222222-0000-0000-0000-000000000015', 4, 'system'),
    ('33333333-0000-0000-0000-000000000013', '22222222-0000-0000-0000-000000000014', 4, 'system'),
    -- Riya (Lead PM)
    ('33333333-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000028', 5, 'system'),
    ('33333333-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000029', 5, 'system'),
    ('33333333-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000030', 4, 'system'),
    ('33333333-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000021', 5, 'system'),
    -- Nikhil (Senior UX)
    ('33333333-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000017', 5, 'system'),
    ('33333333-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000021', 5, 'system'),
    ('33333333-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000024', 4, 'system'),
    -- Divya (Senior HRBP)
    ('33333333-0000-0000-0000-000000000018', '22222222-0000-0000-0000-000000000021', 5, 'system'),
    ('33333333-0000-0000-0000-000000000018', '22222222-0000-0000-0000-000000000024', 5, 'system'),
    ('33333333-0000-0000-0000-000000000018', '22222222-0000-0000-0000-000000000026', 4, 'system'),
    -- Amit (Talent Acquisition)
    ('33333333-0000-0000-0000-000000000019', '22222222-0000-0000-0000-000000000021', 5, 'system'),
    ('33333333-0000-0000-0000-000000000019', '22222222-0000-0000-0000-000000000025', 4, 'system'),
    -- Lakshmi (L&D)
    ('33333333-0000-0000-0000-000000000020', '22222222-0000-0000-0000-000000000027', 5, 'system'),
    ('33333333-0000-0000-0000-000000000020', '22222222-0000-0000-0000-000000000021', 4, 'system'),
    ('33333333-0000-0000-0000-000000000020', '22222222-0000-0000-0000-000000000030', 4, 'system')
ON CONFLICT (employee_id, skill_id) DO NOTHING;

-- ============================================================
-- KNOWLEDGE_BASE sample entries (embeddings populated by backend job)
-- ============================================================
INSERT INTO knowledge_base (content, source, doc_type, metadata) VALUES
    ('Python proficiency at level 3 means the employee can write production-ready scripts, build REST APIs, and work with standard libraries independently.', 'skill_rubric_v2.pdf', 'policy', '{"skill": "Python", "level": 3}'),
    ('The Engineering department currently has a critical skill gap in Kubernetes and container orchestration. Only 2 out of 8 engineers are rated above level 3.', 'q1_skill_gap_report.pdf', 'report', '{"department": "Engineering", "quarter": "Q1-2024"}'),
    ('Data Science team lacks formal LLM Engineering skills. Only 1 team member (Siddharth Kumar) holds a level 5 rating. Recommend upskilling 2 additional members by Q3.', 'q1_skill_gap_report.pdf', 'report', '{"department": "Data Science", "quarter": "Q1-2024"}'),
    ('HR policy mandates that all Senior and above employees undergo annual skill assessments. Junior employees are assessed bi-annually.', 'hr_policy_v3.pdf', 'policy', '{"applies_to": "all"}'),
    ('Team Leadership proficiency is sparse across Engineering. Only Harsh Agarwal (Principal) and Ananya Singh (Lead) hold ratings. This creates succession risk.', 'succession_plan_2024.pdf', 'report', '{"risk": "succession", "department": "Engineering"}'),
    ('The recommended learning path for a Junior Backend Engineer to reach Senior level includes: Python (4+), PostgreSQL (4+), REST API Design (4+), Docker (3+), System Design (3+).', 'career_ladder_v2.pdf', 'policy', '{"role": "Backend Engineer"}'),
    ('Product department shows strength in Strategic Thinking and Stakeholder Management but lacks technical skills like SQL Analytics and data storytelling.', 'q1_skill_gap_report.pdf', 'report', '{"department": "Product", "quarter": "Q1-2024"}')
ON CONFLICT DO NOTHING;
