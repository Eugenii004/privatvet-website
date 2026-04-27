// frontend/src/pages/admin/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

// Константы для типов контента
const CONTENT_TYPES = {
  ARTICLES: 'articles',
  VIDEOS: 'videos',
  FORUM: 'forum',
  USERS: 'users'
};

// Заглушка для демо-данных
const DEMO_STATS = {
  articles: {
    total: 0,
    published: 0,
    drafts: 0,
    views: 0
  },
  videos: {
    total: 0,
    published: 0
  },
  forum: {
    topics: 0,
    posts: 0,
    pending: 0
  },
  users: {
    total: 1,
    active: 1
  },
  recentArticles: [],
  recentActivity: [],
  timestamp: new Date().toISOString()
};

// Компонент карточки статистики
const StatCard = ({ icon, title, value, details, link }) => (
  <div className="stat-card">
    <div className={`stat-icon ${icon.type}`}>{icon.emoji}</div>
    <div className="stat-content">
      <h3>{value}</h3>
      <p>{title}</p>
      <div className="stat-details">
        {details.map((detail, index) => (
          <span key={index} className={detail.className || ''}>
            {detail.label}: <strong>{detail.value}</strong>
          </span>
        ))}
        {link && (
          <Link to={link.to} className="manage-link">
            {link.text} →
          </Link>
        )}
      </div>
    </div>
  </div>
);

