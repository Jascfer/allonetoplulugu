import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(51, 65, 85, 0.3)',
    borderRadius: '20px',
    padding: window.innerWidth < 768 ? '24px' : '40px',
    maxWidth: '400px',
    width: '100%',
    margin: '20px auto',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'white',
    textAlign: 'center' as const,
    marginBottom: '8px',
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: '#94a3b8',
    textAlign: 'center' as const,
    marginBottom: '32px',
  };

  const inputGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: '8px',
  };

  const inputContainerStyle = {
    position: 'relative' as const,
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    paddingLeft: '44px',
    background: 'rgba(51, 65, 85, 0.6)',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const iconStyle = {
    position: 'absolute' as const,
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: '18px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
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
    gap: '8px',
  };

  const switchTextStyle = {
    textAlign: 'center' as const,
    marginTop: '24px',
    fontSize: '14px',
    color: '#94a3b8',
  };

  const switchLinkStyle = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
  };

  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    color: '#fca5a5',
    fontSize: '14px',
    textAlign: 'center' as const,
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={titleStyle}>Giriş Yap</h2>
      <p style={subtitleStyle}>Hesabınıza giriş yapın</p>

      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>E-posta</label>
          <div style={inputContainerStyle}>
            <Mail style={iconStyle} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="ornek@email.com"
              required
            />
          </div>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Şifre</label>
          <div style={inputContainerStyle}>
            <Lock style={iconStyle} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
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
                fontSize: '18px',
              }}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <div style={switchTextStyle}>
        Hesabınız yok mu?{' '}
        <span style={switchLinkStyle} onClick={onSwitchToRegister}>
          Kayıt olun
        </span>
      </div>
    </motion.div>
  );
};

export default LoginForm;
