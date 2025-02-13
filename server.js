require('dotenv').config();
const axios = require('axios');
const { Telegraf } = require('telegraf');

const COINEX_API_URL = 'https://api.coinex.com/v1';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// تابعی برای گرفتن حجم معاملات
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

// بررسی و ارسال پیام به تلگرام
async function checkAndSendAlerts() {
    const markets = ['BTC/USDT', 'ETH/USDT']; // می‌توانید لیست ارزها را تغییر دهید

    for (const market of markets) {
        const averageVolume = await getTradingVolume(market);
        if (averageVolume) {
            await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, `حجم میانگین ${market} برای 5 روز گذشته: ${averageVolume}`);
        }
    }
}

// اجرای برنامه هر 4 ساعت
setInterval(checkAndSendAlerts, 4 * 60 * 60 * 1000);
