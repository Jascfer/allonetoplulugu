import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  ThumbsUp, 
  Calendar, 
  TrendingUp,
  Award,
  Star,
  BookOpen,
  Target,
  Zap,
  Heart,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CommunityPost {
  _id: string;
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'achievement' | 'resource';
  category: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
    role: string;
    points: number;
  };
  createdAt: string;
  likes: string[];
  comments: Comment[];
  tags: string[];
  isPinned: boolean;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: string[];
}

interface UserStats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  points: number;
  rank: number;
}

const Community: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'discussions' | 'questions' | 'achievements' | 'resources'>('all');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'discussion' as const,
    category: '',
    tags: ''
  });
  const [showNewPost, setShowNewPost] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Mock data
  useEffect(() => {
    const mockPosts: CommunityPost[] = [
      {
        _id: '1',
        title: 'Matematik çalışma teknikleri',
        content: 'Merhaba arkadaşlar! Matematik dersinde başarılı olmak için hangi teknikleri kullanıyorsunuz? Benim için en etkili yöntem günlük pratik yapmak oldu.',
        type: 'discussion',
        category: 'Matematik',
        author: {
          _id: '1',
          name: 'Ahmet Yılmaz',
          avatar: 'https://via.placeholder.com/40/22c55e/ffffff?text=AY',
          role: 'user',
          points: 1250
        },
        createdAt: new Date().toISOString(),
        likes: ['1', '2', '3'],
        comments: [
          {
            _id: '1',
            content: 'Ben de aynı şekilde düşünüyorum. Günlük 30 dakika çalışmak çok etkili.',
            author: {
              _id: '2',
              name: 'Fatma Demir',
              avatar: 'https://via.placeholder.com/40/3b82f6/ffffff?text=FD'
            },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            likes: ['1', '2']
          }
        ],
        tags: ['matematik', 'çalışma', 'teknik'],
        isPinned: true
      },
      {
        _id: '2',
        title: 'Fizik sorusu - Momentum',
        content: 'Bu momentum sorusunu çözemiyorum. Yardım edebilir misiniz?\n\nBir 2 kg kütleli cisim 10 m/s hızla hareket ediyor. Bu cismin momentumu nedir?',
        type: 'question',
        category: 'Fizik',
        author: {
          _id: '3',
          name: 'Mehmet Kaya',
          avatar: 'https://via.placeholder.com/40/ef4444/ffffff?text=MK',
          role: 'user',
          points: 890
        },
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        likes: ['1', '2'],
        comments: [],
        tags: ['fizik', 'momentum', 'soru'],
        isPinned: false
      },
      {
        _id: '3',
        title: 'İlk 1000 puanımı aldım! 🎉',
        content: 'Bugün ilk 1000 puanımı aldım! Bu kadar çalışmanın karşılığını görmek harika bir duygu. Herkese teşekkürler!',
        type: 'achievement',
        category: 'Genel',
        author: {
          _id: '4',
          name: 'Ayşe Özkan',
          avatar: 'https://via.placeholder.com/40/f59e0b/ffffff?text=AÖ',
          role: 'user',
          points: 1000
        },
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        likes: ['1', '2', '3', '4', '5'],
        comments: [
          {
            _id: '2',
            content: 'Tebrikler! 🎉 Seni takip ediyorum, gerçekten çok çalışıyorsun.',
            author: {
              _id: '1',
              name: 'Ahmet Yılmaz',
              avatar: 'https://via.placeholder.com/40/22c55e/ffffff?text=AY'
            },
            createdAt: new Date(Date.now() - 9000000).toISOString(),
            likes: ['4']
          }
        ],
        tags: ['başarı', 'puan', 'tebrik'],
        isPinned: false
      }
    ];
    
    setPosts(mockPosts);
    setLoading(false);
  }, []);

  const handleLikePost = (postId: string) => {
    if (!isAuthenticated) return;
    
    setPosts(prev => prev.map(post => 
      post._id === postId 
        ? { ...post, likes: post.likes.includes(user!.id) 
            ? post.likes.filter(id => id !== user!.id)
            : [...post.likes, user!.id]
          }
        : post
    ));
  };

  const handleSubmitPost = async () => {
    if (!isAuthenticated || !newPost.title.trim() || !newPost.content.trim()) return;
    
    setSubmittingPost(true);
    try {
      // Mock post submission
      const post: CommunityPost = {
        _id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        type: newPost.type,
        category: newPost.category,
        author: {
          _id: user!.id,
          name: user!.name,
          avatar: user!.avatar,
          role: user!.role,
          points: 0 // Will be calculated
        },
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPinned: false
      };

      setPosts(prev => [post, ...prev]);
      setNewPost({
        title: '',
        content: '',
        type: 'discussion',
        category: '',
        tags: ''
      });
      setShowNewPost(false);
    } catch (error) {
      console.error('Post submission error:', error);
    } finally {
      setSubmittingPost(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'discussion': return <MessageCircle size={20} />;
      case 'question': return <Target size={20} />;
      case 'achievement': return <Award size={20} />;
      case 'resource': return <BookOpen size={20} />;
      default: return <MessageCircle size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'discussion': return '#3b82f6';
      case 'question': return '#f59e0b';
      case 'achievement': return '#22c55e';
      case 'resource': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'discussion': return 'Tartışma';
      case 'question': return 'Soru';
      case 'achievement': return 'Başarı';
      case 'resource': return 'Kaynak';
      default: return 'Genel';
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.type === activeTab;
  });

  const containerStyle = {
    padding: '100px 20px 40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    color: 'white',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '50px',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '15px',
    background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#cbd5e1',
    maxWidth: '700px',
    margin: '0 auto',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#22c55e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#16a34a',
      transform: 'translateY(-2px)',
    },
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '16px',
    backdropFilter: 'blur(10px)',
    marginBottom: '15px',
    '&::placeholder': {
      color: '#94a3b8',
    },
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical' as const,
    minHeight: '120px',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none' as const,
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23cbd5e1' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '16px 12px',
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '10px 20px',
    borderRadius: '8px',
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
    '&:hover': {
      backgroundColor: isActive ? '#16a34a' : 'rgba(255, 255, 255, 0.2)',
    },
  });

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <motion.div
        style={headerStyle}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 style={titleStyle}>
          <Users size={48} style={{ marginRight: '15px', verticalAlign: 'middle' }} />
          Topluluk
        </h1>
        <p style={subtitleStyle}>
          Öğrenci topluluğumuzla bilgi paylaşın, sorularınızı sorun ve birlikte öğrenin.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', padding: '12px', borderRadius: '12px' }}>
              <Users size={24} style={{ color: '#22c55e' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>1,234</div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Aktif Üye</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', padding: '12px', borderRadius: '12px' }}>
              <MessageCircle size={24} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>5,678</div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Toplam Gönderi</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '12px' }}>
              <TrendingUp size={24} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>89%</div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Memnuniyet</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <motion.button
          style={tabStyle(activeTab === 'all')}
          onClick={() => setActiveTab('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={18} />
          Tümü
        </motion.button>
        <motion.button
          style={tabStyle(activeTab === 'discussions')}
          onClick={() => setActiveTab('discussions')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={18} />
          Tartışmalar
        </motion.button>
        <motion.button
          style={tabStyle(activeTab === 'questions')}
          onClick={() => setActiveTab('questions')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Target size={18} />
          Sorular
        </motion.button>
        <motion.button
          style={tabStyle(activeTab === 'achievements')}
          onClick={() => setActiveTab('achievements')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Award size={18} />
          Başarılar
        </motion.button>
        <motion.button
          style={tabStyle(activeTab === 'resources')}
          onClick={() => setActiveTab('resources')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BookOpen size={18} />
          Kaynaklar
        </motion.button>
      </div>

      {/* New Post Button */}
      {isAuthenticated && (
        <div style={{ marginBottom: '30px' }}>
          <motion.button
            style={primaryButtonStyle}
            onClick={() => setShowNewPost(!showNewPost)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap size={18} />
            Yeni Gönderi Oluştur
          </motion.button>
        </div>
      )}

      {/* New Post Form */}
      {showNewPost && isAuthenticated && (
        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '20px', color: 'white' }}>
            Yeni Gönderi Oluştur
          </h3>
          
          <input
            type="text"
            placeholder="Gönderi başlığı..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            style={inputStyle}
          />
          
          <textarea
            placeholder="Gönderi içeriği..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            style={textareaStyle}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <select
              value={newPost.type}
              onChange={(e) => setNewPost({ ...newPost, type: e.target.value as any })}
              style={selectStyle}
            >
              <option value="discussion">Tartışma</option>
              <option value="question">Soru</option>
              <option value="achievement">Başarı</option>
              <option value="resource">Kaynak</option>
            </select>
            
            <input
              type="text"
              placeholder="Kategori..."
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              style={inputStyle}
            />
          </div>
          
          <input
            type="text"
            placeholder="Etiketler (virgülle ayırın)..."
            value={newPost.tags}
            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
            style={inputStyle}
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <motion.button
              style={secondaryButtonStyle}
              onClick={() => setShowNewPost(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              İptal
            </motion.button>
            <motion.button
              style={primaryButtonStyle}
              onClick={handleSubmitPost}
              disabled={!newPost.title.trim() || !newPost.content.trim() || submittingPost}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={18} />
              {submittingPost ? 'Gönderiliyor...' : 'Gönder'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post._id}
            style={{
              ...cardStyle,
              border: post.isPinned ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: post.isPinned ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{
                    backgroundColor: getTypeColor(post.type),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {getTypeIcon(post.type)}
                    {getTypeText(post.type)}
                  </span>
                  
                  {post.isPinned && (
                    <span style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      📌 Sabitlenmiş
                    </span>
                  )}
                  
                  <span style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {post.category}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '10px', color: 'white' }}>
                  {post.title}
                </h3>
                
                <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '15px' }}>
                  {post.content}
                </p>
                
                {post.tags.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '500',
                        marginRight: '8px',
                        marginBottom: '8px',
                        display: 'inline-block'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                    {post.author.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {post.author.points} puan • {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <motion.button
                  style={{
                    ...secondaryButtonStyle,
                    backgroundColor: post.likes.includes(user?.id || '') ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                    color: post.likes.includes(user?.id || '') ? 'white' : '#cbd5e1',
                    padding: '8px 16px',
                    fontSize: '14px',
                  }}
                  onClick={() => handleLikePost(post._id)}
                  disabled={!isAuthenticated}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={16} />
                  {post.likes.length}
                </motion.button>
                
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#94a3b8' }}>
                  <MessageCircle size={16} />
                  {post.comments.length}
                </span>
                
                <motion.button
                  style={{
                    ...secondaryButtonStyle,
                    padding: '8px',
                    fontSize: '14px',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={16} />
                </motion.button>
              </div>
            </div>

            {/* Comments Preview */}
            {post.comments.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '15px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1', marginBottom: '10px' }}>
                  Son Yorumlar ({post.comments.length})
                </div>
                {post.comments.slice(0, 2).map((comment, commentIndex) => (
                  <div key={comment._id} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
                        {comment.author.name}
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
                {post.comments.length > 2 && (
                  <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>
                    +{post.comments.length - 2} daha fazla yorum
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Community;
