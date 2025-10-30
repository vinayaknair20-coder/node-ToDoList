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

  // Check if time already exists
  const isTimeConflict = (time) => {
    return tasks.some(task => task.scheduledTime === time && task.status !== 'completed');
  };

  const handleAddTask = async () => {
    if (!title.trim()) {
      setMessage('error-Please enter a task title');
      return;
    }

    // Check for time conflict
    if (isTimeConflict(scheduledTime)) {
      setMessage(`error-You already have a task at ${scheduledTime}. Cannot create two tasks at the same time!`);
      return;
    }

    const success = await createTask(title, description, scheduledTime);
    if (success) {
      setTitle('');
      setDescription('');
      setScheduledTime('09:00');
      setMessage('success-Task scheduled successfully!');
    } else {
      setMessage('error-Failed to create task');
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const success = await updateTask(taskId, { status: newStatus });
    if (success) {
      setMessage(`success-Task marked as ${newStatus}!`);
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      setMessage('success-Task deleted!');
    }
  };

  const getTimeStatus = (scheduledTime) => {
    if (!scheduledTime || typeof scheduledTime !== 'string') {
      return { status: 'unknown', label: 'No time set', color: 'future', icon: 'fa-clock' };
    }

    const parts = scheduledTime.split(':');
    if (parts.length !== 2) {
      return { status: 'unknown', label: 'Invalid time', color: 'future', icon: 'fa-clock' };
    }

    const [hours, minutes] = parts.map(Number);
    const taskTime = new Date();
    taskTime.setHours(hours, minutes, 0);

    const now = new Date();
    const diffMinutes = (taskTime - now) / (1000 * 60);

    if (diffMinutes < 0) {
      return { status: 'passed', label: 'Time passed', color: 'passed', icon: 'fa-hourglass-end' };
    } else if (diffMinutes <= 5) {
      return { status: 'now', label: 'Do it now!', color: 'now', icon: 'fa-fire' };
    } else if (diffMinutes <= 60) {
      return { status: 'upcoming', label: `${Math.round(diffMinutes)}m away`, color: 'upcoming', icon: 'fa-hourglass-half' };
    } else {
      return { status: 'future', label: `${Math.round(diffMinutes / 60)}h away`, color: 'future', icon: 'fa-hourglass-start' };
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const timeA = (a.scheduledTime || '00:00').split(':').join('');
    const timeB = (b.scheduledTime || '00:00').split(':').join('');
    return timeA - timeB;
  });

  const getMessageType = (msg) => {
    return msg.startsWith('error-') ? 'alert-error' : 'alert-success';
  };

  const getMessageText = (msg) => {
    return msg.replace('error-', '').replace('success-', '');
  };

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>
            <i className="fas fa-list-check"></i> Your Tasks
          </h1>
          <p>Schedule your daily tasks efficiently</p>
        </div>

        {message && (
          <div className={`alert ${getMessageType(message)}`}>
            <i className={`fas ${getMessageType(message) === 'alert-error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
            {getMessageText(message)}
          </div>
        )}

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
              <label>
                <i className="fas fa-clock"></i> Scheduled Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="time-picker"
              />
              <span className={`time-display ${isTimeConflict(scheduledTime) ? 'conflict' : ''}`}>
                {scheduledTime}
                {isTimeConflict(scheduledTime) && <i className="fas fa-exclamation-triangle"></i>}
              </span>
            </div>

            {isTimeConflict(scheduledTime) && (
              <div className="time-conflict-warning">
                <i className="fas fa-exclamation-triangle"></i> This time slot is already taken! Choose a different time.
              </div>
            )}

            <button
              onClick={handleAddTask}
              disabled={loading || !title.trim() || isTimeConflict(scheduledTime)}
              className="btn-add-task"
            >
              <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
              Schedule Task
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
              <i className="fas fa-inbox empty-icon"></i>
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
                        <i className={`fas ${isCompleted ? 'fa-check-circle' : 'fa-clock'}`}></i>
                        {isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className={`task-description ${isCompleted ? 'completed-text' : ''}`}>
                        {task.description}
                      </p>
                    )}

                    <div className="task-time-display">
                      <div className={`time-badge ${timeStatus.color}`}>
                        <i className={`fas ${timeStatus.icon}`}></i>
                        <strong>{displayTime}</strong>
                      </div>
                      <div className={`time-status ${timeStatus.color}`}>
                        {timeStatus.label}
                      </div>
                    </div>

                    <div className="task-footer">
                      <small className="task-date">
                        <i className="fas fa-calendar-alt"></i>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </small>
                      <div className="task-actions">
                        <button
                          onClick={() => handleToggleStatus(task._id, task.status)}
                          className={`btn-status ${isCompleted ? 'btn-undo' : 'btn-complete'}`}
                          disabled={loading}
                          title={isCompleted ? 'Undo' : 'Mark as done'}
                        >
                          <i className={`fas ${isCompleted ? 'fa-undo' : 'fa-check'}`}></i>
                          {isCompleted ? 'Undo' : 'Done'}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="btn-delete-task"
                          disabled={loading}
                          title="Delete task"
                        >
                          <i className="fas fa-trash-alt"></i> Delete
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
