import { useState } from 'react';
import { tasksAPI } from '../utils/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await tasksAPI.getAll();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (title, description = '', scheduledTime = '09:00') => {
    setLoading(true);
    try {
      const { data } = await tasksAPI.create({ title, description, scheduledTime });
      setTasks([...tasks, data]);
      return true;
    } catch (error) {
      console.error('Failed to create task');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updates) => {
    setLoading(true);
    try {
      const { data } = await tasksAPI.update(id, updates);
      setTasks(tasks.map(t => t._id === id ? data : t));
      return true;
    } catch (error) {
      console.error('Failed to update task');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await tasksAPI.delete(id);
      setTasks(tasks.filter(t => t._id !== id));
      return true;
    } catch (error) {
      console.error('Failed to delete task');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask };
};
