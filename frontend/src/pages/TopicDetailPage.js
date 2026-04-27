import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { forumService } from '../services/api';
import PostCard from '../components/forum/PostCard';
import PostForm from '../components/forum/PostForm';
import './TopicDetailPage.css';

const TopicDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPostForm, setShowPostForm] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    const loadTopicData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Загрузка темы с ID:', id);
            
            const response = await forumService.getTopic(id);
            console.log('Ответ от сервера:', response);
            
            let topicData, postsData;
            
            if (response.topic && response.posts) {
                topicData = response.topic;
                postsData = response.posts;
            } else if (response.id || response.title) {
                topicData = response;
                postsData = [];
            } else {
                throw new Error('Неправильная структура ответа от сервера');
            }
            
            if (!topicData.is_approved && topicData.is_approved !== undefined) {
                setError('Эта тема ожидает модерации и пока недоступна для просмотра.');
                setTopic(topicData);
                setPosts([]);
                return;
            }
            
            setTopic(topicData);
            setPosts(postsData || []);
            
            setPagination(prev => ({
                ...prev,
                total: postsData?.length || 0,
                pages: Math.ceil((postsData?.length || 0) / prev.limit)
            }));
            
        } catch (error) {
            console.error('Ошибка при загрузке темы:', error);
            if (error.response?.status === 404) {
                setError('Тема не найдена. Возможно, она была удалена.');
            } else {
                setError('Не удалось загрузить тему. Пожалуйста, попробуйте позже.');
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadTopicData();
    }, [loadTopicData]);

    const handleAddPost = async (postData) => {
        try {
            console.log('Добавление сообщения:', postData);
            const postWithTopic = {
                ...postData,
                topic_id: parseInt(id)
            };
            const newPost = await forumService.createPost(id, postWithTopic);
            console.log('Новое сообщение добавлено:', newPost);
            setPosts(prev => [newPost, ...prev]);
            if (topic) {
                setTopic(prev => ({
                    ...prev,
                    post_count: (prev.post_count || 0) + 1
                }));
            }
            setShowPostForm(false);
            setTimeout(() => {
                alert('✅ Ваше сообщение добавлено! Оно появится после модерации.');
            }, 100);
        } catch (error) {
            console.error('Ошибка при добавлении сообщения:', error);
            let errorMessage = '❌ Не удалось добавить сообщение. Попробуйте позже.';
            if (error.response?.status === 401) {
                errorMessage = '❌ Для добавления сообщения необходимо авторизоваться.';
            } else if (error.response?.data?.error) {
                errorMessage = `❌ ${error.response.data.error}`;
            }
            alert(errorMessage);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Дата не указана';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Ошибка форматирования даты:', error);
            return dateString;
        }
    };

    const handlePageChange = (newPage) => {
        console.log('Изменение страницы на:', newPage);
        setPagination(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="topic-detail-page">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Загрузка темы...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="topic-detail-page">
                <div className="container">
                    <div className="error-message">
                        <h2>Тема недоступна</h2>
                        <p>{error}</p>
                        <div className="error-actions">
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate('/forum')}
                            >
                                Вернуться на форум
                            </button>
                            <Link to="/forum" className="btn btn-secondary">
                                К списку тем
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="topic-detail-page">
                <div className="container">
                    <div className="error-message">
                        <h2>Ошибка</h2>
                        <p>Данные темы не загружены</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/forum')}
                        >
                            Вернуться на форум
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="topic-detail-page">
            <div className="container">
                {/* Хлебные крошки */}
                <div className="breadcrumbs">
                    <Link to="/">Главная</Link> /{' '}
                    <Link to="/forum">Форум</Link> /{' '}
                    <span>{topic.title || 'Без названия'}</span>
                </div>

                {/* Заголовок темы */}
                <div className="topic-header">
                    <div className="topic-title-section">
                        <h1 className="topic-title">{topic.title || 'Без названия'}</h1>
                        <div className="topic-meta">
                            <span className="meta-item">
                                <span role="img" aria-label="author">👤</span> {topic.author_name || 'Аноним'}
                            </span>
                            <span className="meta-item">
                                <span role="img" aria-label="date">📅</span> {formatDate(topic.created_at)}
                            </span>
                            {topic.category_name && (
                                <span className="meta-item category">
                                    <span role="img" aria-label="category">🏷️</span> {topic.category_name}
                                </span>
                            )}
                            <span className="meta-item">
                                <span role="img" aria-label="comments">💬</span> {topic.post_count || posts.length} ответов
                            </span>
                        </div>
                    </div>
                    
                    <div className="topic-actions">
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowPostForm(!showPostForm)}
                            type="button"
                            disabled={!topic.is_approved && topic.is_approved !== undefined}
                        >
                            {showPostForm ? '✖️ Отмена' : '✏️ Ответить'}
                        </button>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => navigate('/forum')}
                            type="button"
                        >
                            ← Назад к темам
                        </button>
                    </div>
                </div>

                {/* Содержание темы */}
                <div className="topic-content">
                    <div className="original-post">
                        <div className="post-author">
                            <span className="author-avatar">👤</span>
                            <div className="author-info">
                                <span className="author-name">{topic.author_name || 'Аноним'}</span>
                                <span className="post-date">{formatDate(topic.created_at)}</span>
                            </div>
                        </div>
                        <div className="post-content">
                            {topic.content ? (
                                topic.content.split('\n').map((paragraph, index) => (
                                    paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
                                ))
                            ) : (
                                <p>Содержимое темы отсутствует.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Форма добавления сообщения */}
                {showPostForm && (
                    <div className="post-form-section">
                        <PostForm 
                            onSubmit={handleAddPost}
                            onCancel={() => setShowPostForm(false)}
                            topicId={id}
                        />
                    </div>
                )}

                {/* Список ответов */}
                <div className="posts-section">
                    <div className="section-header">
                        <h2>Ответы ({posts.length})</h2>
                        {!showPostForm && topic.is_approved && (
                            <button 
                                className="btn btn-primary btn-small"
                                onClick={() => setShowPostForm(true)}
                                type="button"
                            >
                                + Добавить ответ
                            </button>
                        )}
                    </div>

                    {posts.length === 0 ? (
                        <div className="no-posts">
                            <p>Пока нет ответов. Будьте первым, кто поможет советом!</p>
                            {topic.is_approved && (
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => setShowPostForm(true)}
                                >
                                    Написать первый ответ
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="posts-list">
                                {posts.map(post => (
                                    <PostCard key={post.id || Math.random()} post={post} />
                                ))}
                            </div>

                            {pagination.pages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        disabled={pagination.page === 1}
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        type="button"
                                    >
                                        ← Назад
                                    </button>
                                    <div className="page-numbers">
                                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                            let pageNum;
                                            if (pagination.pages <= 5) {
                                                pageNum = i + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = i + 1;
                                            } else if (pagination.page >= pagination.pages - 2) {
                                                pageNum = pagination.pages - 4 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    type="button"
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        className="pagination-btn"
                                        disabled={pagination.page === pagination.pages}
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        type="button"
                                    >
                                        Вперёд →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Правила комментирования (адаптированы под ветеринарный форум) */}
                <div className="commenting-rules">
                    <h3><span role="img" aria-label="rules">🐾</span> Правила обсуждения</h3>
                    <ul>
                        <li>Указывайте вид, возраст, пол и вес питомца – это помогает точнее оценить ситуацию</li>
                        <li>Опишите симптомы, когда они появились, как менялись со временем</li>
                        <li>Если есть результаты анализов, рентген, МРТ или КТ – приложите снимки (если функция загрузки есть) или подробно опишите заключения</li>
                        <li>Не давайте опасных советов (например, дозировку лекарств без назначения врача). Всегда рекомендуйте обратиться к очному специалисту</li>
                        <li>Будьте вежливы и уважительны к другим участникам и врачу</li>
                        <li>Избегайте оффтопа и флуда. Обсуждайте только здоровье животных</li>
                        <li>Все сообщения проходят модерацию. Ответы, содержащие рекламу или опасные рекомендации, будут удалены</li>
                    </ul>
                    <p className="rules-note">
                        ⚠️ Важно: Дистанционная консультация на форуме не заменяет очный приём. 
                        При острых состояниях (отказ конечностей, судороги, сильная боль) немедленно обращайтесь в ближайшую ветклинику.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TopicDetailPage;