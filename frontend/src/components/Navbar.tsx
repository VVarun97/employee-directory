import React from 'react';
import { Users, Plus, Sun, Moon, Sparkles } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAddModal: () => void;
  isBackendConnected: boolean;
  totalEmployees: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenAddModal,
  isBackendConnected,
  totalEmployees,
}) => {
  return (
    <header className="navbar">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Users size={22} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 className="brand-title">StaffPulse</h1>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Enterprise v1.0
            </span>
          </div>
          <p className="brand-subtitle">
            Centralized Employee Directory & Team Governance
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="navbar-actions">
        {/* Connection Status Pill */}
        <div className="status-pill status-online" title="Backend REST API Status">
          <span className="status-dot-pulse" style={{ backgroundColor: isBackendConnected ? '#10b981' : '#f43f5e' }}></span>
          <span>{isBackendConnected ? 'PostgreSQL Active' : 'Connecting API...'}</span>
        </div>

        {/* Directory Count Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          <Sparkles size={14} color="var(--primary)" />
          <span>{totalEmployees} Staff Records</span>
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          className="btn btn-secondary btn-icon-only"
          onClick={onToggleTheme}
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--primary)" />}
        </button>

        {/* Add Employee CTA */}
        <button className="btn btn-primary" onClick={onOpenAddModal} id="btn-add-employee-header">
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Employee</span>
        </button>
      </div>
    </header>
  );
};
