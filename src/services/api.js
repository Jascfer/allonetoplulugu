// services/api.js - API servisleri
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://allonetoplulugu-production.up.railway.app' : 'http://localhost:5000');

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', url, options); // Debug log
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('API Response:', response.status, response.statusText); // Debug log
      
      // Response'un JSON olup olmadığını kontrol et
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Network hatası kontrolü
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
      }
      
      // JSON parse hatası kontrolü
      if (error.name === 'SyntaxError') {
        throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      }
      
      throw error;
    }
  }

  // Auth API - Real implementation
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Categories API
  async getCategories() {
    return this.request('/api/categories');
  }

  async createCategory(categoryData) {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Notes API - Updated
  async getNotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/notes${queryString ? `?${queryString}` : ''}`);
  }

  async createNote(noteData) {
    return this.request('/api/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(id, noteData) {
    return this.request(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(id) {
    return this.request(`/api/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async downloadNote(id) {
    return this.request(`/api/notes/${id}/download`, {
      method: 'PUT',
    });
  }

  // Upload API
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    }).then(res => res.json());
  }

  // Note Interactions API
  async rateNote(noteId, rating) {
    return this.request(`/api/notes/${noteId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  }

  async addComment(noteId, content) {
    return this.request(`/api/notes/${noteId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async toggleFavorite(noteId) {
    return this.request(`/api/notes/${noteId}/favorite`, {
      method: 'POST',
    });
  }

  // User Management API
  async updateProfile(profileData) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getUserNotes(userId) {
    return this.request(`/api/users/${userId}/notes`);
  }

  async getUserFavorites() {
    return this.request('/api/users/favorites');
  }

  // Avatar Upload API
  async uploadAvatar(formData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${this.baseURL}/api/auth/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Avatar upload failed');
    }

    return response.json();
  }

  // Community API
  async getCommunityPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/community/posts${queryString ? `?${queryString}` : ''}`);
  }

  async createCommunityPost(postData) {
    return this.request('/api/community/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likeCommunityPost(postId) {
    return this.request(`/api/community/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async addCommentToPost(postId, content) {
    return this.request(`/api/community/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async likeComment(postId, commentId) {
    return this.request(`/api/community/posts/${postId}/comments/${commentId}/like`, {
      method: 'POST',
    });
  }

  // Daily Questions API
  async getDailyQuestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/daily-questions${queryString ? `?${queryString}` : ''}`);
  }

  async getTodaysQuestion() {
    return this.request('/api/daily-questions/today');
  }

  async createDailyQuestion(questionData) {
    return this.request('/api/daily-questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  async submitAnswer(questionId, content) {
    return this.request(`/api/daily-questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async likeQuestion(questionId) {
    return this.request(`/api/daily-questions/${questionId}/like`, {
      method: 'POST',
    });
  }

  async likeAnswer(questionId, answerId) {
    return this.request(`/api/daily-questions/${questionId}/answers/${answerId}/like`, {
      method: 'POST',
    });
  }

  async acceptAnswer(questionId, answerId) {
    return this.request(`/api/daily-questions/${questionId}/answers/${answerId}/accept`, {
      method: 'PUT',
    });
  }

  // User Statistics API
  async getUserStats() {
    return this.request('/api/auth/stats');
  }

  // Admin API
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUser(userId) {
    return this.request(`/api/admin/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async toggleUserStatus(userId) {
    return this.request(`/api/admin/users/${userId}/toggle-status`, {
      method: 'POST',
    });
  }

  async getAnalytics() {
    return this.request('/api/admin/analytics');
  }
}

const apiService = new ApiService();
export default apiService;
