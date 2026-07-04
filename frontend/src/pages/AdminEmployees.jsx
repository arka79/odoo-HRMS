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
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Company Directory</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Add Employee
          </button>
        </div>

        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            className="input-field pl-10" 
            placeholder="Search by name or employee ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && fetchEmployees()}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(emp => (
            <div key={emp.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/profile/${emp.id}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {emp.full_name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{emp.full_name}</h3>
                  <p className="text-xs text-gray-500">{emp.employee_id} • {emp.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
              <form onSubmit={handleAddEmployee} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="First Name" required onChange={e => setNewEmp({...newEmp, first_name: e.target.value})} />
                  <input className="input-field" placeholder="Last Name" required onChange={e => setNewEmp({...newEmp, last_name: e.target.value})} />
                </div>
                <input className="input-field" placeholder="Full Name" required onChange={e => setNewEmp({...newEmp, full_name: e.target.value})} />
                <input className="input-field" type="email" placeholder="Email" required onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
                <input className="input-field" placeholder="Phone" onChange={e => setNewEmp({...newEmp, phone: e.target.value})} />
                <select className="input-field" onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                  <button type="submit" className="btn-primary">Create User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {tempPwd && (
          <div className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-lg shadow-xl animate-bounce cursor-pointer" onClick={() => {
            navigator.clipboard.writeText(tempPwd);
            alert('Password copied to clipboard!');
          }}>
            <p className="text-sm opacity-80">Temp Password created!</p>
            <p className="font-mono font-bold text-lg flex items-center gap-2">
              {tempPwd} <span className="text-[10px] bg-white/20 px-1 rounded">Click to Copy</span>
            </p>
            <button onClick={(e) => { e.stopPropagation(); setTempPwd(''); }} className="text-xs underline mt-2 block opacity-70 hover:opacity-100">Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
};


export default AdminEmployees;
