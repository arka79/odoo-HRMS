import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import TopNav from '../components/TopNav';
import { Save, Upload, Mail, Phone, MapPin, Briefcase, User } from 'lucide-react';

const ProfileView = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState({ user: {}, profile: {}, salary: null });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId === 'me' ? user.id : userId;
  const isAdmin = user.role === 'Admin';
  const isOwnProfile = targetUserId === user.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/profile/${targetUserId}`);
        setData(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [targetUserId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/profile/${targetUserId}`, data);
      alert('Profile updated!');
      setIsEditing(false);
    } catch (err) { alert(err.response?.data?.error || 'Update failed'); }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="p-1 bg-white rounded-full shadow-lg">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white">
                  <img src={data.user.profile_pic || '/uploads/avatars/default.png'} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              {(isAdmin || isOwnProfile) && (
                <button onClick={() => setIsEditing(!isEditing)} className="btn-primary flex items-center gap-2">
                  {isEditing ? <Save size={18} /> : <User size={18} />} {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{data.user.full_name}</h1>
                  <p className="text-gray-500">{data.profile.job_title || 'No title assigned'}</p>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3"><Mail size={16} /> {data.user.email}</div>
                  <div className="flex items-center gap-3"><Phone size={16} /> {data.user.phone}</div>
                  <div className="flex items-center gap-3"><MapPin size={16} /> {data.profile.location}</div>
                  <div className="flex items-center gap-3"><Briefcase size={16} /> {data.profile.department}</div>
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 border border-gray-200">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">First Name</label>
                        <input className="input-field" value={data.user.full_name} onChange={e => setData({...data, user: {...data.user, full_name: e.target.value}})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Phone</label>
                        <input className="input-field" value={data.user.phone} onChange={e => setData({...data, user: {...data.user, phone: e.target.value}})} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase">Job Title</label>
                      <input className="input-field" value={data.profile.job_title} onChange={e => setData({...data, profile: {...data.profile, job_title: e.target.value}})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase">Department</label>
                      <input className="input-field" value={data.profile.department} onChange={e => setData({...data, profile: {...data.profile, department: e.target.value}})} />
                    </div>
                    <button type="submit" className="btn-primary w-full">Update Profile</button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 border-b pb-2">Professional Details</h3>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <span className="text-gray-500">Nationality</span> <span className="font-medium">{data.profile.nationality || 'N/A'}</span>
                      <span className="text-gray-500">Date of Joining</span> <span className="font-medium">{data.profile.joined_date || 'N/A'}</span>
                      <span className="text-gray-500">Manager</span> <span className="font-medium">{data.profile.manager || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
