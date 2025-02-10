const express = require('express');
const { getUsdtPairs, getVolume } = require('../services/binanceService');
const { sendAlert } = require('../services/telegramService');
const router = express.Router();

let volumeHistory = {};

router.get('/check-volumes', async (req, res) => {
    const usdtPairs = await getUsdtPairs();
    for (const symbol of usdtPairs) {
        const volume = await getVolume(symbol);
        if (!volumeHistory[symbol]) {
            volumeHistory[symbol] = [volume];
        } else {
            volumeHistory[symbol].push(volume);
            if (volumeHistory[symbol].length > 4) {
                volumeHistory[symbol].shift();
            }
        }

        if (volumeHistory[symbol].length === 4) {
            const avgVolume = volumeHistory[symbol].slice(0, 3).reduce((a, b) => a + b, 0) / 3;
            if (volume > avgVolume * 10) {
                await sendAlert(symbol, volume, avgVolume);
            }
        }
    }
    res.send({ message: '🔍 بررسی حجم معاملات انجام شد!' });
});

module.exports = router;
