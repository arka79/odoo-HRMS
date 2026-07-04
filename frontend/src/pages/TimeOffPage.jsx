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
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {allocations.map(a => (
            <div key={a.leave_type} className="card text-center bg-gradient-to-br from-white to-slate-50/50 hover:border-indigo-200">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">{a.leave_type} Leave</p>
              <h2 className="text-4xl font-extrabold text-indigo-700">{parseFloat(a.balance)} <span className="text-lg text-indigo-400 font-medium">Days</span></h2>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Leave History</h1>
            <p className="text-sm text-slate-500 mt-1">Track your past and upcoming time off</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary w-full sm:w-auto">
            <Calendar size={20} /> Request Time Off
          </button>
        </div>

        <div className="card">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse bg-white">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {requests.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900">{r.leave_type}</td>
                    <td className="py-4 px-4">{new Date(r.start_date).toLocaleDateString()} &rarr; {new Date(r.end_date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{r.days}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : r.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
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
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Apply for Leave</h2>
                <p className="text-sm text-slate-500 mt-1">Submit a new time-off request.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-text">Leave Type</label>
                  <select className="input-field" value={form.leave_type} onChange={e => setForm({...form, leave_type: e.target.value})}>
                    <option value="Paid">Paid Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Unpaid">Unpaid Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Start Date</label>
                    <input type="date" className="input-field" required onChange={e => setForm({...form, start_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-text">End Date</label>
                    <input type="date" className="input-field" required onChange={e => setForm({...form, end_date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="label-text">Remarks</label>
                  <textarea className="input-field resize-none" rows="3" placeholder="Brief reason..." onChange={e => setForm({...form, remarks: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="label-text">Attachment <span className="text-slate-400 font-normal">(Req. for Sick Leave)</span></label>
                  <input type="file" className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={e => setFile(e.target.files[0])} />
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
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
