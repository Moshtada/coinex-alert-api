const axios = require('axios');
require('dotenv').config();

const COINEX_API_BASE = 'https://api.coinex.com/v1/market/kline';

const fetchVolumeData = async () => {
    try {
        const response = await axios.get(COINEX_API_BASE, {
            params: {
                market: 'BTCUSDT',  // جفت ارز مورد نظر
                type: '4hour',      // بازه زمانی ۴ ساعته
                limit: 30           // دریافت داده‌های ۳۰ بازه
            }
        });
        return response.data.data;
    } catch (error) {
        throw new Error('❌ خطا در دریافت داده‌های حجم معاملات از CoinEx');
    }
};

module.exports = { fetchVolumeData };
