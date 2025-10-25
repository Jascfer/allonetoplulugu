import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  BarChart3,
  Settings,
  FileText,
  Calendar,
  Eye,
  Download,
  Star,
  Search,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Users,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';
import apiService from '../services/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
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
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  subject: string;
  semester: string;
  year: string;
  createdAt: string;
  isApproved: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  notesCount: number;
  postsCount: number;
  answersCount: number;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'categories' | 'users' | 'analytics'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'note' | 'category' | 'user', id: string, name: string} | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'none' | 'delete' | 'approve' | 'activate' | 'deactivate'>('none');

  // Form states
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Note form
  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    category: '',
    downloadUrl: '',
    tags: '',
    subject: '',
    semester: '',
    year: ''
  });

  // Category form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: 'book'
  });

  // Üniversite kategorileri
  const universityCategories = [
    { name: 'Matematik', icon: 'calculator', color: '#ef4444' },
    { name: 'Fizik', icon: 'atom', color: '#f97316' },
    { name: 'Kimya', icon: 'flask', color: '#22c55e' },
    { name: 'Biyoloji', icon: 'dna', color: '#06b6d4' },
    { name: 'Türkçe', icon: 'book-open', color: '#8b5cf6' },
    { name: 'Tarih', icon: 'clock', color: '#f59e0b' },
    { name: 'Coğrafya', icon: 'globe', color: '#10b981' },
    { name: 'Felsefe', icon: 'brain', color: '#6366f1' },
    { name: 'Edebiyat', icon: 'pen-tool', color: '#ec4899' },
    { name: 'İngilizce', icon: 'languages', color: '#84cc16' },
    { name: 'Bilgisayar', icon: 'monitor', color: '#06b6d4' },
    { name: 'Ekonomi', icon: 'trending-up', color: '#f59e0b' }
  ];

  const iconMap: { [key: string]: any } = {
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

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'notes') {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (searchTerm) params.append('search', searchTerm);
        if (sortBy) params.append('sortBy', sortBy);

        const response = await apiService.getNotes(Object.fromEntries(params));
        setNotes(response.data.notes || []);
      } else if (activeTab === 'categories') {
        const response = await apiService.getCategories();
        setCategories(response.data || []);
      } else if (activeTab === 'users') {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (sortBy) params.append('sortBy', sortBy);

        const response = await apiService.getUsers(Object.fromEntries(params));
        setUsers(response.data.users || []);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedCategory, searchTerm, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const noteData = {
        ...noteForm,
        tags: noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        googleDriveLink: noteForm.downloadUrl // Backend'de googleDriveLink olarak bekleniyor
      };

      if (editingNote) {
        await apiService.updateNote(editingNote._id, noteData);
        setSuccess('Not başarıyla güncellendi!');
      } else {
        await apiService.createNote(noteData);
        setSuccess('Not başarıyla oluşturuldu!');
      }

      setShowNoteForm(false);
      resetNoteForm();
      loadData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingCategory) {
        await apiService.updateCategory(editingCategory._id, categoryForm);
        setSuccess('Kategori başarıyla güncellendi!');
      } else {
        await apiService.createCategory(categoryForm);
        setSuccess('Kategori başarıyla oluşturuldu!');
      }

      setShowCategoryForm(false);
      resetCategoryForm();
      loadData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string, name: string) => {
    setShowDeleteConfirm({ type: 'note', id, name });
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    setShowDeleteConfirm({ type: 'category', id, name });
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      setLoading(true);
      await apiService.toggleUserStatus(userId);
      setSuccess('Kullanıcı durumu başarıyla güncellendi!');
      loadData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;

    try {
      if (showDeleteConfirm.type === 'note') {
        await apiService.deleteNote(showDeleteConfirm.id);
        setSuccess('Not başarıyla silindi!');
      } else if (showDeleteConfirm.type === 'category') {
        await apiService.deleteCategory(showDeleteConfirm.id);
        setSuccess('Kategori başarıyla silindi!');
      } else if (showDeleteConfirm.type === 'user') {
        await apiService.deleteUser(showDeleteConfirm.id);
        setSuccess('Kullanıcı başarıyla silindi!');
      }
      setShowDeleteConfirm(null);
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleBulkAction = async () => {
    if (selectedNotes.length === 0) return;

    try {
      if (bulkAction === 'delete') {
        for (const noteId of selectedNotes) {
          await apiService.deleteNote(noteId);
        }
        setSuccess(`${selectedNotes.length} not başarıyla silindi!`);
      }
      setSelectedNotes([]);
      setBulkAction('none');
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const selectAllNotes = () => {
    setSelectedNotes(notes.map(note => note._id));
  };

  const clearSelection = () => {
    setSelectedNotes([]);
  };

  const openNoteForm = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNoteForm({
        title: note.title,
        description: note.description,
        category: note.category._id,
        downloadUrl: note.downloadUrl,
        tags: note.tags.join(', '),
        subject: note.subject,
        semester: note.semester,
        year: note.year
      });
    } else {
      setEditingNote(null);
      resetNoteForm();
    }
    setShowNoteForm(true);
  };

  const openCategoryForm = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon
      });
    } else {
      setEditingCategory(null);
      resetCategoryForm();
    }
    setShowCategoryForm(true);
  };

  const resetNoteForm = () => {
    setNoteForm({
      title: '',
      description: '',
      category: '',
      downloadUrl: '',
      tags: '',
      subject: '',
      semester: '',
      year: ''
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      color: '#3b82f6',
      icon: 'book'
    });
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    color: 'white',
    padding: '100px 20px 20px 20px',
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '40px',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '15px',
    background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  };

  const tabContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap' as const,
  };

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '12px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
    color: isActive ? 'white' : '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: isActive ? '#16a34a' : 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
  });

  const searchContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  };

  const searchInputStyle = {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '16px',
    minWidth: '250px',
    backdropFilter: 'blur(10px)',
    '&::placeholder': {
      color: '#94a3b8',
    },
  };

  const selectStyle = {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '16px',
    backdropFilter: 'blur(10px)',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    },
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
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

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',
    color: 'white',
    '&:hover': {
      backgroundColor: '#dc2626',
      transform: 'translateY(-2px)',
    },
  };

  const modalStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  };

  const modalContentStyle = {
    backgroundColor: '#1e293b',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    position: 'relative' as const,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '15px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '16px',
    backdropFilter: 'blur(10px)',
    '&::placeholder': {
      color: '#94a3b8',
    },
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  };

  const statCardStyle = {
    ...cardStyle,
    textAlign: 'center' as const,
    padding: '25px',
  };

  return (
    <div style={containerStyle}>
      <motion.div
        style={headerStyle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={titleStyle}>
          <Settings size={48} />
          Admin Paneli
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
          Üniversite notlarını ve kategorilerini yönetin
        </p>
      </motion.div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid #22c55e',
            color: '#22c55e',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '600px',
            margin: '0 auto 20px auto',
          }}
        >
          <CheckCircle size={20} />
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '600px',
            margin: '0 auto 20px auto',
          }}
        >
          <AlertCircle size={20} />
          {error}
        </motion.div>
      )}

      {/* Tabs */}
      <div style={tabContainerStyle}>
        <motion.button
          style={tabButtonStyle(activeTab === 'notes')}
          onClick={() => setActiveTab('notes')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText size={20} />
          Notlar ({notes.length})
        </motion.button>
        <motion.button
          style={tabButtonStyle(activeTab === 'categories')}
          onClick={() => setActiveTab('categories')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BookOpen size={20} />
          Kategoriler ({categories.length})
        </motion.button>
        <motion.button
          style={tabButtonStyle(activeTab === 'users')}
          onClick={() => setActiveTab('users')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users size={20} />
          Kullanıcılar ({users.length})
        </motion.button>
        <motion.button
          style={tabButtonStyle(activeTab === 'analytics')}
          onClick={() => setActiveTab('analytics')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BarChart3 size={20} />
          İstatistikler
        </motion.button>
      </div>

      {/* Search and Filters */}
      {activeTab === 'notes' && (
        <div style={searchContainerStyle}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Notlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...searchInputStyle, paddingLeft: '45px' }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={selectStyle}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="newest">En Yeni</option>
            <option value="popular">En Popüler</option>
            <option value="top">En Yüksek Puan</option>
          </select>
        </div>
      )}

      {/* Users Search */}
      {activeTab === 'users' && (
        <div style={searchContainerStyle}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Kullanıcılarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...searchInputStyle, paddingLeft: '45px' }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="name">İsim A-Z</option>
            <option value="email">E-posta A-Z</option>
          </select>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '18px', color: '#cbd5e1' }}>Yükleniyor...</div>
          </div>
        ) : (
          <>
            {activeTab === 'notes' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '600', margin: 0 }}>Notlar</h2>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {selectedNotes.length > 0 && (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginRight: '15px' }}>
                        <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                          {selectedNotes.length} seçili
                        </span>
                        <select
                          value={bulkAction}
                          onChange={(e) => setBulkAction(e.target.value as any)}
                          style={{ ...selectStyle, minWidth: '120px' }}
                        >
                          <option value="none">İşlem Seç</option>
                          <option value="delete">Sil</option>
                        </select>
                        <motion.button
                          style={bulkAction !== 'none' ? primaryButtonStyle : secondaryButtonStyle}
                          onClick={handleBulkAction}
                          disabled={bulkAction === 'none'}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Uygula
                        </motion.button>
                        <motion.button
                          style={secondaryButtonStyle}
                          onClick={clearSelection}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Temizle
                        </motion.button>
                      </div>
                    )}
                    <motion.button
                      style={primaryButtonStyle}
                      onClick={() => openNoteForm()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={20} />
                      Yeni Not Ekle
                    </motion.button>
                  </div>
                </div>

                {notes.length > 0 && (
                  <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <motion.button
                      style={secondaryButtonStyle}
                      onClick={selectAllNotes}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Tümünü Seç
                    </motion.button>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                      Toplam {notes.length} not
                    </span>
                  </div>
                )}

                {notes.length === 0 ? (
                  <div style={{ textAlign: 'center', ...cardStyle, padding: '60px' }}>
                    <FileText size={64} style={{ color: '#94a3b8', marginBottom: '20px' }} />
                    <h3 style={{ fontSize: '1.5rem', color: '#cbd5e1', marginBottom: '10px' }}>Henüz not eklenmemiş</h3>
                    <p style={{ color: '#94a3b8' }}>İlk notunuzu eklemek için yukarıdaki butona tıklayın</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {notes.map((note) => (
                      <motion.div
                        key={note._id}
                        style={cardStyle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                              <input
                                type="checkbox"
                                checked={selectedNotes.includes(note._id)}
                                onChange={() => toggleNoteSelection(note._id)}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  accentColor: '#22c55e',
                                  cursor: 'pointer'
                                }}
                              />
                              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0, color: 'white' }}>
                                {note.title}
                              </h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>
                              {note.description.substring(0, 100)}...
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <motion.button
                              style={secondaryButtonStyle}
                              onClick={() => openNoteForm(note)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              style={dangerButtonStyle}
                              onClick={() => handleDeleteNote(note._id, note.title)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                          <span style={{
                            backgroundColor: note.category?.color || '#3b82f6',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {iconMap[note.category?.icon || 'book']} {note.category?.name || 'N/A'}
                          </span>
                          {note.subject && (
                            <span style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#cbd5e1',
                              padding: '4px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {note.subject}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                          <div style={{ display: 'flex', gap: '15px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Eye size={14} /> {note.viewCount}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Download size={14} /> {note.downloadCount}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Star size={14} /> {note.rating.toFixed(1)}
                            </span>
                          </div>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} />
                            {new Date(note.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>

                        {note.tags.length > 0 && (
                          <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {note.tags.map((tag, index) => (
                              <span key={index} style={{
                                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                color: '#22c55e',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '600', margin: 0 }}>Kategoriler</h2>
                  <motion.button
                    style={primaryButtonStyle}
                    onClick={() => openCategoryForm()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={20} />
                    Yeni Kategori Ekle
                  </motion.button>
                </div>

                {/* Üniversite Kategorileri */}
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '15px', color: '#cbd5e1' }}>
                    Hızlı Kategori Ekleme
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                    {universityCategories.map((cat, index) => (
                      <motion.button
                        key={index}
                        style={{
                          ...cardStyle,
                          padding: '15px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          border: '2px solid transparent',
                        }}
                        onClick={() => {
                          setCategoryForm({
                            name: cat.name,
                            description: `${cat.name} dersi için notlar`,
                            color: cat.color,
                            icon: cat.icon
                          });
                          setShowCategoryForm(true);
                        }}
                        whileHover={{ scale: 1.05, borderColor: cat.color }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '24px' }}>{iconMap[cat.icon]}</span>
                          <span style={{ fontWeight: '600', color: 'white' }}>{cat.name}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                          Hızlı ekle
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {categories.length === 0 ? (
                  <div style={{ textAlign: 'center', ...cardStyle, padding: '60px' }}>
                    <BookOpen size={64} style={{ color: '#94a3b8', marginBottom: '20px' }} />
                    <h3 style={{ fontSize: '1.5rem', color: '#cbd5e1', marginBottom: '10px' }}>Henüz kategori eklenmemiş</h3>
                    <p style={{ color: '#94a3b8' }}>İlk kategorinizi eklemek için yukarıdaki butona tıklayın</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {categories.map((category) => (
                      <motion.div
                        key={category._id}
                        style={cardStyle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '24px' }}>{iconMap[category.icon || 'book']}</span>
                              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white', margin: 0 }}>
                                {category.name}
                              </h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>
                              {category.description}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <motion.button
                              style={secondaryButtonStyle}
                              onClick={() => openCategoryForm(category)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              style={dangerButtonStyle}
                              onClick={() => handleDeleteCategory(category._id, category.name)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: category.color,
                            border: '2px solid rgba(255, 255, 255, 0.2)'
                          }} />
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {category.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto' }}>
                            {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '600', margin: 0 }}>Kullanıcılar</h2>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {selectedUsers.length > 0 && (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginRight: '15px' }}>
                        <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                          {selectedUsers.length} seçili
                        </span>
                        <select
                          value={bulkAction}
                          onChange={(e) => setBulkAction(e.target.value as any)}
                          style={selectStyle}
                        >
                          <option value="none">Toplu İşlem</option>
                          <option value="activate">Aktifleştir</option>
                          <option value="deactivate">Pasifleştir</option>
                          <option value="delete">Sil</option>
                        </select>
                        <motion.button
                          style={secondaryButtonStyle}
                          onClick={() => setSelectedUsers([])}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Temizle
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>

                <div style={gridStyle}>
                  {users.map((user) => (
                    <motion.div
                      key={user._id}
                      style={{
                        ...cardStyle,
                        border: selectedUsers.includes(user._id) ? '2px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user._id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                            }
                          }}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <img
                          src={user.avatar || `https://via.placeholder.com/40/22c55e/ffffff?text=${user.name.charAt(0)}`}
                          alt={user.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 5px 0', color: 'white' }}>
                            {user.name}
                          </h3>
                          <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
                            {user.email}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {user.role === 'admin' && (
                            <Shield size={16} style={{ color: '#f59e0b' }} />
                          )}
                          <span style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            backgroundColor: user.isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: user.isActive ? '#22c55e' : '#ef4444',
                            fontWeight: '600'
                          }}>
                            {user.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>{user.notesCount}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Notlar</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>{user.postsCount}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Postlar</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>{user.answersCount}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Cevaplar</div>
                        </div>
                      </div>

                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '15px' }}>
                        Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button
                          style={{
                            ...secondaryButtonStyle,
                            padding: '8px 12px',
                            fontSize: '12px',
                            flex: 1
                          }}
                          onClick={() => handleToggleUserStatus(user._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          {user.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                        </motion.button>
                        <motion.button
                          style={{
                            ...secondaryButtonStyle,
                            padding: '8px 12px',
                            fontSize: '12px',
                            flex: 1
                          }}
                          onClick={() => setShowDeleteConfirm({ type: 'user', id: user._id, name: user.name })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 size={14} />
                          Sil
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {users.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    <Users size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Kullanıcı Bulunamadı</h3>
                    <p>Arama kriterlerinize uygun kullanıcı bulunamadı.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '20px' }}>İstatistikler</h2>
                
                <div style={statsContainerStyle}>
                  <motion.div
                    style={statCardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FileText size={48} style={{ color: '#22c55e', marginBottom: '15px' }} />
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px', color: 'white' }}>
                      {notes.length}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Toplam Not</p>
                  </motion.div>

                  <motion.div
                    style={statCardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <BookOpen size={48} style={{ color: '#3b82f6', marginBottom: '15px' }} />
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px', color: 'white' }}>
                      {categories.length}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Toplam Kategori</p>
                  </motion.div>

                  <motion.div
                    style={statCardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Download size={48} style={{ color: '#f59e0b', marginBottom: '15px' }} />
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px', color: 'white' }}>
                      {notes.reduce((sum, note) => sum + note.downloadCount, 0)}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Toplam İndirme</p>
                  </motion.div>

                  <motion.div
                    style={statCardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Eye size={48} style={{ color: '#8b5cf6', marginBottom: '15px' }} />
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '5px', color: 'white' }}>
                      {notes.reduce((sum, note) => sum + note.viewCount, 0)}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>Toplam Görüntüleme</p>
                  </motion.div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Note Modal */}
      {showNoteForm && (
        <div style={modalStyle}>
          <motion.div
            style={modalContentStyle}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#22c55e', margin: 0 }}>
                {editingNote ? 'Notu Düzenle' : 'Yeni Not Ekle'}
              </h2>
              <motion.button
                style={{ ...buttonStyle, backgroundColor: 'transparent', color: '#94a3b8', padding: '8px' }}
                onClick={() => setShowNoteForm(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            <form onSubmit={handleNoteSubmit}>
              <input
                type="text"
                placeholder="Not Başlığı"
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                style={inputStyle}
                required
              />
              
              <textarea
                placeholder="Not Açıklaması"
                value={noteForm.description}
                onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <select
                  value={noteForm.category}
                  onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                  style={inputStyle}
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Ders (örn: Matematik)"
                  value={noteForm.subject}
                  onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="Dönem (örn: 1. Dönem)"
                  value={noteForm.semester}
                  onChange={(e) => setNoteForm({ ...noteForm, semester: e.target.value })}
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Yıl (örn: 2024)"
                  value={noteForm.year}
                  onChange={(e) => setNoteForm({ ...noteForm, year: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <input
                type="url"
                placeholder="İndirme Linki (Google Drive, Dropbox, vb.)"
                value={noteForm.downloadUrl}
                onChange={(e) => setNoteForm({ ...noteForm, downloadUrl: e.target.value })}
                style={inputStyle}
                required
              />

              <input
                type="text"
                placeholder="Etiketler (virgülle ayırın)"
                value={noteForm.tags}
                onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                style={inputStyle}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
                <motion.button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() => setShowNoteForm(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  İptal
                </motion.button>
                <motion.button
                  type="submit"
                  style={primaryButtonStyle}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save size={18} />
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryForm && (
        <div style={modalStyle}>
          <motion.div
            style={modalContentStyle}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#22c55e', margin: 0 }}>
                {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
              </h2>
              <motion.button
                style={{ ...buttonStyle, backgroundColor: 'transparent', color: '#94a3b8', padding: '8px' }}
                onClick={() => setShowCategoryForm(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            <form onSubmit={handleCategorySubmit}>
              <input
                type="text"
                placeholder="Kategori Adı"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                style={inputStyle}
                required
              />

              <textarea
                placeholder="Kategori Açıklaması"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                    Renk
                  </label>
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    style={{ ...inputStyle, height: '50px', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                    İkon
                  </label>
                  <select
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    style={inputStyle}
                  >
                    {Object.keys(iconMap).map((icon) => (
                      <option key={icon} value={icon}>
                        {iconMap[icon]} {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
                <motion.button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() => setShowCategoryForm(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  İptal
                </motion.button>
                <motion.button
                  type="submit"
                  style={primaryButtonStyle}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save size={18} />
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={modalStyle}>
          <motion.div
            style={{
              ...modalContentStyle,
              maxWidth: '400px',
              textAlign: 'center'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div style={{ marginBottom: '20px' }}>
              <AlertCircle size={64} style={{ color: '#ef4444', marginBottom: '15px' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ef4444', marginBottom: '10px' }}>
                Silme Onayı
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>
                <strong>{showDeleteConfirm.name}</strong> {showDeleteConfirm.type === 'note' ? 'notunu' : 'kategorisini'} silmek istediğinizden emin misiniz?
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '10px' }}>
                Bu işlem geri alınamaz.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <motion.button
                style={secondaryButtonStyle}
                onClick={() => setShowDeleteConfirm(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                İptal
              </motion.button>
              <motion.button
                style={dangerButtonStyle}
                onClick={confirmDelete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={18} />
                Sil
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;