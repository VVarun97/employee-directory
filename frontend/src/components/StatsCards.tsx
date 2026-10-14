import React from 'react';
import { Users, Briefcase, Award, UserCheck } from 'lucide-react';
import type { EmployeeStats } from '../types/employee';

interface StatsCardsProps {
  stats: EmployeeStats | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  const topRole = stats?.roleBreakdown && stats.roleBreakdown.length > 0
    ? stats.roleBreakdown[0].role
    : 'Engineering';

  const cards = [
    {
      title: 'Total Employees',
      value: loading ? '—' : stats?.totalEmployees ?? 0,
      subtext: 'Active workforce members',
      icon: Users,
      color: '#6366f1',
      bgLight: 'rgba(99, 102, 241, 0.12)',
    },
    {
      title: 'Active Roles',
      value: loading ? '—' : stats?.rolesCount ?? 0,
      subtext: 'Specialized disciplines',
      icon: Briefcase,
      color: '#8b5cf6',
      bgLight: 'rgba(139, 92, 246, 0.12)',
    },
    {
      title: 'Dominant Discipline',
      value: loading ? '—' : topRole,
      subtext: 'Largest talent department',
      icon: Award,
      color: '#10b981',
      bgLight: 'rgba(16, 185, 129, 0.12)',
      isText: true,
    },
    {
      title: 'Latest Onboarding',
      value: loading ? '—' : (stats?.latestEmployee ? stats.latestEmployee.name : 'None yet'),
      subtext: stats?.latestEmployee ? stats.latestEmployee.role : 'Awaiting members',
      icon: UserCheck,
      color: '#f59e0b',
      bgLight: 'rgba(245, 158, 11, 0.12)',
      isText: true,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div key={idx} className="glass-card stat-card">
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: card.bgLight, color: card.color }}
            >
              <IconComponent size={24} strokeWidth={2.2} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                className="stat-value"
                style={{
                  fontSize: card.isText ? '1.15rem' : '1.75rem',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
                title={typeof card.value === 'string' ? card.value : undefined}
              >
                {card.value}
              </div>
              <div className="stat-label">{card.title}</div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-tertiary)',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
