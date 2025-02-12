const express = require('express');
const alertRoutes = require('./routes/alertRoutes');
const { log } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000; // استفاده از PORT محیطی Vercel

app.use('/api', alertRoutes);

app.listen(PORT, () => log(`🚀 سرور در حال اجرا روی پورت ${PORT}`));

const VERCEL_URL = process.env.VERCEL_URL || `http://localhost:${PORT}`;

setInterval(() => {
    fetch(`${VERCEL_URL}/api/check-volumes`)
        .then(res => res.json())
        .then(data => log(data.message))
        .catch(err => console.error('❌ خطا در بررسی حجم معاملات:', err));
}, 4 * 60 * 60 * 1000); // اجرای خودکار هر 4 ساعت
