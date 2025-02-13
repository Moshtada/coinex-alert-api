const axios = require('axios');
const { fetchVolumeData } = require('../services/coinexService');
const { log } = require('../utils/logger');

const TELEGRAM_API_BASE = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

const sendTelegramAlert = async (message) => {
    try {
        await axios.post(TELEGRAM_API_BASE, {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message
        });
        log('✅ پیام هشدار به تلگرام ارسال شد.');
    } catch (error) {
        log('❌ خطا در ارسال پیام به تلگرام:', error);
    }
};

const checkVolumes = async (req, res) => {
    try {
        const volumeData = await fetchVolumeData();
        log('✅ داده‌های حجم معاملات دریافت شد.');

        // مثال: محاسبه میانگین حجم و ارسال پیام در صورت افزایش
        const averageVolume = volumeData.reduce((sum, data) => sum + data[5], 0) / volumeData.length;
        const latestVolume = volumeData[volumeData.length - 1][5];

        if (latestVolume > averageVolume * 2) {
            await sendTelegramAlert(`🚨 حجم معاملات ${latestVolume} بیشتر از دو برابر میانگین ${averageVolume} است.`);
        }

        res.json({ message: 'بررسی حجم معاملات انجام شد.' });
    } catch (error) {
        log('❌ خطا در بررسی حجم معاملات:', error);
        res.status(500).json({ error: 'خطا در بررسی حجم معاملات' });
    }
};

module.exports = { checkVolumes };
