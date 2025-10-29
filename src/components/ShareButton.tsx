import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';

interface ShareButtonProps {
  noteId: string;
  noteTitle: string;
  noteUrl?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ noteId, noteTitle, noteUrl }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl = noteUrl || `${window.location.origin}/notes/${noteId}`;
  const shareText = `${noteTitle} - All One Toplulugu'nda bu notu paylaşıyorum!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  const shareViaTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  const shareViaTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Not Paylaşımı: ${noteTitle}`);
    const body = encodeURIComponent(`${shareText}\n\n${currentUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareMenu(false);
  };

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const shareViaNative = async () => {
    try {
      if (hasNativeShare && navigator.share) {
        await navigator.share({
          title: noteTitle,
          text: shareText,
          url: currentUrl,
        });
        setShowShareMenu(false);
      } else {
        copyToClipboard();
      }
    } catch (err) {
      console.error('Share failed:', err);
      copyToClipboard();
    }
  };

  const buttonStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
    color: '#3b82f6',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  } as React.CSSProperties;

  const menuStyle = {
    position: 'absolute' as const,
    bottom: '100%',
    right: 0,
    marginBottom: '8px',
    background: 'rgba(30, 41, 59, 0.98)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '12px',
    padding: '8px',
    minWidth: '200px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  };

  const menuItemStyle = {
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#e2e8f0',
    transition: 'all 0.2s ease',
    marginBottom: '4px',
  } as React.CSSProperties;

  const shareOptions = [
    { label: 'Kopyala', icon: Copy, action: copyToClipboard, color: '#94a3b8' },
    ...(hasNativeShare ? [{ label: 'Paylaş...', icon: Share2, action: shareViaNative, color: '#3b82f6' }] : []),
    { label: 'WhatsApp', icon: MessageCircle, action: shareViaWhatsApp, color: '#25D366' },
    { label: 'Telegram', icon: Send, action: shareViaTelegram, color: '#0088cc' },
    { label: 'Twitter/X', icon: Share2, action: shareViaTwitter, color: '#1DA1F2' },
    { label: 'E-posta', icon: Send, action: shareViaEmail, color: '#ea4335' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        style={buttonStyle}
        onClick={() => setShowShareMenu(!showShareMenu)}
        whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.2)' }}
        whileTap={{ scale: 0.95 }}
      >
        {copied ? (
          <>
            <Check size={16} />
            Kopyalandı!
          </>
        ) : (
          <>
            <Share2 size={16} />
            Paylaş
          </>
        )}
      </motion.button>

      {showShareMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setShowShareMenu(false)}
          />
          <motion.div
            style={menuStyle}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {shareOptions.map((option, index) => (
              <motion.div
                key={index}
                style={{
                  ...menuItemStyle,
                  color: option.color,
                }}
                onClick={option.action}
                whileHover={{ background: 'rgba(100, 116, 139, 0.2)', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <option.icon size={18} />
                {option.label}
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ShareButton;

