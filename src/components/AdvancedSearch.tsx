import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  User, 
  Tag, 
  Star,
  Download,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import apiService from '../services/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface SearchFilters {
  search: string;
  category: string;
  subject: string;
  semester: string;
  year: string;
  author: string;
  tags: string[];
  minRating: number;
  minDownloads: number;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  categories: Category[];
  initialFilters?: Partial<SearchFilters>;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ 
  onFiltersChange, 
  categories, 
  initialFilters = {} 
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    category: '',
    subject: '',
    semester: '',
    year: '',
    author: '',
    tags: [],
    minRating: 0,
    minDownloads: 0,
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Load filter options
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      // Get unique values for filters
      const response = await apiService.getNotes({ limit: '1000' });
      const notes = response.data.notes || [];
      
      const subjects = [...new Set(notes.map(note => note.subject).filter(Boolean))];
      const semesters = [...new Set(notes.map(note => note.semester).filter(Boolean))];
      const years = [...new Set(notes.map(note => note.year).filter(Boolean))];
      
      setAvailableSubjects(subjects);
      setAvailableSemesters(semesters);
      setAvailableYears(years);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
      const newTags = [...filters.tags, tagInput.trim()];
      handleFilterChange('tags', newTags);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = filters.tags.filter(tag => tag !== tagToRemove);
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      search: '',
      category: '',
      subject: '',
      semester: '',
      year: '',
      author: '',
      tags: [],
      minRating: 0,
      minDownloads: 0,
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '30px',
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
    '&::placeholder': {
      color: '#94a3b8',
    },
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

  const tagStyle = {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginRight: '8px',
    marginBottom: '8px',
  };

  const removeTagStyle = {
    background: 'none',
    border: 'none',
    color: '#22c55e',
    cursor: 'pointer',
    padding: '2px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
    },
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Basic Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Notlarda ara..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{ ...inputStyle, paddingLeft: '45px' }}
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={selectStyle}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <select
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            style={selectStyle}
          >
            <option value="">Tüm Dersler</option>
            {availableSubjects.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '120px' }}>
          <select
            value={filters.semester}
            onChange={(e) => handleFilterChange('semester', e.target.value)}
            style={selectStyle}
          >
            <option value="">Tüm Dönemler</option>
            {availableSemesters.map(semester => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '100px' }}>
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            style={selectStyle}
          >
            <option value="">Tüm Yıllar</option>
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <motion.button
          style={secondaryButtonStyle}
          onClick={() => setShowAdvanced(!showAdvanced)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={18} />
          Gelişmiş Filtreler
          {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </motion.button>

        <motion.button
          style={secondaryButtonStyle}
          onClick={clearFilters}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={18} />
          Temizle
        </motion.button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}
        >
          {/* Rating and Downloads */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                Minimum Puan
              </label>
              <div style={{ position: 'relative' }}>
                <Star size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value) || 0)}
                  style={{ ...inputStyle, paddingLeft: '45px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                Minimum İndirme
              </label>
              <div style={{ position: 'relative' }}>
                <Download size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="number"
                  min="0"
                  value={filters.minDownloads}
                  onChange={(e) => handleFilterChange('minDownloads', parseInt(e.target.value) || 0)}
                  style={{ ...inputStyle, paddingLeft: '45px' }}
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                Başlangıç Tarihi
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '45px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                Bitiş Tarihi
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '45px' }}
                />
              </div>
            </div>
          </div>

          {/* Author */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
              Yazar
            </label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Yazar adı..."
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                style={{ ...inputStyle, paddingLeft: '45px' }}
              />
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
              Etiketler
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Etiket ekle..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                  style={{ ...inputStyle, paddingLeft: '45px' }}
                />
              </div>
              <motion.button
                style={primaryButtonStyle}
                onClick={handleTagAdd}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ekle
              </motion.button>
            </div>
            
            {filters.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {filters.tags.map((tag, index) => (
                  <span key={index} style={tagStyle}>
                    #{tag}
                    <motion.button
                      style={removeTagStyle}
                      onClick={() => handleTagRemove(tag)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={14} />
                    </motion.button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                Sıralama
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                style={selectStyle}
              >
                <option value="createdAt">Tarih</option>
                <option value="downloadCount">İndirme Sayısı</option>
                <option value="viewCount">Görüntülenme</option>
                <option value="rating">Puan</option>
                <option value="title">Başlık</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                Sıralama Yönü
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                style={selectStyle}
              >
                <option value="desc">Azalan</option>
                <option value="asc">Artan</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdvancedSearch;
