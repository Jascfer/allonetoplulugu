import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Star, Clock, User, Search, Filter, BookOpen, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import ShareButton from './ShareButton';

interface Category {
  _id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface Note {
  _id: string;
  title: string;
  description: string;
  category: Category;
  googleDriveUrl: string;
  downloadUrl: string;
  downloadCount: number;
  viewCount: number;
  rating: number;
  tags: string[];
  subject?: string;
  semester?: string;
  year?: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

const NotesPage: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // Mobile detection - MUST be at top level before any early returns
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Mobile resize listener - MUST be at top level
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: { [key: string]: string } = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSubject) params.subject = selectedSubject;
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sortBy = sortBy;
      // Limit'i artır ki tüm notlar görünsün
      params.limit = '100';
      params.page = '1';

      console.log('Loading notes with params:', params); // Debug log
      const response = await apiService.getNotes(params);
      console.log('Notes API Response:', response); // Debug log
      
      // Backend response format: { success: true, data: { notes: [...], total: ... } }
      let notesData = [];
      if (response) {
        if (response.success && response.data && Array.isArray(response.data.notes)) {
          notesData = response.data.notes;
        } else if (response.data && Array.isArray(response.data.notes)) {
          notesData = response.data.notes;
        } else if (Array.isArray(response.data)) {
          notesData = response.data;
        } else if (Array.isArray(response)) {
          notesData = response;
        }
      }
      
      console.log('Parsed notes:', notesData, 'Count:', notesData.length); // Debug log
      
      // Notların yapısını kontrol et
      if (notesData.length > 0) {
        console.log('First note structure:', notesData[0]);
      }
      
      setNotes(notesData);
      
