
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import { Photo, AppSettings } from '../types';

interface ViewerPageProps {
  photos: Photo[];
  settings: AppSettings;
}

const ViewerPage: React.FC<ViewerPageProps> = ({ photos, settings }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [columnCount, setColumnCount] = useState(2);

  // Responsive column count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setColumnCount(5);
      else if (window.innerWidth >= 1024) setColumnCount(4);
      else if (window.innerWidth >= 768) setColumnCount(3);
      else setColumnCount(2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Masonry layout logic
  const columns = useMemo(() => {
    const cols: Photo[][] = Array.from({ length: columnCount }, () => []);
    photos.forEach((photo, i) => {
      cols[i % columnCount].push(photo);
    });
    return cols;
  }, [photos, columnCount]);

  return (
    <div className="flex-1 bg-[#F1F3F5] overflow-x-hidden">
      {/* Visual Header */}
      <Header settings={settings} editable={false} />

      <main className="max-w-[1600px] mx-auto w-full px-3 md:px-6 py-8">
        {/* Real-time Status Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-300/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-600 font-bold text-sm tracking-widest">LIVE 云摄影直播中</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
              现场精彩瞬间
            </h2>
          </div>
          
          <div className="flex items-center gap-8 bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-white/80">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800 leading-none">{photos.length}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">张精彩照片</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800 leading-none">
                {photos.length > 0 ? new Date(photos[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </p>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">刚刚更新</p>
            </div>
          </div>
        </div>

        {/* Masonry Waterfall Grid */}
        <div className="masonry-grid">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="masonry-column" style={{ width: `${100 / columnCount}%` }}>
              {col.map((photo) => (
                <div 
                  key={photo.id} 
                  className="masonry-item group relative cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white border border-slate-200"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.name} 
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                  {/* Business Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold opacity-70">CAMERA LIVE</span>
                          <span className="text-xs font-black tracking-wider">
                            {new Date(photo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                       </div>
                       <button className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-blue-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-40">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-100 animate-pulse">
              <svg className="w-12 h-12 text-blue-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800">摄影师正在拍摄中</h2>
            <p className="text-slate-500 mt-3 font-medium">现场精彩照片将实时在此同步展示</p>
          </div>
        )}
      </main>

      {/* Modern Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-10"
            onClick={() => setSelectedPhoto(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <img 
            src={selectedPhoto.url} 
            alt={selectedPhoto.name} 
            className="max-w-full max-h-[75vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="mt-10 w-full max-w-2xl text-center px-4 space-y-4">
            <h3 className="text-white text-xl font-black tracking-tight">{settings.title}</h3>
            <div className="flex items-center justify-center gap-3 text-white/40 text-sm font-bold uppercase tracking-widest">
              <span>PHOTO ID: {selectedPhoto.id.toUpperCase()}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span>{new Date(selectedPhoto.timestamp).toLocaleString()}</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
               <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  分享这张照片
               </button>
               <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-3 rounded-full backdrop-blur-md transition-all flex items-center gap-2 active:scale-95">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  下载原图
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="mt-20 py-12 bg-white border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
            <div className="bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
              Cloud Photography Live
            </div>
            <p className="text-slate-400 text-sm font-medium">版权所有：新华社高校教育事业部LJY</p>
         </div>
      </footer>
    </div>
  );
};

export default ViewerPage;
