import React, { useState, useEffect } from 'react';
import './EditTaskModal.css';

const EditTaskModal = ({ isOpen, task, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledTime: '09:00'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        scheduledTime: task.scheduledTime || '09:00'
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    onSave(task._id, formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            <i className="fas fa-edit"></i> Edit Task
          </h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              disabled={loading}
              className="modal-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add task description (optional)"
              disabled={loading}
              className="modal-textarea"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-clock"></i> Scheduled Time
            </label>
            <input
              type="time"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              disabled={loading}
              className="modal-input"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn-modal-cancel"
            onClick={onClose}
            disabled={loading}
          >
            <i className="fas fa-times"></i> Cancel
          </button>
          <button
            className="btn-modal-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
