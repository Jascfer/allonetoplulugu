import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Star, Clock, User } from 'lucide-react';
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

const NotesDisplay: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubject) params.append('subject', selectedSubject);
      if (selectedGrade) params.append('grade', selectedGrade);
      if (searchTerm) params.append('search', searchTerm);

      const response = await apiService.request(`/api/notes?${params.toString()}`);
      setNotes(response.data.notes || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubject, selectedGrade, searchTerm]);

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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  };

  const headerStyle = {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    textAlign: 'center' as const
  };

  const searchContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '10px'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white',
    marginRight: '10px',
    width: 'auto',
    minWidth: '150px'
  };

  const noteCardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  };

  const tagStyle = {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    marginRight: '8px',
    marginBottom: '8px',
    display: 'inline-block'
  };

  const statsStyle = {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#64748b',
    marginTop: '12px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0', fontSize: '28px' }}>📚 Notlar</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.8 }}>
          Öğrenciler için hazırlanmış kaliteli notlar
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      <div style={searchContainerStyle}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Not ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>
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
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          {filteredNotes.length} not bulundu
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '18px', color: '#64748b' }}>Notlar yükleniyor...</div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '18px', color: '#64748b' }}>
            {searchTerm || selectedCategory || selectedSubject || selectedGrade 
              ? 'Arama kriterlerinize uygun not bulunamadı' 
              : 'Henüz not eklenmemiş'
            }
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredNotes.map(note => (
            <motion.div
              key={note._id}
              style={noteCardStyle}
              whileHover={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    color: '#1e293b',
                    fontSize: '20px',
                    fontWeight: '600'
                  }}>
                    {note.title}
                  </h3>
                  
                  <p style={{ 
                    margin: '0 0 12px 0', 
                    color: '#64748b', 
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {note.description}
                  </p>

                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      📁 {note.category.name}
                    </span>
                    <span style={{
                      backgroundColor: '#f0fdf4',
                      color: '#166534',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500',
                      marginLeft: '8px'
                    }}>
                      🎓 {note.category.grade}. Sınıf
                    </span>
                  </div>

                  {note.tags.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      {note.tags.map((tag, index) => (
                        <span key={index} style={tagStyle}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={statsStyle}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} />
                      {note.viewCount} görüntüleme
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Download size={14} />
                      {note.downloadCount} indirme
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} />
                      {note.rating.toFixed(1)} puan
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={14} />
                      {note.author.name}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                    <Download size={16} />
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

export default NotesDisplay;
