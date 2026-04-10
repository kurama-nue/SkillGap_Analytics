/**
 * All shared TypeScript interfaces and types for the SkillGap Analytics frontend.
 */

// ── API — RAG Engine ──────────────────────────────────────────────────────────

export interface QueryRequest {
  query: string;
  top_k?: number;
}

export interface SourceDocument {
  source: string;
  doc_type: string;
  content_preview: string;
  similarity_score: number;
}

export interface RAGResponse {
  answer: string;
  sources: SourceDocument[];
  query: string;
  model_used: string;
  retrieval_count: number;
}

export type MessageRole = 'user' | 'assistant' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  sources?: SourceDocument[];
  timestamp: Date;
  isLoading?: boolean;
}

// ── API — Analytics ───────────────────────────────────────────────────────────

export interface SkillMetric {
  skill_name: string;
  category: string;
  employee_count: number;
  avg_proficiency: number;
  min_proficiency: number;
  max_proficiency: number;
}

export interface DepartmentSpread {
  department_name: string;
  employee_count: number;
  skill_coverage: number;
  avg_proficiency: number;
  top_skills: SkillMetric[];
  skill_gaps: string[];
}

export interface DepartmentSpreadResponse {
  departments: DepartmentSpread[];
  total_employees: number;
  total_skills: number;
  generated_at: string;
}

// ── API — Employee Nodes (3D visualization) ───────────────────────────────────

export interface EmployeeNode {
  id: string;
  full_name: string;
  email: string;
  department: string | null;
  role: string;
  seniority: string | null;
  pos_x: number | null;
  pos_y: number | null;
  pos_z: number | null;
  skill_count: number;
  avg_proficiency: number;
  has_skill_gap: boolean;
}

export interface EmployeeNodesResponse {
  nodes: EmployeeNode[];
  total: number;
}

// ── Filter State ──────────────────────────────────────────────────────────────

export interface FilterState {
  selectedDepartments: string[];
  showSkillGapsOnly: boolean;
  highlightedEmployeeId: string | null;
  setSelectedDepartments: (depts: string[]) => void;
  toggleDepartment: (dept: string) => void;
  setShowSkillGapsOnly: (v: boolean) => void;
  setHighlightedEmployeeId: (id: string | null) => void;
  reset: () => void;
}

// ── API Errors ────────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  message: string;
  query?: string;
}
