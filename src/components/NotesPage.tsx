import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Star, Clock, User, Search, Filter, Grid, List, SortAsc, SortDesc, BookOpen, TrendingUp, Award } from 'lucide-react';
import apiService from '../services/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  subject: string;
  grade: string;
}

interface Note {
  _id: string;
  title: string;
  description: string;
  category: Category;
  googleDriveUrl: string;
  downloadCount: number;
  viewCount: number;
  rating: number;
  tags: string[];
  author: {
    name: string;
  };
  createdAt: string;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'rating'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubject) params.append('subject', selectedSubject);
      if (selectedGrade) params.append('grade', selectedGrade);
      if (searchTerm) params.append('search', searchTerm);

      const response = await apiService.request(`/api/notes?${params.toString()}`);
      let fetchedNotes = response.data.notes || [];
      
      // Sort notes
      switch (sortBy) {
        case 'newest':
          fetchedNotes.sort((a: Note, b: Note) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'oldest':
          fetchedNotes.sort((a: Note, b: Note) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'popular':
          fetchedNotes.sort((a: Note, b: Note) => b.downloadCount - a.downloadCount);
          break;
        case 'rating':
          fetchedNotes.sort((a: Note, b: Note) => b.rating - a.rating);
          break;
      }
      
      setNotes(fetchedNotes);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubject, selectedGrade, searchTerm, sortBy]);

  const loadCategories = async () => {
    try {
      const response = await apiService.request('/api/categories');
      setCategories(response.data || []);
    } catch (error: any) {
      console.error('Categories load error:', error);
    }
  };

  useEffect(() => {
    loadNotes();
    loadCategories();
  }, [loadNotes]);

  const handleDownload = async (noteId: string, googleDriveUrl: string) => {
    try {
      await apiService.request(`/api/notes/${noteId}/download`, {
        method: 'PUT'
      });
      
      // Open Google Drive link in new tab
      window.open(googleDriveUrl, '_blank');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const filteredNotes = notes.filter(note => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.description.toLowerCase().includes(searchLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: '#0f172a',
    minHeight: '100vh'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    color: 'white',
    padding: '60px 40px',
    borderRadius: '20px',
    marginBottom: '40px',
    textAlign: 'center' as const,
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const headerOverlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none' as const
  };

  const searchContainerStyle = {
    backgroundColor: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.2)'
  };

  const inputStyle = {
    width: '100%',
    padding: '18px 24px',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    fontSize: '16px',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8fafc',
    outline: 'none'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white',
    marginRight: '15px',
    width: 'auto',
    minWidth: '200px',
    cursor: 'pointer'
  };

  const controlButtonStyle = {
    padding: '12px 20px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    marginRight: '10px',
    marginBottom: '10px'
  };

  const secondaryButtonStyle = {
    ...controlButtonStyle,
    backgroundColor: '#64748b',
    color: 'white'
  };

  const noteCardStyle = {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const noteCardOverlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6)'
  };

  const buttonStyle = {
    padding: '16px 32px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
  };

  const tagStyle = {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    marginRight: '8px',
    marginBottom: '8px',
    display: 'inline-block',
    border: '1px solid #bae6fd'
  };

  const statsStyle = {
    display: 'flex',
    gap: '25px',
    fontSize: '14px',
    color: '#64748b',
    marginTop: '15px',
    flexWrap: 'wrap' as const
  };

  const statItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px'
  };

  const emptyStateStyle = {
    textAlign: 'center' as const,
    padding: '80px 20px',
    color: '#64748b'
  };

  const emptyIconStyle = {
    fontSize: '64px',
    marginBottom: '20px',
    opacity: 0.5
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerOverlayStyle}></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '48px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Notlar
          </h1>
          <p style={{ 
            margin: '0 0 30px 0', 
            fontSize: '20px',
            opacity: 0.9,
            fontWeight: '400'
          }}>
            Öğrenciler için hazırlanmış kaliteli notlar
          </p>
          
          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>10K+</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Not</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>5K+</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Öğrenci</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>50+</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Ders</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>100%</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Ücretsiz</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div style={searchContainerStyle}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Not ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button
            style={controlButtonStyle}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtreler
          </button>
          <button
            style={secondaryButtonStyle}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
            {viewMode === 'grid' ? 'Liste' : 'Grid'}
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: '20px' }}
          >
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={selectStyle}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={selectStyle}
              >
                <option value="">Tüm Dersler</option>
                <option value="matematik">Matematik</option>
                <option value="fizik">Fizik</option>
                <option value="kimya">Kimya</option>
                <option value="biyoloji">Biyoloji</option>
                <option value="turkce">Türkçe</option>
                <option value="tarih">Tarih</option>
                <option value="cografya">Coğrafya</option>
                <option value="felsefe">Felsefe</option>
                <option value="edebiyat">Edebiyat</option>
              </select>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                style={selectStyle}
              >
                <option value="">Tüm Sınıflar</option>
                <option value="9">9. Sınıf</option>
                <option value="10">10. Sınıf</option>
                <option value="11">11. Sınıf</option>
                <option value="12">12. Sınıf</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: '#64748b', alignSelf: 'center' }}>Sırala:</span>
              <button
                style={sortBy === 'newest' ? controlButtonStyle : secondaryButtonStyle}
                onClick={() => setSortBy('newest')}
              >
                <Clock size={14} />
                En Yeni
              </button>
              <button
                style={sortBy === 'popular' ? controlButtonStyle : secondaryButtonStyle}
                onClick={() => setSortBy('popular')}
              >
                <TrendingUp size={14} />
                Popüler
              </button>
              <button
                style={sortBy === 'rating' ? controlButtonStyle : secondaryButtonStyle}
                onClick={() => setSortBy('rating')}
              >
                <Star size={14} />
                En İyi
              </button>
            </div>
          </motion.div>
        )}

        <div style={{ fontSize: '16px', color: '#64748b', fontWeight: '500' }}>
          {filteredNotes.length} not bulundu
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      {/* Notes Grid/List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <div style={{ fontSize: '20px', color: '#64748b' }}>Notlar yükleniyor...</div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>📚</div>
          <h3 style={{ fontSize: '24px', marginBottom: '12px', color: '#374151' }}>
            {searchTerm || selectedCategory || selectedSubject || selectedGrade 
              ? 'Arama kriterlerinize uygun not bulunamadı' 
              : 'Henüz not eklenmemiş'
            }
          </h3>
          <p style={{ fontSize: '16px', color: '#64748b' }}>
            {searchTerm || selectedCategory || selectedSubject || selectedGrade 
              ? 'Farklı arama terimleri deneyebilir veya filtreleri temizleyebilirsiniz.' 
              : 'Yakında kaliteli notlar eklenecek!'
            }
          </p>
        </div>
      ) : (
        <div style={{
          display: viewMode === 'grid' ? 'grid' : 'block',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(400px, 1fr))' : '1fr',
          gap: '30px'
        }}>
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note._id}
              style={noteCardStyle}
              whileHover={{ 
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                transform: 'translateY(-5px)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div style={noteCardOverlayStyle}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: '0 0 12px 0', 
                    color: '#1e293b',
                    fontSize: '22px',
                    fontWeight: '700',
                    lineHeight: '1.3'
                  }}>
                    {note.title}
                  </h3>
                  
                  <p style={{ 
                    margin: '0 0 16px 0', 
                    color: '#64748b', 
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}>
                    {note.description}
                  </p>

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginRight: '8px'
                    }}>
                      📁 {note.category.name}
                    </span>
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      🎓 {note.category.grade}. Sınıf
                    </span>
                  </div>

                  {note.tags.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      {note.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} style={tagStyle}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={statsStyle}>
                    <span style={statItemStyle}>
                      <Eye size={14} />
                      {note.viewCount} görüntüleme
                    </span>
                    <span style={statItemStyle}>
                      <Download size={14} />
                      {note.downloadCount} indirme
                    </span>
                    <span style={statItemStyle}>
                      <Star size={14} />
                      {note.rating.toFixed(1)} puan
                    </span>
                    <span style={statItemStyle}>
                      <User size={14} />
                      {note.author.name}
                    </span>
                    <span style={statItemStyle}>
                      <Clock size={14} />
                      {new Date(note.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>

                <div style={{ marginLeft: '20px' }}>
                  <button
                    style={buttonStyle}
                    onClick={() => handleDownload(note._id, note.googleDriveUrl)}
                  >
                    <Download size={18} />
                    İndir
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
