// Подключаем необходимые библиотеки
const { Telegraf } = require('telegraf');

// Токен твоего бота (замени на свой)
const bot = new Telegraf('7823018612:AAHrXL3C9nlop7uffLoLZ9jjVbU05DXii6M');

// Приветственное сообщение
bot.start((ctx) => ctx.reply('Привет! Пожалуйста, подпишись на спонсоров.'));

bot.on('text', (ctx) => {
  const code = ctx.message.text.trim();

  // Проверка введенного кода
  if (code === '1234') {
    ctx.reply('Фильм: "Интерстеллар"');
  } else {
    ctx.reply('Неверный код. Попробуй снова.');
  }
});

// Запускаем бота
bot.launch();