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
  const [uploading, setUploading] = useState(false);

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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const { data: res } = await api.put(`/profile/${targetUserId}/avatar`, formData);
      setData({ ...data, user: { ...data.user, profile_pic: res.profile_pic } });
      alert('Avatar updated!');
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <div className="p-6 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">
        <div className="card p-0 overflow-hidden border-0">
          <div className="h-40 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900"></div>
          <div className="px-8 pb-8">
            <div className="relative flex flex-col sm:flex-row justify-between items-center sm:items-end -mt-16 sm:-mt-12 mb-8 gap-4">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg">
                  <img src={data.user.profile_pic || '/uploads/avatars/default.png'} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                {(isAdmin || isOwnProfile) && (
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200 text-white backdrop-blur-sm">
                    <Upload size={20} className="mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                    <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                  </label>
                )}
              </div>
              {(isAdmin || isOwnProfile) && (
                <button onClick={() => setIsEditing(!isEditing)} className={isEditing ? "btn-secondary w-full sm:w-auto" : "btn-primary w-full sm:w-auto"}>
                  {isEditing ? <Save size={18} className="text-indigo-600" /> : <User size={18} />} 
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="md:col-span-1 space-y-8">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{data.user.full_name}</h1>
                  <p className="text-slate-500 font-medium mt-1">{data.profile.job_title || 'No title assigned'}</p>
                </div>
                <div className="space-y-4 text-sm text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3"><Mail size={16} className="text-slate-400" /> <span className="truncate">{data.user.email}</span></div>
                  <div className="flex items-center gap-3"><Phone size={16} className="text-slate-400" /> {data.user.phone || 'N/A'}</div>
                  <div className="flex items-center gap-3"><MapPin size={16} className="text-slate-400" /> {data.profile.location || 'N/A'}</div>
                  <div className="flex items-center gap-3"><Briefcase size={16} className="text-slate-400" /> {data.profile.department || 'N/A'}</div>
                </div>
              </div>

              <div className="md:col-span-2">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-5 bg-white p-6 rounded-2xl border border-indigo-100 shadow-[0_0_40px_-15px_rgba(79,70,229,0.1)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label-text">Full Name</label>
                        <input className="input-field" value={data.user.full_name} onChange={e => setData({...data, user: {...data.user, full_name: e.target.value}})} />
                      </div>
                      <div>
                        <label className="label-text">Phone</label>
                        <input className="input-field" value={data.user.phone} onChange={e => setData({...data, user: {...data.user, phone: e.target.value}})} />
                      </div>
                    </div>
                    <div>
                      <label className="label-text">Job Title</label>
                      <input className="input-field" value={data.profile.job_title} onChange={e => setData({...data, profile: {...data.profile, job_title: e.target.value}})} />
                    </div>
                    <div>
                      <label className="label-text">Department</label>
                      <input className="input-field" value={data.profile.department} onChange={e => setData({...data, profile: {...data.profile, department: e.target.value}})} />
                    </div>
                    <div className="pt-4">
                      <button type="submit" disabled={uploading} className="btn-primary w-full">
                        {uploading ? 'Saving Changes...' : 'Update Profile Details'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg border-b border-slate-200 pb-3 mb-4">Professional Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-sm">
                        <div>
                          <p className="text-slate-500 font-medium mb-1">Nationality</p>
                          <p className="font-semibold text-slate-900">{data.profile.nationality || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium mb-1">Date of Joining</p>
                          <p className="font-semibold text-slate-900">{data.profile.joined_date ? new Date(data.profile.joined_date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium mb-1">Manager</p>
                          <p className="font-semibold text-slate-900">{data.profile.manager || 'N/A'}</p>
                        </div>
                      </div>
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
