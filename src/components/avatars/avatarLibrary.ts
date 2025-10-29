// Hazır Avatar Kütüphanesi
export interface AvatarOption {
  id: string;
  url: string;
  category: 'academic' | 'modern' | 'minimal' | 'fun' | 'professional';
  name: string;
  color: string;
}

export const avatarLibrary: AvatarOption[] = [
  // Akademik Temalı
  {
    id: 'academic-1',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Academic1&backgroundColor=3b82f6',
    category: 'academic',
    name: 'Akademik 1',
    color: '#3b82f6'
  },
  {
    id: 'academic-2',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Academic2&backgroundColor=22c55e',
    category: 'academic',
    name: 'Akademik 2',
    color: '#22c55e'
  },
  {
    id: 'academic-3',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Academic3&backgroundColor=8b5cf6',
    category: 'academic',
    name: 'Akademik 3',
    color: '#8b5cf6'
  },
  {
    id: 'academic-4',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Academic4&backgroundColor=f59e0b',
    category: 'academic',
    name: 'Akademik 4',
    color: '#f59e0b'
  },
  
  // Modern Temalı
  {
    id: 'modern-1',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Modern1&backgroundColor=ef4444',
    category: 'modern',
    name: 'Modern 1',
    color: '#ef4444'
  },
  {
    id: 'modern-2',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Modern2&backgroundColor=06b6d4',
    category: 'modern',
    name: 'Modern 2',
    color: '#06b6d4'
  },
  {
    id: 'modern-3',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Modern3&backgroundColor=ec4899',
    category: 'modern',
    name: 'Modern 3',
    color: '#ec4899'
  },
  {
    id: 'modern-4',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Modern4&backgroundColor=14b8a6',
    category: 'modern',
    name: 'Modern 4',
    color: '#14b8a6'
  },
  
  // Minimal Temalı
  {
    id: 'minimal-1',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minimal1&backgroundColor=64748b',
    category: 'minimal',
    name: 'Minimal 1',
    color: '#64748b'
  },
  {
    id: 'minimal-2',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minimal2&backgroundColor=475569',
    category: 'minimal',
    name: 'Minimal 2',
    color: '#475569'
  },
  {
    id: 'minimal-3',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minimal3&backgroundColor=334155',
    category: 'minimal',
    name: 'Minimal 3',
    color: '#334155'
  },
  
  // Eğlenceli Temalı
  {
    id: 'fun-1',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fun1&backgroundColor=fbbf24',
    category: 'fun',
    name: 'Eğlenceli 1',
    color: '#fbbf24'
  },
  {
    id: 'fun-2',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fun2&backgroundColor=a855f7',
    category: 'fun',
    name: 'Eğlenceli 2',
    color: '#a855f7'
  },
  {
    id: 'fun-3',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fun3&backgroundColor=10b981',
    category: 'fun',
    name: 'Eğlenceli 3',
    color: '#10b981'
  },
  
  // Profesyonel Temalı
  {
    id: 'professional-1',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Professional1&backgroundColor=1e293b',
    category: 'professional',
    name: 'Profesyonel 1',
    color: '#1e293b'
  },
  {
    id: 'professional-2',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Professional2&backgroundColor=0f172a',
    category: 'professional',
    name: 'Profesyonel 2',
    color: '#0f172a'
  },
  {
    id: 'professional-3',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Professional3&backgroundColor=334155',
    category: 'professional',
    name: 'Profesyonel 3',
    color: '#334155'
  },
];

// Kategorilere göre avatar'ları grupla
export const avatarsByCategory = avatarLibrary.reduce((acc, avatar) => {
  if (!acc[avatar.category]) {
    acc[avatar.category] = [];
  }
  acc[avatar.category].push(avatar);
  return acc;
}, {} as Record<string, AvatarOption[]>);

// Kategori isimleri (Türkçe)
export const categoryNames: Record<string, string> = {
  academic: 'Akademik',
  modern: 'Modern',
  minimal: 'Minimal',
  fun: 'Eğlenceli',
  professional: 'Profesyonel'
};

