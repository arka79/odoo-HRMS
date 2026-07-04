import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, Clock, Wallet, UserCircle, LogOut } from 'lucide-react';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          {user?.company_id ? 'HR' : 'H'}
        </div>
        <span className="text-xl font-bold text-gray-800">HRMS Portal</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
          <button onClick={() => navigate(user?.role === 'Admin' ? '/admin/employees' : '/dashboard')} className="flex items-center gap-1 hover:text-blue-600">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => navigate('/attendance')} className="flex items-center gap-1 hover:text-blue-600">
            <Clock size={18} /> Attendance
          </button>
          <button onClick={() => navigate('/leave')} className="flex items-center gap-1 hover:text-blue-600">
            <Calendar size={18} /> Time Off
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">{user?.role}</p>
            <p className="text-sm font-bold text-gray-800">{user?.full_name}</p>
          </div>
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer border-2 border-white shadow-sm">
              <UserCircle className="w-full h-full text-gray-400" />
            </div>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 hidden group-hover:block z-50">
              <button onClick={() => navigate('/profile/me')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                <UserCircle size={16} /> My Profile
              </button>
              <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
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
