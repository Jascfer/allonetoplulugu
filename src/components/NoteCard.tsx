import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Eye, 
  Star, 
  Heart, 
  MessageCircle, 
  ThumbsUp,
  Calendar,
  User,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  isEdited: boolean;
}

interface Note {
  _id: string;
  title: string;
  description: string;
  category: Category;
  downloadUrl: string;
  downloadCount: number;
  viewCount: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  subject: string;
  semester: string;
  year: string;
  createdAt: string;
  isApproved: boolean;
  comments: Comment[];
  favorites: string[];
  userRating?: number;
  isFavorited?: boolean;
}

interface NoteCardProps {
  note: Note;
  onUpdate?: () => void;
  showActions?: boolean;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onUpdate, 
  showActions = false, 
  onEdit, 
  onDelete 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isRating, setIsRating] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleRating = async (rating: number) => {
    if (!isAuthenticated) return;
    
    setIsSubmitting(true);
    try {
      await apiService.rateNote(note._id, rating);
      onUpdate?.();
    } catch (error) {
      console.error('Rating error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !isAuthenticated) return;
    
    setIsSubmitting(true);
    try {
      await apiService.addComment(note._id, commentText);
      setCommentText('');
      onUpdate?.();
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) return;
    
    setIsSubmitting(true);
    try {
      await apiService.toggleFavorite(note._id);
      onUpdate?.();
    } catch (error) {
      console.error('Favorite error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      await apiService.downloadNote(note._id);
      window.open(note.downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const iconMap: { [key: string]: string } = {
    calculator: '🧮',
    atom: '⚛️',
    flask: '🧪',
    dna: '🧬',
    'book-open': '📖',
    clock: '🕰️',
    globe: '🌍',
    brain: '🧠',
    'pen-tool': '✍️',
    languages: '🌐',
    monitor: '💻',
    'trending-up': '📈',
    book: '📚'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    },
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  };

  const titleStyle = {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
    lineHeight: '1.3',
  };

  const descriptionStyle = {
    fontSize: '0.95rem',
    color: '#cbd5e1',
    lineHeight: '1.5',
    marginBottom: '15px',
  };

  const categoryStyle = {
    backgroundColor: note.category?.color || '#3b82f6',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '15px',
  };

  const tagStyle = {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
    marginRight: '6px',
    marginBottom: '6px',
    display: 'inline-block',
  };

  const statsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginBottom: '15px',
  };

  const actionButtonStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginRight: '8px',
    marginBottom: '8px',
  };

  const primaryButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: '#22c55e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#16a34a',
      transform: 'translateY(-2px)',
    },
  };

  const secondaryButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
  };

  const favoriteButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: note.isFavorited ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
    color: note.isFavorited ? 'white' : '#cbd5e1',
    '&:hover': {
      backgroundColor: note.isFavorited ? '#dc2626' : 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
  };

  const ratingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '15px',
  };

  const starStyle = (filled: boolean) => ({
    color: filled ? '#fbbf24' : '#6b7280',
    cursor: isAuthenticated ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: isAuthenticated ? 'scale(1.2)' : 'none',
    },
  });

  const commentSectionStyle = {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const commentInputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '14px',
    marginBottom: '10px',
    resize: 'vertical' as const,
    minHeight: '60px',
    '&::placeholder': {
      color: '#94a3b8',
    },
  };

  const commentStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <motion.div
      style={cardStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h3 style={titleStyle}>{note.title}</h3>
          <p style={descriptionStyle}>
            {note.description.length > 120 
              ? `${note.description.substring(0, 120)}...` 
              : note.description}
          </p>
        </div>
        {showActions && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <motion.button
              style={secondaryButtonStyle}
              onClick={() => onEdit?.(note)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit size={16} />
            </motion.button>
            <motion.button
              style={{
                ...actionButtonStyle,
                backgroundColor: '#ef4444',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#dc2626',
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => onDelete?.(note._id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        )}
      </div>

      <div style={categoryStyle}>
        {iconMap[note.category?.icon || 'book']} {note.category?.name || 'N/A'}
      </div>

      {note.tags.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          {note.tags.map((tag, index) => (
            <span key={index} style={tagStyle}>#{tag}</span>
          ))}
        </div>
      )}

      <div style={statsStyle}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={14} style={{ color: '#22c55e' }} />
            {note.viewCount}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Download size={14} style={{ color: '#22c55e' }} />
            {note.downloadCount}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} style={{ color: '#22c55e' }} />
            {new Date(note.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <User size={14} style={{ color: '#22c55e' }} />
          {note.author?.name || 'Anonim'}
        </span>
      </div>

      {/* Rating Section */}
      <div style={ratingContainerStyle}>
        <span style={{ fontSize: '14px', color: '#cbd5e1' }}>Puanla:</span>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.div
              key={star}
              style={starStyle(star <= (note.userRating || note.rating))}
              onClick={() => handleRating(star)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star size={18} fill={star <= (note.userRating || note.rating) ? 'currentColor' : 'none'} />
            </motion.div>
          ))}
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
          ({note.ratingCount} değerlendirme)
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
        <motion.button
          style={primaryButtonStyle}
          onClick={handleDownload}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={16} />
          İndir
        </motion.button>

        <motion.button
          style={favoriteButtonStyle}
          onClick={handleFavorite}
          disabled={!isAuthenticated || isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart size={16} fill={note.isFavorited ? 'currentColor' : 'none'} />
          {note.isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        </motion.button>

        <motion.button
          style={secondaryButtonStyle}
          onClick={() => setShowComments(!showComments)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={16} />
          Yorumlar ({note.comments?.length || 0})
        </motion.button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={commentSectionStyle}>
          {isAuthenticated && (
            <div>
              <textarea
                placeholder="Yorumunuzu yazın..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={commentInputStyle}
                disabled={isSubmitting}
              />
              <motion.button
                style={primaryButtonStyle}
                onClick={handleComment}
                disabled={!commentText.trim() || isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={16} />
                {isSubmitting ? 'Gönderiliyor...' : 'Yorum Yap'}
              </motion.button>
            </div>
          )}

          {note.comments && note.comments.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '10px' }}>
                Yorumlar ({note.comments.length})
              </h4>
              {note.comments.map((comment, index) => (
                <div key={index} style={commentStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
                      {comment.user.name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default NoteCard;
