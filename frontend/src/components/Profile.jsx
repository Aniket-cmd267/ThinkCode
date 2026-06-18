import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import {
  Award,
  Calendar,
  TrendingUp
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';

export default function Profile() {
  const { user } = useSelector((state) => state.slice1);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // 1. Create a native JavaScript Multipart Data append container
      const formData = new FormData();
      
      // 2. Append the binary file. 'profilePicFile' matches the upload.single interception key on your backend
      formData.append('profilePicFile', file);
      
      // 3. Dispatch the binary payload with explicit multipart boundary headers
      const res = await axiosClient.post('/profile/update-picture', formData, {
        headers: {
          'Content-Type': undefined,
        },
      });
      
      // 4. Dynamically pull the saved Cloudinary secure URL from the response payload
      setProfileData((prev) => ({
        ...prev,
        profilePic: res.data.profilePic || prev?.profilePic
      }));
    } catch (error) {
      console.error('Multipart profile image upload failed', error);
      alert('Failed to upload multipart profile image.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Flush input change targets cleanly
    }
  };

  useEffect(() => {
    const fetchProfileMetrics = async () => {
      try {
        const res = await axiosClient.get('/profile/metrics');
        setProfileData(res.data);
      } catch (error) {
        console.error('Failed to load profile metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileMetrics();
  }, []);

  const stats = {
    solved: profileData?.solvedStats?.totalSolved ?? 0,
    total: profileData?.solvedStats?.totalPlatform ?? 0,
    easySolved: profileData?.solvedStats?.easySolved ?? 0,
    easyTotal: profileData?.solvedStats?.easyTotal ?? 0,
    mediumSolved: profileData?.solvedStats?.mediumSolved ?? 0,
    mediumTotal: profileData?.solvedStats?.mediumTotal ?? 0,
    hardSolved: profileData?.solvedStats?.hardSolved ?? 0,
    hardTotal: profileData?.solvedStats?.hardTotal ?? 0,
    rank: profileData?.rank ? profileData.rank.toString() : '—',
    submissions: profileData?.solvedStats?.totalSolved ?? 0 // Safely mapped to your metric engine
  };

  const displayName = profileData?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Guest';
  const profilePicSrc = profileData?.profilePic || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`;
  const solvedRatio = stats.total > 0 ? Math.min(1, stats.solved / stats.total) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#0A0A0A] text-slate-200 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - IDENTITY */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <m.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#120505] border border-white/5 rounded-3xl p-6 shadow-2xl sticky top-24"
            >
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-linear-to-tr from-[#EF4444] to-[#F87171] rounded-3xl rotate-6 opacity-20" />
                <button type="button" onClick={handleProfileClick} className="relative w-full h-full bg-[#1A1A1A] border-2 border-[#EF4444]/30 rounded-3xl flex items-center justify-center overflow-hidden focus:outline-none">
                  <img src={profilePicSrc} alt={displayName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center text-sm text-white font-semibold">
                    {uploading ? 'Uploading...' : 'Change'}
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">{displayName}</h1>
                <p className="text-slate-500 font-mono text-sm">@{displayName.replace(/\s+/g, '').toLowerCase()}</p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-[#EF4444]/20">
                  Edit Profile
                </button>
                
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="grid gap-2 text-slate-300 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Problems Solved</span>
                      <span className="font-semibold text-white">{stats.solved}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Problems</span>
                      <span className="font-semibold text-white">{stats.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* TOP ROW - PROGRESS GAUGE & QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <m.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="col-span-1 md:col-span-2 bg-[#120505] border border-white/5 rounded-3xl p-8 flex items-center justify-between shadow-xl"
              >
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * solvedRatio)} className="text-[#EF4444] transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{stats.solved}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Solved</span>
                  </div>
                </div>

                <div className="space-y-4 flex-grow ml-12">
                   <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase mb-1"><span className="text-emerald-400">Easy</span><span className="text-slate-400">{stats.easySolved}/{stats.easyTotal}</span></div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full" style={{ width: `${stats.easyTotal ? (stats.easySolved / stats.easyTotal) * 100 : 0}%` }} /></div>
                   </div>
                   <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase mb-1"><span className="text-amber-400">Medium</span><span className="text-slate-400">{stats.mediumSolved}/{stats.mediumTotal}</span></div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full" style={{ width: `${stats.mediumTotal ? (stats.mediumSolved / stats.mediumTotal) * 100 : 0}%` }} /></div>
                   </div>
                   <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase mb-1"><span className="text-rose-500">Hard</span><span className="text-slate-400">{stats.hardSolved}/{stats.hardTotal}</span></div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-rose-500 h-full" style={{ width: `${stats.hardTotal ? (stats.hardSolved / stats.hardTotal) * 100 : 0}%` }} /></div>
                   </div>
                </div>
              </m.div>

              <div className="grid grid-rows-2 gap-6">
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#120505] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl"><Award className="text-amber-500" /></div>
                  <div><p className="text-xs font-bold text-slate-500 uppercase">Global Rank</p><p className="text-xl font-black text-white">#{stats.rank}</p></div>
                </m.div>
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#120505] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                  <div className="p-3 bg-[#EF4444]/10 rounded-2xl"><TrendingUp className="text-[#EF4444]" /></div>
                  <div><p className="text-xs font-bold text-slate-500 uppercase">Accepted Solves</p><p className="text-xl font-black text-white">{stats.solved}</p></div>
                </m.div>
              </div>
            </div>

            {/* MIDDLE ROW - RECENT ACTIVITY */}
            <m.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-[#120505] border border-white/5 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2"><Calendar size={18} className="text-[#EF4444]" /> Recent Submissions</h3>
                <span className="text-xs text-slate-500 font-mono">Total Submissions: {stats.submissions}</span>
              </div>
              <div className="divide-y divide-white/5">
                {(profileData?.recentSubmissions?.length ?? 0) > 0 ? (
                  profileData.recentSubmissions.map((submission, index) => (
                    <div key={index} className="p-5 flex items-center justify-between hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div>
                          <p className="text-sm font-bold text-white">{submission.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{new Date(submission.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-mono ${submission.status === 'accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>{submission.status}</p>
                        <p className="text-[10px] text-slate-600">Runtime: {submission.runtime ?? '--'}ms</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-slate-400 text-sm">No recent submissions available.</div>
                )}
              </div>
            </m.div>

          </div>
        </div>
      </div>
    </LazyMotion>
  );
}