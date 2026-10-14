import axios from 'axios';
import type { Employee, EmployeeFormData, ApiResponse, EmployeeStats } from '../types/employee';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

export interface FetchEmployeesParams {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// ==========================================
// Local Storage Demo Fallback for GitHub Pages
// ==========================================
const STORAGE_KEY = 'staffpulse_demo_employees';

const INITIAL_FALLBACK_EMPLOYEES: Employee[] = [
  { id: 1, name: 'Alexander Wright', email: 'alex.wright@techcorp.io', role: 'Senior Full Stack Engineer', created_at: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id: 2, name: 'Sophia Chen', email: 'sophia.chen@techcorp.io', role: 'Lead UI/UX Designer', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 3, name: 'Marcus Johnson', email: 'marcus.j@techcorp.io', role: 'Backend Architect', created_at: new Date(Date.now() - 86400000 * 9).toISOString() },
  { id: 4, name: 'Elena Rostova', email: 'elena.r@techcorp.io', role: 'Product Manager', created_at: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: 5, name: 'Devon Vance', email: 'devon.vance@techcorp.io', role: 'DevOps & Cloud Specialist', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 6, name: 'Priya Sharma', email: 'priya.s@techcorp.io', role: 'Frontend Developer', created_at: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 7, name: 'Lucas Bennett', email: 'lucas.b@techcorp.io', role: 'QA Automation Engineer', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 8, name: 'Maya Patel', email: 'maya.patel@techcorp.io', role: 'HR Talent Partner', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 9, name: 'David Kim', email: 'david.kim@techcorp.io', role: 'Engineering Manager', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 10, name: 'Olivia Martin', email: 'olivia.m@techcorp.io', role: 'Data Scientist', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 11, name: 'Ethan Miller', email: 'ethan.m@techcorp.io', role: 'Mobile Developer', created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 12, name: 'Aisha Al-Mansoor', email: 'aisha.m@techcorp.io', role: 'Security Analyst', created_at: new Date().toISOString() },
];

const getStoredEmployees = (): Employee[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_EMPLOYEES));
      return INITIAL_FALLBACK_EMPLOYEES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FALLBACK_EMPLOYEES;
  }
};

const saveStoredEmployees = (list: Employee[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Could not save to localStorage', err);
  }
};

// State flag tracking whether live backend is currently responding
let isBackendLive = true;

export const getBackendLiveStatus = () => isBackendLive;

/**
 * Health check
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const res = await apiClient.get('/api/health');
    isBackendLive = res.status === 200;
    return isBackendLive;
  } catch {
    isBackendLive = false;
    return false;
  }
};

/**
 * Fetch all employees with optional search, role filter, and pagination
 */
export const getEmployees = async (params?: FetchEmployeesParams): Promise<ApiResponse<Employee[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Employee[]>>('/employees', { params });
    isBackendLive = true;
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using LocalStorage fallback for GitHub Pages demo mode:', error);
    isBackendLive = false;

    // Fallback logic for GitHub Pages
    let list = getStoredEmployees();

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q)
      );
    }

    if (params?.role && params.role !== 'All') {
      list = list.filter((e) => e.role === params.role);
    }

    const total = list.length;
    const page = params?.page || 1;
    const limit = params?.limit || total;
    const offset = (page - 1) * limit;
    const paginated = list.slice(offset, offset + limit);

    return {
      success: true,
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
};

/**
 * Fetch single employee by ID
 */
export const getEmployeeById = async (id: number): Promise<ApiResponse<Employee>> => {
  try {
    const response = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
    isBackendLive = true;
    return response.data;
  } catch {
    isBackendLive = false;
    const list = getStoredEmployees();
    const found = list.find((e) => e.id === id);
    if (!found) throw new Error(`Employee #${id} not found`);
    return { success: true, data: found };
  }
};

/**
 * Add a new employee
 */
export const createEmployee = async (data: EmployeeFormData): Promise<ApiResponse<Employee>> => {
  try {
    const response = await apiClient.post<ApiResponse<Employee>>('/employees', data);
    isBackendLive = true;
    return response.data;
  } catch (err: unknown) {
    // If it's a 409 conflict from backend, re-throw so the UI displays the conflict error
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 409) {
        throw err;
      }
    }

    isBackendLive = false;
    const list = getStoredEmployees();
    if (list.some((e) => e.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error(`An employee with email '${data.email}' already exists.`);
    }

    const newEmp: Employee = {
      id: list.length > 0 ? Math.max(...list.map((e) => e.id)) + 1 : 1,
      name: data.name,
      email: data.email,
      role: data.role,
      created_at: new Date().toISOString(),
    };

    saveStoredEmployees([newEmp, ...list]);
    return { success: true, data: newEmp, message: 'Employee added successfully' };
  }
};

/**
 * Update an existing employee
 */
export const updateEmployee = async (id: number, data: EmployeeFormData): Promise<ApiResponse<Employee>> => {
  try {
    const response = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data);
    isBackendLive = true;
    return response.data;
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 409) {
        throw err;
      }
    }

    isBackendLive = false;
    const list = getStoredEmployees();
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Employee #${id} not found`);

    if (list.some((e) => e.email.toLowerCase() === data.email.toLowerCase() && e.id !== id)) {
      throw new Error(`Email '${data.email}' is already in use by another team member.`);
    }

    const updated: Employee = {
      ...list[index],
      name: data.name,
      email: data.email,
      role: data.role,
    };
    list[index] = updated;
    saveStoredEmployees(list);
    return { success: true, data: updated, message: 'Employee updated successfully' };
  }
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (id: number): Promise<ApiResponse<Employee>> => {
  try {
    const response = await apiClient.delete<ApiResponse<Employee>>(`/employees/${id}`);
    isBackendLive = true;
    return response.data;
  } catch {
    isBackendLive = false;
    const list = getStoredEmployees();
    const filtered = list.filter((e) => e.id !== id);
    const deleted = list.find((e) => e.id === id);
    saveStoredEmployees(filtered);
    return {
      success: true,
      data: deleted || { id, name: 'Deleted', email: '', role: '', created_at: '' },
      message: 'Employee deleted successfully',
    };
  }
};

/**
 * Fetch dashboard statistics
 */
export const getEmployeeStats = async (): Promise<ApiResponse<EmployeeStats>> => {
  try {
    const response = await apiClient.get<ApiResponse<EmployeeStats>>('/employees/stats/summary');
    isBackendLive = true;
    return response.data;
  } catch {
    isBackendLive = false;
    const list = getStoredEmployees();

    const counts: Record<string, number> = {};
    for (const e of list) {
      counts[e.role] = (counts[e.role] || 0) + 1;
    }

    const roleBreakdown = Object.entries(counts)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => (b.count as number) - (a.count as number));

    return {
      success: true,
      data: {
        totalEmployees: list.length,
        rolesCount: Object.keys(counts).length,
        roleBreakdown,
        latestEmployee: list[0] || null,
      },
    };
  }
};
