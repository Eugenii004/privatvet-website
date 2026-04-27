// frontend/src/pages/ContactsPage.js
import React, { useState } from 'react';
import { contactService } from '../services/api';
import './ContactsPage.css';

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    animal_name: '',
    animal_type: '',
    message: '',
    consent_processing: false,
    consent_read: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: 'Пожалуйста, заполните имя, email и описание проблемы'
      });
      return;
    }

    if (!formData.consent_processing || !formData.consent_read) {
      setSubmitStatus({
        type: 'error',
        message: 'Для отправки сообщения необходимо дать согласие на обработку персональных данных и подтвердить ознакомление с Политикой'
      });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const fullMessage = `
        🐾 Животное: ${formData.animal_name || 'не указано'} (${formData.animal_type || 'вид не указан'})
        📝 Вопрос: ${formData.message}
      `;
      
      await contactService.sendMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: fullMessage,
        consent_processing: formData.consent_processing,
        consent_read: formData.consent_read
      });
      
      setSubmitStatus({
        type: 'success',
        message: '✅ Сообщение отправлено! Я свяжусь с вами в Telegram или по email в ближайшие 24 часа.'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        animal_name: '',
        animal_type: '',
        message: '',
        consent_processing: false,
        consent_read: false
      });
      
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      setSubmitStatus({
        type: 'error',
        message: '❌ Не удалось отправить сообщение. Пожалуйста, попробуйте позже или напишите напрямую в Telegram.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contacts-page">
      <div className="container">
        <div className="page-header">
          <h1>Дистанционная консультация</h1>
          <p className="page-subtitle">
            Экспертное мнение ветеринарного хирурга-ортопеда и невролога по всему миру
          </p>
        </div>

        <div className="contacts-grid">
          {/* Левая колонка — контакты */}
          <div className="contacts-info">
            <div className="info-card">
              <div className="doctor-photo-small">
                <img src="/images/vet-doctor-2.jpg" alt="Ветеринарный врач Евгений Плахов" />
              </div>
              <h2>Свяжитесь со мной</h2>
              
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <div>
                  <h3>Telegram (быстрее всего)</h3>
                  <p><a href="https://t.me/surgeonvet04" target="_blank" rel="noopener noreferrer" className="messenger-link">@surgeonvet04</a></p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h3>Email</h3>
                  <p>plakhov83@mail.ru</p>
                  <small>Отвечаю в течение 24 часов</small>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">⭐</span>
                <div>
                  <h3>Отзывы</h3>
                  <p><a href="https://zoon.ru/spb/p-veterinar/evgenij_aleksandrovich_plahov/" target="_blank" rel="noopener noreferrer">Читать на Zoon.ru</a></p>
                </div>
              </div>

              <div className="info-note">
                <p>🌍 <strong>Работаю дистанционно</strong> — помогу владельцам из любой страны.</p>
                <p>🩻 <strong>Разбор снимков МРТ, КТ, рентгена</strong> — второе мнение эксперта.</p>
              </div>
            </div>
          </div>

          {/* Правая колонка — форма */}
          <div className="contact-form-section">
            <div className="form-card">
              <h2>Задать вопрос врачу</h2>
              <p>Опишите ситуацию, и я дам рекомендации в течение суток</p>

              {submitStatus && (
                <div className={`alert alert-${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Ваше имя <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=""
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=""
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон (Telegram/WhatsApp)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="animal_name">Кличка питомца</label>
                    <input
                      type="text"
                      id="animal_name"
                      name="animal_name"
                      value={formData.animal_name}
                      onChange={handleChange}
                      placeholder=""
                    />
                  </div>
                  <div className="form-group half">
                    <label htmlFor="animal_type">Вид и возраст</label>
                    <input
                      type="text"
                      id="animal_type"
                      name="animal_type"
                      value={formData.animal_type}
                      onChange={handleChange}
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Опишите проблему <span className="required">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder=""
                    rows="5"
                    required
                  />
                </div>

                <div className="form-group consent-group">
                  <div className="consent-checkbox">
                    <input
                      type="checkbox"
                      id="consent_processing"
                      name="consent_processing"
                      checked={formData.consent_processing}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="consent_processing" className="consent-label">
                      Я даю согласие на обработку моих персональных данных для связи и предоставления ветеринарной консультации*
                    </label>
                  </div>
                  
                  <div className="consent-checkbox">
                    <input
                      type="checkbox"
                      id="consent_read"
                      name="consent_read"
                      checked={formData.consent_read}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="consent_read" className="consent-label">
                      Я подтверждаю, что ознакомлен(а) с <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Политикой обработки персональных данных</a>
                    </label>
                  </div>
                  <p className="consent-note">* Обязательные поля</p>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Отправка...' : 'Отправить вопрос'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="consultation-info">
          <h3>Как проходит дистанционная консультация?</h3>
          <div className="consultation-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Вы описываете проблему</h4>
              <p>Через форму или напрямую в Telegram — присылаете анализы, снимки, видео движений питомца</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Экспертный анализ</h4>
              <p>Я изучаю материалы, оцениваю неврологический/ортопедический статус по видео</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Рекомендации и план лечения</h4>
              <p>Вы получаете второе мнение, схему терапии или направления на дообследование</p>
            </div>
          </div>
          <p className="consultation-note">
            * Дистанционная консультация не заменяет очный приём, но позволяет быстро получить экспертную оценку и спланировать дальнейшие шаги.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;