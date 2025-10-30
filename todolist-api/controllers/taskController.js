// Mock database
const tasks = [];

exports.getTasks = async (req, res) => {
  try {
    const userTasks = tasks.filter(t => t.userId === req.userId);
    res.json(userTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, scheduledTime } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title required' });
    }
    
    const task = {
      _id: Date.now().toString(),
      title,
      description: description || '',
      scheduledTime: scheduledTime || '09:00',
      status: 'pending',
      userId: req.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tasks.push(task);
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t._id === id && t.userId === req.userId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body, updatedAt: new Date() };
    res.json(tasks[taskIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t._id === id && t.userId === req.userId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    tasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
