const { Telegraf } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Инициализация бота
const bot = new Telegraf('7914595148:AAHnr-yt8zw1zUVel6Q9JK3lVZEZQwlaTjs');

function startBot() {
  bot.launch().catch((error) => {
    console.error('Ошибка при запуске бота:', error);
    setTimeout(startBot, 5000); // Перезапуск через 5 секунд
  });
}

startBot();
