import React, { useState } from 'react';
import { Pencil, Trash2, Copy, Check, Calendar, Mail } from 'lucide-react';
import type { Employee } from '../types/employee';
import { getInitials, getAvatarGradient, getRoleTheme, formatDate } from '../utils/helpers';

interface EmployeeCardsProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  isDarkMode: boolean;
}

export const EmployeeCards: React.FC<EmployeeCardsProps> = ({
  employees,
  onEdit,
  onDelete,
  isDarkMode,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyEmail = (emp: Employee) => {
    navigator.clipboard.writeText(emp.email);
    setCopiedId(emp.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="cards-grid">
      {employees.map((emp) => {
        const roleTheme = getRoleTheme(emp.role);
        const isCopied = copiedId === emp.id;

        return (
          <div key={emp.id} className="emp-card" id={`employee-card-${emp.id}`}>
            {/* Header: Avatar, Info, Actions */}
            <div className="emp-card-header">
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <div
                  className="avatar-circle"
                  style={{
                    background: getAvatarGradient(emp.name),
                    width: '48px',
                    height: '48px',
                    fontSize: '1rem',
                  }}
                >
                  {getInitials(emp.name)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {emp.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                    ID: #{emp.id}
                  </span>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn-action-edit"
                  onClick={() => onEdit(emp)}
                  title={`Edit ${emp.name}`}
                  aria-label="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="btn-action-delete"
                  onClick={() => onDelete(emp)}
                  title={`Delete ${emp.name}`}
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Role Badge */}
            <div style={{ margin: '0.75rem 0' }}>
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
            </div>

            {/* Email with copy */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                marginBottom: '0.75rem',
              }}
              onClick={() => handleCopyEmail(emp)}
              title="Click to copy email address"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                <Mail size={14} color="var(--text-tertiary)" />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {emp.email}
                </span>
              </div>
              {isCopied ? (
                <Check size={14} color="var(--accent-emerald)" />
              ) : (
                <Copy size={13} color="var(--text-tertiary)" />
              )}
            </div>

            {/* Footer with Date */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} />
                <span>Joined {formatDate(emp.created_at)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
