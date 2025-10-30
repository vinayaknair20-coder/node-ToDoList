import React from 'react';
import './StatsCard.css';

const StatsCard = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-card">
      <div className="stats-header">
        <h3>
          <i className="fas fa-chart-pie"></i> Task Statistics
        </h3>
      </div>

      <div className="stats-container">
        {/* Total Tasks */}
        <div className="stat-item total">
          <div className="stat-icon">
            <i className="fas fa-list"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Tasks</p>
            <p className="stat-value">{total}</p>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="stat-item completed">
          <div className="stat-icon">
            <i className="fas fa-check-square"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{completed}</p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="stat-item pending">
          <div className="stat-icon">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{pending}</p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="stat-item rate">
          <div className="stat-icon">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Completion Rate</p>
            <p className="stat-value">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span className="progress-text">{completed} of {total}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