      // Eğer not yoksa bilgi ver
      if (notesData.length === 0) {
        console.warn('No notes found. Check if notes exist in database and are approved (isApproved: true).');
      } else {
        console.log('✅ Notes loaded successfully!', notesData.length, 'notes');
      }
    } catch (error: any) {
      console.error('Load notes error:', error);
      setError(error.message || 'Notlar yüklenirken bir hata oluştu');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubject, searchTerm, sortBy]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data || []);
    } catch (error: any) {
      console.error('Categories load error:', error);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    // Authentication durumu değiştiğinde veya sayfa ilk yüklendiğinde notları yükle
    // Auth loading tamamlandıktan sonra notları yükle
    // Notlar public endpoint olduğu için authentication gerekmiyor
    if (!authLoading) {
      console.log('Loading notes - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading);
      loadNotes();
    }
  }, [isAuthenticated, authLoading, loadNotes]);

  // Listen for login success event - reload notes immediately after login
  useEffect(() => {
    const handleUserLoggedIn = () => {
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        loadNotes();
      }, 300);
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, [loadNotes]);

  // Auth loading durumunda bekleyelim
  if (authLoading) {
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
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(34, 197, 94, 0.3)',
            borderTop: '4px solid #22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#94a3b8' }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

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
    padding: isMobile ? '100px 10px 20px 10px' : '80px 20px 20px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
    color: 'white',
    minHeight: 'calc(100vh - 80px)',
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: isMobile ? '40px 20px' : '60px 30px',
    borderRadius: '16px',
    marginBottom: isMobile ? '20px' : '40px',
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
    top: isMobile ? '10px' : '20px',
    left: isMobile ? '10px' : '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: isMobile ? '8px 12px' : '10px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    zIndex: 2,
  };

  const searchContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: isMobile ? '20px 15px' : '30px',
    marginBottom: isMobile ? '20px' : '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: isMobile ? '12px 16px' : '16px 20px',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    fontSize: isMobile ? '14px' : '16px',
    marginBottom: '15px',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    outline: 'none',
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
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: isMobile ? '20px' : '30px',
    marginTop: isMobile ? '20px' : '30px',
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
            Üniversite öğrencileri için hazırlanmış kaliteli notları keşfedin. Aradığınız ders, konu veya dönem notlarını kolayca bulun.
          </motion.p>

          <motion.div
            style={statsContainerStyle}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6, staggerChildren: 0.1 }}
          >
            <motion.div style={statCardStyle} whileHover={{ scale: isMobile ? 1 : 1.05 }} whileTap={{ scale: 0.95 }}>
              <h3 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '700', color: '#22c55e' }}>10K+</h3>
              <p style={{ color: '#cbd5e1', fontSize: isMobile ? '0.9rem' : '1rem' }}>Not</p>
            </motion.div>
            <motion.div style={statCardStyle} whileHover={{ scale: isMobile ? 1 : 1.05 }} whileTap={{ scale: 0.95 }}>
              <h3 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '700', color: '#3b82f6' }}>5K+</h3>
              <p style={{ color: '#cbd5e1', fontSize: isMobile ? '0.9rem' : '1rem' }}>Öğrenci</p>
            </motion.div>
            <motion.div style={statCardStyle} whileHover={{ scale: isMobile ? 1 : 1.05 }} whileTap={{ scale: 0.95 }}>
              <h3 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '700', color: '#f97316' }}>50+</h3>
              <p style={{ color: '#cbd5e1', fontSize: isMobile ? '0.9rem' : '1rem' }}>Ders</p>
            </motion.div>
            <motion.div style={statCardStyle} whileHover={{ scale: isMobile ? 1 : 1.05 }} whileTap={{ scale: 0.95 }}>
              <h3 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '700', color: '#ef4444' }}>100%</h3>
              <p style={{ color: '#cbd5e1', fontSize: isMobile ? '0.9rem' : '1rem' }}>Ücretsiz</p>
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
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap', 
          gap: '15px', 
          alignItems: 'stretch', 
          marginBottom: '20px' 
        }}>
          <div style={{ 
            flexGrow: 1, 
            minWidth: isMobile ? '100%' : '300px', 
            position: 'relative' 
          }}>
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
              style={{ 
                ...inputStyle, 
                paddingLeft: '50px',
                marginBottom: isMobile ? '10px' : '15px'
              }}
            />
          </div>
          <motion.button
            style={{
              ...filterButtonStyle,
              width: isMobile ? '100%' : 'auto',
              padding: isMobile ? '12px 20px' : '14px 28px',
              fontSize: isMobile ? '14px' : '16px',
            }}
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={isMobile ? 18 : 20} /> Filtreler
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
          style={{ textAlign: 'center', padding: isMobile ? '40px 20px' : '60px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ 
            fontSize: isMobile ? '16px' : '18px', 
            color: '#cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(34, 197, 94, 0.3)',
              borderTop: '4px solid #22c55e',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            Notlar yükleniyor...
          </div>
        </motion.div>
      ) : (
        <>
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '8px', 
              marginBottom: '20px',
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              Debug: Loading={loading.toString()}, Notes Count={notes.length}, 
              Auth={isAuthenticated ? 'Yes' : 'No'}, 
              AuthLoading={authLoading.toString()}
            </div>
          )}
          {notes.length === 0 ? (
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
              <BookOpen size={isMobile ? 40 : 48} style={{ color: '#64748b', marginBottom: '20px' }} />
              <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.8rem', color: '#cbd5e1', marginBottom: '15px', padding: isMobile ? '0 10px' : '0' }}>
                {searchTerm || selectedCategory || selectedSubject 
                  ? 'Arama kriterlerinize uygun not bulunamadı' 
                  : 'Henüz not eklenmemiş'
                }
              </h3>
              <p style={{ color: '#94a3b8', fontSize: isMobile ? '0.95rem' : '1.1rem', padding: isMobile ? '0 10px' : '0' }}>
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
                    <span>📁 </span>
                    <span>{typeof note.category === 'object' && note.category?.name ? note.category.name : (typeof note.category === 'string' ? note.category : 'Kategori Yok')}</span>
                  </span>
                  {(note.semester || note.year) && (
                    <span style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ade80',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      <span>🎓 </span>
                      <span>{note.semester && note.year ? `${note.semester} - ${note.year}` : note.semester || note.year}</span>
                    </span>
                  )}
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
                    <span>{note.viewCount || 0}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Download size={14} style={statIconStyle} />
                    <span>{note.downloadCount || 0}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Star size={14} style={statIconStyle} />
                    <span>{(note.rating || 0).toFixed(1)}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={14} style={statIconStyle} />
                    <span>{typeof note.author === 'object' && note.author?.name ? note.author.name : (typeof note.author === 'string' ? note.author : 'Bilinmeyen')}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} style={statIconStyle} />
                    <span>{new Date(note.createdAt).toLocaleDateString('tr-TR')}</span>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <ShareButton
                  noteId={note._id}
                  noteTitle={note.title}
                  noteUrl={`${window.location.origin}/notes/${note._id}`}
                />
                <motion.button
                  style={downloadButtonStyle}
                  onClick={() => handleDownload(note._id, note.googleDriveUrl || note.downloadUrl)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={16} />
                  İndir
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default NotesPage;
