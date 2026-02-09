"use client";

import React, { useEffect, useState } from "react";
import Waveform from "./Waveform";

interface RecordingViewProps {
  onStop: () => void;
  onPause: () => void;
  isPaused: boolean;
  transcriptPreview: string;
  duration: number; // in seconds
}

const RecordingView: React.FC<RecordingViewProps> = ({
  onStop,
  onPause,
  isPaused,
  transcriptPreview,
  duration,
}) => {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark transition-colors duration-500 min-h-screen flex flex-col">
       <style>{`
        .waveform-gradient {
            background: linear-gradient(90deg, #0d7ff2 0%, #8b5cf6 50%, #2dd4bf 100%);
        }
        .active-glow {
            box-shadow: 0 0 20px 2px rgba(13, 127, 242, 0.2);
        }
        .soft-pulse {
            background: radial-gradient(circle at center, rgba(13, 127, 242, 0.05) 0%, transparent 70%);
        }
    `}</style>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Soft Background Pulse Effect */}
        <div className="absolute inset-0 soft-pulse pointer-events-none"></div>
        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-24">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 bg-primary rounded-full text-white shadow-lg">
                <span className="material-symbols-outlined text-2xl">graphic_eq</span>
              </div>
              <h1 className="text-[#0d141c] dark:text-white text-xl font-bold tracking-tight">Voice Record</h1>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-8">
                <a className="text-[#0d141c]/60 dark:text-white/60 text-sm font-medium hover:text-primary transition-colors" href="#">Recordings</a>
                <a className="text-[#0d141c]/60 dark:text-white/60 text-sm font-medium hover:text-primary transition-colors" href="#">Library</a>
              </nav>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-white/50 dark:bg-white/5 backdrop-blur-md opacity-60 hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-[#0d141c] dark:text-white">KR</span>
                <span className="text-sm font-medium text-[#0d141c] dark:text-white">Korean</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-800 shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuABNo5Wbghj70CzPtEjNowUiJEwDi-acaTCNM-qMXICNBe2--yzcwNo208mTVhIdIJJP6_JmgcmgtsRhCGkZQg_mOzkepqQXUyFrGUJUwz1WRPWXMFvmamaVTt8Gu3vGuRatCPnaig_vxIn8fBjFBec96MtvAFZi1aYLmZ2F8L1M0gQKmCNLLwygt2BKoZaFSn1-qqLRzSHLUHd-gOEKkZ0UQfGZLvEOgI8pkizrV-ACvWF1f_IMPad5H5Xe1g-gge50ndgpGRR7H8")'}}></div>
            </div>
          </header>

          {/* Main Recording Area */}
          <main className="flex flex-1 flex-col items-center justify-center px-4">
            {/* Status & Timer Section */}
            <div className="flex flex-col items-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-red-500/10 dark:bg-red-500/20 px-4 py-1.5 rounded-full border border-red-500/20">
                <span className={`size-2 rounded-full bg-red-500 ${!isPaused ? 'animate-pulse' : ''}`}></span>
                <span className="text-xs font-bold text-red-500 tracking-widest uppercase">{isPaused ? 'Paused' : 'Recording'}</span>
              </div>
              <div className="text-7xl md:text-9xl font-light tracking-tighter text-[#0d141c] dark:text-white tabular-nums">
                {formatTime(duration)}<span className="text-4xl md:text-5xl text-primary/40">.00</span>
              </div>
              <p className="text-sm font-medium text-[#0d141c]/40 dark:text-white/30 tracking-wide mt-2 italic h-6 text-center max-w-lg truncate px-4">
                {transcriptPreview || "Generating live transcription..."}
              </p>
            </div>

            {/* Waveform Visualization */}
            <div id="waveform-container" className="w-full max-w-4xl h-48 flex items-center justify-center px-8 overflow-hidden">
                <Waveform isPaused={isPaused} />
            </div>

            {/* Controls */}
            <div className="mt-16 mb-20 flex items-center gap-12">
              <button
                onClick={onPause}
                className="group flex flex-col items-center gap-2"
              >
                <div className="size-14 flex items-center justify-center rounded-full bg-white dark:bg-white/5 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-[#0d141c] dark:text-white text-2xl group-hover:text-primary transition-colors">
                    {isPaused ? 'resume' : 'pause'}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0d141c]/40 dark:text-white/40">
                    {isPaused ? 'Resume' : 'Pause'}
                </span>
              </button>

              {/* Main Stop Button */}
              <button onClick={onStop} className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative size-24 flex items-center justify-center rounded-full bg-primary text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>stop</span>
                </div>
              </button>

              <button className="group flex flex-col items-center gap-2">
                <div className="size-14 flex items-center justify-center rounded-full bg-white dark:bg-white/5 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-[#0d141c] dark:text-white text-2xl group-hover:text-primary transition-colors">bookmark</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0d141c]/40 dark:text-white/40">Mark</span>
              </button>
            </div>

            {/* Settings / Device Hint */}
            <div className="flex items-center gap-3 px-6 py-3 bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-full border border-white/50 dark:border-white/10 mb-8">
              <span className="material-symbols-outlined text-primary text-xl">mic</span>
              <span className="text-sm font-medium text-[#0d141c]/60 dark:text-white/60">Built-in Microphone — Level: Optimal</span>
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-primary rounded-full"></div>
              </div>
            </div>
          </main>

          {/* Bottom Navigation Bar (Hidden or Minimal in active record) */}
          <footer className="px-6 py-8 flex justify-center">
            <div className="flex items-center gap-10">
              <div className="flex flex-col items-center gap-1 group cursor-pointer opacity-30">
                <span className="material-symbols-outlined text-[#0d141c] dark:text-white">settings</span>
              </div>
              <div className="flex flex-col items-center gap-1 group cursor-pointer opacity-30">
                <span className="material-symbols-outlined text-[#0d141c] dark:text-white">cloud_upload</span>
              </div>
              <div className="flex flex-col items-center gap-1 group cursor-pointer opacity-30">
                <span className="material-symbols-outlined text-[#0d141c] dark:text-white">help_outline</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default RecordingView;
