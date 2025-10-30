import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Lock, Save, Eye, EyeOff, Settings, FileText, Upload, Camera, BarChart3, Download, Heart, MessageCircle, Award, TrendingUp, Shield, Smartphone, Monitor, Trash2, LogOut, GraduationCap, BookOpen, Building2, Palette, Edit, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import AvatarSelectionModal from '../avatars/AvatarSelectionModal';

interface ProfileModalProps {
  show: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ show, onClose }) => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'activity' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: (user as any)?.department || '',
    year: (user as any)?.year || '',
    studentNumber: (user as any)?.studentNumber || '',
    graduationYear: (user as any)?.graduationYear || '',
    biography: (user as any)?.biography || '',
    interests: (user as any)?.interests || [],
    privacy: {
      profileVisibility: (user as any)?.privacy?.profileVisibility || 'public',
      emailVisibility: (user as any)?.privacy?.emailVisibility || false,
      showActivity: (user as any)?.privacy?.showActivity !== undefined ? (user as any)?.privacy?.showActivity : true
    }
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır!');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Sadece resim dosyaları yüklenebilir!');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiService.uploadAvatar(formData);
      updateUser({ ...user!, avatar: response.data.avatar });
      setSuccess('Profil resmi başarıyla güncellendi!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Avatar URL'ini backend'e kaydet
      const response = await apiService.updateProfile({ avatar: avatarUrl });
      
      if (response.success && response.data?.user) {
        updateUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          avatar: response.data.user.avatar,
          role: response.data.user.role
        });
        setAvatarPreview(avatarUrl);
        setSuccess('Profil resmi başarıyla güncellendi!');
        
        // Success mesajını 3 saniye sonra temizle
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error: any) {
      setError(error.message || 'Profil resmi güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUploadClick = () => {
    setShowAvatarSelection(false);
    triggerFileInput();
  };

  const loadUserStats = async () => {
    try {
      setLoadingStats(true);
      const response = await apiService.getUserStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadSessions = async () => {
    try {
      setLoadingSessions(true);
      const response = await apiService.getSessions();
      setSessions(response.data || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await apiService.deleteSession(sessionId);
      setSessions(sessions.filter(s => s._id !== sessionId));
      setSuccess('Oturum başarıyla silindi!');
    } catch (error: any) {
      setError(error.message || 'Oturum silinirken bir hata oluştu');
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm('Tüm cihazlardan çıkış yapmak istediğinizden emin misiniz?')) {
      return;
    }
    try {
      await apiService.logoutAll();
      setSuccess('Tüm cihazlardan başarıyla çıkış yapıldı!');
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Çıkış yapılırken bir hata oluştu');
    }
  };

  useEffect(() => {
    if (show && activeTab === 'activity') {
      loadUserStats();
    }
    if (show && activeTab === 'security') {
      loadSessions();
    }
    // Update form when user data changes
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        department: (user as any)?.department || '',
        year: (user as any)?.year || '',
        studentNumber: (user as any)?.studentNumber || '',
        graduationYear: (user as any)?.graduationYear || '',
        biography: (user as any)?.biography || '',
        interests: (user as any)?.interests || [],
        privacy: {
          profileVisibility: (user as any)?.privacy?.profileVisibility || 'public',
          emailVisibility: (user as any)?.privacy?.emailVisibility || false,
          showActivity: (user as any)?.privacy?.showActivity !== undefined ? (user as any)?.privacy?.showActivity : true
        }
      });
    }
  }, [show, activeTab, user]);

  const modalStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: show ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    padding: '20px',
    boxSizing: 'border-box' as const,
  };

  const modalContentStyle = {
    backgroundColor: '#1e293b',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '600px',
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto' as const,
    position: 'relative' as const,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    margin: '0 auto',
  };

  const headerStyle = {
    padding: '20px 25px 15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky' as const,
    top: 0,
    backgroundColor: '#1e293b',
    zIndex: 10,
    borderRadius: '20px 20px 0 0',
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
    color: isActive ? 'white' : '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    minWidth: 'fit-content',
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
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',
    color: 'white',
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
        <div style={{ padding: '15px 20px 0', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
          <motion.button
            style={tabStyle(activeTab === 'security')}
            onClick={() => setActiveTab('security')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield size={18} />
            Güvenlik
          </motion.button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
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
              {/* Avatar Upload Section */}
              <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <div style={{ marginBottom: '15px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              margin: '0 auto',
              backgroundColor: avatarPreview || user?.avatar ? 'transparent' : '#1e293b',
              backgroundImage: avatarPreview || user?.avatar ? `url(${avatarPreview || user?.avatar})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: '600',
              color: 'white'
            }} onClick={() => setShowAvatarSelection(true)}>
              {!avatarPreview && !user?.avatar && (
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '36px',
                      height: '36px',
                      backgroundColor: '#22c55e',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid #1e293b',
                    }}>
                      <Camera size={18} color="white" />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <motion.button
                    type="button"
                    style={{
                      ...secondaryButtonStyle,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                      borderColor: '#8b5cf6',
                      color: '#a78bfa',
                    }}
                    onClick={() => setShowAvatarSelection(true)}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Palette size={16} />
                    Hazır Avatar Seç
                  </motion.button>
                  <motion.button
                    type="button"
                    style={{
                      ...secondaryButtonStyle,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onClick={triggerFileInput}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Upload size={16} />
                    Resim Yükle
                  </motion.button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
                <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>
                  Maksimum 5MB, JPG/PNG/GIF formatları desteklenir
                </p>
              </div>

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

              {/* Akademik Bilgiler */}
              <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#3b82f6', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={20} />
                  Akademik Bilgiler
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                      <Building2 size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      Bölüm/Fakülte
                    </label>
                    <input
                      type="text"
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                      placeholder="Örn: Bilgisayar Mühendisliği"
                      style={{ ...inputStyle }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                      <BookOpen size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      Sınıf/Yıl
                    </label>
                    <select
                      value={profileForm.year}
                      onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                      style={{ ...inputStyle, backgroundColor: '#1e293b' }}
                    >
                      <option value="" style={{ backgroundColor: '#1e293b', color: 'white' }}>Seçiniz</option>
                      <option value="1" style={{ backgroundColor: '#1e293b', color: 'white' }}>1. Sınıf</option>
                      <option value="2" style={{ backgroundColor: '#1e293b', color: 'white' }}>2. Sınıf</option>
                      <option value="3" style={{ backgroundColor: '#1e293b', color: 'white' }}>3. Sınıf</option>
                      <option value="4" style={{ backgroundColor: '#1e293b', color: 'white' }}>4. Sınıf</option>
                      <option value="5" style={{ backgroundColor: '#1e293b', color: 'white' }}>5. Sınıf</option>
                      <option value="6" style={{ backgroundColor: '#1e293b', color: 'white' }}>6. Sınıf</option>
                      <option value="Yüksek Lisans" style={{ backgroundColor: '#1e293b', color: 'white' }}>Yüksek Lisans</option>
                      <option value="Doktora" style={{ backgroundColor: '#1e293b', color: 'white' }}>Doktora</option>
                      <option value="Mezun" style={{ backgroundColor: '#1e293b', color: 'white' }}>Mezun</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                      Öğrenci Numarası
                    </label>
                    <input
                      type="text"
                      value={profileForm.studentNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, studentNumber: e.target.value })}
                      placeholder="Opsiyonel"
                      style={{ ...inputStyle }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                      Mezuniyet Yılı
                    </label>
                    <input
                      type="text"
                      value={profileForm.graduationYear}
                      onChange={(e) => setProfileForm({ ...profileForm, graduationYear: e.target.value })}
                      placeholder="Örn: 2025"
                      style={{ ...inputStyle }}
                    />
                  </div>
                </div>
              </div>

              {/* Biyografi */}
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                  <Edit size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Hakkımda / Biyografi
                </label>
                <textarea
                  value={profileForm.biography}
                  onChange={(e) => setProfileForm({ ...profileForm, biography: e.target.value })}
                  placeholder="Kendinizden kısaca bahsedin..."
                  maxLength={500}
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
                <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px', textAlign: 'right' }}>
                  {profileForm.biography.length}/500
                </p>
              </div>

              {/* Gizlilik Ayarları */}
              <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#a78bfa', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={20} />
                  Gizlilik Ayarları
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                    Profil Görünürlüğü
                  </label>
                  <select
                    value={profileForm.privacy.profileVisibility}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      privacy: { ...profileForm.privacy, profileVisibility: e.target.value as 'public' | 'friends' | 'private' }
                    })}
                    style={{ ...inputStyle, backgroundColor: '#1e293b' }}
                  >
                    <option value="public" style={{ backgroundColor: '#1e293b', color: 'white' }}>Herkese Açık</option>
                    <option value="friends" style={{ backgroundColor: '#1e293b', color: 'white' }}>Sadece Arkadaşlar</option>
                    <option value="private" style={{ backgroundColor: '#1e293b', color: 'white' }}>Özel</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                      E-posta Adresini Göster
                    </label>
                    <p style={{ color: '#94a3b8', fontSize: '12px' }}>Profilinizde e-posta adresiniz görünsün mü?</p>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setProfileForm({
                      ...profileForm,
                      privacy: { ...profileForm.privacy, emailVisibility: !profileForm.privacy.emailVisibility }
                    })}
                    style={{
                      width: '50px',
                      height: '28px',
                      borderRadius: '14px',
                      border: 'none',
                      backgroundColor: profileForm.privacy.emailVisibility ? '#22c55e' : 'rgba(71, 85, 105, 0.5)',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: profileForm.privacy.emailVisibility ? '25px' : '3px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                      }}
                      animate={{ left: profileForm.privacy.emailVisibility ? '25px' : '3px' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                  </motion.button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                      Aktivite Göster
                    </label>
                    <p style={{ color: '#94a3b8', fontSize: '12px' }}>Aktivite durumunuz görünsün mü?</p>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setProfileForm({
                      ...profileForm,
                      privacy: { ...profileForm.privacy, showActivity: !profileForm.privacy.showActivity }
                    })}
                    style={{
                      width: '50px',
                      height: '28px',
                      borderRadius: '14px',
                      border: 'none',
                      backgroundColor: profileForm.privacy.showActivity ? '#22c55e' : 'rgba(71, 85, 105, 0.5)',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: profileForm.privacy.showActivity ? '25px' : '3px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                      }}
                      animate={{ left: profileForm.privacy.showActivity ? '25px' : '3px' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
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
              {loadingStats ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '3px solid rgba(34, 197, 94, 0.3)', 
                    borderTop: '3px solid #22c55e', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                  }} />
                  <p style={{ color: '#94a3b8' }}>İstatistikler yükleniyor...</p>
                </div>
              ) : userStats ? (
                <div>
                  {/* Statistics Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <motion.div
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '15px',
                        padding: '20px',
                        textAlign: 'center'
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FileText size={32} style={{ color: '#22c55e', marginBottom: '10px' }} />
                      <div style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                        {userStats.notesCount}
                      </div>
                      <div style={{ fontSize: '14px', color: '#94a3b8' }}>Yüklenen Not</div>
                    </motion.div>

                    <motion.div
                      style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '15px',
                        padding: '20px',
                        textAlign: 'center'
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Download size={32} style={{ color: '#3b82f6', marginBottom: '10px' }} />
                      <div style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                        {userStats.totalDownloads}
                      </div>
                      <div style={{ fontSize: '14px', color: '#94a3b8' }}>Toplam İndirme</div>
                    </motion.div>

                    <motion.div
                      style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '15px',
                        padding: '20px',
                        textAlign: 'center'
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Heart size={32} style={{ color: '#f59e0b', marginBottom: '10px' }} />
                      <div style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                        {userStats.totalLikesReceived}
                      </div>
                      <div style={{ fontSize: '14px', color: '#94a3b8' }}>Toplam Beğeni</div>
                    </motion.div>

                    <motion.div
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '15px',
                        padding: '20px',
                        textAlign: 'center'
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageCircle size={32} style={{ color: '#8b5cf6', marginBottom: '10px' }} />
                      <div style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                        {userStats.postsCount + userStats.answersCount}
                      </div>
                      <div style={{ fontSize: '14px', color: '#94a3b8' }}>Toplam Katkı</div>
                    </motion.div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div style={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.5)', 
                    borderRadius: '15px', 
                    padding: '25px',
                    border: '1px solid rgba(51, 65, 85, 0.3)'
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <BarChart3 size={20} />
                      Detaylı İstatistikler
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1', marginBottom: '10px' }}>Notlar</h4>
                        <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                          <div>• Yüklenen notlar: {userStats.notesCount}</div>
                          <div>• Not beğenileri: {userStats.noteLikes}</div>
                          <div>• Toplam indirme: {userStats.totalDownloads}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1', marginBottom: '10px' }}>Topluluk</h4>
                        <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                          <div>• Gönderilen postlar: {userStats.postsCount}</div>
                          <div>• Post beğenileri: {userStats.communityLikes}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1', marginBottom: '10px' }}>Günlük Sorular</h4>
                        <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                          <div>• Verilen cevaplar: {userStats.answersCount}</div>
                          <div>• Cevap beğenileri: {userStats.answerLikes}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievement Badges */}
                  <div style={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.5)', 
                    borderRadius: '15px', 
                    padding: '25px',
                    border: '1px solid rgba(51, 65, 85, 0.3)',
                    marginTop: '20px'
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Award size={20} />
                      Başarı Rozetleri
                    </h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                      {userStats.notesCount >= 5 && (
                        <motion.div
                          style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            border: '1px solid #22c55e',
                            borderRadius: '10px',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            minWidth: '200px'
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <FileText size={24} style={{ color: '#22c55e' }} />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Not Ustası</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>5+ not yükledi</div>
                          </div>
                        </motion.div>
                      )}
                      
                      {userStats.totalDownloads >= 100 && (
                        <motion.div
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid #3b82f6',
                            borderRadius: '10px',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            minWidth: '200px'
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <TrendingUp size={24} style={{ color: '#3b82f6' }} />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Popüler Yazar</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>100+ indirme</div>
                          </div>
                        </motion.div>
                      )}
                      
                      {userStats.totalLikesReceived >= 50 && (
                        <motion.div
                          style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid #f59e0b',
                            borderRadius: '10px',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            minWidth: '200px'
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Heart size={24} style={{ color: '#f59e0b' }} />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Sevilen Üye</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>50+ beğeni</div>
                          </div>
                        </motion.div>
                      )}
                      
                      {userStats.postsCount >= 10 && (
                        <motion.div
                          style={{
                            backgroundColor: 'rgba(139, 92, 246, 0.2)',
                            border: '1px solid #8b5cf6',
                            borderRadius: '10px',
                            padding: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            minWidth: '200px'
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <MessageCircle size={24} style={{ color: '#8b5cf6' }} />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Aktif Katılımcı</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>10+ topluluk postu</div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <Settings size={64} style={{ color: '#94a3b8', marginBottom: '20px' }} />
                  <h3 style={{ fontSize: '1.3rem', color: '#cbd5e1', marginBottom: '10px' }}>
                    İstatistikler Yüklenemedi
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Kullanıcı istatistiklerinizi yüklerken bir hata oluştu.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={24} />
                  Oturum Yönetimi
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                  Aktif oturumlarınızı görüntüleyin ve yönetin
                </p>
              </div>

              {loadingSessions ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(34, 197, 94, 0.3)',
                    borderTop: '3px solid #22c55e',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                  }} />
                  <p style={{ color: '#94a3b8' }}>Oturumlar yükleniyor...</p>
                </div>
              ) : sessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {sessions.map((session: any) => (
                    <motion.div
                      key={session._id}
                      style={{
                        backgroundColor: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(51, 65, 85, 0.3)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '15px',
                      }}
                      whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.7)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {session.device?.toLowerCase().includes('mobile') ? (
                            <Smartphone size={24} style={{ color: '#3b82f6' }} />
                          ) : (
                            <Monitor size={24} style={{ color: '#3b82f6' }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                            {session.device || 'Bilinmeyen Cihaz'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                            IP: {session.ip || 'Bilinmiyor'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            Son aktivite: {session.lastActivity ? new Date(session.lastActivity).toLocaleString('tr-TR') : 'Bilinmiyor'}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                        onClick={() => handleDeleteSession(session._id)}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 size={16} />
                        Kaldır
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px' }}>
                  <Shield size={48} style={{ color: '#94a3b8', marginBottom: '20px' }} />
                  <h3 style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '10px' }}>
                    Aktif Oturum Bulunamadı
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Şu anda aktif oturumunuz bulunmuyor.
                  </p>
                </div>
              )}

              <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <LogOut size={20} />
                  Tüm Cihazlardan Çıkış
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '15px' }}>
                  Tüm cihazlardan oturumunuzu sonlandırmak istediğinizde bu butona tıklayın. Bu işlem geri alınamaz.
                </p>
                <motion.button
                  style={{
                    ...dangerButtonStyle,
                    width: '100%',
                  }}
                  onClick={handleLogoutAll}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={18} />
                  Tüm Cihazlardan Çıkış Yap
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: user?.avatar ? 'transparent' : '#22c55e',
                backgroundImage: user?.avatar ? `url(${user?.avatar})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white'
              }}
            >
              {!user?.avatar && (user?.name?.charAt(0)?.toUpperCase() || 'U')}
            </div>
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

      {/* Avatar Selection Modal */}
      <AvatarSelectionModal
        show={showAvatarSelection}
        onClose={() => setShowAvatarSelection(false)}
        currentAvatar={avatarPreview || user?.avatar}
        onSelect={handleAvatarSelect}
        onUpload={handleAvatarUploadClick}
      />
    </div>
  );
};

export default ProfileModal;