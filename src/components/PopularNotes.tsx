import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface Category {
  _id: string;
  name: string;
  description: string;
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

const PopularNotes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const handleViewAllNotes = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('openAuthModal'));
    }
  };

  useEffect(() => {
    const loadPopularNotes = async () => {
      try {
        const response = await apiService.getNotes({ sortBy: 'popular', limit: '6' });
        setNotes(response.data.notes || []);
      } catch (error) {
        console.error('Popular notes load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularNotes();
  }, []);

  const handleDownload = async (noteId: string, googleDriveUrl: string) => {
    try {
      await apiService.downloadNote(noteId);
      window.open(googleDriveUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const containerStyle = {
    padding: '80px 20px 20px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
    color: 'white',
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '50px',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '15px',
    background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#cbd5e1',
    marginBottom: '30px',
  };

  const viewAllButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(34, 197, 94, 0.3)',
      transform: 'translateY(-2px)',
    },
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginBottom: '40px',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(5px)',
    borderRadius: '16px',
    padding: '25px',
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

  const cardHeaderStyle = {
    marginBottom: '15px',
  };

  const cardTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
    lineHeight: '1.3',
  };

  const cardDescriptionStyle = {
    fontSize: '14px',
    color: '#cbd5e1',
    lineHeight: '1.5',
    marginBottom: '12px',
  };

  const categoryTagStyle = {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    color: '#60a5fa',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    marginBottom: '12px',
  };

  const statsStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '12px',
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '15px',
  };

  const statItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const statIconStyle = {
    color: '#22c55e',
  };

  const downloadButtonStyle = {
    padding: '10px 16px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)',
    '&:hover': {
      backgroundColor: '#16a34a',
      boxShadow: '0 6px 15px rgba(34, 197, 94, 0.4)',
    },
  };

  const emptyStateStyle = {
    textAlign: 'center' as const,
    padding: '60px 20px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  const emptyTitleStyle = {
    fontSize: '1.5rem',
    color: '#cbd5e1',
    marginBottom: '10px',
  };

  const emptySubtitleStyle = {
    color: '#94a3b8',
    fontSize: '1rem',
  };

  return (
    <motion.section
      style={containerStyle}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <motion.div
        style={headerStyle}
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 style={titleStyle}>
          <TrendingUp size={32} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          En Çok İndirilen Notlar
        </h2>
        <p style={subtitleStyle}>
          Öğrenciler tarafından en çok tercih edilen kaliteli notlar
        </p>
        <Link 
          to="/notes" 
          style={viewAllButtonStyle}
          onClick={handleViewAllNotes}
        >
          Tüm Notları Görüntüle
          <ArrowRight size={18} />
        </Link>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '18px', color: '#cbd5e1' }}>Popüler notlar yükleniyor...</div>
        </div>
      ) : notes.length === 0 ? (
        <motion.div
          style={emptyStateStyle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 style={emptyTitleStyle}>Henüz not bulunmuyor</h3>
          <p style={emptySubtitleStyle}>Yakında kaliteli notlar eklenecek!</p>
        </motion.div>
      ) : (
        <motion.div
          style={gridStyle}
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          viewport={{ once: true }}
        >
          {notes.map((note) => (
            <motion.div
              key={note._id}
              style={cardStyle}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
              transition={{ duration: 0.3 }}
            >
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>{note.title}</h3>
                <p style={cardDescriptionStyle}>{note.description}</p>
                
                <span style={categoryTagStyle}>
                  📁 {note.category.name}
                </span>
              </div>

              <div style={statsStyle}>
                <span style={statItemStyle}>
                  <Eye size={12} style={statIconStyle} />
                  {note.viewCount}
                </span>
                <span style={statItemStyle}>
                  <Download size={12} style={statIconStyle} />
                  {note.downloadCount}
                </span>
                <span style={statItemStyle}>
                  <Star size={12} style={statIconStyle} />
                  {note.rating.toFixed(1)}
                </span>
              </div>

              <motion.button
                style={downloadButtonStyle}
                onClick={() => handleDownload(note._id, note.googleDriveUrl)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={14} />
                İndir
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
};

export default PopularNotes;
