import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api';

  const signup = async () => {
    try {
      const res = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setMessage('✅ Signup successful!');
      }
    } catch (err) {
      setMessage('❌ Signup failed');
    }
  };

  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setMessage('✅ Login successful!');
      }
    } catch (err) {
      setMessage('❌ Login failed');
    }
  };

  const createTask = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description: '' })
      });
      const data = await res.json();
      if (data._id) {
        setTasks([...tasks, data]);
        setTitle('');
        setMessage('✅ Task created!');
      }
    } catch (err) {
      setMessage('❌ Failed to create task');
    }
  };

  const getTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setMessage('❌ Failed to fetch tasks');
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t._id !== id));
      setMessage('✅ Task deleted!');
    } catch (err) {
      setMessage('❌ Failed to delete task');
    }
  };

  useEffect(() => {
    if (token) getTasks();
  }, [token]);

  return (
    <div className="App">
      <h1>📝 Todo App</h1>
      
      {message && <p className="message">{message}</p>}

      {!token ? (
        <div className="auth">
          <h2>Login / Signup</h2>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={signup}>Sign Up</button>
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div className="tasks">
          <h2>Your Tasks</h2>
          <div>
            <input
              placeholder="Add new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={createTask}>Add Task</button>
          </div>
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                {task.title}
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={() => { setToken(null); localStorage.removeItem('token'); }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
