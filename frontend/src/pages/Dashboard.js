import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/common/Spinner';
import './Dashboard.css';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [message, setMessage] = useState('');
  const { tasks, loading, fetchTasks, createTask, deleteTask, updateTask } = useTasks();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleAddTask = async () => {
    if (!title.trim()) {
      setMessage('❌ Please enter a task title');
      return;
    }
    const success = await createTask(title, description, scheduledTime);
    if (success) {
      setTitle('');
      setDescription('');
      setScheduledTime('09:00');
      setMessage('✅ Task scheduled successfully!');
    } else {
      setMessage('❌ Failed to create task');
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const success = await updateTask(taskId, { status: newStatus });
    if (success) {
      setMessage(`✅ Task marked as ${newStatus}!`);
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteTask(id);
      setMessage('✅ Task deleted!');
    }
  };

  const getTimeStatus = (scheduledTime) => {
    if (!scheduledTime || typeof scheduledTime !== 'string') {
      return { status: 'unknown', label: 'No time set', color: 'future' };
    }

    const parts = scheduledTime.split(':');
    if (parts.length !== 2) {
      return { status: 'unknown', label: 'Invalid time', color: 'future' };
    }

    const [hours, minutes] = parts.map(Number);
    const taskTime = new Date();
    taskTime.setHours(hours, minutes, 0);

    const now = new Date();
    const diffMinutes = (taskTime - now) / (1000 * 60);

    if (diffMinutes < 0) {
      return { status: 'passed', label: '⏰ Time passed', color: 'passed' };
    } else if (diffMinutes <= 5) {
      return { status: 'now', label: '🔔 Do it now!', color: 'now' };
    } else if (diffMinutes <= 60) {
      return { status: 'upcoming', label: `⏳ ${Math.round(diffMinutes)}m away`, color: 'upcoming' };
    } else {
      return { status: 'future', label: `${Math.round(diffMinutes / 60)}h away`, color: 'future' };
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const timeA = (a.scheduledTime || '00:00').split(':').join('');
    const timeB = (b.scheduledTime || '00:00').split(':').join('');
    return timeA - timeB;
  });

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>📋 Your Tasks</h1>
          <p>Schedule your daily tasks efficiently</p>
        </div>

        {message && <div className={`alert ${message.includes('❌') ? 'alert-error' : 'alert-success'}`}>{message}</div>}

        {/* Add Task Form */}
        <div className="add-task-section">
          <div className="add-task-box">
            <input
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="task-input"
            />
            <textarea
              placeholder="Add description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="task-textarea"
            />
            
            <div className="time-picker-box">
              <label>🕐 Scheduled Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="time-picker"
              />
              <span className="time-display">{scheduledTime}</span>
            </div>

            <button
              onClick={handleAddTask}
              disabled={loading || !title.trim()}
              className="btn-add-task"
            >
              {loading ? '⏳' : '➕'} Schedule Task
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-section">
          {loading && tasks.length === 0 ? (
            <div className="loading-container">
              <Spinner size="large" />
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <h2>No scheduled tasks</h2>
              <p>Schedule your first task to get started!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {sortedTasks.map((task) => {
                const timeStatus = getTimeStatus(task.scheduledTime);
                const displayTime = task.scheduledTime || 'No time';
                const isCompleted = task.status === 'completed';

                return (
                  <div 
                    key={task._id} 
                    className={`task-card ${timeStatus.color} ${isCompleted ? 'completed' : ''}`}
                  >
                    <div className="task-header">
                      <div className="task-title-section">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => handleToggleStatus(task._id, task.status)}
                          className="task-checkbox"
                        />
                        <h3 className={`task-title ${isCompleted ? 'completed-text' : ''}`}>
                          {task.title}
                        </h3>
                      </div>
                      <span className={`task-status ${task.status}`}>
                        {isCompleted ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className={`task-description ${isCompleted ? 'completed-text' : ''}`}>
                        {task.description}
                      </p>
                    )}

                    {/* Time Display */}
                    <div className="task-time-display">
                      <div className={`time-badge ${timeStatus.color}`}>
                        <strong>{displayTime}</strong>
                      </div>
                      <div className={`time-status ${timeStatus.color}`}>
                        {timeStatus.label}
                      </div>
                    </div>

                    <div className="task-footer">
                      <small className="task-date">
                        📅 {new Date(task.createdAt).toLocaleDateString()}
                      </small>
                      <div className="task-actions">
                        <button
                          onClick={() => handleToggleStatus(task._id, task.status)}
                          className={`btn-status ${isCompleted ? 'btn-undo' : 'btn-complete'}`}
                          disabled={loading}
                        >
                          {isCompleted ? '↩️ Undo' : '✓ Done'}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="btn-delete-task"
                          disabled={loading}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
