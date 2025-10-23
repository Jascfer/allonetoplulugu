import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, Atom, Microscope, Globe, Clock, MapPin, Languages, Brain, PenTool } from 'lucide-react';

const SubjectCategories: React.FC = () => {
  const subjects = [
    { name: 'Matematik', icon: Calculator, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    { name: 'Fizik', icon: Atom, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
    { name: 'Kimya', icon: Microscope, color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)' },
    { name: 'Biyoloji', icon: BookOpen, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    { name: 'Türkçe', icon: PenTool, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
    { name: 'Tarih', icon: Clock, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
    { name: 'Coğrafya', icon: MapPin, color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' },
    { name: 'İngilizce', icon: Languages, color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)' },
    { name: 'Felsefe', icon: Brain, color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.1)' },
    { name: 'Edebiyat', icon: Globe, color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)' },
  ];

  const sectionStyle = {
    padding: '120px 24px',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    position: 'relative' as const,
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '80px',
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '50px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#22c55e',
    marginBottom: '24px',
  };

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    color: 'white',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#94a3b8',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  };

  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(51, 65, 85, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const cardIconStyle = (color: string, bgColor: string) => ({
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    border: `1px solid ${color}20`,
  });

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
  };

  const cardDescriptionStyle = {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.5',
    marginBottom: '16px',
  };

  const cardStatsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const statStyle = {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  };

  const countStyle = (color: string) => ({
    fontSize: '18px',
    fontWeight: '700',
    color: color,
  });

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <motion.div 
            style={badgeStyle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <BookOpen size={16} />
            <span>50+ Ders Kategorisi</span>
          </motion.div>

          <motion.h2 
            style={titleStyle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Dersler
          </motion.h2>

          <motion.p 
            style={subtitleStyle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Her ders için özel olarak hazırlanmış notlar, konu anlatımları ve örnekler
          </motion.p>
        </div>

        <div style={gridStyle}>
          {subjects.map((subject, index) => {
            const IconComponent = subject.icon;
            return (
              <motion.div
                key={subject.name}
                style={cardStyle}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  background: 'rgba(30, 41, 59, 0.8)',
                  borderColor: `${subject.color}40`,
                  boxShadow: `0 20px 40px ${subject.color}20`
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div style={cardIconStyle(subject.color, subject.bgColor)}>
                  <IconComponent size={28} color={subject.color} />
                </div>
                
                <h3 style={cardTitleStyle}>{subject.name}</h3>
                
                <p style={cardDescriptionStyle}>
                  {subject.name} dersi için hazırlanmış kapsamlı notlar ve konu anlatımları
                </p>
                
                <div style={cardStatsStyle}>
                  <div>
                    <div style={countStyle(subject.color)}>
                      {Math.floor(Math.random() * 500) + 100}+
                    </div>
                    <div style={statStyle}>Not</div>
                  </div>
                  <div>
                    <div style={countStyle(subject.color)}>
                      {Math.floor(Math.random() * 50) + 10}+
                    </div>
                    <div style={statStyle}>Konu</div>
                  </div>
                  <div>
                    <div style={countStyle(subject.color)}>
                      {Math.floor(Math.random() * 200) + 50}+
                    </div>
                    <div style={statStyle}>Öğrenci</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubjectCategories;