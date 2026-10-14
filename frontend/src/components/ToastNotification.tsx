import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../types/employee';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 size={20} color="var(--accent-emerald)" />;
        let toastClass = 'toast-success';

        if (toast.type === 'error') {
          icon = <AlertCircle size={20} color="var(--danger)" />;
          toastClass = 'toast-error';
        } else if (toast.type === 'info') {
          icon = <Info size={20} color="var(--primary)" />;
          toastClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast ${toastClass}`}>
            <div style={{ flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              {toast.title && (
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-icon-only"
              onClick={() => onDismiss(toast.id)}
              style={{ padding: '2px', color: 'var(--text-tertiary)' }}
              aria-label="Dismiss toast"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
