const express = require('express');
const alertRoutes = require('./routes/alertRoutes');
const { log } = require('./utils/logger');

const app = express();
const PORT = 3000;

app.use('/api', alertRoutes);

app.listen(PORT, () => log(`🚀 سرور در حال اجرا روی پورت ${PORT}`));

// اجرای خودکار بررسی حجم هر ۴ ساعت
setInterval(() => {
    fetch(`http://localhost:${PORT}/api/check-volumes`)
        .then(res => res.json())
        .then(data => log(data.message))
        .catch(err => console.error('❌ خطا در بررسی حجم معاملات:', err));
}, 4 * 60 * 60 * 1000);
