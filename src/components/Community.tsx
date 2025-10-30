import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  Heart,
  Trash2,
  Edit,
  Pin,
  Flag,
  MoreVertical,
  X,
  Reply as ReplyIcon,
  BarChart3,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface Reply {
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
  replies?: Reply[];
}

interface Poll {
  question: string;
  options: {
    text: string;
    votes: string[];
  }[];
  expiresAt?: string;
  multipleChoice: boolean;
}

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
  poll?: Poll;
}


const Community: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'discussion' | 'question' | 'achievement' | 'resource'>('all');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'discussion' as const,
    category: '',
    tags: ''
  });
  const [showNewPost, setShowNewPost] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [editPostForm, setEditPostForm] = useState({ title: '', content: '', category: '', tags: '' });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ postId: string; commentId: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentContents, setCommentContents] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [showPollModal, setShowPollModal] = useState<string | null>(null);
  const [pollForm, setPollForm] = useState({
    question: '',
    options: ['', ''],
    expiresAt: '',
    multipleChoice: false
  });

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { limit: '20' };
      if (activeTab !== 'all') {
        params.type = activeTab;
      }
      
      const response = await apiService.getCommunityPosts(params);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Load posts from API
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleLikePost = async (postId: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await apiService.likeCommunityPost(postId);
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: response.data.isLiked 
                ? [...post.likes, user!.id]
                : post.likes.filter(id => id !== user!.id)
            }
          : post
      ));
    } catch (error) {
      console.error('Like post error:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      await apiService.deleteCommunityPost(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error: any) {
      alert(error.message || 'Gönderi silinirken bir hata oluştu');
    }
  };

  const handleEditPost = (post: CommunityPost) => {
    setEditingPost(post);
    setEditPostForm({
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', ')
    });
    setOpenMenuId(null);
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      const response = await apiService.updateCommunityPost(editingPost._id, editPostForm);
      setPosts(prev => prev.map(post => 
        post._id === editingPost._id 
          ? { ...post, ...response.data.post }
          : post
      ));
      setEditingPost(null);
      setEditPostForm({ title: '', content: '', category: '', tags: '' });
    } catch (error: any) {
      alert(error.message || 'Gönderi güncellenirken bir hata oluştu');
    }
  };

  const handlePinPost = async (postId: string) => {
    try {
      const response = await apiService.pinCommunityPost(postId);
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, isPinned: response.data.isPinned }
          : post
      ));
      setOpenMenuId(null);
    } catch (error: any) {
      alert(error.message || 'Gönderi sabitlenirken bir hata oluştu');
    }
  };

  const handleReportPost = (postId: string) => {
    setReportingPostId(postId);
    setShowReportModal(true);
    setOpenMenuId(null);
  };

  const handleSubmitReport = async () => {
    if (!reportingPostId || !reportReason.trim()) {
      alert('Lütfen rapor nedenini belirtin');
      return;
    }

    try {
      await apiService.reportCommunityPost(reportingPostId, reportReason);
      alert('Gönderi başarıyla raporlandı. Ekibimiz inceleme yapacak.');
      setShowReportModal(false);
      setReportingPostId(null);
      setReportReason('');
    } catch (error: any) {
      alert(error.message || 'Gönderi raporlanırken bir hata oluştu');
    }
  };

  const handleAddReply = async (postId: string, commentId: string) => {
    if (!replyContent.trim()) {
      alert('Cevap içeriği gereklidir');
      return;
    }
    try {
      const response = await apiService.addReplyToComment(postId, commentId, replyContent);
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response.data.reply]
              };
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      }));
      setReplyContent('');
      setReplyingTo(null);
    } catch (error: any) {
      alert(error.message || 'Cevap eklenirken bir hata oluştu');
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleCreatePoll = async (postId: string) => {
    if (!pollForm.question.trim()) {
      alert('Anket sorusu gereklidir');
      return;
    }
    const validOptions = pollForm.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('En az 2 seçenek gereklidir');
      return;
    }
    try {
      const pollData = {
        question: pollForm.question.trim(),
        options: validOptions.map(text => ({ text })),
        expiresAt: pollForm.expiresAt || null,
        multipleChoice: pollForm.multipleChoice
      };
      const response = await apiService.createPoll(postId, pollData);
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return { ...post, poll: response.data.poll };
        }
        return post;
      }));
      setShowPollModal(null);
      setPollForm({ question: '', options: ['', ''], expiresAt: '', multipleChoice: false });
    } catch (error: any) {
      alert(error.message || 'Anket oluşturulurken bir hata oluştu');
    }
  };

  const handleVotePoll = async (postId: string, optionIndex: number) => {
    try {
      const response = await apiService.votePoll(postId, optionIndex);
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return { ...post, poll: response.data.poll };
        }
        return post;
      }));
    } catch (error: any) {
      alert(error.message || 'Oy verilirken bir hata oluştu');
    }
  };

  const addPollOption = () => {
    if (pollForm.options.length < 10) {
      setPollForm({ ...pollForm, options: [...pollForm.options, ''] });
    }
  };

  const removePollOption = (index: number) => {
    if (pollForm.options.length > 2) {
      setPollForm({
        ...pollForm,
        options: pollForm.options.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmitPost = async () => {
    if (!isAuthenticated || !newPost.title.trim() || !newPost.content.trim()) return;
    
    setSubmittingPost(true);
    try {
      const postData = {
        title: newPost.title,
        content: newPost.content,
        type: newPost.type,
        category: newPost.category || 'Genel',
        tags: newPost.tags
      };
      
      const response = await apiService.createCommunityPost(postData);
      setPosts(prev => [response.data.post, ...prev]);
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
      case 'question': return <Zap size={20} />;
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
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.2)',
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

  const optionStyle = {
    backgroundColor: '#1e293b',
    color: 'white',
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
          style={tabStyle(activeTab === 'discussion')}
          onClick={() => setActiveTab('discussion')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={18} />
          Tartışmalar
        </motion.button>
        <motion.button
          style={tabStyle(activeTab === 'question')}
          onClick={() => setActiveTab('question')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap size={18} />
          Sorular
        </motion.button>
        <motion.button
          style={tabStyle(activeTab === 'achievement')}
          onClick={() => setActiveTab('achievement')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Award size={18} />
          Başarılar
        </motion.button>
        <motion.button
          style={tabStyle(activeTab === 'resource')}
          onClick={() => setActiveTab('resource')}
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
              <option value="discussion" style={optionStyle}>Tartışma</option>
              <option value="question" style={optionStyle}>Soru</option>
              <option value="achievement" style={optionStyle}>Başarı</option>
              <option value="resource" style={optionStyle}>Kaynak</option>
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
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {post.author.name}
                    {post.author.role === 'admin' && (
                      <span style={{ fontSize: '12px', color: '#22c55e' }}>
                        👑 Admin
                      </span>
                    )}
                    {post.isPinned && (
                      <Pin size={16} style={{ color: '#f59e0b' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {post.author.points} puan • {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {/* Action Menu for Post Author or Admin */}
                {(user?.id === post.author._id || user?.role === 'admin') && (
                  <div style={{ position: 'relative' }}>
                    <motion.button
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#cbd5e1',
                      }}
                      onClick={() => setOpenMenuId(openMenuId === post._id ? null : post._id)}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical size={18} />
                    </motion.button>
                    
                    {openMenuId === post._id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: '8px',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '8px',
                          minWidth: '180px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                          zIndex: 100,
                        }}
                      >
                        {user?.role === 'admin' && (
                          <motion.button
                            style={{
                              width: '100%',
                              padding: '10px',
                              background: 'none',
                              border: 'none',
                              color: '#cbd5e1',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              fontSize: '14px',
                              textAlign: 'left',
                            }}
                            onClick={() => handlePinPost(post._id)}
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                          >
                            <Pin size={16} />
                            {post.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
                          </motion.button>
                        )}
                        {user?.id === post.author._id && (
                          <>
                            <motion.button
                              style={{
                                width: '100%',
                                padding: '10px',
                                background: 'none',
                                border: 'none',
                                color: '#cbd5e1',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '14px',
                                textAlign: 'left',
                              }}
                              onClick={() => handleEditPost(post)}
                              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                              <Edit size={16} />
                              Düzenle
                            </motion.button>
                            {!post.poll && (
                              <motion.button
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  background: 'none',
                                  border: 'none',
                                  color: '#cbd5e1',
                                  cursor: 'pointer',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontSize: '14px',
                                  textAlign: 'left',
                                }}
                                onClick={() => {
                                  setShowPollModal(post._id);
                                  setPollForm({ question: '', options: ['', ''], expiresAt: '', multipleChoice: false });
                                }}
                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                              >
                                <BarChart3 size={16} />
                                Anket Oluştur
                              </motion.button>
                            )}
                          </>
                        )}
                        {(user?.id === post.author._id || user?.role === 'admin') && (
                          <motion.button
                            style={{
                              width: '100%',
                              padding: '10px',
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              fontSize: '14px',
                              textAlign: 'left',
                            }}
                            onClick={() => handleDeletePost(post._id)}
                            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                          >
                            <Trash2 size={16} />
                            Sil
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
                
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
                  onClick={() => handleReportPost(post._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Gönderiyi raporla"
                >
                  <Flag size={16} />
                </motion.button>
              </div>
            </div>

            {/* Poll Section */}
            {post.poll && post.poll.question && (
              <div style={{ 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                paddingTop: '15px',
                marginTop: '15px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#cbd5e1', 
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <BarChart3 size={18} />
                  Anket: {post.poll.question}
                </div>
                {post.poll.options.map((option, optIndex) => {
                  const totalVotes = post.poll!.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                  const optionVotes = option.votes.length;
                  const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                  const hasVoted = option.votes.includes(user?.id || '');
                  const isExpired = post.poll!.expiresAt && new Date(post.poll!.expiresAt) < new Date();
                  
                  return (
                    <div key={optIndex} style={{ marginBottom: '10px' }}>
                      <motion.button
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          backgroundColor: hasVoted ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: hasVoted ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'white',
                          textAlign: 'left',
                          cursor: isExpired ? 'default' : 'pointer',
                          fontSize: '14px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onClick={() => !isExpired && handleVotePoll(post._id, optIndex)}
                        disabled={isExpired || !isAuthenticated}
                        whileHover={!isExpired ? { scale: 1.02 } : {}}
                        whileTap={!isExpired ? { scale: 0.98 } : {}}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                          <span>{option.text}</span>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {optionVotes} oy ({percentage.toFixed(0)}%)
                            {hasVoted && <Check size={14} style={{ display: 'inline', marginLeft: '5px', color: '#22c55e' }} />}
                          </span>
                        </div>
                        {totalVotes > 0 && (
                          <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${percentage}%`,
                            backgroundColor: hasVoted ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                            zIndex: 0,
                            transition: 'width 0.3s ease'
                          }} />
                        )}
                      </motion.button>
                    </div>
                  );
                })}
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>
                  Toplam: {post.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)} oy
                  {post.poll.expiresAt && (
                    <span style={{ marginLeft: '10px' }}>
                      Bitiş: {new Date(post.poll.expiresAt).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>
                  Yorumlar ({post.comments.length})
                </div>
                {post.comments.length > 0 && (
                  <motion.button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#cbd5e1',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleComments(post._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedComments.has(post._id) ? 'Gizle' : 'Tümünü Göster'}
                  </motion.button>
                )}
              </div>

              {/* Comment Input */}
              {isAuthenticated && !replyingTo?.commentId && (
                <div style={{ marginBottom: '15px' }}>
                  <textarea
                    placeholder="Yorum yazın..."
                    value={commentContents[post._id] || ''}
                    onChange={(e) => {
                      setCommentContents({ ...commentContents, [post._id]: e.target.value });
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'vertical',
                      minHeight: '60px',
                      fontFamily: 'inherit'
                    }}
                    rows={2}
                  />
                  <motion.button
                    style={{
                      marginTop: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onClick={async () => {
                      const commentContent = commentContents[post._id];
                      if (commentContent && commentContent.trim()) {
                        try {
                          await apiService.addCommentToPost(post._id, commentContent);
                          setCommentContents({ ...commentContents, [post._id]: '' });
                          loadPosts();
                        } catch (error: any) {
                          alert(error.message || 'Yorum eklenirken bir hata oluştu');
                        }
                      }
                    }}
                    disabled={!commentContents[post._id]?.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Yorum Yap
                  </motion.button>
                </div>
              )}

              {/* Comments List */}
              {(expandedComments.has(post._id) || post.comments.length <= 3) ? (
                post.comments.map((comment) => (
                  <div key={comment._id} style={{ 
                    marginBottom: '15px', 
                    padding: '12px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '8px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <img
                        src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.name}&background=22c55e&color=fff`}
                        alt={comment.author.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'white', marginRight: '8px' }}>
                          {comment.author.name}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 10px 42px', lineHeight: '1.5' }}>
                      {comment.content}
                    </p>
                    
                    {/* Reply Button */}
                    {isAuthenticated && (
                      <div style={{ marginLeft: '42px', marginTop: '8px' }}>
                        <motion.button
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onClick={() => setReplyingTo(
                            replyingTo?.postId === post._id && replyingTo?.commentId === comment._id 
                              ? null 
                              : { postId: post._id, commentId: comment._id }
                          )}
                          whileHover={{ color: '#3b82f6' }}
                        >
                          <ReplyIcon size={14} />
                          Cevap Ver
                          {comment.replies && comment.replies.length > 0 && (
                            <span style={{ marginLeft: '4px' }}>
                              ({comment.replies.length})
                            </span>
                          )}
                        </motion.button>

                        {/* Reply Input */}
                        {replyingTo?.postId === post._id && replyingTo?.commentId === comment._id && (
                          <div style={{ marginTop: '10px' }}>
                            <textarea
                              placeholder="Cevabınızı yazın..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '6px',
                                color: 'white',
                                fontSize: '13px',
                                resize: 'vertical',
                                minHeight: '50px',
                                fontFamily: 'inherit'
                              }}
                              rows={2}
                            />
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                              <motion.button
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#22c55e',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: 'white',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleAddReply(post._id, comment._id)}
                                disabled={!replyContent.trim()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Gönder
                              </motion.button>
                              <motion.button
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: '#94a3b8',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                İptal
                              </motion.button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div style={{ marginTop: '10px', marginLeft: '20px', paddingLeft: '20px', borderLeft: '2px solid rgba(255, 255, 255, 0.1)' }}>
                            {comment.replies.map((reply) => (
                              <div key={reply._id} style={{ 
                                marginBottom: '10px', 
                                padding: '10px', 
                                backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                                borderRadius: '6px' 
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                  <img
                                    src={reply.author.avatar || `https://ui-avatars.com/api/?name=${reply.author.name}&background=3b82f6&color=fff`}
                                    alt={reply.author.name}
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '50%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
                                    {reply.author.name}
                                  </span>
                                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                    {new Date(reply.createdAt).toLocaleDateString('tr-TR')}
                                  </span>
                                </div>
                                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, marginLeft: '32px' }}>
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>
                  +{post.comments.length - 3} daha fazla yorum görmek için tıklayın
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
        }} onClick={() => setEditingPost(null)}>
          <motion.div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>Gönderiyi Düzenle</h3>
              <motion.button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '8px',
                }}
                onClick={() => setEditingPost(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            <input
              type="text"
              placeholder="Gönderi başlığı..."
              value={editPostForm.title}
              onChange={(e) => setEditPostForm({ ...editPostForm, title: e.target.value })}
              style={inputStyle}
            />

            <textarea
              placeholder="Gönderi içeriği..."
              value={editPostForm.content}
              onChange={(e) => setEditPostForm({ ...editPostForm, content: e.target.value })}
              style={textareaStyle}
              rows={8}
            />

            <input
              type="text"
              placeholder="Kategori..."
              value={editPostForm.category}
              onChange={(e) => setEditPostForm({ ...editPostForm, category: e.target.value })}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Etiketler (virgülle ayırın)..."
              value={editPostForm.tags}
              onChange={(e) => setEditPostForm({ ...editPostForm, tags: e.target.value })}
              style={inputStyle}
            />

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <motion.button
                style={secondaryButtonStyle}
                onClick={() => setEditingPost(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                İptal
              </motion.button>
              <motion.button
                style={primaryButtonStyle}
                onClick={handleUpdatePost}
                disabled={!editPostForm.title.trim() || !editPostForm.content.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit size={18} />
                Güncelle
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
        }} onClick={() => {
          setShowReportModal(false);
          setReportingPostId(null);
          setReportReason('');
        }}>
          <motion.div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flag size={24} />
                Gönderiyi Raporla
              </h3>
              <motion.button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '8px',
                }}
                onClick={() => {
                  setShowReportModal(false);
                  setReportingPostId(null);
                  setReportReason('');
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            <p style={{ color: '#cbd5e1', marginBottom: '20px', fontSize: '14px' }}>
              Bu gönderiyi neden raporlamak istiyorsunuz? Raporunuz ekibimiz tarafından incelenecektir.
            </p>

            <textarea
              placeholder="Rapor nedenini açıklayın..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              style={textareaStyle}
              rows={6}
            />

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <motion.button
                style={secondaryButtonStyle}
                onClick={() => {
                  setShowReportModal(false);
                  setReportingPostId(null);
                  setReportReason('');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                İptal
              </motion.button>
              <motion.button
                style={{
                  ...primaryButtonStyle,
                  backgroundColor: '#f59e0b',
                  borderColor: '#f59e0b',
                }}
                onClick={handleSubmitReport}
                disabled={!reportReason.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flag size={18} />
                Raporla
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Poll Creation Modal */}
      {showPollModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
        }} onClick={() => {
          setShowPollModal(null);
          setPollForm({ question: '', options: ['', ''], expiresAt: '', multipleChoice: false });
        }}>
          <motion.div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={24} />
                Anket Oluştur
              </h3>
              <motion.button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '8px',
                }}
                onClick={() => {
                  setShowPollModal(null);
                  setPollForm({ question: '', options: ['', ''], expiresAt: '', multipleChoice: false });
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                Anket Sorusu
              </label>
              <input
                type="text"
                placeholder="Anket sorusunu yazın..."
                value={pollForm.question}
                onChange={(e) => setPollForm({ ...pollForm, question: e.target.value })}
                style={inputStyle}
                maxLength={200}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                  Seçenekler (En az 2, en fazla 10)
                </label>
                {pollForm.options.length < 10 && (
                  <motion.button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '6px',
                      color: '#22c55e',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    onClick={addPollOption}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={14} />
                    Ekle
                  </motion.button>
                )}
              </div>
              {pollForm.options.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder={`Seçenek ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...pollForm.options];
                      newOptions[index] = e.target.value;
                      setPollForm({ ...pollForm, options: newOptions });
                    }}
                    style={{
                      ...inputStyle,
                      flex: 1,
                      marginBottom: 0
                    }}
                    maxLength={100}
                  />
                  {pollForm.options.length > 2 && (
                    <motion.button
                      style={{
                        padding: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                      onClick={() => removePollOption(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus size={16} />
                    </motion.button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                Bitiş Tarihi (Opsiyonel)
              </label>
              <input
                type="datetime-local"
                value={pollForm.expiresAt}
                onChange={(e) => setPollForm({ ...pollForm, expiresAt: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="multipleChoice"
                checked={pollForm.multipleChoice}
                onChange={(e) => setPollForm({ ...pollForm, multipleChoice: e.target.checked })}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              <label htmlFor="multipleChoice" style={{ color: '#cbd5e1', fontSize: '14px', cursor: 'pointer' }}>
                Çoklu seçim (Birden fazla seçenek seçilebilir)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <motion.button
                style={secondaryButtonStyle}
                onClick={() => {
                  setShowPollModal(null);
                  setPollForm({ question: '', options: ['', ''], expiresAt: '', multipleChoice: false });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                İptal
              </motion.button>
              <motion.button
                style={primaryButtonStyle}
                onClick={() => showPollModal && handleCreatePoll(showPollModal)}
                disabled={!pollForm.question.trim() || pollForm.options.filter(opt => opt.trim()).length < 2}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 size={18} />
                Anket Oluştur
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Community;
