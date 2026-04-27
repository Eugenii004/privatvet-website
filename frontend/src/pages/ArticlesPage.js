// frontend/src/pages/ArticlesPage.js
import React, { useState, useEffect } from 'react';
import { articleService } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import './ArticlesPage.css';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articleService.getAll();
        // Фильтруем только опубликованные статьи для публичной страницы
        const publishedArticles = data.filter(article => article.is_published === true);
        setArticles(publishedArticles);
      } catch (err) {
        console.error('Ошибка при загрузке статей:', err);
        setError('Не удалось загрузить статьи. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="container text-center">
        <div className="loading">Загрузка статей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="container">
        <div className="page-header">
          <h1>Полезные статьи</h1>
          <p className="page-subtitle">
            Полезные материалы о здоровье, лечении и реабилитации ваших питомцев
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="no-articles">
            <p>Статьи скоро будут добавлены...</p>
            <p>Все материалы основаны на моём клиническом опыте и современных ветеринарных протоколах.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
