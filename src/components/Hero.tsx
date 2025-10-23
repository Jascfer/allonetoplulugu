import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Search functionality - can be expanded later
    if (searchQuery.trim()) {
      alert(`"${searchQuery}" için arama yapılıyor...`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    position: 'relative' as const,
    overflow: 'hidden',
    paddingTop: '120px',
    display: 'flex',
    alignItems: 'center',
  };

  const backgroundPatternStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)
    `,
    zIndex: 1,
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    position: 'relative' as const,
    zIndex: 2,
    textAlign: 'center' as const,
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '50px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#22c55e',
    marginBottom: '32px',
  };

  const titleStyle = {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #22c55e 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '24px',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  };

  const subtitleStyle = {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
    color: '#94a3b8',
    marginBottom: '48px',
    maxWidth: '800px',
    margin: '0 auto 48px auto',
    lineHeight: '1.6',
    fontWeight: '400',
  };

  const searchContainerStyle = {
    maxWidth: '600px',
    margin: '0 auto 40px auto',
    position: 'relative' as const,
  };

  const searchBarStyle = {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '4px',
    border: '1px solid rgba(51, 65, 85, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  };

  const inputStyle = {
    flex: 1,
    background: 'transparent',
    color: 'white',
    padding: '16px 20px',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    fontWeight: '500',
  };

  const searchButtonStyle = {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s ease',
  };

  const actionButtonsStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40px',
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    padding: '20px 40px',
    borderRadius: '16px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '18px',
    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s ease',
  };

  const secondaryButtonStyle = {
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(20px)',
    color: 'white',
    padding: '20px 40px',
    borderRadius: '16px',
    border: '1px solid rgba(51, 65, 85, 0.3)',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '18px',
    transition: 'all 0.3s ease',
  };

  const statsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    marginTop: '80px',
    flexWrap: 'wrap' as const,
  };

  const statItemStyle = {
    textAlign: 'center' as const,
  };

  const statNumberStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#22c55e',
    marginBottom: '8px',
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: '#94a3b8',
    fontWeight: '500',
  };

  return (
    <section style={heroStyle}>
      <div style={backgroundPatternStyle}></div>
      
      <div style={containerStyle}>
        {/* Badge */}
        <motion.div 
          style={badgeStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Sparkles size={16} />
          <span>Türkiye'nin En Büyük Not Paylaşım Platformu</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          style={titleStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Paylaş, Öğren,<br />
          Birlikte Büyü
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          style={subtitleStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Binlerce öğrencinin katıldığı not kütüphanesi. Ders, konu ve sınıf seviyesine göre filtrele, anında indir, başarıya ulaş.
        </motion.p>

        {/* Search Bar */}
        <motion.div 
          style={searchContainerStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div style={searchBarStyle}>
            <Search size={20} color="#94a3b8" style={{ marginLeft: '20px' }} />
            <input
              type="text"
              placeholder="Ders, konu veya sınıf ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={inputStyle}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <motion.button
              onClick={handleSearch}
              style={searchButtonStyle}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Ara</span>
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          style={actionButtonsStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.button
            style={primaryButtonStyle}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 12px 40px rgba(34, 197, 94, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('notes')}
          >
            <BookOpen size={20} />
            <span>Notları Keşfet</span>
            <ArrowRight size={16} />
          </motion.button>
          
          <motion.button
            style={secondaryButtonStyle}
            whileHover={{ 
              scale: 1.05,
              background: 'rgba(30, 41, 59, 0.9)',
              borderColor: 'rgba(34, 197, 94, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('daily-questions')}
          >
            <Calendar size={20} />
            <span>Günün Sorusu</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          style={statsStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div style={statItemStyle}>
            <div style={statNumberStyle}>10K+</div>
            <div style={statLabelStyle}>Not</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>5K+</div>
            <div style={statLabelStyle}>Öğrenci</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>50+</div>
            <div style={statLabelStyle}>Ders</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>100%</div>
            <div style={statLabelStyle}>Ücretsiz</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;