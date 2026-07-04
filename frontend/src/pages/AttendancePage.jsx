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
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="p-8 max-w-5xl mx-auto">
        <div className="card flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
            <p className="text-gray-500">Manage your daily clock-in and out</p>
          </div>
          <div className="flex gap-4">
            {status === 'idle' && (
              <button onClick={handleCheckIn} className="btn-primary flex items-center gap-2 px-6 py-3">
                <Clock size={20} /> Check In Now
              </button>
            )}
            {status === 'checked-in' && (
              <button onClick={handleCheckOut} className="btn-primary bg-orange-600 hover:bg-orange-700 flex items-center gap-2 px-6 py-3">
                <Clock size={20} /> Check Out Now
              </button>
            )}
            {status === 'checked-out' && (
              <div className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium flex items-center gap-2">
                <CheckCircle size={20} /> Day Completed
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold mb-4">Monthly Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-400 text-xs uppercase font-bold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {records.map((rec, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{rec.date}</td>
                    <td className="py-3 px-4">{rec.check_in ? new Date(rec.check_in).toLocaleTimeString() : '-'}</td>
                    <td className="py-3 px-4">{rec.check_out ? new Date(rec.check_out).toLocaleTimeString() : '-'}</td>
                    <td className="py-3 px-4 font-bold">{rec.work_hours}h</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${rec.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
