import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import TopNav from '../components/TopNav';
import { Calendar, FileText, CheckCircle, Clock } from 'lucide-react';

const TimeOffPage = () => {
  const { user } = useAuth();
  const [allocations, setAllocations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ leave_type: 'Paid', start_date: '', end_date: '', remarks: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aRes, lRes] = await Promise.all([
        api.get('/leave/allocations/me'),
        api.get('/leave/all') // In real app, filter for 'me'
      ]);
      setAllocations(aRes.data);
      setRequests(lRes.data.filter(r => r.user_id === user.id));
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append('attachment', file);

    try {
      await api.post('/leave/request', data);
      setShowModal(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Request failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {allocations.map(a => (
            <div key={a.leave_type} className="card text-center">
              <p className="text-gray-500 text-sm font-medium">{a.leave_type} Leave</p>
              <h2 className="text-3xl font-bold text-gray-800">{a.balance} Days</h2>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Leave History</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Calendar size={20} /> Request Time Off
          </button>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-400 text-xs uppercase font-bold">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {requests.map((r, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{r.leave_type}</td>
                    <td className="py-3 px-4">{r.start_date} to {r.end_date}</td>
                    <td className="py-3 px-4 font-bold">{r.days}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${r.status === 'Approved' ? 'bg-green-100 text-green-700' : r.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Leave Type</label>
                  <select className="input-field" value={form.leave_type} onChange={e => setForm({...form, leave_type: e.target.value})}>
                    <option value="Paid">Paid Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Unpaid">Unpaid Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                    <input type="date" className="input-field" required onChange={e => setForm({...form, start_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                    <input type="date" className="input-field" required onChange={e => setForm({...form, end_date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Remarks</label>
                  <textarea className="input-field" rows="3" onChange={e => setForm({...form, remarks: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Attachment (Required for Sick Leave)</label>
                  <input type="file" className="input-field" onChange={e => setFile(e.target.files[0])} />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                  <button type="submit" className="btn-primary">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeOffPage;
