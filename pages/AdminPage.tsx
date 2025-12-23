
import React, { useState } from 'react';
import Header from '../components/Header';
import { Photo, AppSettings } from '../types';

interface AdminPageProps {
  photos: Photo[];
  settings: AppSettings;
  onAddPhotos: (newPhotos: Photo[]) => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onDeletePhoto: (id: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  photos, 
  settings, 
  onAddPhotos, 
  onUpdateSettings,
  onDeletePhoto
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // 辅助函数：压缩图片
  const compressImage = (file: File): Promise<Photo> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxSide = 1600;

          if (width > maxSide || height > maxSide) {
            if (width > height) {
              height = Math.round((height * maxSide) / width);
              width = maxSide;
            } else {
              width = Math.round((width * maxSide) / height);
              height = maxSide;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve({
            id: Math.random().toString(36).substring(2, 11),
            url: compressedDataUrl,
            timestamp: Date.now(),
            width: width,
            height: height,
            name: file.name
          });
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newPhotos: Photo[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i]);
        // 稍微拉开一点时间差
        compressed.timestamp -= (i * 10);
        newPhotos.push(compressed);
      }
      onAddPhotos(newPhotos);
    } catch (err) {
      console.error("上传失败", err);
      alert("部分图片处理失败，请重试。");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const viewerUrl = `${window.location.origin}${window.location.pathname}#/`;

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">摄影管理工作台</h1>
          <p className="text-sm text-slate-500">在此管理活动信息与即时照片上传</p>
        </div>
        <a 
          href={viewerUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          预览前端展示页
        </a>
      </div>

      <main className="max-w-6xl mx-auto w-full p-6 space-y-8">
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-700">1. 活动配置 (标题与主题图)</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">活动直播标题</label>
                  <input 
                    type="text"
                    value={settings.title}
                    onChange={(e) => onUpdateSettings({ title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-semibold"
                    placeholder="输入活动标题..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">更新活动封面</label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => document.getElementById('banner-upload')?.click()}
                      className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900 transition-colors"
                    >
                      选择封面图片
                    </button>
                    <span className="text-xs text-slate-400">建议尺寸: 1600x600px</span>
                    <input 
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => onUpdateSettings({ bannerUrl: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="relative group rounded-lg overflow-hidden h-40 border border-slate-200 shadow-inner bg-slate-100">
                <img src={settings.bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold px-3 py-1 bg-black/50 rounded-full">当前封面预览</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-700">2. 照片上传 (支持即时拍摄与批量)</h2>
          </div>
          <div className="p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 m-6 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all group">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <p className="text-slate-600 font-medium">拖拽或点击下方按钮上传</p>
            <p className="text-xs text-slate-400 mt-1 mb-6">支持 JPG, PNG, WEBP</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => document.getElementById('camera-upload')?.click()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                disabled={isUploading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {isUploading ? '处理中...' : '手机/相机即时拍摄'}
              </button>
              <button 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-800 text-slate-800 px-8 py-3 rounded-full font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                disabled={isUploading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                {isUploading ? '处理中...' : '批量选择本地照片'}
              </button>
            </div>
            
            <input id="camera-upload" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
            <input id="file-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-700">3. 照片管理 ({photos.length})</h2>
            <div className="flex gap-2 text-xs font-bold">
               {photos.length > 50 && <span className="text-orange-500">存储已接近上限</span>}
            </div>
          </div>
          
          <div className="p-6">
            {isUploading && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg animate-pulse">
                <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-bold">正在压缩并处理照片... 请稍候</span>
              </div>
            )}
            
            {photos.length === 0 && !isUploading ? (
              <div className="text-center py-12">
                <p className="text-slate-400">目前还没有照片，请从上方区域开始上传</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {photos.map(photo => (
                  <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 hover:ring-2 hover:ring-blue-500 transition-all">
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button 
                        onClick={() => onDeletePhoto(photo.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                        title="删除"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                      <span className="text-[10px] text-white/80">{new Date(photo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 max-w-lg w-[90%] md:w-auto">
        <div className="flex-1">
          <p className="text-xs font-bold text-blue-400 uppercase">微信扫码/复制链接分享</p>
          <p className="text-sm truncate max-w-[200px] text-slate-300">{viewerUrl}</p>
        </div>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(viewerUrl);
            alert('直播间链接已复制，可粘贴至微信分享');
          }}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap"
        >
          复制链接
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
