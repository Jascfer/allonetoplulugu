import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

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

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ position: 'relative' }}>
        <button
          style={closeButtonStyle}
          onClick={() => {
            // Modal'ı kapatmak için parent component'e event gönder
            window.dispatchEvent(new CustomEvent('closeAuthModal'));
          }}
        >
          ×
        </button>

        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </motion.div>
  );
};

export default AuthModal;
