import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { Play, Eye, Clock, Film } from "lucide-react";

export default function Editorial({ problemId }) {
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEditorialVideo() {
            try {
                const response = await axiosClient.get(`/video/get-video/${problemId}`);
                if (response.data.success) {
                    setVideoData(response.data.video);
                }
            } catch (err) {
                console.log("No video asset configuration established for this item.");
            } finally {
                setLoading(false);
            }
        }
        loadEditorialVideo();
    }, [problemId]);

    if (loading) return <div className="text-slate-400 font-mono text-xs p-6 animate-pulse">Loading explanations...</div>;
    if (!videoData) return <div className="text-slate-500 font-medium text-sm p-6">No multimedia video solutions are currently available for this problem.</div>;

    // Convert total seconds to clean readable minutes configuration
    const formatDuration = (secs) => {
        const mins = Math.floor(secs / 60);
        const remainSecs = Math.floor(secs % 60);
        return `${mins}:${remainSecs < 10 ? '0' : ''}${remainSecs}`;
    };

    return (
        <div className="bg-[#1F2633] border border-slate-700/40 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto my-4 text-slate-100">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
                <Film className="text-red-400 w-5 h-5" /> Video Walkthrough Explanation
            </h3>

            {/* HIGH CONTRAST RESPONSIVE VIDEO LAYER CONTAINER */}
            <div className="relative overflow-hidden rounded-xl border border-slate-700/60 bg-black aspect-video group shadow-2xl">
                <video 
                    src={videoData.videoUrl} 
                    poster={videoData.thumbnailUrl}
                    controls 
                    className="w-full h-full object-contain"
                    preload="metadata"
                />
            </div>

            {/* VIDEO METADATA BLOCK PANEL */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-400 border-t border-slate-700/40 pt-4">
                <div className="flex items-center gap-5">
                    <span className="flex items-center gap-1.5 bg-[#161B26] px-3 py-1.5 rounded-lg border border-slate-800">
                        <Clock size={13} className="text-red-400" /> 
                        {formatDuration(videoData.duration)} mins
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Eye size={13} /> {videoData.viewsCount || 0} views
                    </span>
                    <span className="text-slate-500">
                        Resolution: {videoData.width}x{videoData.height} ({videoData.format || 'mp4'})
                    </span>
                </div>
                {videoData.user_id && (
                    <span className="text-[11px] bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-md font-sans font-semibold">
                        Author: {videoData.user_id.name || videoData.user_id.username}
                    </span>
                )}
            </div>
        </div>
    );
}