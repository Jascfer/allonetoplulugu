import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Lock, Save, Eye, EyeOff, Settings, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

interface ProfileModalProps {
  show: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ show, onClose }) => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'activity'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.updateProfile(profileForm);
      updateUser(response.data.user);
      setSuccess('Profil başarıyla güncellendi!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      setIsLoading(false);
      return;
    }

    try {
      await apiService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setSuccess('Şifre başarıyla değiştirildi!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const modalStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: show ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  };

  const modalContentStyle = {
    backgroundColor: '#1e293b',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    position: 'relative' as const,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const headerStyle = {
    padding: '25px 30px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
    color: isActive ? 'white' : '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      backgroundColor: isActive ? '#16a34a' : 'rgba(255, 255, 255, 0.2)',
    },
  });

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '15px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '16px',
    backdropFilter: 'blur(10px)',
    '&::placeholder': {
      color: '#94a3b8',
    },
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#22c55e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#16a34a',
      transform: 'translateY(-2px)',
    },
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',
    color: 'white',
    '&:hover': {
      backgroundColor: '#dc2626',
      transform: 'translateY(-2px)',
    },
  };

  if (!show) return null;

  return (
    <div style={modalStyle}>
      <motion.div
        style={modalContentStyle}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#22c55e', margin: 0 }}>
              Profil Yönetimi
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '5px 0 0 0' }}>
              Hesap bilgilerinizi yönetin
            </p>
          </div>
          <motion.button
            style={{ ...buttonStyle, backgroundColor: 'transparent', color: '#94a3b8', padding: '8px' }}
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Tabs */}
        <div style={{ padding: '20px 30px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <motion.button
            style={tabStyle(activeTab === 'profile')}
            onClick={() => setActiveTab('profile')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={18} />
            Profil
          </motion.button>
          <motion.button
            style={tabStyle(activeTab === 'password')}
            onClick={() => setActiveTab('password')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lock size={18} />
            Şifre
          </motion.button>
          <motion.button
            style={tabStyle(activeTab === 'activity')}
            onClick={() => setActiveTab('activity')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={18} />
            Aktivite
          </motion.button>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid #22c55e',
                color: '#22c55e',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              {success}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                  Ad Soyad
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Adınızı girin"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '45px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                  E-posta
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    placeholder="E-posta adresinizi girin"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '45px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <motion.button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  İptal
                </motion.button>
                <motion.button
                  type="submit"
                  style={primaryButtonStyle}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save size={18} />
                  {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </motion.button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                  Mevcut Şifre
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="Mevcut şifrenizi girin"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '45px', paddingRight: '45px' }}
                    required
                  />
                  <motion.button
                    type="button"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                  Yeni Şifre
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Yeni şifrenizi girin"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '45px', paddingRight: '45px' }}
                    required
                  />
                  <motion.button
                    type="button"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                  Şifre Onayı
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Yeni şifrenizi tekrar girin"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '45px', paddingRight: '45px' }}
                    required
                  />
                  <motion.button
                    type="button"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <motion.button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  İptal
                </motion.button>
                <motion.button
                  type="submit"
                  style={primaryButtonStyle}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save size={18} />
                  {isLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </motion.button>
              </div>
            </form>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Settings size={64} style={{ color: '#94a3b8', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#cbd5e1', marginBottom: '10px' }}>
                  Aktivite Geçmişi
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Yakında kullanıcı aktivitelerinizi burada görebileceksiniz.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 30px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={user?.avatar}
              alt={user?.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                {user?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
              </div>
            </div>
          </div>
          <motion.button
            style={dangerButtonStyle}
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Çıkış Yap
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;