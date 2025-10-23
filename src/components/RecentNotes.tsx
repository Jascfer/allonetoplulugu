import React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Star, Clock, User, ArrowRight } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  description: string;
  tags: string[];
  fileSize: string;
  author: string;
  rating: number;
  downloads: number;
  date: string;
  subject: string;
  grade: string;
}

const RecentNotes: React.FC = () => {
  const notes: Note[] = [
    {
      id: 1,
      title: "Newtonun Hareket Yasaları",
      description: "Newtonun 3 hareket yasası ve detaylı örneklerle açıklamaları. Fizik dersinin temel konularından biri olan hareket yasalarını kapsamlı şekilde ele alan özet notlar.",
      tags: ["Fizik", "Sınıf 9"],
      fileSize: "1.8 MB",
      author: "Dr. Ahmet Yılmaz",
      rating: 4.8,
      downloads: 1247,
      date: "2 gün önce",
      subject: "Fizik",
      grade: "9. Sınıf"
    },
    {
      id: 2,
      title: "Türev Konusu Özet",
      description: "Türev kavramı, türev alma kuralları ve uygulamaları içeren kapsamlı özet notlar. Matematik dersinin en önemli konularından biri olan türev konusunu detaylı şekilde işleyen materyal.",
      tags: ["Matematik", "Sınıf 11"],
      fileSize: "2.5 MB",
      author: "Prof. Mehmet Kaya",
      rating: 4.9,
      downloads: 2156,
      date: "1 gün önce",
      subject: "Matematik",
      grade: "11. Sınıf"
    }
  ];

  const handleDownload = (noteId: number) => {
    console.log('Downloading note:', noteId);
    alert(`Not #${noteId} indiriliyor...`);
  };

  const handleViewAll = () => {
    console.log('Viewing all notes');
    alert('Tüm notları görüntüleme özelliği yakında eklenecek!');
  };

  const sectionStyle = {
    padding: '120px 24px',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    position: 'relative' as const,
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '60px',
    flexWrap: 'wrap' as const,
    gap: '20px',
  };

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    color: 'white',
    margin: 0,
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const viewAllStyle = {
    color: '#22c55e',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    background: 'rgba(34, 197, 94, 0.1)',
  };

  const notesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '32px',
  };

  const noteCardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(51, 65, 85, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px',
  };

  const noteTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
    lineHeight: '1.3',
  };

  const noteDescriptionStyle = {
    color: '#94a3b8',
    marginBottom: '20px',
    lineHeight: '1.6',
    fontSize: '15px',
  };

  const tagsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginBottom: '20px',
  };

  const tagStyle = {
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    color: '#e2e8f0',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid rgba(51, 65, 85, 0.3)',
  };

  const cardFooterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(51, 65, 85, 0.3)',
  };

  const metaInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: '#64748b',
  };

  const metaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const downloadButtonStyle = {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s ease',
  };

  const ratingStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '8px',
  };

  const ratingTextStyle = {
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '500',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <motion.h2 
            style={titleStyle}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Son Eklenen Notlar
          </motion.h2>
          
          <motion.button
            onClick={handleViewAll}
            style={viewAllStyle}
            whileHover={{ 
              scale: 1.05,
              background: 'rgba(34, 197, 94, 0.2)',
              borderColor: 'rgba(34, 197, 94, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={16} />
            <span>Tümünü Görüntüle</span>
            <ArrowRight size={14} />
          </motion.button>
        </div>

        <div style={notesGridStyle}>
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              style={noteCardStyle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.02,
                borderColor: 'rgba(34, 197, 94, 0.5)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={cardHeaderStyle}>
                <div>
                  <h3 style={noteTitleStyle}>{note.title}</h3>
                  <div style={ratingStyle}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        color={i < Math.floor(note.rating) ? "#fbbf24" : "#374151"}
                        fill={i < Math.floor(note.rating) ? "#fbbf24" : "none"}
                      />
                    ))}
                    <span style={ratingTextStyle}>({note.rating})</span>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '10px',
                  color: '#22c55e',
                  fontWeight: '600',
                }}>
                  {note.fileSize}
                </div>
              </div>
              
              <p style={noteDescriptionStyle}>{note.description}</p>
              
              <div style={tagsContainerStyle}>
                {note.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} style={tagStyle}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <div style={cardFooterStyle}>
                <div style={metaInfoStyle}>
                  <div style={metaItemStyle}>
                    <User size={12} />
                    <span>{note.author}</span>
                  </div>
                  <div style={metaItemStyle}>
                    <Clock size={12} />
                    <span>{note.date}</span>
                  </div>
                  <div style={metaItemStyle}>
                    <Download size={12} />
                    <span>{note.downloads}</span>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => handleDownload(note.id)}
                  style={downloadButtonStyle}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={16} />
                  <span>İndir</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentNotes;