
export interface Photo {
  id: string;
  url: string;
  timestamp: number;
  width: number;
  height: number;
  name: string;
}

export interface AppSettings {
  title: string;
  bannerUrl: string;
}

export type AppView = 'uploader' | 'viewer';
