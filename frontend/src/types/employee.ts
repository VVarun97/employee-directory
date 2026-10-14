export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  role: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  message?: string;
  errors?: string[];
}

export interface RoleCount {
  role: string;
  count: string | number;
}

export interface EmployeeStats {
  totalEmployees: number;
  rolesCount: number;
  roleBreakdown: RoleCount[];
  latestEmployee: Employee | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}
