import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle, X, GraduationCap } from 'lucide-react';
import apiService from '../../services/api';

interface ForgotPasswordModalProps {
  show: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Geçerli bir e-posta adresi girin');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      setEmailError('Geçerli bir e-posta adresi girin');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.forgotPassword(email);
      setSuccess(true);
      if (response.resetUrl) {
        setResetUrl(response.resetUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Şifre sıfırlama isteği gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
    zIndex: 1001,
    backdropFilter: 'blur(10px)',
    padding: '20px',
    boxSizing: 'border-box' as const,
  };

  const containerStyle = {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(100, 116, 139, 0.2)',
    borderRadius: '24px',
    padding: window.innerWidth < 768 ? '32px' : '48px',
    maxWidth: '450px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    position: 'relative' as const,
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    paddingLeft: '48px',
    background: 'rgba(51, 65, 85, 0.5)',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
  } as React.CSSProperties;

  if (!show) return null;

  return (
    <div style={modalStyle} onClick={onClose}>
      <motion.div
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(100, 116, 139, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
          }}>
            <GraduationCap size={32} color="white" />
          </div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
          }}>
            Şifremi Unuttum
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
            E-posta adresinize şifre sıfırlama linki göndereceğiz
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '20px',
                color: '#fca5a5',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '20px',
                color: '#86efac',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CheckCircle size={18} />
              E-posta adresinize şifre sıfırlama linki gönderildi!
              {resetUrl && (
                <div style={{ marginTop: '12px', fontSize: '12px', wordBreak: 'break-all' }}>
                  <a href={resetUrl} style={{ color: '#86efac', textDecoration: 'underline' }}>
                    {resetUrl}
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!success && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '10px',
              }}>
                E-posta Adresi
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  style={{
                    ...inputStyle,
                    ...(emailError ? { border: '1px solid #ef4444' } : {}),
                  }}
                  placeholder="ornek@universite.edu.tr"
                  required
                />
              </div>
              {emailError && (
                <motion.div
                  style={{
                    fontSize: '12px',
                    color: '#fca5a5',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={14} />
                  {emailError}
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading || !!emailError}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || emailError ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                opacity: loading || emailError ? 0.6 : 1,
              }}
              whileHover={!loading && !emailError ? { scale: 1.02 } : {}}
              whileTap={!loading && !emailError ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  Şifre Sıfırlama Linki Gönder
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>
        )}

        {success && (
          <motion.button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(100, 116, 139, 0.2)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              borderRadius: '12px',
              color: '#cbd5e1',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Kapat
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordModal;

