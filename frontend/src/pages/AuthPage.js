import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/Auth.css';

const AuthPage = ({ onLogin }) => {
  const { darkMode } = useContext(ThemeContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use entered username or default to "Guest User"
    const finalUsername = username.trim() || 'Guest User';
    // Store user info and trigger login
    localStorage.setItem('user', JSON.stringify({ username: finalUsername }));
    if (onLogin) onLogin({ username: finalUsername });
  };

  return (
    <div className={`auth-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="auth-container">
        <div className="auth-header">
          <h1>NovaChat</h1>
          <h2>{isLogin ? 'Sign in to your account' : 'Create your account'}</h2>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username (optional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (optional)"
            />
          </div>

          <button type="submit" className="auth-button">
            {isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        
        <div className="auth-switch">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
