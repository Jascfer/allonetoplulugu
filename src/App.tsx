import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import DailyQuestion from './components/DailyQuestion';
import RecentNotes from './components/RecentNotes';
import NotesDisplay from './components/NotesDisplay';
import AdminPanel from './components/AdminPanel';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const appStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    color: 'white',
    position: 'relative' as const,
  };

  const footerStyle = {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(51, 65, 85, 0.3)',
    padding: '60px 24px 40px 24px',
    marginTop: '80px',
  };

  const footerContainerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    textAlign: 'center' as const,
  };

  const footerContentStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  };

  const footerSectionStyle = {
    textAlign: 'left' as const,
  };

  const footerTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '20px',
  };

  const footerLinkStyle = {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'block',
    marginBottom: '12px',
    transition: 'color 0.3s ease',
  };

  const footerTextStyle = {
    color: '#64748b',
    margin: 0,
    fontSize: '14px',
    fontWeight: '500',
  };

  const socialLinksStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '20px',
  };

  const socialLinkStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(51, 65, 85, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <AuthProvider>
      <div style={appStyle}>
        <Header />
        <main>
          <Hero />
          <div id="notes">
            <NotesDisplay />
          </div>
          
          <div id="admin">
            <AdminPanel />
          </div>
          
          <div id="daily-questions">
            <DailyQuestion />
          </div>
          
          <div id="community">
            <RecentNotes />
          </div>
        </main>
        
        {/* Footer */}
        <motion.footer 
          style={footerStyle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div style={footerContainerStyle}>
            <div style={footerContentStyle}>
              <div style={footerSectionStyle}>
                <h3 style={footerTitleStyle}>All One Topluluğu</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                  Türkiye'nin en büyük not paylaşım platformu. Öğrencilerin başarısı için tasarlandı.
                </p>
                <div style={socialLinksStyle}>
                  <a href="https://facebook.com" style={socialLinkStyle}>📘</a>
                  <a href="https://instagram.com" style={socialLinkStyle}>📷</a>
                  <a href="https://twitter.com" style={socialLinkStyle}>🐦</a>
                  <a href="https://youtube.com" style={socialLinkStyle}>📺</a>
                </div>
              </div>

              <div style={footerSectionStyle}>
                <h3 style={footerTitleStyle}>Dersler</h3>
                <a href="/matematik" style={footerLinkStyle}>Matematik</a>
                <a href="/fizik" style={footerLinkStyle}>Fizik</a>
                <a href="/kimya" style={footerLinkStyle}>Kimya</a>
                <a href="/biyoloji" style={footerLinkStyle}>Biyoloji</a>
                <a href="/turkce" style={footerLinkStyle}>Türkçe</a>
              </div>

              <div style={footerSectionStyle}>
                <h3 style={footerTitleStyle}>Kaynaklar</h3>
                <a href="/upload" style={footerLinkStyle}>Not Yükle</a>
                <a href="/daily-questions" style={footerLinkStyle}>Günlük Sorular</a>
                <a href="/community" style={footerLinkStyle}>Topluluk</a>
                <a href="/help" style={footerLinkStyle}>Yardım</a>
                <a href="/contact" style={footerLinkStyle}>İletişim</a>
              </div>

              <div style={footerSectionStyle}>
                <h3 style={footerTitleStyle}>Destek</h3>
                <a href="/faq" style={footerLinkStyle}>SSS</a>
                <a href="/terms" style={footerLinkStyle}>Kullanım Şartları</a>
                <a href="/privacy" style={footerLinkStyle}>Gizlilik Politikası</a>
                <a href="/cookies" style={footerLinkStyle}>Çerez Politikası</a>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid rgba(51, 65, 85, 0.3)',
              paddingTop: '20px',
              textAlign: 'center'
            }}>
              <p style={footerTextStyle}>
                © 2024 All One Topluluğu. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </AuthProvider>
  );
}

export default App;