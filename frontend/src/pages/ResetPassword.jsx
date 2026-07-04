import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import TopNav from '../components/TopNav';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert('Passwords do not match');
    
    try {
      await api.put('/auth/reset-password', { password });
      alert('Password updated successfully!');
      navigate(user.role === 'Admin' ? '/admin/employees' : '/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full card">
        <h2 className="text-2xl font-bold mb-2 text-center">Reset Password</h2>
        <p className="text-center text-gray-500 mb-6">Your admin has set a temporary password. Please update it now.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input className="input-field" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <button className="btn-primary w-full mt-4">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
