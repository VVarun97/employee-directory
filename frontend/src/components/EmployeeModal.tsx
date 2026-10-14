import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import type { Employee, EmployeeFormData } from '../types/employee';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<boolean>;
  initialData?: Employee | null;
  mode: 'add' | 'edit';
}

const COMMON_ROLE_SUGGESTIONS = [
  'Full Stack Engineer',
  'Frontend Developer',
  'Backend Architect',
  'UI/UX Designer',
  'Product Manager',
  'DevOps & Cloud Specialist',
  'QA Automation Engineer',
  'HR Talent Partner',
  'Engineering Manager',
  'Security Analyst',
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string; general?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initialData.role);
    } else {
      setName('');
      setEmail('');
      setRole('');
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: { name?: string; email?: string; role?: string } = {};

    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g., alex@company.com)';
    }

    if (!role.trim()) {
      errs.role = 'Job role is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const success = await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role.trim(),
      });
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred while saving.';
      setErrors((prev) => ({ ...prev, general: errorMsg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: mode === 'add' ? 'var(--primary-light)' : 'rgba(245, 158, 11, 0.15)',
                color: mode === 'add' ? 'var(--primary)' : '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mode === 'add' ? <User size={20} /> : <Briefcase size={20} />}
            </div>
            <div>
              <h2 className="modal-title">
                {mode === 'add' ? 'Add New Employee' : 'Edit Employee Details'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                {mode === 'add'
                  ? 'Fill in the information below to add a staff member'
                  : `Updating employee ID #${initialData?.id}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon-only"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {errors.general && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--danger-light)',
                  color: 'var(--danger)',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={16} flex-shrink={0} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Name Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-name-input">
                Full Name <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="emp-name-input"
                  type="text"
                  className={`form-input ${errors.name ? 'has-error' : ''}`}
                  placeholder="e.g., Alexandra Miller"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  autoFocus
                />
              </div>
              {errors.name && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-email-input">
                Work Email Address <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="emp-email-input"
                  type="email"
                  className={`form-input ${errors.email ? 'has-error' : ''}`}
                  placeholder="e.g., alex.miller@techcorp.io"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                />
              </div>
              {errors.email && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Role Field */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="emp-role-input">
                Job Role / Designation <span className="required">*</span>
              </label>
              <input
                id="emp-role-input"
                type="text"
                className={`form-input ${errors.role ? 'has-error' : ''}`}
                placeholder="e.g., Senior Full Stack Engineer"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (errors.role) setErrors((prev) => ({ ...prev, role: undefined }));
                }}
              />
              {errors.role && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.role}</span>
                </div>
              )}

              {/* Quick Preset Suggestions */}
              <div style={{ marginTop: '0.625rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  Quick Suggestions:
                </span>
                <div className="role-presets">
                  {COMMON_ROLE_SUGGESTIONS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`role-pill ${role === preset ? 'active' : ''}`}
                      onClick={() => {
                        setRole(preset);
                        if (errors.role) setErrors((prev) => ({ ...prev, role: undefined }));
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="btn-save-employee"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : mode === 'add' ? (
                <span>Add Employee</span>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
