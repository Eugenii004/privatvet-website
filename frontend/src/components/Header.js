import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <Link to="/">
                            <div className="logo-text">
                                <div className="logo-name">
                                    Евгений Плахов
                                </div>
                                <div className="logo-profession">
                                    ветеринарный хирург, ортопед, невролог
                                </div>
                            </div>
                        </Link>
                        <p className="tagline">дистанционные консультации по всему миру</p>
                    </div>

                    <nav className="nav">
                        <Link to="/" className="nav-link">Главная</Link>
                        <Link to="/articles" className="nav-link">Статьи</Link>
                        <Link to="/videos" className="nav-link">Видео</Link>
                        <Link to="/forum" className="nav-link">Форум</Link>
                        <Link to="/contacts" className="nav-link">Контакты</Link>
                        <a href="https://zoon.ru/spb/p-veterinar/evgenij_aleksandrovich_plahov/" target="_blank" rel="noopener noreferrer" className="nav-link reviews-link">
                            ⭐ Отзывы
                        </a>
                        {isAuthenticated && user?.role === 'admin' && (
                            <Link to="/admin" className="admin-link">
                                🔐 Админка
                            </Link>
                        )}
                    </nav>

                    <div className="header-actions">
                        {isAuthenticated ? (
                            <>
                                <span className="username">
                                    👤 {user?.username || 'Администратор'}
                                </span>
                                <button onClick={handleLogout} className="btn-logout">
                                    Выйти
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;