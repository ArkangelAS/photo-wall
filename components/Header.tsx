
import React from 'react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  editable?: boolean;
  onUpdateTitle?: (title: string) => void;
  onUpdateBanner?: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({ settings, editable, onUpdateTitle, onUpdateBanner }) => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-slate-900">
      <img 
        src={settings.bannerUrl} 
        alt="Event Banner" 
        className="w-full h-full object-cover opacity-60 scale-105"
      />
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#F1F3F5]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>
      
      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="inline-block px-4 py-1.5 bg-blue-600/90 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.3em] rounded-sm mb-6 shadow-lg shadow-blue-900/20 backdrop-blur-sm">
            Event Live Stream
          </div>
          
          {editable ? (
            <div className="space-y-4 max-w-4xl">
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-1">正在修改直播标题:</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => onUpdateTitle?.(e.target.value)}
                className="bg-white/10 backdrop-blur-md text-white text-3xl md:text-5xl lg:text-6xl font-black border-none focus:ring-4 focus:ring-blue-500/30 outline-none w-full transition-all py-4 px-6 rounded-2xl"
                placeholder="点击输入会议标题..."
              />
            </div>
          ) : (
            <div className="max-w-5xl">
               <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight drop-shadow-2xl">
                 {settings.title}
               </h1>
               <div className="mt-8 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] font-bold uppercase">Activity Date</span>
                      <span className="text-white text-sm font-black uppercase tracking-wider">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-10 bg-white/10"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] font-bold uppercase">Venue Location</span>
                      <span className="text-white text-sm font-black uppercase tracking-wider">峰会中心 · 主会场</span>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
      
      {editable && (
        <div className="absolute bottom-8 right-8 z-20 flex gap-4">
           <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
              <span className="text-white/60 text-xs font-bold uppercase">管理视图专属编辑</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Header;
