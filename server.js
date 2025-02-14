require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Telegraf } = require('telegraf');

const COINEX_API_URL = 'https://api.coinex.com/v1';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const app = express();
const PORT = process.env.PORT

// پیام شروع سرور
console.log('Server is starting...');

// ربات تلگرام
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// تابع برای گرفتن حجم معاملات
async function getTradingVolume(market) {
    try {
        const response = await axios.get(`${COINEX_API_URL}/market/kline`, {
            params: {
                market: market,
                type: '4hour',
                limit: 30, // تعداد کندل‌ها (5 روز * 6 کندل 4 ساعته در هر روز)
            },
        });

        const data = response.data.data;
        const volumes = data.map(item => parseFloat(item[5])); // گرفتن حجم معاملات
        const averageVolume = (volumes.reduce((sum, volume) => sum + volume, 0)) / volumes.length;

        return averageVolume;
    } catch (error) {
        console.error('❌ خطا در دریافت حجم معاملات:', error);
        return null;
    }
}

// بررسی و ارسال پیام هشدار
async function checkAndSendAlerts() {
    const markets = ['BTC/USDT', 'ETH/USDT']; // لیست ارزهای قابل بررسی

    for (const market of markets) {
        const averageVolume = await getTradingVolume(market);
        if (averageVolume) {
            await bot.telegram.sendMessage(
                TELEGRAM_CHAT_ID, 
                `حجم میانگین ${market} برای 5 روز گذشته: ${averageVolume}`
            );
        }
    }
}

// مسیر API برای بررسی حجم معاملات
app.get('/api/check-volumes', async (req, res) => {
    try {
        await checkAndSendAlerts();
        res.send('Check and alerts sent.');
    } catch (error) {
        console.error('❌ خطا در بررسی حجم معاملات:', error);
        res.status(500).send('خطا در بررسی حجم معاملات');
    }
});

// اجرای سرور
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
