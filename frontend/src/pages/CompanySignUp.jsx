import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const CompanySignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    company_name: '', admin_name: '', email: '', phone: '', password: '', confirm_password: ''
  });
  const [logo, setLogo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (logo) data.append('logo', logo);

    try {
      const { data: res } = await api.post('/auth/signup-company', data);
      
      login(res.token, res.admin);
      
      navigate('/admin/employees');
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8 py-12">
      <div className="max-w-xl w-full card">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Setup Workspace</h2>
          <p className="mt-2 text-sm text-slate-500">Create your company profile and admin account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
            <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">Company Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-text">Company Name</label>
                <input className="input-field" placeholder="Acme Corp" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} required />
              </div>
              <div className="sm:col-span-2">
                <label className="label-text">Company Logo</label>
                <input type="file" className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={e => setLogo(e.target.files[0])} />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">Admin Account</h3>
            <div>
              <label className="label-text">Full Name</label>
              <input className="input-field" placeholder="Admin Name" value={formData.admin_name} onChange={e => setFormData({...formData, admin_name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Email</label>
                <input className="input-field" type="email" placeholder="admin@acme.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                <label className="label-text">Phone</label>
                <input className="input-field" placeholder="+1 234 567 8900" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
              <div>
                <label className="label-text">Confirm Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={formData.confirm_password} onChange={e => setFormData({...formData, confirm_password: e.target.value})} required />
              </div>
            </div>
          </div>
          <div className="pt-4">
            <button className="btn-primary w-full py-3 text-lg shadow-indigo-200/50">Complete Setup</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySignUp;
