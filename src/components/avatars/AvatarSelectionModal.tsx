import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Check, Palette } from 'lucide-react';
import { avatarLibrary, avatarsByCategory, categoryNames, AvatarOption } from './avatarLibrary';

interface AvatarSelectionModalProps {
  show: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSelect: (avatarUrl: string) => void;
  onUpload: () => void;
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  show,
  onClose,
  currentAvatar,
  onSelect,
  onUpload
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const filteredAvatars = selectedCategory === 'all'
    ? avatarLibrary
    : avatarLibrary.filter(avatar => avatar.category === selectedCategory);

  const handleSelect = (avatar: AvatarOption) => {
    setSelectedAvatar(avatar.id);
    onSelect(avatar.url);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const modalStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: show ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002,
    backdropFilter: 'blur(10px)',
    padding: '20px',
    boxSizing: 'border-box' as const,
  };

  const containerStyle = {
    backgroundColor: '#1e293b',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    position: 'relative' as const,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const headerStyle = {
    padding: '25px 30px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky' as const,
    top: 0,
    backgroundColor: '#1e293b',
    zIndex: 10,
    borderRadius: '24px 24px 0 0',
  };

  const categoryButtonStyle = (isActive: boolean) => ({
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
    color: isActive ? 'white' : '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  const avatarGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '20px',
    padding: '25px 30px',
  };

  const avatarCardStyle = (isSelected: boolean) => ({
    width: '100%',
    aspectRatio: '1',
    borderRadius: '16px',
    border: `3px solid ${isSelected ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
    overflow: 'hidden' as const,
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    boxShadow: isSelected ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none',
  });

  if (!show) return null;

  return (
    <div style={modalStyle} onClick={onClose}>
      <motion.div
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#22c55e', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Palette size={28} />
              Profil Resmi Seç
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '8px 0 0 0' }}>
              Hazır avatar'lardan birini seçin veya kendi resminizi yükleyin
            </p>
          </div>
          <motion.button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={onClose}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Categories */}
        <div style={{
          padding: '0 30px 20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <motion.button
            style={categoryButtonStyle(selectedCategory === 'all')}
            onClick={() => setSelectedCategory('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tümü
          </motion.button>
          {Object.keys(avatarsByCategory).map(category => (
            <motion.button
              key={category}
              style={categoryButtonStyle(selectedCategory === category)}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {categoryNames[category]}
            </motion.button>
          ))}
        </div>

        {/* Avatar Grid */}
        <div style={avatarGridStyle}>
          {filteredAvatars.map((avatar) => {
            const isSelected = selectedAvatar === avatar.id;
            return (
              <motion.div
                key={avatar.id}
                style={avatarCardStyle(isSelected)}
                onClick={() => handleSelect(avatar)}
                whileHover={{ scale: 1.05, borderColor: '#22c55e' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={avatar.url}
                  alt={avatar.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {isSelected && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Check size={16} color="white" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Upload Option */}
        <div style={{
          padding: '20px 30px 30px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <motion.button
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '2px dashed rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
            }}
            onClick={() => {
              onUpload();
              onClose();
            }}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: '#22c55e' }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload size={20} />
            Kendi Resminizi Yükleyin
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarSelectionModal;

