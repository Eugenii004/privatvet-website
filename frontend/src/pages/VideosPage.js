import React, { useState, useEffect } from 'react';
import { videoService } from '../services/api';
import VideoCard from '../components/VideoCard';
import './VideosPage.css';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await videoService.getAll();
        // Показываем только опубликованные видео
        const publishedVideos = data.filter(video => video.is_published === true);
        setVideos(publishedVideos);
      } catch (err) {
        console.error('Ошибка при загрузке видео:', err);
        setError('Не удалось загрузить видео. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="container text-center">
        <div className="loading">Загрузка видео...</div>
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
    <div className="videos-page">
      <div className="container">
        <div className="page-header">
          <h1>Видео материалы</h1>
          <p className="page-subtitle">
            Видео-лекции, записи операций, реабилитация и неврологические осмотры
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="no-videos">
            <p>Видео скоро будут добавлены...</p>
            <p>Все материалы основаны на моём клиническом опыте и современных ветеринарных подходах.</p>
          </div>
        ) : (
          <div className="videos-grid">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosPage;