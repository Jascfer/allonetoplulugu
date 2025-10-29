import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { login } = useAuth();

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
      await login(email, password);
      setSuccess(true);
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      }
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('closeAuthModal'));
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const containerStyle = {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(100, 116, 139, 0.2)',
    borderRadius: '24px',
    padding: window.innerWidth < 768 ? '32px' : '48px',
    maxWidth: '450px',
    width: '100%',
    margin: '20px auto',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    position: 'relative' as const,
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '32px',
  };

  const iconContainerStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center' as const,
    marginBottom: '8px',
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: '#94a3b8',
    textAlign: 'center' as const,
  };

  const inputGroupStyle = {
    marginBottom: '24px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '10px',
    letterSpacing: '0.3px',
  };

  const inputContainerStyle = {
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

  const focusedInputStyle = {
    border: '1px solid #3b82f6',
    background: 'rgba(59, 130, 246, 0.1)',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  };

  const iconStyle = {
    position: 'absolute' as const,
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: '20px',
    pointerEvents: 'none' as const,
  };

  const passwordToggleStyle = {
    position: 'absolute' as const,
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s ease',
  } as React.CSSProperties;

  const rememberMeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    cursor: 'pointer',
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '2px solid rgba(100, 116, 139, 0.5)',
    background: 'rgba(51, 65, 85, 0.5)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  } as React.CSSProperties;

  const buttonStyle = {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
    marginBottom: '20px',
  } as React.CSSProperties;

  const switchTextStyle = {
    textAlign: 'center' as const,
    marginTop: '24px',
    fontSize: '14px',
    color: '#94a3b8',
  };

  const switchLinkStyle = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginLeft: '6px',
  } as React.CSSProperties;

  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '20px',
    color: '#fca5a5',
    fontSize: '14px',
    textAlign: 'center' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const successStyle = {
    background: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '20px',
    color: '#86efac',
    fontSize: '14px',
    textAlign: 'center' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const fieldErrorStyle = {
    fontSize: '12px',
    color: '#fca5a5',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div style={headerStyle}>
        <motion.div
          style={iconContainerStyle}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <GraduationCap size={32} color="white" />
        </motion.div>
        <h2 style={titleStyle}>Giriş Yap</h2>
        <p style={subtitleStyle}>Üniversite not platformuna hoş geldiniz</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            style={errorStyle}
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
            style={successStyle}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CheckCircle size={18} />
            Başarıyla giriş yapıldı!
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>E-posta Adresi</label>
          <div style={inputContainerStyle}>
            <Mail size={20} style={iconStyle} />
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle,
                ...(focusedField === 'email' ? focusedInputStyle : {}),
                ...(emailError ? { border: '1px solid #ef4444' } : {}),
              }}
              placeholder="ornek@universite.edu.tr"
              required
            />
          </div>
          {emailError && (
            <motion.div
              style={fieldErrorStyle}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={14} />
              {emailError}
            </motion.div>
          )}
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Şifre</label>
          <div style={inputContainerStyle}>
            <Lock size={20} style={iconStyle} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle,
                ...(focusedField === 'password' ? focusedInputStyle : {}),
              }}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={passwordToggleStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div style={rememberMeStyle} onClick={() => setRememberMe(!rememberMe)}>
          <div style={{
            ...checkboxStyle,
            background: rememberMe ? '#3b82f6' : 'rgba(51, 65, 85, 0.5)',
            borderColor: rememberMe ? '#3b82f6' : 'rgba(100, 116, 139, 0.5)',
          }}>
            {rememberMe && <CheckCircle size={14} color="white" />}
          </div>
          <span style={{ color: '#cbd5e1', fontSize: '14px' }}>Beni hatırla</span>
          <span 
            style={{ marginLeft: 'auto', color: '#3b82f6', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('openForgotPassword'));
            }}
          >
            Şifremi unuttum
          </span>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !!emailError}
          style={{
            ...buttonStyle,
            opacity: loading || emailError ? 0.6 : 1,
            cursor: loading || emailError ? 'not-allowed' : 'pointer',
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
              Giriş yapılıyor...
            </>
          ) : (
            <>
              Giriş Yap
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </form>

      <div style={switchTextStyle}>
        Hesabınız yok mu?{' '}
        <motion.span
          style={switchLinkStyle}
          onClick={onSwitchToRegister}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Kayıt olun
        </motion.span>
      </div>
    </motion.div>
  );
};

export default LoginForm;
