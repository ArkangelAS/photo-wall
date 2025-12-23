
import React, { useState } from 'react';
import Header from '../components/Header';
import { Photo, AppSettings } from '../types';

interface UploaderPageProps {
  photos: Photo[];
  settings: AppSettings;
  onAddPhotos: (newPhotos: Photo[]) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onDeletePhoto: (id: string) => void;
}

const UploaderPage: React.FC<UploaderPageProps> = ({ 
  photos, 
  settings, 
  onAddPhotos, 
  onUpdateSettings,
  onDeletePhoto
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      const promise = new Promise<void>((resolve) => {
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            newPhotos.push({
              id: Math.random().toString(36).substr(2, 9),
              url: reader.result as string,
              timestamp: Date.now() - (i * 1000), // Stagger times slightly for demo
              width: img.width,
              height: img.height,
              name: file.name
            });
            resolve();
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
      await promise;
    }

    onAddPhotos(newPhotos);
    setIsUploading(false);
    e.target.value = ''; // Reset input
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}#/view`;

  return (
    <div className="flex-1 flex flex-col pb-20">
      <Header 
        settings={settings} 
        editable={true} 
        onUpdateTitle={(title) => onUpdateSettings({ title })}
        onUpdateBanner={(bannerUrl) => onUpdateSettings({ bannerUrl })}
      />

      <main className="max-w-6xl mx-auto w-full p-4 md:p-8 space-y-8">
        {/* Upload Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-800">工作台</h2>
            <p className="text-slate-500 text-sm">在这里上传拍摄的照片，系统将自动同步至直播页</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => document.getElementById('camera-upload')?.click()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              即时拍摄
            </button>
            <button 
              onClick={() => document.getElementById('file-upload')?.click()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              批量上传
            </button>
            
            <input 
              id="camera-upload" 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>
            <div>
              <p className="font-bold text-slate-800">分享直播间</p>
              <p className="text-sm text-slate-500">将链接分享至微信群，参会者可实时观看</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input 
              readOnly 
              value={shareUrl} 
              className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded text-xs text-slate-600 outline-none min-w-[200px]"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert('链接已复制到剪贴板');
              }}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-4 py-2 rounded font-medium text-sm transition-colors"
            >
              复制
            </button>
          </div>
        </div>

        {/* Photo Management Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">管理照片 ({photos.length})</h3>
            <span className="text-xs text-slate-400">最新上传优先显示</span>
          </div>

          {isUploading && (
            <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-dashed border-blue-300">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-600 font-medium">照片正在上传处理中...</p>
              </div>
            </div>
          )}

          {photos.length === 0 && !isUploading ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400">暂无照片，请开始拍摄或上传</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => onDeletePhoto(photo.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform"
                      title="删除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/40 text-[10px] text-white">
                    {new Date(photo.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploaderPage;
