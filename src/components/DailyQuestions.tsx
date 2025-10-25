import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MessageCircle, 
  ThumbsUp, 
  Send,
  BookOpen,
  Lightbulb,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface DailyQuestion {
  _id: string;
  question: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  createdAt: string;
  answers: Answer[];
  likes: string[];
  isAnswered: boolean;
}

interface Answer {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: string[];
  isAccepted: boolean;
}

const DailyQuestions: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<DailyQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getDailyQuestions({ limit: '10' });
      const questions = response.data.questions || [];
      setQuestions(questions);
      if (questions.length > 0) {
        setCurrentQuestion(questions[0]);
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load questions from API
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAnswerSubmit = async () => {
    if (!answerText.trim() || !isAuthenticated || !currentQuestion) return;
    
    setSubmittingAnswer(true);
    try {
      const response = await apiService.submitAnswer(currentQuestion._id, answerText);
      const newAnswer = response.data.answer;
      
      const updatedQuestion = {
        ...currentQuestion,
        answers: [...currentQuestion.answers, newAnswer]
      };

      setCurrentQuestion(updatedQuestion);
      setAnswerText('');
    } catch (error) {
      console.error('Answer submission error:', error);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleLikeQuestion = async (questionId: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await apiService.likeQuestion(questionId);
      setQuestions(prev => prev.map(q => 
        q._id === questionId 
          ? { 
              ...q, 
              likes: response.data.isLiked 
                ? [...q.likes, user!.id]
                : q.likes.filter(id => id !== user!.id)
            }
          : q
      ));
      
      if (currentQuestion && currentQuestion._id === questionId) {
        setCurrentQuestion(prev => prev ? {
          ...prev,
          likes: response.data.isLiked 
            ? [...prev.likes, user!.id]
            : prev.likes.filter(id => id !== user!.id)
        } : null);
      }
    } catch (error) {
      console.error('Like question error:', error);
    }
  };

  const handleLikeAnswer = async (answerId: string) => {
    if (!isAuthenticated || !currentQuestion) return;
    
    try {
      const response = await apiService.likeAnswer(currentQuestion._id, answerId);
      const updatedAnswers = currentQuestion.answers.map(answer =>
        answer._id === answerId 
          ? { 
              ...answer, 
              likes: response.data.isLiked 
                ? [...answer.likes, user!.id]
                : answer.likes.filter(id => id !== user!.id)
            }
          : answer
      );
      
      setCurrentQuestion(prev => prev ? {
        ...prev,
        answers: updatedAnswers
      } : null);
    } catch (error) {
      console.error('Like answer error:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Kolay';
      case 'medium': return 'Orta';
      case 'hard': return 'Zor';
      default: return 'Bilinmiyor';
    }
  };

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
    padding: '30px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '20px',
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
    resize: 'vertical' as const,
    minHeight: '100px',
    '&::placeholder': {
      color: '#94a3b8',
    },
  };

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
          <Lightbulb size={48} style={{ marginRight: '15px', verticalAlign: 'middle' }} />
          Günlük Sorular
        </h1>
        <p style={subtitleStyle}>
          Her gün yeni sorularla bilginizi test edin ve toplulukla etkileşim kurun.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Questions List */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px', color: 'white' }}>
            Sorular
          </h2>
          
          {questions.map((question, index) => (
            <motion.div
              key={question._id}
              style={{
                ...cardStyle,
                cursor: 'pointer',
                border: currentQuestion?._id === question._id ? '2px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: currentQuestion?._id === question._id ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              }}
              onClick={() => setCurrentQuestion(question)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                    {question.question}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>
                    {question.description.substring(0, 100)}...
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    backgroundColor: getDifficultyColor(question.difficulty),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {getDifficultyText(question.difficulty)}
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {question.points} puan
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageCircle size={14} />
                    {question.answers.length} cevap
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ThumbsUp size={14} />
                    {question.likes.length}
                  </span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} />
                  {new Date(question.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Question Detail */}
        {currentQuestion && (
          <div>
            <motion.div
              style={cardStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: 0 }}>
                    {currentQuestion.question}
                  </h2>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{
                      backgroundColor: getDifficultyColor(currentQuestion.difficulty),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {getDifficultyText(currentQuestion.difficulty)}
                    </span>
                    <span style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      color: '#22c55e',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      <Award size={14} style={{ marginRight: '4px' }} />
                      {currentQuestion.points} puan
                    </span>
                  </div>
                </div>
                
                <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' }}>
                  {currentQuestion.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: '#94a3b8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} />
                      {new Date(currentQuestion.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={16} />
                      {currentQuestion.category}
                    </span>
                  </div>
                  
                  <motion.button
                    style={{
                      ...secondaryButtonStyle,
                      backgroundColor: currentQuestion.likes.includes(user?.id || '') ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                      color: currentQuestion.likes.includes(user?.id || '') ? 'white' : '#cbd5e1',
                    }}
                    onClick={() => handleLikeQuestion(currentQuestion._id)}
                    disabled={!isAuthenticated}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ThumbsUp size={16} />
                    {currentQuestion.likes.length}
                  </motion.button>
                </div>
              </div>

              {/* Answer Form */}
              {isAuthenticated && (
                <div style={{ marginBottom: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: 'white' }}>
                    Cevabınızı Yazın
                  </h3>
                  <textarea
                    placeholder="Sorunuzun cevabını buraya yazın..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    style={inputStyle}
                    disabled={submittingAnswer}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                    <motion.button
                      style={primaryButtonStyle}
                      onClick={handleAnswerSubmit}
                      disabled={!answerText.trim() || submittingAnswer}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send size={18} />
                      {submittingAnswer ? 'Gönderiliyor...' : 'Cevap Gönder'}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Answers */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px', color: 'white' }}>
                  Cevaplar ({currentQuestion.answers.length})
                </h3>
                
                {currentQuestion.answers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <MessageCircle size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <p>Henüz cevap verilmemiş. İlk cevabı siz verin!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {currentQuestion.answers.map((answer, index) => (
                      <motion.div
                        key={answer._id}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          padding: '20px',
                          borderRadius: '12px',
                          border: answer.isAccepted ? '2px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={answer.author.avatar}
                              alt={answer.author.name}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                                {answer.author.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                {new Date(answer.createdAt).toLocaleDateString('tr-TR')}
                              </div>
                            </div>
                          </div>
                          
                          {answer.isAccepted && (
                            <span style={{
                              backgroundColor: '#22c55e',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              ✓ Kabul Edildi
                            </span>
                          )}
                        </div>
                        
                        <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '15px' }}>
                          {answer.content}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <motion.button
                            style={{
                              ...secondaryButtonStyle,
                              backgroundColor: answer.likes.includes(user?.id || '') ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                              color: answer.likes.includes(user?.id || '') ? 'white' : '#cbd5e1',
                              padding: '8px 16px',
                              fontSize: '14px',
                            }}
                            onClick={() => handleLikeAnswer(answer._id)}
                            disabled={!isAuthenticated}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ThumbsUp size={14} />
                            {answer.likes.length}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyQuestions;
