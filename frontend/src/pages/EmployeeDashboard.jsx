import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TopNav from '../components/TopNav';
import { LayoutDashboard, Clock, Calendar, Wallet, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user?.full_name}!</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Here is what's happening with your work today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:ring-2 hover:ring-indigo-500 group cursor-pointer" onClick={() => navigate('/attendance')}>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Attendance</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">Clock in and track your hours</p>
            <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Manage <span aria-hidden="true">&rarr;</span></span>
          </div>

          <div className="card hover:ring-2 hover:ring-emerald-500 group cursor-pointer" onClick={() => navigate('/leave')}>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Calendar size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Time Off</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">Apply for leaves & check balance</p>
            <span className="text-emerald-600 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Apply Now <span aria-hidden="true">&rarr;</span></span>
          </div>

          <div className="card hover:ring-2 hover:ring-purple-500 group cursor-pointer" onClick={() => navigate('/profile/me')}>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <UserCircle size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">My Profile</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">Update personal & professional info</p>
            <span className="text-purple-600 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">View Profile <span aria-hidden="true">&rarr;</span></span>
          </div>

          <div className="card hover:ring-2 hover:ring-amber-500 group cursor-pointer">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Wallet size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Payroll</h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">View your salary structure</p>
            <span className="text-amber-600 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Check Pay <span aria-hidden="true">&rarr;</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 card">
            <h3 className="font-bold text-xl text-slate-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button onClick={() => navigate('/attendance')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm transition-all group">
                <span className="text-slate-700 group-hover:text-indigo-700 font-medium">Clock In / Out Today</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <Clock size={16} className="text-slate-500 group-hover:text-indigo-600" />
                </div>
              </button>
              <button onClick={() => navigate('/leave')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-sm transition-all group">
                <span className="text-slate-700 group-hover:text-emerald-700 font-medium">Request a day off</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Calendar size={16} className="text-slate-500 group-hover:text-emerald-600" />
                </div>
              </button>
              <button onClick={() => navigate('/profile/me')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-sm transition-all group">
                <span className="text-slate-700 group-hover:text-purple-700 font-medium">Update my contact info</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <UserCircle size={16} className="text-slate-500 group-hover:text-purple-600" />
                </div>
              </button>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-indigo-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-3">Company Help</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Need help with your payroll or attendance? Contact your HR Administrator directly from here.</p>
              <button className="w-full py-3 bg-white text-indigo-700 rounded-lg font-bold hover:bg-indigo-50 shadow-sm transition-colors focus:ring-4 focus:ring-white/20">
                Contact Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
