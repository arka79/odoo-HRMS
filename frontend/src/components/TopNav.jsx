import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, Clock, Wallet, UserCircle, LogOut } from 'lucide-react';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(user?.role === 'Admin' ? '/admin/employees' : '/dashboard')}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner shadow-indigo-300">
          {user?.company_id ? 'HR' : 'H'}
        </div>
        <span className="text-xl font-extrabold text-slate-900 tracking-tight hidden sm:block">HRMS Portal</span>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
          <button onClick={() => navigate(user?.role === 'Admin' ? '/admin/employees' : '/dashboard')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => navigate('/attendance')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            <Clock size={18} /> Attendance
          </button>
          <button onClick={() => navigate('/leave')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition-colors">
            <Calendar size={18} /> Time Off
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-2 sm:pl-4 md:border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{user?.role}</p>
            <p className="text-sm font-bold text-slate-900">{user?.full_name}</p>
          </div>
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden cursor-pointer border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
              <UserCircle className="w-full h-full text-slate-400" />
            </div>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button onClick={() => navigate('/profile/me')} className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                <UserCircle size={16} /> My Profile
              </button>
              <button onClick={logout} className="w-full px-4 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
