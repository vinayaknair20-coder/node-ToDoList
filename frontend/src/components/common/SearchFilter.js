import React from 'react';
import './SearchFilter.css';

const SearchFilter = ({ searchTerm, onSearchChange, filterStatus, onFilterChange }) => {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="search-clear"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
          title="Show all tasks"
        >
          <i className="fas fa-list"></i> All
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
          title="Show pending tasks"
        >
          <i className="fas fa-hourglass-half"></i> Pending
        </button>
        <button
          className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
          title="Show completed tasks"
        >
          <i className="fas fa-check-circle"></i> Completed
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
