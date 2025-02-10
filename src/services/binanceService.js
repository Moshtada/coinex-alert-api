const axios = require('axios');
const { BINANCE_API_URL } = require('../config/env');

async function getUsdtPairs() {
    try {
        const response = await axios.get(`${BINANCE_API_URL}/exchangeInfo`);
        return response.data.symbols
            .filter(symbol => symbol.quoteAsset === 'USDT' && symbol.status === 'TRADING')
            .map(symbol => symbol.symbol);
    } catch (error) {
        console.error('❌ خطا در دریافت لیست ارزها:', error);
        return [];
    }
}

async function getVolume(symbol) {
    try {
        const response = await axios.get(`${BINANCE_API_URL}/ticker/24hr`, { params: { symbol } });
        return parseFloat(response.data.quoteVolume);
    } catch (error) {
        console.error(`❌ خطا در دریافت حجم ${symbol}:`, error);
        return 0;
    }
}

module.exports = { getUsdtPairs, getVolume };
