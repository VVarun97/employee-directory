import axios from 'axios';
import type { Employee, EmployeeFormData, ApiResponse, EmployeeStats } from '../types/employee';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export interface FetchEmployeesParams {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Fetch all employees with optional search, role filter, and pagination
 */
export const getEmployees = async (params?: FetchEmployeesParams): Promise<ApiResponse<Employee[]>> => {
  const response = await apiClient.get<ApiResponse<Employee[]>>('/employees', { params });
  return response.data;
};

/**
 * Fetch single employee by ID
 */
export const getEmployeeById = async (id: number): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
  return response.data;
};

/**
 * Add a new employee
 */
export const createEmployee = async (data: EmployeeFormData): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.post<ApiResponse<Employee>>('/employees', data);
  return response.data;
};

/**
 * Update an existing employee
 */
export const updateEmployee = async (id: number, data: EmployeeFormData): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data);
  return response.data;
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (id: number): Promise<ApiResponse<Employee>> => {
  const response = await apiClient.delete<ApiResponse<Employee>>(`/employees/${id}`);
  return response.data;
};

/**
 * Fetch dashboard statistics
 */
export const getEmployeeStats = async (): Promise<ApiResponse<EmployeeStats>> => {
  const response = await apiClient.get<ApiResponse<EmployeeStats>>('/employees/stats/summary');
  return response.data;
};

/**
 * Health check
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const res = await apiClient.get('/api/health');
    return res.status === 200;
  } catch {
    return false;
  }
};
