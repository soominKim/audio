"use client";

import React, { useState } from "react";
import { RecordingSession } from "../types/recording";

interface ResultViewProps {
  transcript: string;
  duration: string;
  onNewRecording: () => void;
  language: string;
  history: RecordingSession[];
}

const ResultView: React.FC<ResultViewProps> = ({
  transcript,
  duration,
  onNewRecording,
  language,
  history,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return formatDate(dateString);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display transition-colors duration-300 flex flex-col items-center">
      <style>{`
        .apple-shadow {
            box-shadow: 0 10px 50px -12px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="w-full max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px]">mic</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Voice Record</h1>
        </div>

        {/* Language Toggle */}
        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-full flex items-center">
          <button className="px-6 py-2 rounded-full text-sm font-semibold bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white transition-all">
              {language === 'ko-KR' ? '한국어' : 'English (US)'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDy_XdT_X78lUSJ6ci246VyQQi-8fwNPbZubF9x0C-p73ec50V_odmNiiyb5jf5jgoHuDdYBmZ7Bq9hOOAJAD4b7kFMz91iQImHhIMOnRv48qRWJPOCwrIRkUBLioixill9ngVYXZzrsjPmpO2ax0ylPvkBz8KFexEg_bUbQXgFXDeVDxsojD1W_wL0xmb7S589UbYd0f_7jiyB1GNl_2cJ2mnUqIaUm-eOnb9avCCxarnKnpT7LgfvJLEbabMUMXu2QYwi0pppk30")'}}></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto px-6 pt-4 pb-20 flex flex-col items-center w-full">
        {/* Status Badge */}
        <div className="mb-8 flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span className="text-xs font-bold uppercase tracking-widest">Transcription Complete</span>
        </div>

        {/* Hero Transcription Card */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-xl apple-shadow p-12 md:p-20 relative overflow-hidden">
          {/* Decorative Gradient Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-start w-full">
            <p className="text-[28px] md:text-[40px] font-extrabold leading-[1.2] text-slate-900 dark:text-white tracking-tight break-words w-full whitespace-pre-wrap">
                {transcript || "No speech detected."}
            </p>
          </div>

          {/* Meta Data */}
          <div className="mt-12 flex items-center gap-6 text-slate-400 dark:text-slate-500 font-medium text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">timer</span>
              <span>{duration} Record Duration</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleCopy}
            className="group flex items-center gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-4 rounded-full apple-shadow transition-all border border-slate-100 dark:border-slate-800 cursor-pointer"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 rounded-full transition-all">
              <span className={`material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:text-primary`}>
                {copied ? 'check' : 'content_copy'}
              </span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button className="group flex items-center gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-4 rounded-full apple-shadow transition-all border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 rounded-full transition-all">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:text-primary">share</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Share Result</span>
          </button>

          <button
            onClick={onNewRecording}
            className="group flex items-center gap-3 bg-primary hover:bg-blue-600 px-8 py-4 rounded-full apple-shadow transition-all text-white cursor-pointer"
          >
            <div className="p-2 bg-white/20 rounded-full">
              <span className="material-symbols-outlined text-white">add</span>
            </div>
            <span className="font-bold">New Recording</span>
          </button>
        </div>

        {/* History Preview */}
        <div className="mt-24 w-full border-t border-slate-200 dark:border-slate-800 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Recordings</h3>
            <a className="text-primary font-semibold text-sm hover:underline" href="#">View All History</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.length === 0 ? (
                <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2">history</span>
                    <p>No recent recordings found</p>
                </div>
            ) : (
                history.map((session) => (
                    <div key={session.id} className="bg-white dark:bg-slate-900 p-6 rounded-lg apple-shadow border border-slate-50 dark:border-slate-800 flex flex-col gap-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">description</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">{formatTimeAgo(session.date)}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {session.transcript ? session.transcript.substring(0, 30) + (session.transcript.length > 30 ? '...' : '') : 'Untitled Recording'}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                            {session.transcript || "No content"}
                        </p>
                        <div className="mt-2 text-xs text-slate-400 font-medium">
                            {formatDuration(session.duration)} • {session.language === 'ko-KR' ? 'Korean' : 'English'}
                        </div>
                      </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 flex flex-col items-center gap-6 text-slate-400 dark:text-slate-500 text-sm">
        <div className="flex items-center gap-8">
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
        </div>
        <div className="flex items-center gap-2">
          <span>© 2023 Voice Record AI</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Crafted for high performance</span>
        </div>
      </footer>
    </div>
  );
};

export default ResultView;
