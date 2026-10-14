import React from 'react';
import { UserX, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
  onOpenAddModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onResetFilters,
  onOpenAddModal,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-subtle)',
          color: 'var(--text-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-color)',
        }}
      >
        <UserX size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        {isFiltered ? 'No matching employee records' : 'No employees added yet'}
      </h3>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          maxWidth: '400px',
          marginBottom: '1.5rem',
        }}
      >
        {isFiltered
          ? 'No employees matched your active search query or role filter. Clear your filters or try a different keyword.'
          : 'Your company directory is currently empty. Get started by adding your first employee to the system.'}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {isFiltered ? (
          <button className="btn btn-secondary" onClick={onResetFilters}>
            <RotateCcw size={16} />
            <span>Clear Filters</span>
          </button>
        ) : null}

        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add Employee</span>
        </button>
      </div>
    </div>
  );
};
