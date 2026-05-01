const express = require('express');
const cors = require('cors');
require('dotenv').config();

const articleRoutes = require('./src/routes/articleRoutes');
const videoRoutes = require('./src/routes/videoRoutes');
const authRoutes = require('./src/routes/authRoutes');
const forumRoutes = require('./src/routes/forumRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Разрешённые источники (CORS) — ВСЕ ваши адреса
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://eugenii004-privatvet-website-7aa4.twc1.net',
    'https://eugenii004-privatvet-website-7aa4.twc1.net/api',
    'https://doctor-plakhov.ru',
    'https://doctor-plakhov.ru/api',
    'https://5d216e37-ebfe-435c-9f77-830ea8d73076.website.twcstorage.ru',
    'https://5d216e37-ebfe-435c-9f77-830ea8d73076.website.twcstorage.ru/api',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.warn(`❌ CORS: заблокирован источник ${origin}`);
            callback(new Error(`CORS: источник ${origin} не разрешён`), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url} [origin: ${req.headers.origin}]`);
    next();
});

app.use('/api/articles', articleRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contacts', contactRoutes);

app.use('/api/contacts/message', (req, res, next) => {
    console.log('📩 Входящая заявка:', {
        time: new Date().toISOString(),
        ip: req.ip,
        name: req.body.name,
        email: req.body.email,
        consent: req.body.consent_processing ? 'да' : 'нет'
    });
    next();
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), env: process.env.NODE_ENV || 'development' });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Сервер работает!', cors: 'enabled', allowedOrigins });
});

app.post('/api/test/video', (req, res) => {
    console.log('🔍 TEST VIDEO ENDPOINT - Body:', req.body);
    res.json({ success: true, message: 'Test endpoint works!', received: req.body });
});

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>API Ветеринарного врача</title></head>
            <body>
                <h1>🐾 API сайта ветеринарного врача</h1>
                <p>Сервер работает на порту <strong>${PORT}</strong></p>
                <p>Окружение: <strong>${process.env.NODE_ENV || 'development'}</strong></p>
                <h2>Доступные эндпоинты:</h2>
                <ul>
                    <li><a href="/api/health">/api/health</a></li>
                    <li><a href="/api/articles">/api/articles</a></li>
                    <li><a href="/api/videos">/api/videos</a></li>
                    <li><a href="/api/forum">/api/forum</a></li>
                    <li><a href="/api/contacts">/api/contacts</a></li>
                    <li><a href="/api/auth">/api/auth</a></li>
                    <li><a href="/api/test">/api/test</a></li>
                </ul>
                <p>Разрешённые источники: ${allowedOrigins.map(o => `<li>${o}</li>`).join('')}</p>
            </body>
        </html>
    `);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', message: `Маршрут ${req.method} ${req.url} не найден` });
});

app.use((err, req, res, next) => {
    console.error('❌ Ошибка сервера:', err);
    if (err.message.includes('CORS')) {
        return res.status(403).json({ error: 'CORS Error', message: err.message, origin: req.headers.origin });
    }
    res.status(500).json({ error: 'Internal Server Error', message: process.env.NODE_ENV === 'development' ? err.message : 'Что-то пошло не так' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

module.exports = app;