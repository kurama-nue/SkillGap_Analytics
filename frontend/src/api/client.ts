/**
 * Typed Axios API client for the SkillGap Analytics backend.
 */
import axios from 'axios';
import type {
  DepartmentSpreadResponse,
  EmployeeNodesResponse,
  QueryRequest,
  RAGResponse,
} from '../types';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

// ── Request interceptor: attach auth token if present ────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hr_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: normalize errors ───────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;
    const message =
      (typeof detail === 'object' ? detail?.message : detail) ??
      error.message ??
      'An unknown error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ── API methods ───────────────────────────────────────────────────────────────

export async function queryRAG(payload: QueryRequest): Promise<RAGResponse> {
  const { data } = await apiClient.post<RAGResponse>('/engine/query', payload);
  return data;
}

export async function getDepartmentSpread(): Promise<DepartmentSpreadResponse> {
  const { data } = await apiClient.get<DepartmentSpreadResponse>(
    '/analytics/department-spread'
  );
  return data;
}

export async function getEmployeeNodes(): Promise<EmployeeNodesResponse> {
  const { data } = await apiClient.get<EmployeeNodesResponse>(
    '/analytics/employee-nodes'
  );
  return data;
}

export { apiClient };
