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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full card">
        <h2 className="text-2xl font-bold mb-6 text-center">Company Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input className="input-field" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Logo</label>
            <input type="file" className="input-field" onChange={e => setLogo(e.target.files[0])} />
          </div>
          <hr className="my-4" />
          <div>
            <label className="block text-sm font-medium mb-1">Admin Full Name</label>
            <input className="input-field" value={formData.admin_name} onChange={e => setFormData({...formData, admin_name: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="input-field" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input className="input-field" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input className="input-field" type="password" value={formData.confirm_password} onChange={e => setFormData({...formData, confirm_password: e.target.value})} required />
          </div>
          <button className="btn-primary w-full mt-4">Create Company</button>
        </form>
      </div>
    </div>
  );
};

export default CompanySignUp;
