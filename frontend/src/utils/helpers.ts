/**
 * Generates up to 2 uppercase initials from a person's name
 */
export const getInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Deterministic gradient background for avatars
 */
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', // Indigo to Violet
  'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // Pink to Rose
  'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)', // Sky to Blue
  'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald to Teal
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber to Orange
  'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)', // Purple to Fuchsia
  'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', // Teal to Cyan
  'linear-gradient(135deg, #64748b 0%, #475569 100%)', // Slate
];

export const getAvatarGradient = (name: string): string => {
  if (!name) return AVATAR_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

/**
 * Returns role badge theme tokens: bg, text, border
 */
export const getRoleTheme = (role: string) => {
  const r = (role || '').toLowerCase();

  if (r.includes('engineer') || r.includes('developer') || r.includes('sde') || r.includes('architect') || r.includes('frontend') || r.includes('backend') || r.includes('full stack')) {
    return {
      bg: 'rgba(99, 102, 241, 0.12)',
      text: '#4f46e5',
      textDark: '#818cf8',
      border: 'rgba(99, 102, 241, 0.25)',
      dot: '#6366f1',
    };
  }
  if (r.includes('design') || r.includes('ui') || r.includes('ux') || r.includes('creative')) {
    return {
      bg: 'rgba(217, 70, 239, 0.12)',
      text: '#c026d3',
      textDark: '#e879f9',
      border: 'rgba(217, 70, 239, 0.25)',
      dot: '#d946ef',
    };
  }
  if (r.includes('product') || r.includes('manager') || r.includes('lead') || r.includes('director')) {
    return {
      bg: 'rgba(245, 158, 11, 0.12)',
      text: '#d97706',
      textDark: '#fbbf24',
      border: 'rgba(245, 158, 11, 0.25)',
      dot: '#f59e0b',
    };
  }
  if (r.includes('devops') || r.includes('cloud') || r.includes('infra') || r.includes('sre')) {
    return {
      bg: 'rgba(14, 165, 233, 0.12)',
      text: '#0284c7',
      textDark: '#38bdf8',
      border: 'rgba(14, 165, 233, 0.25)',
      dot: '#0ea5e9',
    };
  }
  if (r.includes('qa') || r.includes('test') || r.includes('automation') || r.includes('quality')) {
    return {
      bg: 'rgba(16, 185, 129, 0.12)',
      text: '#059669',
      textDark: '#34d399',
      border: 'rgba(16, 185, 129, 0.25)',
      dot: '#10b981',
    };
  }
  if (r.includes('hr') || r.includes('talent') || r.includes('people') || r.includes('recruit')) {
    return {
      bg: 'rgba(244, 63, 94, 0.12)',
      text: '#e11d48',
      textDark: '#fb7185',
      border: 'rgba(244, 63, 94, 0.25)',
      dot: '#f43f5e',
    };
  }
  if (r.includes('security') || r.includes('cyber') || r.includes('analyst')) {
    return {
      bg: 'rgba(139, 92, 246, 0.12)',
      text: '#7c3aed',
      textDark: '#a78bfa',
      border: 'rgba(139, 92, 246, 0.25)',
      dot: '#8b5cf6',
    };
  }

  return {
    bg: 'rgba(100, 116, 139, 0.12)',
    text: '#475569',
    textDark: '#94a3b8',
    border: 'rgba(100, 116, 139, 0.25)',
    dot: '#64748b',
  };
};

/**
 * Format ISO date string into readable representation
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};
