import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleLogin = () => {
    // Login functionality - can be expanded later
    alert('Giriş yapma özelliği yakında eklenecek!');
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

  const loginButtonStyle = {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s ease',
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
        <nav style={{ ...navStyle, display: window.innerWidth >= 768 ? 'flex' : 'none' }}>
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

        {/* Desktop Login Button */}
        <motion.button 
          style={{ ...loginButtonStyle, display: window.innerWidth >= 768 ? 'flex' : 'none' }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
        >
          <User size={16} />
          <span>Giriş Yap</span>
        </motion.button>

        {/* Mobile Menu Button */}
        <motion.button
          style={{ ...mobileMenuButtonStyle, display: window.innerWidth < 768 ? 'block' : 'none' }}
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
              style={{ ...loginButtonStyle, width: '100%', justifyContent: 'center', marginTop: '8px' }}
              onClick={handleLogin}
            >
              <User size={16} />
              <span>Giriş Yap</span>
            </button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;