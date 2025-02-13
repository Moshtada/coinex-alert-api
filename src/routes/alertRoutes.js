const express = require('express');
const { getUsdtPairs, getVolume } = require('../services/coinexService');
const { sendAlert } = require('../services/telegramService');
const router = express.Router();

let volumeHistory = {};

router.get('/check-volumes', async (req, res) => {
    try {
        const pairs = await getUsdtPairs();
        for (const symbol of pairs) {
            const currentVolume = await getVolume(symbol);
            const avgVolume = volumeHistory[symbol] || currentVolume;

            if (currentVolume >= 10 * avgVolume) {
                await sendAlert(symbol, currentVolume, avgVolume);
            }

            volumeHistory[symbol] = avgVolume * 0.75 + currentVolume * 0.25;
        }
        res.json({ message: '🔍 بررسی حجم معاملات انجام شد.' });
    } catch (error) {
        res.status(500).json({ error: '❌ خطا در بررسی حجم معاملات' });
    }
});

module.exports = router;
