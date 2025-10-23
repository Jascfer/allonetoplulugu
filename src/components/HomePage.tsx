import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Star, Clock, User, Search, BookOpen, TrendingUp } from 'lucide-react';
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

const HomePage: React.FC = () => {
  const [popularNotes, setPopularNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadPopularNotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/api/notes?sort=popular&limit=6');
      setPopularNotes(response.data.notes || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPopularNotes();
  }, [loadPopularNotes]);

  const handleDownload = async (noteId: string, googleDriveUrl: string) => {
    try {
      await apiService.request(`/api/notes/${noteId}/download`, {
        method: 'PUT'
      });
      
      window.open(googleDriveUrl, '_blank');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: '#0f172a',
    minHeight: '100vh'
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    color: 'white',
    padding: '80px 40px',
    borderRadius: '20px',
    marginBottom: '60px',
    textAlign: 'center' as const,
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const heroOverlayStyle = {
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
    border: '1px solid rgba(255,255,255,0.2)',
    maxWidth: '800px',
    margin: '0 auto 40px auto'
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
    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
    marginRight: '15px',
    marginBottom: '15px'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#64748b',
    color: 'white',
    boxShadow: '0 8px 25px rgba(100, 116, 139, 0.3)'
  };

  const notesSectionStyle = {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '40px',
    marginBottom: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const noteCardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
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
    height: '3px',
    background: 'linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6)'
  };

  const downloadButtonStyle = {
    padding: '12px 24px',
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
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
  };

  const tagStyle = {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
    marginRight: '6px',
    marginBottom: '6px',
    display: 'inline-block',
    border: '1px solid #bae6fd'
  };

  const statsStyle = {
    display: 'flex',
    gap: '20px',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '12px',
    flexWrap: 'wrap' as const
  };

  const statItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px'
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroStyle}>
        <div style={heroOverlayStyle}></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '56px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            All One Topluluğu
          </h1>
          <p style={{ 
            margin: '0 0 40px 0', 
            fontSize: '22px',
            opacity: 0.9,
            fontWeight: '400'
          }}>
            Türkiye'nin en büyük not paylaşım platformu
          </p>
          
          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '50px',
            marginTop: '40px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#22c55e' }}>10K+</div>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>Not</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#22c55e' }}>5K+</div>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>Öğrenci</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#22c55e' }}>50+</div>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>Ders</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#22c55e' }}>100%</div>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>Ücretsiz</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Section */}
      <div style={searchContainerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 10px 0' }}>
            Ders, konu veya sınıf ara...
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', margin: '0' }}>
            Binlerce kaliteli not arasından aradığını bulun
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Ders, konu veya sınıf ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button style={buttonStyle}>
            <Search size={18} />
            Ara →
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button style={buttonStyle}>
            <BookOpen size={18} />
            Notları Keşfet →
          </button>
          <button style={secondaryButtonStyle}>
            <TrendingUp size={18} />
            Günün Sorusu
          </button>
        </div>
      </div>

      {/* Popular Notes Section */}
      <div style={notesSectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            color: 'white', 
            margin: '0 0 16px 0' 
          }}>
            En Çok İndirilen Notlar
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(255,255,255,0.8)', 
            margin: '0' 
          }}>
            Öğrencilerin en çok tercih ettiği kaliteli notlar
          </p>
        </div>

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)' }}>Notlar yükleniyor...</div>
          </div>
        ) : popularNotes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>📚</div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px', color: 'white' }}>
              Henüz not eklenmemiş
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>
              Yakında kaliteli notlar eklenecek!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '25px'
          }}>
            {popularNotes.map((note, index) => (
              <motion.div
                key={note._id}
                style={noteCardStyle}
                whileHover={{ 
                  boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                  transform: 'translateY(-3px)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div style={noteCardOverlayStyle}></div>
                
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    color: '#1e293b',
                    fontSize: '18px',
                    fontWeight: '700',
                    lineHeight: '1.3'
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
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginRight: '6px'
                    }}>
                      📁 {note.category.name}
                    </span>
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      🎓 {note.category.grade}. Sınıf
                    </span>
                  </div>

                  {note.tags.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      {note.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} style={tagStyle}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={statsStyle}>
                    <span style={statItemStyle}>
                      <Eye size={12} />
                      {note.viewCount}
                    </span>
                    <span style={statItemStyle}>
                      <Download size={12} />
                      {note.downloadCount}
                    </span>
                    <span style={statItemStyle}>
                      <Star size={12} />
                      {note.rating.toFixed(1)}
                    </span>
                    <span style={statItemStyle}>
                      <User size={12} />
                      {note.author.name}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button
                    style={downloadButtonStyle}
                    onClick={() => handleDownload(note._id, note.googleDriveUrl)}
                  >
                    <Download size={14} />
                    İndir
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            style={{
              ...buttonStyle,
              padding: '16px 40px',
              fontSize: '18px'
            }}
            onClick={() => window.location.href = '/notes'}
          >
            <BookOpen size={20} />
            Tüm Notları Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
