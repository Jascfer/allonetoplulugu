import React from 'react';

const Logo: React.FC = () => {
  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: 'white',
  };

  const allBoxStyle = {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  };

  const allTextStyle = {
    fontSize: '12px',
    fontWeight: '800',
    color: '#1e293b',
    writingMode: 'vertical-rl' as const,
    textOrientation: 'mixed' as const,
    letterSpacing: '1px',
  };

  const oneTextStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#e2e8f0',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.1)',
    letterSpacing: '2px',
  };

  const topluluguTextStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e2e8f0',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
    letterSpacing: '1px',
    marginTop: '2px',
  };

  const logoContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
  };

  const topRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <a href="/" style={logoStyle}>
      <div style={topRowStyle}>
        <div style={allBoxStyle}>
          <div style={allTextStyle}>ALL</div>
        </div>
        <div style={logoContainerStyle}>
          <div style={oneTextStyle}>ONE</div>
          <div style={topluluguTextStyle}>TOPLULUĞU</div>
        </div>
      </div>
    </a>
  );
};

export default Logo;
