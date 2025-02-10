require('dotenv').config();

module.exports = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    BINANCE_API_URL: 'https://api.binance.com/api/v3'
};
