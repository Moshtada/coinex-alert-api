const axios = require('axios');
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = require('../src/config/env');

async function sendAlert(symbol, volume, avgVolume) {
    const message = `🚨 **هشدار حجم معاملات** 🚨\n\n` +
        `💰 **ارز:** ${symbol}\n` +
        `📊 **حجم فعلی:** ${volume.toFixed(2)} USDT\n` +
        `📉 **میانگین حجم ۴ ساعت:** ${avgVolume.toFixed(2)} USDT`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await axios.post(url, { chat_id: TELEGRAM_CHAT_ID, text: message });
        console.log(`✅ هشدار برای ${symbol} ارسال شد!`, response.data);
    } catch (error) {
        if (error.response) {
            // اگر خطایی از سمت سرور تلگرام باشد
            console.error('❌ خطا در ارسال پیام تلگرام:', error.response.data);
        } else if (error.request) {
            // اگر درخواست به تلگرام ارسال شده اما پاسخی دریافت نشده
            console.error('❌ درخواست ارسال شد اما پاسخی دریافت نشد:', error.request);
        } else {
            // خطای ناشی از تنظیمات یا موارد دیگر
            console.error('❌ خطای غیرمنتظره در ارسال پیام تلگرام:', error.message);
        }
    }
}

module.exports = { sendAlert };