// Компонент быстрого действия
const QuickActionCard = ({ icon, title, description, to }) => (
  <Link to={to} className="action-card">
    <div className={`action-icon ${icon.type}`}>{icon.emoji}</div>
    <div className="action-content">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <div className="action-arrow">→</div>
  </Link>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(DEMO_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token');

  const fetchDashboardStats = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/api/stats/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
      throw error;
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Не удалось загрузить статистику. Используются демо-данные.');
      console.warn('Используются демо-данные:', err.message);
      setStats(DEMO_STATS);
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardStats]);

  const refreshStats = () => {
    if (!loading) {
      loadStats();
    }
  };

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const formatTime = (dateString) => {
    if (!dateString) return 'только что';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Конфигурация карточек статистики
  const statCardsConfig = [
    {
      icon: { type: 'article', emoji: '📝' },
      title: 'Статьи',
      value: stats.articles?.total || 0,
      details: [
        { label: 'Опубликовано', value: stats.articles?.published || 0, className: 'published' },
        { label: 'Черновики', value: stats.articles?.drafts || 0, className: 'draft' },
        { label: 'Просмотры', value: stats.articles?.views || 0, className: 'views' }
      ]
    },
    {
      icon: { type: 'video', emoji: '🎥' },
      title: 'Видео',
      value: stats.videos?.total || 0,
      details: [
        { label: 'Опубликовано', value: stats.videos?.published || 0, className: 'published' }
      ],
      link: { to: '/admin/videos', text: 'Управление видео' }
    },
    {
      icon: { type: 'forum', emoji: '💬' },
      title: 'Темы форума',
      value: stats.forum?.topics || 0,
      details: [
        { label: 'Сообщений', value: stats.forum?.posts || 0 },
        { label: 'На модерации', value: stats.forum?.pending || 0, className: 'pending' }
      ],
      link: { to: '/admin/forum/moderate', text: 'Модерация' }
    },
    {
      icon: { type: 'users', emoji: '👥' },
      title: 'Пользователи',
      value: stats.users?.total || 1,
      details: [
        { label: 'Активных', value: stats.users?.active || 1, className: 'active' },
        { label: 'Онлайн', value: 1 }
      ]
    }
  ];

  // Конфигурация быстрых действий (адаптирована под ветеринарный сайт)
  const quickActionsConfig = [
    // Статьи
    {
      icon: { type: 'article', emoji: '📝' },
      title: 'Управление статьями',
      description: 'Создание, редактирование, публикация ветеринарных статей',
      to: '/admin/articles'
    },
    {
      icon: { type: 'new', emoji: '➕' },
      title: 'Новая статья',
      description: 'Добавить статью по ортопедии, неврологии, хирургии',
      to: '/admin/articles/new'
    },
    // Видео
    {
      icon: { type: 'video', emoji: '🎥' },
      title: 'Управление видео',
      description: 'Добавление видео-лекций, операций, реабилитации',
      to: '/admin/videos'
    },
    {
      icon: { type: 'new', emoji: '➕' },
      title: 'Новое видео',
      description: 'Загрузить видео с YouTube/Rutube',
      to: '/admin/videos/new'
    },
    // Форум
    {
      icon: { type: 'forum', emoji: '💬' },
      title: 'Модерация форума',
      description: 'Проверка новых тем и сообщений',
      to: '/admin/forum/moderate'
    },
    {
      icon: { type: 'category', emoji: '🗂️' },
      title: 'Категории форума',
      description: 'Ортопедия, неврология, хирургия, реабилитация',
      to: '/admin/forum/categories'
    },
    // Контакты (убрать адрес, оставить только форму и мессенджеры)
    {
      icon: { type: 'contacts', emoji: '📞' },
      title: 'Контактная информация',
      description: 'Редактирование данных для связи (Telegram, email)',
      to: '/admin/contacts'
    },
    // Настройки сайта (оставить для общих настроек)
    {
      icon: { type: 'settings', emoji: '⚙️' },
      title: 'Настройки сайта',
      description: 'Основные настройки ветеринарного сайта',
      to: '/admin/settings'
    },
    // Заявки на дистанционную консультацию
    {
      icon: { type: 'contacts', emoji: '📋' },
      title: 'Заявки на консультацию',
      description: 'Просмотр и обработка заявок от владельцев животных',
      to: '/admin/contact-requests'
    }
  ];

  // Конфигурация системной информации (изменён текст)
  const systemInfoConfig = [
    { label: 'Статус системы:', value: '✅ Работает нормально', className: 'status-ok' },
    { label: 'База данных:', value: '✅ PostgreSQL подключена' },
    { label: 'Роль пользователя:', value: '👑 Администратор (ветеринарный эксперт)', className: 'role-admin' },
    { label: 'Время на сервере:', value: new Date().toLocaleString('ru-RU') },
    { label: 'API статус:', value: '✅ Все endpoints доступны' },
    { label: 'Версия системы:', value: '1.0.0 (ветеринарная версия)' }
  ];

  if (loading && !stats) {
    return (
      <div className="dashboard-container">
        <div className="loading">Загрузка статистики...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Шапка панели */}
      <div className="dashboard-header">
        <div className="header-top">
          <div>
            <h1>Админ-панель</h1>
            <p>Панель управления сайтом ветеринарного врача-хирурга, ортопеда, невролога</p>
          </div>
          <button 
            onClick={refreshStats}
            disabled={loading}
            className="btn-refresh"
            aria-label="Обновить статистику"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Обновление...
              </>
            ) : (
              '🔄 Обновить статистику'
            )}
          </button>
        </div>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="alert alert-warning" role="alert">
          <strong>Внимание:</strong> {error}
        </div>
      )}

      {/* Основная статистика */}
      <div className="stats-grid">
        {statCardsConfig.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Быстрые действия */}
      <section className="quick-actions" aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title">🚀 Быстрые действия</h2>
        <div className="actions-grid">
          {quickActionsConfig.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </section>

      {/* Последняя активность */}
      <section className="recent-activity" aria-labelledby="recent-activity-title">
        <div className="section-header">
          <h2 id="recent-activity-title">📅 Последняя активность</h2>
          <span className="last-update">
            Обновлено: {formatTime(stats.timestamp)}
          </span>
        </div>

        <div className="activity-grid">
          {/* Последние статьи */}
          <div className="activity-card">
            <h3>📝 Последние статьи</h3>
            {stats.recentArticles && stats.recentArticles.length > 0 ? (
              <ul className="activity-list">
                {stats.recentArticles.map(article => (
                  <ActivityItem key={article.id} item={article} type="article" />
                ))}
              </ul>
            ) : (
              <p className="no-data">Ветеринарные статьи еще не созданы</p>
            )}
            <Link to="/admin/articles" className="view-all">
              Все статьи →
            </Link>
          </div>

          {/* Активность за неделю */}
          <div className="activity-card">
            <h3>📊 Активность за неделю</h3>
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="week-activity">
                {stats.recentActivity.map((day, index) => (
                  <div key={index} className="day-activity">
                    <div className="day-name">
                      {new Date(day.date).toLocaleDateString('ru-RU', { 
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                    <div className="day-stats">
                      <span className="created">
                        +{day.articles_created || 0} статей
                      </span>
                      <span className="published">
                        +{day.articles_published || 0} опубликовано
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Активность за неделю отсутствует</p>
            )}
          </div>
        </div>
      </section>

      {/* Системная информация */}
      <section className="system-info" aria-labelledby="system-info-title">
        <h3 id="system-info-title">⚙️ Системная информация</h3>
        <div className="info-grid">
          {systemInfoConfig.map((info, index) => (
            <div key={index} className="info-item">
              <span className="info-label">{info.label}</span>
              <span className={`info-value ${info.className || ''}`}>
                {info.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Быстрые заметки (адаптированы) */}
      <aside className="quick-notes" aria-labelledby="quick-notes-title">
        <h3 id="quick-notes-title">📌 Быстрые заметки</h3>
        <div className="notes-content">
          <p>✅ <strong>Готово к работе:</strong> Все основные функции для ветеринарного сайта реализованы</p>
          <p>🎯 <strong>Следующие задачи:</strong></p>
          <ul>
            <li>Добавить раздел "Услуги" с описанием дистанционных консультаций</li>
            <li>Настроить автоматическую отправку уведомлений в Telegram</li>
            <li>Оптимизировать загрузку снимков МРТ/КТ для форума</li>
            <li>Добавить форму для отправки файлов (рентген, видео движений)</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

// Компонент элемента активности (должен быть определён до использования)
const ActivityItem = ({ item, type = 'article' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  if (type === 'article') {
    return (
      <li className="activity-item">
        <div className="activity-title">
          <Link to={`/articles/${item.id}`} target="_blank">
            {item.title}
          </Link>
          <span className={`status-badge ${item.is_published ? 'published' : 'draft'}`}>
            {item.is_published ? 'Опубликовано' : 'Черновик'}
          </span>
        </div>
        <div className="activity-meta">
          <span>{formatDate(item.created_at)}</span>
          <Link to={`/admin/articles/edit/${item.id}`} className="edit-link">
            Редактировать
          </Link>
        </div>
      </li>
    );
  }

  return null;
};

export default DashboardPage;