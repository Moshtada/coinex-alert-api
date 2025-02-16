require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Telegraf } = require('telegraf');

const BINANCE_API_URL = 'https://api.binance.com/api/v1/klines';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const app = express();
const PORT = process.env.PORT

// پیام شروع سرور
console.log('Server is starting...');

// ربات تلگرام
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// تابع برای گرفتن حجم معاملات از بایننس
async function getTradingVolumes(symbol) {
    try {
        const response = await axios.get(BINANCE_API_URL, {
            params: {
                symbol: symbol,
                interval: '4h',
                limit: 60, // 10 روز * 6 کندل ۴ ساعته در هر روز
            }
        });

        const data = response.data;
        const volumes = data.map(item => parseFloat(item[5])); // گرفتن حجم معاملات
        return volumes;
    } catch (error) {
        console.error('❌ خطا در دریافت حجم معاملات:', error);
        return null;
    }
}

// بررسی و ارسال پیام هشدار
async function checkAndSendAlerts() {
    const symbol = 'BTCUSDT';
    const volumes = await getTradingVolumes(symbol);
    
    if (volumes) {
        const averageVolume = volumes.reduce((sum, volume) => sum + volume, 0) / volumes.length;

        for (const volume of volumes) {
            if (volume > 5 * averageVolume) {
                await bot.telegram.sendMessage(
                    TELEGRAM_CHAT_ID, 
                    `حجم معاملات کندل ۴ ساعته ${symbol} بیش از ۵ برابر حجم میانگین ۱۰ روز گذشته است: ${volume}`
                );
            }
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