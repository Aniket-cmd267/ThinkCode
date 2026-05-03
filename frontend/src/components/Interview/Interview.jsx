import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import axiosClient from '../../utils/axiosClient'; // Using your existing client

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const uploadResume = async () => {
    if (!file) return;
    setStatus('uploading');
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      // Endpoint we will create in the backend
      const { data } = await axiosClient.post('/interview/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      console.log("Extracted Text:", data);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-[#120505] border border-[#EF4444]/20 rounded-3xl p-10 text-center shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
         <span className="text-[#EF4444]">Upload Resume</span>
        </h2>
        {/* <p className="text-slate-500 text-sm mb-8 font-mono">Upload your PDF to begin the AI briefing.</p> */}

        <label 
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center cursor-pointer transition-all
            ${file ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 hover:border-[#EF4444]/40 bg-black/20'}`}
        >
          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="text-emerald-500 w-12 h-12" />
              <span className="text-emerald-400 font-bold">{file.name}</span>
            </div>
          ) : (
            <>
              <Upload className="text-[#EF4444]/50 w-12 h-12 mb-4" />
              <span className="text-slate-400">Drag & Drop or Click to Upload Resume</span>
            </>
          )}
        </label>

        {file && status !== 'success' && (
          <button 
            onClick={uploadResume}
            disabled={status === 'uploading'}
            className="mt-8 w-full bg-[#EF4444] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#EF4444]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {status === 'uploading' ? 'Analyzing Resume...' : 'Analyze & Store'}
          </button>
        )}

        {status === 'success' && (
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-500 font-bold">
            <CheckCircle size={20} /> Resume Processed Successfully
          </div>
        )}
      </div>
    </div>
  );
}