import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import ProfileModal from './auth/ProfileModal';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleCloseAuthModal = () => setShowAuthModal(false);
    const handleCloseProfileModal = () => setShowProfileModal(false);
    
    window.addEventListener('closeAuthModal', handleCloseAuthModal);
    window.addEventListener('closeProfileModal', handleCloseProfileModal);
    
    return () => {
      window.removeEventListener('closeAuthModal', handleCloseAuthModal);
      window.removeEventListener('closeProfileModal', handleCloseProfileModal);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setShowProfileModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const headerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(51, 65, 85, 0.3)',
    padding: '16px 0',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
  };

  const navLinkStyle = (isActive: boolean) => ({
    color: isActive ? '#22c55e' : '#e2e8f0',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    position: 'relative' as const,
    transition: 'color 0.3s ease',
    cursor: 'pointer',
  });

  const authButtonStyle = {
    background: isAuthenticated 
      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
      : 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    padding: isMobile ? '10px 16px' : '12px 24px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    fontSize: isMobile ? '13px' : '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: isAuthenticated 
      ? '0 4px 15px rgba(59, 130, 246, 0.3)' 
      : '0 4px 15px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s ease',
    minWidth: isMobile ? 'auto' : '120px',
    justifyContent: 'center',
  };

  const mobileMenuButtonStyle = {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '8px',
  };

  return (
    <motion.header 
      style={headerStyle}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div style={containerStyle}>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Logo />
        </motion.div>

        {/* Desktop Navigation */}
        <nav style={{ ...navStyle, display: !isMobile ? 'flex' : 'none' }}>
          <motion.span
            style={navLinkStyle(activeSection === 'notes')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('notes')}
          >
            Notlar
          </motion.span>
          <motion.span
            style={navLinkStyle(activeSection === 'daily-questions')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('daily-questions')}
          >
            Günlük Sorular
          </motion.span>
          <motion.span
            style={navLinkStyle(activeSection === 'community')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('community')}
          >
            Topluluk
          </motion.span>
        </nav>

        {/* Desktop Auth Button */}
        <motion.button 
          style={{ ...authButtonStyle, display: !isMobile ? 'flex' : 'none' }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: isAuthenticated 
              ? '0 6px 20px rgba(59, 130, 246, 0.4)' 
              : '0 6px 20px rgba(34, 197, 94, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAuthClick}
        >
          <User size={16} />
          <span>{isAuthenticated ? (user?.name?.length > 10 ? user.name.substring(0, 10) + '...' : user?.name) : 'Giriş Yap'}</span>
        </motion.button>

        {/* Mobile Menu Button */}
        <motion.button
          style={{ ...mobileMenuButtonStyle, display: isMobile ? 'block' : 'none' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(51, 65, 85, 0.3)',
            padding: '24px',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span 
              style={{ ...navLinkStyle(activeSection === 'notes'), padding: '12px 0' }}
              onClick={() => {
                scrollToSection('notes');
                setIsMobileMenuOpen(false);
              }}
            >
              Notlar
            </span>
            <span 
              style={{ ...navLinkStyle(activeSection === 'daily-questions'), padding: '12px 0' }}
              onClick={() => {
                scrollToSection('daily-questions');
                setIsMobileMenuOpen(false);
              }}
            >
              Günlük Sorular
            </span>
            <span 
              style={{ ...navLinkStyle(activeSection === 'community'), padding: '12px 0' }}
              onClick={() => {
                scrollToSection('community');
                setIsMobileMenuOpen(false);
              }}
            >
              Topluluk
            </span>
            <button 
              style={{ ...authButtonStyle, width: '100%', justifyContent: 'center', marginTop: '8px' }}
              onClick={handleAuthClick}
            >
              <User size={16} />
              <span>{isAuthenticated ? user?.name : 'Giriş Yap'}</span>
            </button>
          </nav>
        </motion.div>
      )}

      {/* Auth Modal */}
      {showAuthModal && <AuthModal />}

      {/* Profile Modal */}
      {showProfileModal && <ProfileModal />}
    </motion.header>
  );
};

export default Header;