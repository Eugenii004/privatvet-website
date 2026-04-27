// frontend/src/pages/admin/ForumModerationPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ForumModerationPage.css';

const ForumModerationPage = () => {
    const [pendingTopics, setPendingTopics] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [allTopics, setAllTopics] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('pendingTopics');

    const getToken = () => localStorage.getItem('token');

    const loadAllForumContent = async () => {
        try {
            setLoading(true);
            setError('');
            
            const token = getToken();
            if (!token) {
                throw new Error('Требуется авторизация');
            }

            console.log('🔍 Загрузка контента ветеринарного форума...');

            const [pendingTopicsRes, pendingPostsRes, allTopicsRes, allPostsRes] = await Promise.all([
                fetch('http://localhost:5000/api/forum/moderation/topics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/forum/moderation/posts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/forum/admin/topics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/forum/admin/posts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const pendingTopics = pendingTopicsRes.ok ? await pendingTopicsRes.json() : [];
            const pendingPosts = pendingPostsRes.ok ? await pendingPostsRes.json() : [];
            const allTopics = allTopicsRes.ok ? await allTopicsRes.json() : [];
            const allPosts = allPostsRes.ok ? await allPostsRes.json() : [];

            setPendingTopics(pendingTopics);
            setPendingPosts(pendingPosts);
            setAllTopics(allTopics);
            setAllPosts(allPosts);
            
            console.log(`✅ Загружено: 
              ${pendingTopics.length} тем на модерации,
              ${pendingPosts.length} сообщений на модерации,
              ${allTopics.length} всех тем,
              ${allPosts.length} всех сообщений`);

        } catch (err) {
            console.error('❌ Ошибка загрузки:', err);
            setError(`Не удалось загрузить данные: ${err.message}`);
            
            // Демо-данные для ветеринарного форума
            setPendingTopics([
                {
                    id: 6,
                    title: "Собака не встаёт на задние лапы: что делать?",
                    content: "Корги, 6 лет, внезапно отказали задние лапы. МРТ сделали – грыжа диска. Нужна операция?",
                    category_name: "Неврология",
                    author_name: "Ольга",
                    created_at: "2026-01-23T13:12:22.985Z",
                    is_approved: false
                }
            ]);
            setAllTopics([
                {
                    id: 1,
                    title: "Артроскопия колена у кошки: опыт и восстановление",
                    content: "Кошка после операции, делюсь опытом реабилитации.",
                    category_name: "Хирургия",
                    author_name: "Екатерина",
                    created_at: "2026-01-22T10:00:00.000Z",
                    is_approved: true,
                    views: 10
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const deleteTopic = async (id, title) => {
        if (!window.confirm(`Удалить тему "${title}"? Это действие необратимо.`)) return;

        try {
            const token = getToken();
            let response = await fetch(`http://localhost:5000/api/forum/moderation/topics/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                response = await fetch(`http://localhost:5000/api/forum/admin/topics/${id}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.ok) {
                alert('Тема удалена!');
                loadAllForumContent();
            } else {
                alert('Ошибка удаления темы');
            }
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Ошибка сервера');
        }
    };

    const deletePost = async (id) => {
        if (!window.confirm('Удалить это сообщение? Действие необратимо.')) return;

        try {
            const token = getToken();
            let response = await fetch(`http://localhost:5000/api/forum/moderation/posts/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                response = await fetch(`http://localhost:5000/api/forum/admin/posts/${id}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.ok) {
                alert('Сообщение удалено!');
                loadAllForumContent();
            } else {
                alert('Ошибка удаления сообщения');
            }
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Ошибка сервера');
        }
    };

    const approveTopic = async (id) => {
        if (!window.confirm('Одобрить эту тему?')) return;

        try {
            const token = getToken();
            const response = await fetch(`http://localhost:5000/api/forum/moderation/topics/${id}/approve`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Тема одобрена!');
                loadAllForumContent();
            } else {
                alert('Ошибка одобрения темы');
            }
        } catch (error) {
            console.error('Ошибка одобрения:', error);
            alert('Ошибка сервера');
        }
    };

    const approvePost = async (id) => {
        if (!window.confirm('Одобрить это сообщение?')) return;

        try {
            const token = getToken();
            const response = await fetch(`http://localhost:5000/api/forum/moderation/posts/${id}/approve`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Сообщение одобрено!');
                loadAllForumContent();
            } else {
                alert('Ошибка одобрения сообщения');
            }
        } catch (error) {
            console.error('Ошибка одобрения:', error);
            alert('Ошибка сервера');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    useEffect(() => {
        loadAllForumContent();
    }, []);

    if (loading) {
        return (
            <div className="moderation-container">
                <div className="loading">Загрузка контента форума...</div>
            </div>
        );
    }

    return (
        <div className="moderation-container">
            <div className="moderation-header">
                <h1>Модерация ветеринарного форума</h1>
                <div className="header-actions">
                    <button onClick={loadAllForumContent} className="btn-refresh">
                        🔄 Обновить
                    </button>
                    <Link to="/admin" className="btn-back">
                        ← Назад в панель
                    </Link>
                </div>
            </div>

            {error && (
                <div className="alert alert-warning">
                    <strong>Внимание:</strong> {error}
                </div>
            )}

            <div className="moderation-stats">
                <div className="stat-item">
                    <div className="stat-value">{pendingTopics.length}</div>
                    <div className="stat-label">Тем на модерации</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{pendingPosts.length}</div>
                    <div className="stat-label">Сообщений на модерации</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{allTopics.length}</div>
                    <div className="stat-label">Всего тем</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{allPosts.length}</div>
                    <div className="stat-label">Всего сообщений</div>
                </div>
            </div>

            <div className="moderation-tabs">
                <button 
                    className={`tab ${activeTab === 'pendingTopics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pendingTopics')}
                >
                    Темы на модерации ({pendingTopics.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'pendingPosts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pendingPosts')}
                >
                    Сообщения на модерации ({pendingPosts.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'allTopics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('allTopics')}
                >
                    Все темы ({allTopics.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'allPosts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('allPosts')}
                >
                    Все сообщения ({allPosts.length})
                </button>
            </div>

            {activeTab === 'pendingTopics' && (
                <div className="moderation-content">
                    <h2>Темы на модерации</h2>
                    {pendingTopics.length === 0 ? (
                        <div className="empty-state">
                            <p>🎉 Нет тем на модерации!</p>
                            <p>Все ветеринарные вопросы проверены.</p>
                        </div>
                    ) : (
                        <div className="topics-list">
                            {pendingTopics.map(topic => (
                                <div key={topic.id} className="moderation-item">
                                    <div className="item-header">
                                        <h3>{topic.title}</h3>
                                        <div className="item-meta">
                                            <span className="category">📁 {topic.category_name}</span>
                                            <span className="author">👤 {topic.author_name}</span>
                                            <span className="date">📅 {formatDate(topic.created_at)}</span>
                                            <span className="status pending">⏳ На модерации</span>
                                        </div>
                                    </div>
                                    <div className="item-content">
                                        <p>{topic.content}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button onClick={() => approveTopic(topic.id)} className="btn-approve">✅ Одобрить</button>
                                        <button onClick={() => deleteTopic(topic.id, topic.title)} className="btn-delete">🗑️ Удалить</button>
                                        <Link to={`/forum/topics/${topic.id}`} target="_blank" className="btn-preview">👁️ Просмотр</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'pendingPosts' && (
                <div className="moderation-content">
                    <h2>Сообщения на модерации</h2>
                    {pendingPosts.length === 0 ? (
                        <div className="empty-state">
                            <p>🎉 Нет сообщений на модерации!</p>
                        </div>
                    ) : (
                        <div className="posts-list">
                            {pendingPosts.map(post => (
                                <div key={post.id} className="moderation-item">
                                    <div className="item-header">
                                        <h3>Ответ в теме: <strong>{post.topic_title}</strong></h3>
                                        <div className="item-meta">
                                            <span className="author">👤 {post.author_name}</span>
                                            <span className="date">📅 {formatDate(post.created_at)}</span>
                                            <span className="status pending">⏳ На модерации</span>
                                        </div>
                                    </div>
                                    <div className="item-content">
                                        <p>{post.content}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button onClick={() => approvePost(post.id)} className="btn-approve">✅ Одобрить</button>
                                        <button onClick={() => deletePost(post.id)} className="btn-delete">🗑️ Удалить</button>
                                        <Link to={`/forum/topics/${post.topic_id}`} target="_blank" className="btn-preview">👁️ К теме</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'allTopics' && (
                <div className="moderation-content">
                    <h2>Все темы форума</h2>
                    <p className="subtitle">Вы можете удалить любую тему, даже одобренную</p>
                    {allTopics.length === 0 ? (
                        <div className="empty-state">
                            <p>😕 Нет тем на форуме</p>
                        </div>
                    ) : (
                        <div className="topics-list">
                            {allTopics.map(topic => (
                                <div key={topic.id} className="moderation-item">
                                    <div className="item-header">
                                        <h3>{topic.title}</h3>
                                        <div className="item-meta">
                                            <span className="category">📁 {topic.category_name}</span>
                                            <span className="author">👤 {topic.author_name}</span>
                                            <span className="date">📅 {formatDate(topic.created_at)}</span>
                                            <span className="views">👁️ {topic.views || 0}</span>
                                            {topic.is_approved ? <span className="status approved">✅ Одобрена</span> : <span className="status pending">⏳ На модерации</span>}
                                        </div>
                                    </div>
                                    <div className="item-content">
                                        <p>{topic.content}</p>
                                    </div>
                                    <div className="item-actions">
                                        {!topic.is_approved && <button onClick={() => approveTopic(topic.id)} className="btn-approve">✅ Одобрить</button>}
                                        <button onClick={() => deleteTopic(topic.id, topic.title)} className="btn-delete">🗑️ Удалить</button>
                                        <Link to={`/forum/topics/${topic.id}`} target="_blank" className="btn-preview">👁️ Просмотр</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'allPosts' && (
                <div className="moderation-content">
                    <h2>Все сообщения форума</h2>
                    {allPosts.length === 0 ? (
                        <div className="empty-state">
                            <p>😕 Нет сообщений</p>
                        </div>
                    ) : (
                        <div className="posts-list">
                            {allPosts.map(post => (
                                <div key={post.id} className="moderation-item">
                                    <div className="item-header">
                                        <h3>Сообщение в теме: <strong>{post.topic_title || `ID: ${post.topic_id}`}</strong></h3>
                                        <div className="item-meta">
                                            <span className="author">👤 {post.author_name}</span>
                                            <span className="date">📅 {formatDate(post.created_at)}</span>
                                            {post.is_approved ? <span className="status approved">✅ Одобрено</span> : <span className="status pending">⏳ На модерации</span>}
                                        </div>
                                    </div>
                                    <div className="item-content">
                                        <p>{post.content}</p>
                                    </div>
                                    <div className="item-actions">
                                        {!post.is_approved && <button onClick={() => approvePost(post.id)} className="btn-approve">✅ Одобрить</button>}
                                        <button onClick={() => deletePost(post.id)} className="btn-delete">🗑️ Удалить</button>
                                        <Link to={`/forum/topics/${post.topic_id}`} target="_blank" className="btn-preview">👁️ К теме</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="moderation-tips">
                <h3>💡 Советы модератору ветеринарного форума:</h3>
                <ul>
                    <li><strong>Вкладка "Все темы"</strong> – для удаления любых тем (даже одобренных)</li>
                    <li><strong>Темы на модерации</strong> – одобряйте вопросы, соответствующие тематике (ортопедия, неврология, хирургия, реабилитация)</li>
                    <li>Удаляйте спам, рекламу, опасные советы (например, дозировки лекарств без назначения врача)</li>
                    <li>Одобряйте конструктивные обсуждения и полезный опыт владельцев</li>
                    <li>Напоминайте участникам, что дистанционная консультация не заменяет очный приём при острых состояниях</li>
                </ul>
            </div>
        </div>
    );
};

export default ForumModerationPage;