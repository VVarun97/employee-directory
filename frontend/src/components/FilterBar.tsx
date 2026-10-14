import React from 'react';
import { Search, X, LayoutList, LayoutGrid, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  availableRoles: string[];
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: 'ASC' | 'DESC';
  onSortOrderChange: (order: 'ASC' | 'DESC') => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  selectedRole,
  onRoleChange,
  availableRoles,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalFiltered,
}) => {
  const isFiltered = search.trim() !== '' || (selectedRole !== '' && selectedRole !== 'All');

  return (
    <div className="glass-card toolbar-card">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-employee-input"
        />
        {search && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter and Control Group */}
      <div className="filter-group">
        {/* Role Filter */}
        <select
          className="custom-select"
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
          title="Filter by Role"
          id="role-filter-select"
        >
          <option value="All">All Roles ({availableRoles.length})</option>
          {availableRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Sort Field & Direction */}
        <select
          className="custom-select"
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            onSortByChange(field);
            onSortOrderChange(order as 'ASC' | 'DESC');
          }}
          title="Sort Employees"
          id="sort-select"
        >
          <option value="created_at-DESC">Newest First</option>
          <option value="created_at-ASC">Oldest First</option>
          <option value="name-ASC">Name (A → Z)</option>
          <option value="name-DESC">Name (Z → A)</option>
          <option value="role-ASC">Role (A → Z)</option>
        </select>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            className="btn btn-secondary"
            onClick={onResetFilters}
            style={{ padding: '0.625rem 0.875rem' }}
            title="Clear all active filters"
          >
            <RotateCcw size={15} />
            <span>Reset ({totalFiltered} found)</span>
          </button>
        )}

        {/* View Switcher */}
        <div className="view-switch" title="Toggle Layout View">
          <button
            type="button"
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => onViewModeChange('table')}
            aria-label="Table View"
          >
            <LayoutList size={18} />
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
