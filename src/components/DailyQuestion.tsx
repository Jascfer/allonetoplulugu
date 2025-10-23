import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, ArrowRight, Lightbulb } from 'lucide-react';

const DailyQuestion: React.FC = () => {
  const handleAnswer = () => {
    console.log('Answering daily question');
    alert('Günün sorusu cevaplama özelliği yakında eklenecek!');
  };

  const sectionStyle = {
    padding: '120px 24px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    position: 'relative' as const,
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '48px',
    border: '1px solid rgba(51, 65, 85, 0.3)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  };

  const iconStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'white',
    margin: 0,
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '50px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#22c55e',
    marginLeft: 'auto',
  };

  const questionStyle = {
    fontSize: '1.5rem',
    color: '#e2e8f0',
    marginBottom: '32px',
    lineHeight: '1.6',
    fontWeight: '500',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '16px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s ease',
  };

  const statsStyle = {
    display: 'flex',
    gap: '32px',
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '1px solid rgba(51, 65, 85, 0.3)',
  };

  const statItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '500',
  };

  const backgroundPatternStyle = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <motion.div 
          style={cardStyle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div style={backgroundPatternStyle}></div>
          
          <div style={headerStyle}>
            <div style={iconStyle}>
              <Calendar size={28} color="white" />
            </div>
            <div>
              <h2 style={titleStyle}>Bugünün Sorusu</h2>
            </div>
            <div style={badgeStyle}>
              <Lightbulb size={14} />
              <span>Günlük</span>
            </div>
          </div>
          
          <p style={questionStyle}>
            Bir fonksiyonun türevi nedir ve nasıl hesaplanır? Türev kavramının geometrik anlamını açıklayarak, temel türev alma kurallarını örneklerle gösteriniz.
          </p>
          
          <motion.button
            onClick={handleAnswer}
            style={buttonStyle}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 12px 40px rgba(34, 197, 94, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Cevapla</span>
            <ArrowRight size={16} />
          </motion.button>

          <div style={statsStyle}>
            <div style={statItemStyle}>
              <Clock size={16} />
              <span>24 saat aktif</span>
            </div>
            <div style={statItemStyle}>
              <Users size={16} />
              <span>156 öğrenci cevapladı</span>
            </div>
            <div style={statItemStyle}>
              <Calendar size={16} />
              <span>Her gün yeni soru</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DailyQuestion;