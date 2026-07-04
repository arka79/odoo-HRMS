import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import TopNav from '../components/TopNav';
import { Plus, Search, User } from 'lucide-react';

const AdminEmployees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ first_name: '', last_name: '', email: '', phone: '', role: 'Employee', full_name: '' });
  const [tempPwd, setTempPwd] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get(`/admin/employees?search=${search}`);
      setEmployees(data);
    } catch (err) { console.error(err); }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/add-employee', newEmp);
      setTempPwd(data.tempPassword);
      setShowModal(false);
      fetchEmployees();
    } catch (err) { alert(err.response?.data?.error || 'Failed to add'); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Company Directory</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your organization's employees</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 w-full sm:w-auto">
            <Plus size={20} /> Add Employee
          </button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            className="input-field pl-10" 
            placeholder="Search by name or employee ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && fetchEmployees()}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map(emp => (
            <div key={emp.id} className="card group hover:ring-2 hover:ring-indigo-500 cursor-pointer" onClick={() => window.location.href = `/profile/${emp.id}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl group-hover:scale-105 transition-transform">
                  {emp.full_name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{emp.full_name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{emp.employee_id} <span className="mx-1">&bull;</span> {emp.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Add New Employee</h2>
                <p className="text-sm text-slate-500 mt-1">Fill in the details to onboard a new team member.</p>
              </div>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">First Name</label>
                    <input className="input-field" placeholder="John" required onChange={e => setNewEmp({...newEmp, first_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-text">Last Name</label>
                    <input className="input-field" placeholder="Doe" required onChange={e => setNewEmp({...newEmp, last_name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="label-text">Full Name</label>
                  <input className="input-field" placeholder="John Doe" required onChange={e => setNewEmp({...newEmp, full_name: e.target.value})} />
                </div>
                <div>
                  <label className="label-text">Email</label>
                  <input className="input-field" type="email" placeholder="john@company.com" required onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
                </div>
                <div>
                  <label className="label-text">Phone</label>
                  <input className="input-field" placeholder="+1 (555) 000-0000" onChange={e => setNewEmp({...newEmp, phone: e.target.value})} />
                </div>
                <div>
                  <label className="label-text">Role</label>
                  <select className="input-field" onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Create User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {tempPwd && (
          <div className="fixed bottom-8 right-8 max-w-sm bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-2xl shadow-2xl shadow-indigo-900/50 animate-in slide-in-from-bottom-5 cursor-pointer hover:scale-105 transition-transform" onClick={() => {
            navigator.clipboard.writeText(tempPwd);
            alert('Password copied to clipboard!');
          }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-indigo-200 font-medium mb-1">Temporary Password</p>
                <p className="font-mono font-bold text-2xl tracking-wider flex items-center gap-3">
                  {tempPwd}
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-1 rounded">Click to Copy</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setTempPwd(''); }} className="text-xs text-indigo-200 hover:text-white underline mt-4 block transition-colors">Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
};


export default AdminEmployees;
