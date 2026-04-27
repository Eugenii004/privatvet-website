// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService, videoService } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import VideoCard from '../components/VideoCard';
import './HomePage.css';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, videosData] = await Promise.all([
          articleService.getAll(),
          videoService.getAll()
        ]);
        setArticles(articlesData.slice(0, 3));
        setVideos(videosData.slice(0, 2));
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container text-center">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Герой секция с фото */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>Ветеринарный врач - хирург, ортопед, невролог</h1>
              <p className="hero-subtitle">
                Эксперт в вопросах ветеринарной неврологии и ортопедии.<br />
                Дистанционные консультации по всему миру. Второе мнение, разбор МРТ/КТ/рентгена, план лечения.
              </p>
              <div className="hero-buttons">
                <a href="https://t.me/surgeonvet04" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Написать в Telegram
                </a>
                <Link to="/forum" className="btn btn-secondary">
                  Задать вопрос на форуме
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img src="/images/vet-doctor.jpg" alt="Ветеринарный врач Евгений Плахов" />
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Почему стоит обратиться</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🌍</div>
              <h3>Любая точка мира</h3>
              <p>Помогаю владельцам животных из любой страны — без перелётов и стресса для питомца</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📄</div>
              <h3>Второе мнение эксперта</h3>
              <p>Разбор МРТ, КТ, рентген-снимков. Подтверждение или корректировка диагноза</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⏱️</div>
              <h3>Быстрая помощь</h3>
              <p>Ответ в течение 24 часов. Не нужно ждать очереди в клинику</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📹</div>
              <h3>Видео-осмотр</h3>
              <p>По видеосвязи оцениваю движения, походку, неврологические рефлексы</p>
            </div>
          </div>
        </div>
      </section>

      {/* Блок отзывов */}
      <section className="reviews-section">
        <div className="container">
          <div className="reviews-content">
            <h2>Реальные отзывы моих пациентов</h2>
            <p>Более 50 отзывов на независимом портале Zoon.ru</p>
            <a href="https://zoon.ru/spb/p-veterinar/evgenij_aleksandrovich_plahov/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Читать все отзывы →
            </a>
          </div>
        </div>
      </section>

      {/* Последние статьи */}
      <section className="articles-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Последние статьи</h2>
            <Link to="/articles" className="section-link">Все статьи →</Link>
          </div>
          <div className="articles-grid">
            {articles.map(article => <ArticleCard key={article.id} article={article} />)}
          </div>
        </div>
      </section>

      {/* Видео материалы */}
      <section className="videos-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Видео материалы</h2>
            <Link to="/videos" className="section-link">Все видео →</Link>
          </div>
          <div className="videos-grid">
            {videos.map(video => <VideoCard key={video.id} video={video} />)}
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Нужно экспертное мнение по здоровью питомца?</h2>
            <p>Напишите мне в Telegram или WhatsApp — я отвечу на все вопросы и помогу составить план лечения.</p>
            <div className="cta-buttons">
              <a href="https://t.me/surgeonvet04" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-large">
                Написать в Telegram
              </a>
              <Link to="/forum" className="btn btn-secondary btn-large">
                Бесплатный вопрос на форуме
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;