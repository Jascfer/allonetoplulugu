import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, GraduationCap } from 'lucide-react';
import apiService from '../../services/api';

const ResetPasswordModal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | 'very-strong' | null>(null);

  useEffect(() => {
    if (!token || !email) {
      setError('Geçersiz şifre sıfırlama linki');
    }
  }, [token, email]);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    if (strength <= 5) return 'strong';
    return 'very-strong';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      setPasswordStrength(calculatePasswordStrength(value));
    } else {
      setPasswordStrength(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      setLoading(false);
      return;
    }

    if (!passwordStrength || passwordStrength === 'weak') {
      setError('Şifre çok zayıf. Daha güçlü bir şifre seçin');
      setLoading(false);
      return;
    }

    try {
      await apiService.resetPassword(token!, email!, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
        window.dispatchEvent(new CustomEvent('openAuthModal'));
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Şifre sıfırlanırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength: 'weak' | 'medium' | 'strong' | 'very-strong' | null) => {
    if (!strength) return '#64748b';
    switch (strength) {
      case 'weak': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'strong': return '#3b82f6';
      case 'very-strong': return '#10b981';
      default: return '#64748b';
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  };

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(100, 116, 139, 0.2)',
    borderRadius: '24px',
    padding: window.innerWidth < 768 ? '32px' : '48px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  };

  if (!token || !email) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <motion.div
        style={cardStyle}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
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
            Yeni Şifre Belirle
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
            Güvenli bir şifre seçin
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
              Şifreniz başarıyla sıfırlandı! Giriş sayfasına yönlendiriliyorsunuz...
            </motion.div>
          )}
        </AnimatePresence>

        {!success && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '10px',
              }}>
                Yeni Şifre
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    background: 'rgba(51, 65, 85, 0.5)',
                    border: '1px solid rgba(71, 85, 105, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Şifre Gücü</span>
                    <span style={{ fontSize: '12px', color: getStrengthColor(passwordStrength), fontWeight: '600' }}>
                      {passwordStrength === 'weak' ? 'Zayıf' :
                       passwordStrength === 'medium' ? 'Orta' :
                       passwordStrength === 'strong' ? 'Güçlü' :
                       passwordStrength === 'very-strong' ? 'Çok Güçlü' : ''}
                    </span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                      style={{
                        height: '100%',
                        width: passwordStrength === 'weak' ? '25%' :
                              passwordStrength === 'medium' ? '50%' :
                              passwordStrength === 'strong' ? '75%' :
                              passwordStrength === 'very-strong' ? '100%' : '0%',
                        background: getStrengthColor(passwordStrength),
                        borderRadius: '2px',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: passwordStrength === 'weak' ? '25%' :
                                        passwordStrength === 'medium' ? '50%' :
                                        passwordStrength === 'strong' ? '75%' :
                                        passwordStrength === 'very-strong' ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '10px',
              }}>
                Şifre Tekrar
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    background: 'rgba(51, 65, 85, 0.5)',
                    border: confirmPassword && password !== confirmPassword ? '1px solid #ef4444' :
                           confirmPassword && password === confirmPassword ? '1px solid #10b981' :
                           '1px solid rgba(71, 85, 105, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
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
                  Şifreler eşleşmiyor
                </motion.div>
              )}
              {confirmPassword && password === confirmPassword && password && (
                <motion.div
                  style={{
                    fontSize: '12px',
                    color: '#10b981',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={14} />
                  Şifreler eşleşiyor
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading || !passwordStrength || passwordStrength === 'weak' || password !== confirmPassword}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || !passwordStrength || passwordStrength === 'weak' || password !== confirmPassword ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                opacity: loading || !passwordStrength || passwordStrength === 'weak' || password !== confirmPassword ? 0.6 : 1,
              }}
              whileHover={!loading && passwordStrength && passwordStrength !== 'weak' && password === confirmPassword ? { scale: 1.02 } : {}}
              whileTap={!loading && passwordStrength && passwordStrength !== 'weak' && password === confirmPassword ? { scale: 0.98 } : {}}
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
                  Sıfırlanıyor...
                </>
              ) : (
                <>
                  Şifreyi Sıfırla
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordModal;

