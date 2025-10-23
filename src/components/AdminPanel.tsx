import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Link } from 'lucide-react';
import apiService from '../services/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  subject: string;
  grade: string;
  isActive: boolean;
}

interface Note {
  _id: string;
  title: string;
  description: string;
  category: Category;
  googleDriveUrl: string;
  downloadCount: number;
  viewCount: number;
  rating: number;
  tags: string[];
  author: {
    name: string;
  };
  createdAt: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'categories'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Note form
  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    category: '',
    googleDriveUrl: '',
    tags: ''
  });

  // Category form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    subject: '',
    grade: ''
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'notes') {
        const response = await apiService.request('/api/notes');
        setNotes(response.data.notes || []);
      } else {
        const response = await apiService.request('/api/categories');
        setCategories(response.data || []);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const noteData = {
        ...noteForm,
        tags: noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingNote) {
        await apiService.request(`/api/notes/${editingNote._id}`, {
          method: 'PUT',
          body: JSON.stringify(noteData)
        });
      } else {
        await apiService.request('/api/notes', {
          method: 'POST',
          body: JSON.stringify(noteData)
        });
      }

      setShowNoteForm(false);
      setEditingNote(null);
      setNoteForm({ title: '', description: '', category: '', googleDriveUrl: '', tags: '' });
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
    try {
      if (editingCategory) {
        await apiService.request(`/api/categories/${editingCategory._id}`, {
          method: 'PUT',
          body: JSON.stringify(categoryForm)
        });
      } else {
        await apiService.request('/api/categories', {
          method: 'POST',
          body: JSON.stringify(categoryForm)
        });
      }

      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', subject: '', grade: '' });
      loadData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Bu notu silmek istediğinizden emin misiniz?')) return;
    
    try {
      await apiService.request(`/api/notes/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    
    try {
      await apiService.request(`/api/categories/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const openNoteForm = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNoteForm({
        title: note.title,
        description: note.description,
        category: note.category._id,
        googleDriveUrl: note.googleDriveUrl,
        tags: note.tags.join(', ')
      });
    } else {
      setEditingNote(null);
      setNoteForm({ title: '', description: '', category: '', googleDriveUrl: '', tags: '' });
    }
    setShowNoteForm(true);
  };

  const openCategoryForm = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description,
        subject: category.subject,
        grade: category.grade
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', subject: '', grade: '' });
    }
    setShowCategoryForm(true);
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  };

  const headerStyle = {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center' as const
  };

  const tabStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  };

  const tabButtonStyle = (active: boolean) => ({
    padding: '10px 20px',
    backgroundColor: active ? '#3b82f6' : '#e2e8f0',
    color: active ? 'white' : '#64748b',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  });

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444'
  };

  const formStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '10px'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0', fontSize: '24px' }}>📚 Admin Panel</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.8 }}>Notlar ve Kategoriler Yönetimi</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      <div style={tabStyle}>
        <button
          style={tabButtonStyle(activeTab === 'notes')}
          onClick={() => setActiveTab('notes')}
        >
          📝 Notlar ({notes.length})
        </button>
        <button
          style={tabButtonStyle(activeTab === 'categories')}
          onClick={() => setActiveTab('categories')}
        >
          🏷️ Kategoriler ({categories.length})
        </button>
      </div>

      {activeTab === 'notes' && (
        <>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button
              style={buttonStyle}
              onClick={() => openNoteForm()}
            >
              <Plus size={16} />
              Yeni Not
            </button>
          </div>

          {showNoteForm && (
            <div style={formStyle}>
              <h3>{editingNote ? 'Not Düzenle' : 'Yeni Not Ekle'}</h3>
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
                  style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                  required
                />
                <select
                  value={noteForm.category}
                  onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                  style={selectStyle}
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} ({cat.subject} - {cat.grade}. Sınıf)
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="Google Drive URL (https://drive.google.com/file/d/...)"
                  value={noteForm.googleDriveUrl}
                  onChange={(e) => setNoteForm({ ...noteForm, googleDriveUrl: e.target.value })}
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
                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
                    onClick={() => setShowNoteForm(false)}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    style={buttonStyle}
                    disabled={loading}
                  >
                    {loading ? 'Kaydediliyor...' : (editingNote ? 'Güncelle' : 'Kaydet')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '18px' }}>Yükleniyor...</div>
            </div>
          ) : (
            notes.map(note => (
              <div key={note._id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{note.title}</h3>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>
                      {note.description}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#64748b' }}>
                      <span>📁 {note.category.name}</span>
                      <span>👤 {note.author.name}</span>
                      <span>👁️ {note.viewCount}</span>
                      <span>⬇️ {note.downloadCount}</span>
                      <span>⭐ {note.rating.toFixed(1)}</span>
                    </div>
                    {note.tags.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        {note.tags.map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              marginRight: '4px'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      style={buttonStyle}
                      onClick={() => window.open(note.googleDriveUrl, '_blank')}
                    >
                      <Link size={14} />
                    </button>
                    <button
                      style={buttonStyle}
                      onClick={() => openNoteForm(note)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      style={dangerButtonStyle}
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button
              style={buttonStyle}
              onClick={() => openCategoryForm()}
            >
              <Plus size={16} />
              Yeni Kategori
            </button>
          </div>

          {showCategoryForm && (
            <div style={formStyle}>
              <h3>{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h3>
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
                  style={{ ...inputStyle, height: '60px', resize: 'vertical' }}
                />
                <select
                  value={categoryForm.subject}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subject: e.target.value })}
                  style={selectStyle}
                  required
                >
                  <option value="">Ders Seçin</option>
                  <option value="matematik">Matematik</option>
                  <option value="fizik">Fizik</option>
                  <option value="kimya">Kimya</option>
                  <option value="biyoloji">Biyoloji</option>
                  <option value="turkce">Türkçe</option>
                  <option value="tarih">Tarih</option>
                  <option value="cografya">Coğrafya</option>
                  <option value="felsefe">Felsefe</option>
                  <option value="edebiyat">Edebiyat</option>
                </select>
                <select
                  value={categoryForm.grade}
                  onChange={(e) => setCategoryForm({ ...categoryForm, grade: e.target.value })}
                  style={selectStyle}
                  required
                >
                  <option value="">Sınıf Seçin</option>
                  <option value="9">9. Sınıf</option>
                  <option value="10">10. Sınıf</option>
                  <option value="11">11. Sınıf</option>
                  <option value="12">12. Sınıf</option>
                </select>
                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    style={{ ...buttonStyle, backgroundColor: '#6b7280' }}
                    onClick={() => setShowCategoryForm(false)}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    style={buttonStyle}
                    disabled={loading}
                  >
                    {loading ? 'Kaydediliyor...' : (editingCategory ? 'Güncelle' : 'Kaydet')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '18px' }}>Yükleniyor...</div>
            </div>
          ) : (
            categories.map(category => (
              <div key={category._id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{category.name}</h3>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>
                      {category.description}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#64748b' }}>
                      <span>📚 {category.subject}</span>
                      <span>🎓 {category.grade}. Sınıf</span>
                      <span style={{ color: category.isActive ? '#059669' : '#dc2626' }}>
                        {category.isActive ? '✅ Aktif' : '❌ Pasif'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      style={buttonStyle}
                      onClick={() => openCategoryForm(category)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      style={dangerButtonStyle}
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
