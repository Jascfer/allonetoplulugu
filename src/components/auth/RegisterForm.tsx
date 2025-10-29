import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle, GraduationCap, Check } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong';

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const { register } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (pwd: string): PasswordStrength => {
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

  const checkPasswordRequirements = (pwd: string) => {
    setPasswordRequirements({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^a-zA-Z0-9]/.test(pwd),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      setPasswordStrength(calculatePasswordStrength(value));
      checkPasswordRequirements(value);
    } else {
      setPasswordStrength(null);
    }
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

    if (!passwordRequirements.uppercase || !passwordRequirements.lowercase || 
        !passwordRequirements.number) {
      setError('Şifre büyük harf, küçük harf ve rakam içermelidir');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('closeAuthModal'));
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
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
    marginBottom: '20px',
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
    border: '1px solid #10b981',
    background: 'rgba(16, 185, 129, 0.1)',
    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
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

  const getStrengthColor = (strength: PasswordStrength | null) => {
    if (!strength) return '#64748b';
    switch (strength) {
      case 'weak': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'strong': return '#3b82f6';
      case 'very-strong': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStrengthLabel = (strength: PasswordStrength | null) => {
    if (!strength) return '';
    switch (strength) {
      case 'weak': return 'Zayıf';
      case 'medium': return 'Orta';
      case 'strong': return 'Güçlü';
      case 'very-strong': return 'Çok Güçlü';
      default: return '';
    }
  };

  const strengthBarStyle = {
    height: '4px',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    width: passwordStrength === 'weak' ? '25%' :
          passwordStrength === 'medium' ? '50%' :
          passwordStrength === 'strong' ? '75%' :
          passwordStrength === 'very-strong' ? '100%' : '0%',
    background: getStrengthColor(passwordStrength),
  };

  const requirementsStyle = {
    marginTop: '8px',
    fontSize: '12px',
    color: '#94a3b8',
  };

  const requirementItemStyle = (met: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
    color: met ? '#10b981' : '#94a3b8',
  });

  const buttonStyle = {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
    marginTop: '24px',
  } as React.CSSProperties;

  const switchTextStyle = {
    textAlign: 'center' as const,
    marginTop: '24px',
    fontSize: '14px',
    color: '#94a3b8',
  };

  const switchLinkStyle = {
    color: '#10b981',
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
        <h2 style={titleStyle}>Kayıt Ol</h2>
        <p style={subtitleStyle}>Üniversite not platformuna katılın</p>
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
            Kayıt başarıyla tamamlandı!
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Ad Soyad</label>
          <div style={inputContainerStyle}>
            <User size={20} style={iconStyle} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle,
                ...(focusedField === 'name' ? focusedInputStyle : {}),
              }}
              placeholder="Adınız ve soyadınız"
              required
              minLength={3}
            />
          </div>
        </div>

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
              onChange={handlePasswordChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle,
                ...(focusedField === 'password' ? focusedInputStyle : {}),
              }}
              placeholder="••••••••"
              required
              minLength={8}
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
          {password && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Şifre Gücü</span>
                <span style={{ fontSize: '12px', color: getStrengthColor(passwordStrength), fontWeight: '600' }}>
                  {getStrengthLabel(passwordStrength)}
                </span>
              </div>
              <div style={{ height: '4px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                  style={strengthBarStyle}
                  initial={{ width: 0 }}
                  animate={{ width: strengthBarStyle.width }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div style={requirementsStyle}>
                <div style={requirementItemStyle(passwordRequirements.length)}>
                  <Check size={12} />
                  En az 8 karakter
                </div>
                <div style={requirementItemStyle(passwordRequirements.uppercase)}>
                  <Check size={12} />
                  Büyük harf (A-Z)
                </div>
                <div style={requirementItemStyle(passwordRequirements.lowercase)}>
                  <Check size={12} />
                  Küçük harf (a-z)
                </div>
                <div style={requirementItemStyle(passwordRequirements.number)}>
                  <Check size={12} />
                  Rakam (0-9)
                </div>
                <div style={requirementItemStyle(passwordRequirements.special)}>
                  <Check size={12} />
                  Özel karakter (!@#$%)
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Şifre Tekrar</label>
          <div style={inputContainerStyle}>
            <Lock size={20} style={iconStyle} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle,
                ...(focusedField === 'confirmPassword' ? focusedInputStyle : {}),
                ...(confirmPassword && password !== confirmPassword ? { border: '1px solid #ef4444' } : {}),
                ...(confirmPassword && password === confirmPassword ? { border: '1px solid #10b981' } : {}),
              }}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={passwordToggleStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <motion.div
              style={fieldErrorStyle}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={14} />
              Şifreler eşleşmiyor
            </motion.div>
          )}
          {confirmPassword && password === confirmPassword && password && (
            <motion.div
              style={{ ...fieldErrorStyle, color: '#10b981' }}
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
          disabled={loading || !!emailError || password !== confirmPassword || !passwordStrength || passwordStrength === 'weak'}
          style={{
            ...buttonStyle,
            opacity: loading || emailError || password !== confirmPassword || !passwordStrength || passwordStrength === 'weak' ? 0.6 : 1,
            cursor: loading || emailError || password !== confirmPassword || !passwordStrength || passwordStrength === 'weak' ? 'not-allowed' : 'pointer',
          }}
          whileHover={!loading && !emailError && password === confirmPassword && passwordStrength && passwordStrength !== 'weak' ? { scale: 1.02 } : {}}
          whileTap={!loading && !emailError && password === confirmPassword && passwordStrength && passwordStrength !== 'weak' ? { scale: 0.98 } : {}}
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
              Kayıt yapılıyor...
            </>
          ) : (
            <>
              Kayıt Ol
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </form>

      <div style={switchTextStyle}>
        Zaten hesabınız var mı?{' '}
        <motion.span
          style={switchLinkStyle}
          onClick={onSwitchToLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Giriş yapın
        </motion.span>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
