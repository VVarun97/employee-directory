import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeCards } from './components/EmployeeCards';
import { EmployeeModal } from './components/EmployeeModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Pagination } from './components/Pagination';
import { ToastNotification } from './components/ToastNotification';
import { EmptyState } from './components/EmptyState';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  checkApiHealth,
} from './api/employeeApi';
import type {
  Employee,
  EmployeeFormData,
  EmployeeStats,
  PaginationMeta,
  ToastMessage,
} from './types/employee';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('staffpulse_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Data & loading state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Filters & Pagination state
  const [search, setSearch] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // View Mode: Table vs Grid
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark theme class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('staffpulse_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('staffpulse_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const addToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend health
  const verifyBackend = useCallback(async () => {
    const healthy = await checkApiHealth();
    setIsBackendConnected(healthy);
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await getEmployeeStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Fetch Employees List
  const fetchEmployeesData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployees({
        search: search.trim() || undefined,
        role: selectedRole !== 'All' ? selectedRole : undefined,
        sortBy,
        sortOrder,
        page,
        limit,
      });

      if (res.success) {
        setEmployees(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
        setIsBackendConnected(true);
      }
    } catch (err: unknown) {
      console.error('Error fetching employees:', err);
      setIsBackendConnected(false);
      addToast('error', 'Unable to connect to backend server. Make sure PostgreSQL & backend are running.', 'Connection Error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedRole, sortBy, sortOrder, page, limit]);

  // Initial load
  useEffect(() => {
    verifyBackend();
    fetchStats();
  }, [verifyBackend, fetchStats]);

  // Fetch when filters or pagination change
  useEffect(() => {
    fetchEmployeesData();
  }, [fetchEmployeesData]);

  // Extract unique roles for dropdown filter
  const availableRoles = useMemo(() => {
    if (stats?.roleBreakdown && stats.roleBreakdown.length > 0) {
      return stats.roleBreakdown.map((r) => r.role);
    }
    const rolesSet = new Set(employees.map((e) => e.role));
    return Array.from(rolesSet);
  }, [stats, employees]);

  // Handle Search Input Change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1); // Reset to page 1 on new search
  };

  // Handle Role Filter Change
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setPage(1); // Reset to page 1 on new filter
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedRole('All');
    setSortBy('created_at');
    setSortOrder('DESC');
    setPage(1);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (emp: Employee) => {
    setModalMode('edit');
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setIsDeleteModalOpen(true);
  };

  // Form Submission (Add or Edit)
  const handleModalSubmit = async (formData: EmployeeFormData): Promise<boolean> => {
    try {
      if (modalMode === 'add') {
        const res = await createEmployee(formData);
        if (res.success) {
          addToast('success', `${formData.name} has been successfully added to directory.`, 'Employee Created');
          fetchEmployeesData();
          fetchStats();
          return true;
        }
      } else if (modalMode === 'edit' && selectedEmployee) {
        const res = await updateEmployee(selectedEmployee.id, formData);
        if (res.success) {
          addToast('success', `Details for ${formData.name} were updated successfully.`, 'Employee Updated');
          fetchEmployeesData();
          fetchStats();
          return true;
        }
      }
      return false;
    } catch (err: unknown) {
      let msg = 'Failed to save employee record.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          msg = axiosErr.response.data.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      addToast('error', msg, 'Operation Failed');
      throw new Error(msg);
    }
  };

  // Delete Action
  const handleConfirmDelete = async (id: number): Promise<boolean> => {
    try {
      const res = await deleteEmployee(id);
      if (res.success) {
        addToast(
          'success',
          employeeToDelete
            ? `${employeeToDelete.name} was removed from the directory.`
            : 'Employee removed.',
          'Record Deleted'
        );
        // If current page is now empty and not page 1, step back
        if (employees.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchEmployeesData();
        }
        fetchStats();
        return true;
      }
      return false;
    } catch (err: unknown) {
      let msg = 'Failed to delete employee.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          msg = axiosErr.response.data.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      addToast('error', msg, 'Delete Failed');
      return false;
    }
  };

  const isFiltered = search.trim() !== '' || (selectedRole !== '' && selectedRole !== 'All');

  return (
    <>
      {/* Background ambient mesh */}
      <div className="atmospheric-bg">
        <div className="atmospheric-blob-1" />
        <div className="atmospheric-blob-2" />
      </div>

      <div className="app-container">
        {/* Navigation Bar */}
        <Navbar
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenAddModal={handleOpenAddModal}
          isBackendConnected={isBackendConnected}
          totalEmployees={stats?.totalEmployees ?? pagination.total}
        />

        {/* Analytics & Key Metrics */}
        <StatsCards stats={stats} loading={loading && !stats} />

        {/* Toolbar: Search, Role Filter, Sort, View Toggle */}
        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
          availableRoles={availableRoles}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
          totalFiltered={pagination.total}
        />

        {/* Main Content Area */}
        {loading && employees.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: 'var(--text-tertiary)',
            }}
          >
            <Loader2 size={36} className="animate-spin" color="var(--primary)" />
            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Loading employee directory...
            </p>
          </div>
        ) : employees.length === 0 ? (
          <EmptyState
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
            onOpenAddModal={handleOpenAddModal}
          />
        ) : (
          <>
            {viewMode === 'table' ? (
              <EmployeeTable
                employees={employees}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                isDarkMode={isDarkMode}
              />
            ) : (
              <EmployeeCards
                employees={employees}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 || pagination.total > 5 ? (
              <Pagination
                pagination={pagination}
                onPageChange={(p) => setPage(p)}
                onLimitChange={(l) => {
                  setLimit(l);
                  setPage(1);
                }}
              />
            ) : null}
          </>
        )}
      </div>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedEmployee}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        employee={employeeToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Floating Toast Alerts */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default App;
