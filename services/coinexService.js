const axios = require('axios');
require('dotenv').config();

// URL صحیح برای دریافت اطلاعات تیکر
const COINEX_API_BASE = 'https://api.coinex.com/v1/market/ticker';

const fetchVolumeData = async () => {
    try {
        const response = await axios.get(COINEX_API_BASE, {
            params: {
                market: 'BTCUSDT'  // جفت ارز مورد نظر
            }
        });

        const volumeData = response.data.data.BTCUSDT;  // داده‌های جفت ارز BTC/USDT
        return volumeData; // حجم معاملات و سایر داده‌ها
    } catch (error) {
        throw new Error('❌ خطا در دریافت داده‌های حجم معاملات از CoinEx');
    }
};

module.exports = { fetchVolumeData };
