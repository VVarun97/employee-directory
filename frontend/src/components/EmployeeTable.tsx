import React, { useState } from 'react';
import { Pencil, Trash2, Copy, Check, Calendar } from 'lucide-react';
import type { Employee } from '../types/employee';
import { getInitials, getAvatarGradient, getRoleTheme, formatDate } from '../utils/helpers';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  isDarkMode: boolean;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onEdit,
  onDelete,
  isDarkMode,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyEmail = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    navigator.clipboard.writeText(emp.email);
    setCopiedId(emp.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>ID</th>
            <th>Employee Details</th>
            <th>Email Address</th>
            <th>Job Role</th>
            <th>Date Added</th>
            <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const roleTheme = getRoleTheme(emp.role);
            const isCopied = copiedId === emp.id;

            return (
              <tr key={emp.id} id={`employee-row-${emp.id}`}>
                {/* ID */}
                <td style={{ fontWeight: 600, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                  #{emp.id}
                </td>

                {/* Employee Details (Avatar + Name) */}
                <td>
                  <div className="user-cell">
                    <div
                      className="avatar-circle"
                      style={{ background: getAvatarGradient(emp.name) }}
                    >
                      {getInitials(emp.name)}
                    </div>
                    <div>
                      <span className="user-name">{emp.name}</span>
                      <span className="user-id">Emp ID: {emp.id.toString().padStart(4, '0')}</span>
                    </div>
                  </div>
                </td>

                {/* Email (with one-click copy) */}
                <td>
                  <button
                    type="button"
                    className="email-badge"
                    onClick={(e) => handleCopyEmail(e, emp)}
                    title="Click to copy email address"
                  >
                    {isCopied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={13} />}
                    <span>{emp.email}</span>
                  </button>
                </td>

                {/* Job Role Badge */}
                <td>
                  <span
                    className="role-badge"
                    style={{
                      backgroundColor: roleTheme.bg,
                      color: isDarkMode ? roleTheme.textDark : roleTheme.text,
                      borderColor: roleTheme.border,
                    }}
                  >
                    <span className="role-dot" style={{ backgroundColor: roleTheme.dot }}></span>
                    <span>{emp.role}</span>
                  </span>
                </td>

                {/* Creation Date */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    <Calendar size={14} color="var(--text-tertiary)" />
                    <span>{formatDate(emp.created_at)}</span>
                  </div>
                </td>

                {/* Action Buttons */}
                <td style={{ textAlign: 'right' }}>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn-action-edit"
                      onClick={() => onEdit(emp)}
                      title={`Edit ${emp.name}`}
                      aria-label="Edit Employee"
                      id={`btn-edit-employee-${emp.id}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="btn-action-delete"
                      onClick={() => onDelete(emp)}
                      title={`Delete ${emp.name}`}
                      aria-label="Delete Employee"
                      id={`btn-delete-employee-${emp.id}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
