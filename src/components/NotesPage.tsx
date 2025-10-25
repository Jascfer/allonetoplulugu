import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Star, Clock, User, Search, Filter, BookOpen, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubject) params.append('subject', selectedSubject);
      if (selectedGrade) params.append('grade', selectedGrade);
      if (searchTerm) params.append('search', searchTerm);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await apiService.getNotes(Object.fromEntries(params));
      setNotes(response.data.notes || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubject, selectedGrade, searchTerm, sortBy]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data || []);
    } catch (error: any) {
      console.error('Categories load error:', error);
    }
  }, []);

  useEffect(() => {
    loadNotes();
    loadCategories();
  }, [loadNotes, loadCategories]);

  // Authentication kontrolü - giriş yapmamış kullanıcıları ana sayfaya yönlendir
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            maxWidth: '500px',
            padding: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Lock size={64} style={{ color: '#ef4444', marginBottom: '20px' }} />
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '15px',
            background: 'linear-gradient(90deg, #ef4444, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Giriş Gerekli
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Notları görüntülemek için lütfen önce giriş yapın. Bu sayede tüm notlara erişebilir ve indirebilirsiniz.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/"
              style={{
                padding: '12px 24px',
                backgroundColor: '#22c55e',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ArrowLeft size={18} />
              Ana Sayfaya Dön
            </Link>
            <button
              onClick={() => {
                // Auth modal'ı açmak için custom event gönder
                window.dispatchEvent(new CustomEvent('openAuthModal'));
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <User size={18} />
              Giriş Yap
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleDownload = async (noteId: string, googleDriveUrl: string) => {
    try {
      await apiService.downloadNote(noteId);
      window.open(googleDriveUrl, '_blank');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const containerStyle = {
    padding: '80px 20px 20px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
    color: 'white',
    minHeight: 'calc(100vh - 80px)',
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '60px 30px',
    borderRadius: '16px',
    marginBottom: '40px',
    textAlign: 'center' as const,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  const headerOverlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at top left, rgba(34,197,94,0.2) 0%, transparent 50%), radial-gradient(circle at bottom right, rgba(59,130,246,0.2) 0%, transparent 50%)',
    zIndex: 0,
  };

  const headerContentStyle = {
    position: 'relative' as const,
    zIndex: 1,
  };

  const backButtonStyle = {
    position: 'absolute' as const,
    top: '20px',
    left: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    zIndex: 2,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
    },
  };

  const searchContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    fontSize: '16px',
    marginBottom: '15px',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    '::placeholder': {
      color: '#cbd5e1',
    },
    '&:focus': {
      borderColor: '#22c55e',
      outline: 'none',
    },
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: '15px',
    width: 'auto',
    minWidth: '180px',
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23cbd5e1' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px center',
    backgroundSize: '18px',
  };

  const optionStyle = {
    backgroundColor: '#1e293b',
    color: 'white',
  };

  const filterButtonStyle = {
    padding: '14px 28px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    flexShrink: 0,
  };

  const noteCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(5px)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    },
  };

  const tagStyle = {
    backgroundColor: 'rgba(34,197,94,0.2)',
    color: '#22c55e',
    padding: '4px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    marginRight: '8px',
    marginBottom: '8px',
    display: 'inline-block',
  };

  const statIconStyle = {
    color: '#22c55e',
    marginRight: '5px',
  };

  const downloadButtonStyle = {
    padding: '12px 20px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)',
    marginTop: '20px',
    '&:hover': {
      backgroundColor: '#16a34a',
      boxShadow: '0 6px 15px rgba(34, 197, 94, 0.4)',
    },
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
    marginTop: '30px',
  };

  const statsContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap' as const,
    gap: '20px',
    marginTop: '40px',
    marginBottom: '40px',
  };

  const statCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    padding: '20px 30px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    minWidth: '180px',
  };

  const filterOptionsStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '15px',
    marginTop: '20px',
    justifyContent: 'center',
  };

  const filterOptionGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    minWidth: '180px',
  };

  const filterLabelStyle = {
    fontSize: '14px',
    color: '#cbd5e1',
    marginBottom: '5px',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        style={headerStyle}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div style={headerOverlayStyle}></div>
        <div style={headerContentStyle}>
          <Link to="/" style={backButtonStyle}>
            <ArrowLeft size={16} />
            Ana Sayfaya Dön
          </Link>
          
          <motion.h1
            style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '15px',
              background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            📚 Tüm Notlar
          </motion.h1>
          <motion.p
            style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto' }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Öğrenciler için hazırlanmış kaliteli notları keşfedin. Aradığınız ders, konu veya sınıf notlarını kolayca bulun.
          </motion.p>

          <motion.div
            style={statsContainerStyle}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6, staggerChildren: 0.1 }}
          >
            <motion.div style={statCardStyle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#22c55e' }}>10K+</h3>
              <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Not</p>
            </motion.div>
            <motion.div style={statCardStyle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6' }}>5K+</h3>
              <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Öğrenci</p>
            </motion.div>
            <motion.div style={statCardStyle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f97316' }}>50+</h3>
              <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Ders</p>
            </motion.div>
            <motion.div style={statCardStyle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ef4444' }}>100%</h3>
              <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Ücretsiz</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={searchContainerStyle}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ flexGrow: 1, minWidth: '300px', position: 'relative' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '15px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#cbd5e1' 
              }} 
            />
            <input
              type="text"
              placeholder="Not ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '50px' }}
            />
          </div>
          <motion.button
            style={filterButtonStyle}
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={20} /> Filtreler
          </motion.button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="newest" style={optionStyle}>En Yeni</option>
            <option value="popular" style={optionStyle}>Popüler</option>
            <option value="top" style={optionStyle}>En İyi</option>
          </select>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={filterOptionsStyle}>
              <div style={filterOptionGroupStyle}>
                <label style={filterLabelStyle}>Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={selectStyle}
                >
                  <option value="" style={optionStyle}>Tüm Kategoriler</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id} style={optionStyle}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div style={filterOptionGroupStyle}>
                <label style={filterLabelStyle}>Ders</label>
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
              </div>
              <div style={filterOptionGroupStyle}>
                <label style={filterLabelStyle}>Sınıf</label>
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
            </div>
          </motion.div>
        )}

        <div style={{ fontSize: '14px', color: '#cbd5e1', textAlign: 'center', marginTop: '15px' }}>
          {notes.length} not bulundu
        </div>
      </motion.div>

      {error && (
        <motion.div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            backdropFilter: 'blur(5px)',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <motion.div
          style={{ textAlign: 'center', padding: '60px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '18px', color: '#cbd5e1' }}>Notlar yükleniyor...</div>
        </motion.div>
      ) : notes.length === 0 ? (
        <motion.div
          style={{
            textAlign: 'center',
            padding: '50px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen size={48} style={{ color: '#64748b', marginBottom: '20px' }} />
          <h3 style={{ fontSize: '1.8rem', color: '#cbd5e1', marginBottom: '15px' }}>
            {searchTerm || selectedCategory || selectedSubject || selectedGrade 
              ? 'Arama kriterlerinize uygun not bulunamadı' 
              : 'Henüz not eklenmemiş'
            }
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            Filtreleri değiştirmeyi veya daha genel bir arama yapmayı deneyin.
          </p>
        </motion.div>
      ) : (
        <motion.div
          style={gridContainerStyle}
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {notes.map(note => (
            <motion.div
              key={note._id}
              style={noteCardStyle}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  lineHeight: '1.3'
                }}>
                  {note.title}
                </h3>
                
                <p style={{ 
                  margin: '0 0 15px 0', 
                  color: '#cbd5e1', 
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  {note.description}
                </p>

                <div style={{ marginBottom: '15px' }}>
                  <span style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginRight: '8px'
                  }}>
                    📁 {note.category.name}
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    🎓 {note.category.grade}. Sınıf
                  </span>
                </div>

                {note.tags.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    {note.tags.map((tag, index) => (
                      <span key={index} style={tagStyle}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: '15px', 
                  fontSize: '13px', 
                  color: '#94a3b8',
                  marginBottom: '20px'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Eye size={14} style={statIconStyle} />
                    {note.viewCount}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Download size={14} style={statIconStyle} />
                    {note.downloadCount}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Star size={14} style={statIconStyle} />
                    {note.rating.toFixed(1)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={14} style={statIconStyle} />
                    {note.author.name}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} style={statIconStyle} />
                    {new Date(note.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              <motion.button
                style={downloadButtonStyle}
                onClick={() => handleDownload(note._id, note.googleDriveUrl)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                İndir
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default NotesPage;
