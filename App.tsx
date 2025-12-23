
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import ViewerPage from './pages/ViewerPage';
import { Photo, AppSettings } from './types';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    title: '2024 全球科技创新峰会 - 精彩瞬间',
    bannerUrl: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=1600&q=80'
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem('event_photos');
    const savedSettings = localStorage.getItem('event_settings');
    
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch (e) {
        console.error('Failed to parse photos', e);
      }
    }
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('event_photos', JSON.stringify(photos));
    } catch (e) {
      console.warn('存储空间已满：照片数量过多，部分照片可能无法持久化。', e);
      // 如果溢出，只保留最近的 50 张以尝试拯救持久化
      if (photos.length > 50) {
        try {
          localStorage.setItem('event_photos', JSON.stringify(photos.slice(0, 50)));
        } catch (e2) {}
      }
    }
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem('event_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  const addPhotos = useCallback((newPhotos: Photo[]) => {
    setPhotos(prev => [...newPhotos, ...prev].sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const deletePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <nav className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center text-sm sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold tracking-tight text-blue-400">峰会云摄影系统</Link>
            <div className="hidden md:flex gap-4 border-l border-slate-700 pl-6">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors">观众直播页</Link>
              <Link to="/admin" className="text-slate-300 hover:text-white transition-colors">管理工作台</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-slate-500 text-xs hidden sm:inline">V2.0 商务版</span>
             <Link to="/admin" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs font-medium transition-all">后台入口</Link>
          </div>
        </nav>

        <Routes>
          <Route 
            path="/" 
            element={
              <ViewerPage 
                photos={photos} 
                settings={settings} 
              />
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminPage 
                photos={photos} 
                settings={settings} 
                onAddPhotos={addPhotos} 
                onUpdateSettings={updateSettings}
                onDeletePhoto={deletePhoto}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
