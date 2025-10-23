import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, LogOut, Edit3, Shield } from 'lucide-react';

const ProfileModal: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const containerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    overflowY: 'auto' as const,
    minHeight: '100vh',
  };

  const modalStyle = {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(51, 65, 85, 0.3)',
    borderRadius: '20px',
    padding: window.innerWidth < 768 ? '24px' : '40px',
    maxWidth: '500px',
    width: '100%',
    margin: '20px auto',
    position: 'relative' as const,
    maxHeight: '80vh',
    overflowY: 'auto' as const,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  };

  const closeButtonStyle = {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    background: 'rgba(51, 65, 85, 0.6)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'all 0.3s ease',
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '32px',
  };

  const avatarStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    margin: '0 auto 16px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: 'white',
    fontWeight: 'bold',
  };

  const nameStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
  };

  const emailStyle = {
    fontSize: '1rem',
    color: '#94a3b8',
    marginBottom: '8px',
  };

  const roleStyle = {
    fontSize: '0.875rem',
    color: '#3b82f6',
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '4px 12px',
    borderRadius: '20px',
    display: 'inline-block',
  };

  const sectionStyle = {
    marginBottom: '24px',
  };

  const sectionTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'white',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const inputGroupStyle = {
    marginBottom: '16px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(51, 65, 85, 0.6)',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const buttonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginRight: '12px',
  };

  const logoutButtonStyle = {
    padding: '12px 24px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    color: '#fca5a5',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const handleSave = () => {
    // Profil güncelleme işlemi burada yapılacak
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new CustomEvent('closeProfileModal'));
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        style={modalStyle}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          style={closeButtonStyle}
          onClick={() => {
            window.dispatchEvent(new CustomEvent('closeProfileModal'));
          }}
        >
          ×
        </button>

        <div style={headerStyle}>
          <div style={avatarStyle}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 style={nameStyle}>{user?.name}</h2>
          <p style={emailStyle}>{user?.email}</p>
          <span style={roleStyle}>
            <Shield size={14} style={{ marginRight: '4px' }} />
            {user?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
          </span>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>
            <Settings size={20} />
            Hesap Bilgileri
          </h3>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Ad Soyad</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              disabled={!isEditing}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              disabled={!isEditing}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isEditing ? (
              <>
                <button style={buttonStyle} onClick={handleSave}>
                  <Edit3 size={16} />
                  Kaydet
                </button>
                <button
                  style={{
                    ...buttonStyle,
                    background: 'rgba(51, 65, 85, 0.6)',
                    color: '#94a3b8',
                  }}
                  onClick={() => setIsEditing(false)}
                >
                  İptal
                </button>
              </>
            ) : (
              <button
                style={buttonStyle}
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={16} />
                Düzenle
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center' as const }}>
          <button style={logoutButtonStyle} onClick={handleLogout}>
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileModal;
