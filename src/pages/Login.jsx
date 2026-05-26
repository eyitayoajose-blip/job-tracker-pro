import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = ({ setAuth, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('auth', 'true');
      setAuth(true);
      toast.success('Logged in successfully!');
      onLoginSuccess();
    } else {
      toast.error('Please enter email and password');
    }
  };

  return (
    <div className="login-container">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="login-card">
        <h1>🎯 JobTracker Pro</h1>
        <p>Sign in to manage your applications</p>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        <p className="demo-hint">Demo: any email/password</p>
      </motion.div>
    </div>
  );
};
export default Login;
