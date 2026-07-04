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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full card">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Security Update Required</h2>
          <p className="mt-2 text-sm text-slate-500 px-4">Your admin has set a temporary password. Please update it to secure your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-text">New Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="label-text">Confirm New Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <div className="pt-2">
            <button className="btn-primary w-full shadow-indigo-200/50">Update Password & Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
