import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import TopNav from '../components/TopNav';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';

const AttendancePage = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('idle'); // idle, checked-in, checked-out
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
    checkTodayStatus();
  }, []);

  const checkTodayStatus = async () => {
    try {
      const { data } = await api.get(`/attendance/me?month=${new Date().getMonth()+1}&year=${new Date().getFullYear()}`);
      const today = new Date().toISOString().split('T')[0];
      const todayRec = data.find(r => r.date === today);
      if (todayRec?.check_in && !todayRec?.check_out) setStatus('checked-in');
      else if (todayRec?.check_out) setStatus('checked-out');
    } catch (err) { console.error(err); }
  };

  const fetchRecords = async () => {
    try {
      const { data } = await api.get(`/attendance/me?month=${new Date().getMonth()+1}&year=${new Date().getFullYear()}`);
      setRecords(data);
    } catch (err) { console.error(err); }
  };

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/check-in');
      setStatus('checked-in');
      fetchRecords();
    } catch (err) { alert(err.response?.data?.error || 'Check-in failed'); }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/check-out');
      setStatus('checked-out');
      fetchRecords();
    } catch (err) { alert(err.response?.data?.error || 'Check-out failed'); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <div className="p-6 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-8">
        <div className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-white to-slate-50">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Attendance</h1>
            <p className="text-slate-500 mt-1">Manage your daily clock-in and out records</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {status === 'idle' && (
              <button onClick={handleCheckIn} className="btn-primary w-full md:w-auto px-8 py-3 shadow-indigo-200/50">
                <Clock size={20} /> Check In Now
              </button>
            )}
            {status === 'checked-in' && (
              <button onClick={handleCheckOut} className="w-full md:w-auto px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:bg-amber-700 shadow-sm shadow-amber-200 hover:shadow-md transition-all font-semibold flex items-center justify-center gap-2">
                <Clock size={20} /> Check Out Now
              </button>
            )}
            {status === 'checked-out' && (
              <div className="w-full md:w-auto px-8 py-3 bg-emerald-100/50 text-emerald-700 rounded-lg font-bold flex items-center justify-center gap-2 border border-emerald-200">
                <CheckCircle size={20} /> Day Completed
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Monthly Log</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse bg-white">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {records.map((rec, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900">{rec.date}</td>
                    <td className="py-4 px-4">{rec.check_in ? new Date(rec.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</td>
                    <td className="py-4 px-4">{rec.check_out ? new Date(rec.check_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{rec.work_hours ? parseFloat(rec.work_hours).toFixed(1) + 'h' : '-'}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${rec.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
