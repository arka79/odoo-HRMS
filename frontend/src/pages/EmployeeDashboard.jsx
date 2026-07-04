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
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.full_name}!</h1>
          <p className="text-gray-500">Here is what's happening with your work today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:border-blue-500 transition-all cursor-pointer" onClick={() => navigate('/attendance')}>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-lg">Attendance</h3>
            <p className="text-sm text-gray-500 mb-4">Clock in and track your hours</p>
            <span className="text-blue-600 text-sm font-semibold flex items-center gap-1">Manage →</span>
          </div>

          <div className="card hover:border-green-500 transition-all cursor-pointer" onClick={() => navigate('/leave')}>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="font-bold text-lg">Time Off</h3>
            <p className="text-sm text-gray-500 mb-4">Apply for leaves & check balance</p>
            <span className="text-green-600 text-sm font-semibold flex items-center gap-1">Apply Now →</span>
          </div>

          <div className="card hover:border-purple-500 transition-all cursor-pointer" onClick={() => navigate('/profile/me')}>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
              <UserCircle size={24} />
            </div>
            <h3 className="font-bold text-lg">My Profile</h3>
            <p className="text-sm text-gray-500 mb-4">Update personal & professional info</p>
            <span className="text-purple-600 text-sm font-semibold flex items-center gap-1">View Profile →</span>
          </div>

          <div className="card hover:border-orange-500 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
              <Wallet size={24} />
            </div>
            <h3 className="font-bold text-lg">Payroll</h3>
            <p className="text-sm text-gray-500 mb-4">View your salary structure</p>
            <span className="text-orange-600 text-sm font-semibold flex items-center gap-1">Check Pay →</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card">
            <h3 className="font-bold text-xl mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => navigate('/attendance')} className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors group">
                <span className="text-gray-700 group-hover:text-blue-600 font-medium">Clock In / Out Today</span>
                <Clock size={20} className="text-gray-400" />
              </button>
              <button onClick={() => navigate('/leave')} className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors group">
                <span className="text-gray-700 group-hover:text-green-600 font-medium">Request a day off</span>
                <Calendar size={20} className="text-gray-400" />
              </button>
              <button onClick={() => navigate('/profile/me')} className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors group">
                <span className="text-gray-700 group-hover:text-purple-600 font-medium">Update my contact info</span>
                <UserCircle size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="card bg-blue-600 text-white">
            <h3 className="font-bold text-xl mb-2">Company Help</h3>
            <p className="text-blue-100 text-sm mb-6">Need help with your payroll or attendance? Contact your HR Admin.</p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              Contact Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
