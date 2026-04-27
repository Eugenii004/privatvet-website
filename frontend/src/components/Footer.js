import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Ветеринарный врач Евгений Плахов</h3>
            <p>
              Хирургия • Ортопедия • Неврология.<br />
              Дистанционные консультации по всему миру. Экспертное второе мнение, разбор снимков МРТ/КТ, план лечения.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Быстрые ссылки</h4>
            <ul className="footer-links">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/articles">Статьи</Link></li>
              <li><Link to="/videos">Видео</Link></li>
              <li><Link to="/forum">Форум</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
              <li><a href="https://zoon.ru/spb/p-veterinar/evgenij_aleksandrovich_plahov/" target="_blank" rel="noopener noreferrer">⭐ Отзывы</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Свяжитесь со мной</h4>
            <div className="contact-info">
              <p>📱 <strong>Telegram:</strong> <a href="https://t.me/surgeonvet04" target="_blank" rel="noopener noreferrer">@surgeonvet04</a></p>
              <p>📧 <strong>Email:</strong> plakhov83@mail.ru</p>
              <div className="social-links">
                <a href="https://t.me/surgeonvet04" target="_blank" rel="noopener noreferrer">Telegram</a>
              </div>
            </div>
            <p className="online-note">🌍 Онлайн-консультации для владельцев из любых стран</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Ветеринарный врач Евгений Плахов. Все права защищены.</p>
          <p>Информация на сайте не заменяет очный приём. Дистанционная консультация — экспертное мнение специалиста.</p>
          <div className="privacy-footer">
            <Link to="/privacy-policy">Политика конфиденциальности</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;