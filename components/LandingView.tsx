"use client";

import React, { useState } from "react";

interface LandingViewProps {
  onStartRecording: () => void;
  onLanguageChange: (lang: string) => void;
  language: string;
}

const LandingView: React.FC<LandingViewProps> = ({
  onStartRecording,
  onLanguageChange,
  language,
}) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300 subtle-mesh font-display">
      <style>{`
        .glass-effect {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .subtle-mesh {
          background-color: #f8fafc;
          background-image:
            radial-gradient(at 0% 0%, rgba(13, 127, 242, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(13, 127, 242, 0.05) 0px, transparent 50%);
        }
        .dark .subtle-mesh {
          background-color: #0f172a;
          background-image:
            radial-gradient(at 0% 0%, rgba(13, 127, 242, 0.1) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(13, 127, 242, 0.1) 0px, transparent 50%);
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between glass-effect bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-800/50 px-8 py-3 rounded-full shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined !text-[20px]">mic</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">VoiceRec</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Features</a>
            <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">How it works</a>
            <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold px-5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">Sign In</button>
            <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300/50 dark:border-slate-700/50">
              <img className="w-full h-full object-cover" alt="User profile avatar placeholder" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWOusGs-xEwCkGJUnhH1j4nR-7WxGNS_4e-P0D-45n-Mg3v6LFHH868YWLURqfTlPdTYgUpK2ftsRKnR0x4M6A3VvM_JXLgirX47CiFpqYOBbFozYNLNiZ1BRGjkQQnkyDFny-KM2Ugu4WWhw1gRS0mU68eQ9uCUUBbdLTxM18ZSPtdqP5TF7_4iPF1R5wmUwLp7oYR-U5HR7LI5ilr1DL6gCTxd3AE_zW_EOop4k3BmMoN6RDcjPfWNFInWGyU9o-qV6m8oPmdfg"/>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-2xl text-center space-y-12">
          {/* Typography Section */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Voice to AI <span className="text-primary">Transcription</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Instantly capture your thoughts and convert them into organized, searchable text using world-class AI.
            </p>
          </div>

          {/* Interaction Container */}
          <div className="flex flex-col items-center gap-8">
            {/* Language Selector Toggle */}
            <div className="bg-white/80 dark:bg-slate-800/80 p-1.5 rounded-full shadow-xl shadow-primary/5 flex items-center gap-1 border border-white dark:border-slate-700 glass-effect">
              <button
                onClick={() => onLanguageChange('ko-KR')}
                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${
                  language === 'ko-KR'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                한국어
              </button>
              <button
                onClick={() => onLanguageChange('en-US')}
                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${
                  language === 'en-US'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                English
              </button>
            </div>

            {/* Central Record Button */}
            <div className="relative group">
              {/* Outer Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all duration-500"></div>
              <button
                onClick={onStartRecording}
                className="relative flex items-center justify-center size-44 md:size-52 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl shadow-primary/40 transform transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
              >
                <span className="material-symbols-outlined !text-[64px] transition-transform duration-300">mic</span>
              </button>
            </div>

            {/* Status Feedback */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-emerald-500 rounded-full"></span>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ready to record</h2>
              </div>
              <p className="text-sm text-slate-400 dark:text-slate-500">Click the microphone to start your session</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Info Cards (Apple-inspired cards) */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-primary mb-4">
              <span className="material-symbols-outlined !text-[32px]">bolt</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Real-time Sync</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Your transcripts are synchronized across all your devices instantly as you speak.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-primary mb-4">
              <span className="material-symbols-outlined !text-[32px]">security</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Privacy First</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">End-to-end encryption ensures only you have access to your voice data and transcripts.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-primary mb-4">
              <span className="material-symbols-outlined !text-[32px]">auto_fix_high</span>
            </div>
            <h3 className="font-bold text-lg mb-2">AI Summary</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Automatically generate concise summaries and action items from every recording.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <span className="material-symbols-outlined !text-[20px]">mic</span>
            <span className="text-sm font-bold uppercase tracking-widest">VoiceRec</span>
          </div>
          <div className="flex gap-8">
            <a className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Support</a>
          </div>
          <p className="text-sm text-slate-400">© 2024 VoiceRec Inc.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
