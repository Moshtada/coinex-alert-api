const axios = require('axios');
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = require('../config/env');

async function sendAlert(symbol, volume, avgVolume) {
    const message = `🚨 **هشدار حجم معاملات** 🚨\n\n` +
        `💰 **ارز:** ${symbol}\n` +
        `📊 **حجم فعلی:** ${volume.toFixed(2)} USDT\n` +
        `📉 **میانگین حجم ۴ ساعت:** ${avgVolume.toFixed(2)} USDT`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        await axios.post(url, { chat_id: TELEGRAM_CHAT_ID, text: message });
        console.log(`✅ هشدار برای ${symbol} ارسال شد!`);
    } catch (error) {
        console.error('❌ خطا در ارسال پیام تلگرام:', error);
    }
}

module.exports = { sendAlert };
