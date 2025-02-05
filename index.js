const { Telegraf, Markup, session } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Загрузка списка фильмов из файла
const movies = require('./movies.json');

const bot = new Telegraf('7914595148:AAHnr-yt8zw1zUVel6Q9JK3lVZEZQwlaTjs');

// Включаем сессии для каждого пользователя
bot.use(session());

const channels = [
  { name: 'Спонсор 1', link: 'https://t.me/xsetgaming', username: '@xsetgaming' },
];

// Стартовое сообщение
bot.start(async (ctx) => {
  console.log(ctx.from);
  ctx.session = {}; // сброс данных сессии
  await ctx.reply(
    'Привет! Чтобы получить название фильма, подпишись на спонсоров:',
    Markup.inlineKeyboard(
      channels.map(ch => [Markup.button.url(ch.name, ch.link)])
    )
  );
  await ctx.reply('После подписки нажми "Проверить подписку".', 
    Markup.inlineKeyboard([Markup.button.callback('✅ Проверить подписку', 'check_subscription')])
  );
});

// Проверка подписки
bot.action('check_subscription', async (ctx) => {
  const userId = ctx.from.id;
  let notSubscribed = [];

  for (const ch of channels) {
    try {
      const res = await axios.get(`https://api.telegram.org/bot${bot.token}/getChatMember?chat_id=${ch.username}&user_id=${userId}`);
      const status = res.data.result.status;
      if (status !== 'member' && status !== 'administrator' && status !== 'creator') {
        notSubscribed.push(ch);
      }
    } catch (error) {
      console.log(`Ошибка проверки подписки на ${ch.username}:`, error);
      notSubscribed.push(ch);
    }
  }

  if (notSubscribed.length === 0) {
    ctx.session.subscribed = true; // сохраняем состояние подписки
    await ctx.reply(
      '🎉 Поздравляю! Ты подписался на всех спонсоров. Теперь введи код для получения фильма.',
      Markup.inlineKeyboard([Markup.button.callback('🔑 Ввести код', 'enter_code')])
    );
  } else {
    await ctx.reply(
      '❌ Ты не подписался на всех спонсоров! Подпишись и попробуй снова.',
      Markup.inlineKeyboard(
        notSubscribed.map(ch => [Markup.button.url(ch.name, ch.link)])
      )
    );
  }
});

// Открытие меню ввода кода
bot.action('enter_code', (ctx) => {
  ctx.reply(
    '✍️ Введи код в это сообщение:',
    Markup.forceReply()
  );
});

// Проверка кода и выдача фильма
bot.on('text', (ctx) => {
  const code = ctx.message.text.trim();
  console.log('Введенный код:', code);  // Выводим введенный код в консоль для отладки

  // Проверяем, что код существует в списке фильмов
  const movie = movies.find(m => m.code.toString() === code);  // Приводим коды в строку для сравнения

  if (!movie) {
    return ctx.reply('❌ Неверный код. Попробуй снова.');
  }

  // Отправляем постер из интернета
  ctx.replyWithPhoto(
    movie.poster,
    {
      caption: `🎬 *Название фильма*: _${movie.title} (${movie.year})_\n⭐ Рейтинг: ${movie.rating}\n📝 Описание: ${movie.description}\n🎥 Смотрите фильм: [IMDb](${movie.imdb_link})\n📽️ Смотреть на платформе: [Ссылка на фильм](${movie.movie_link})`,
      parse_mode: 'Markdown'
    }
  );

  // После получения фильма предлагаем вернуться к началу или ввести новый код
  ctx.reply(
    'Что бы вы хотели сделать дальше?',
    Markup.inlineKeyboard([
      Markup.button.callback('🔄 Ввести новый код', 'enter_code'),
      Markup.button.callback('🔙 Начать с начала', 'start_over')
    ])
  );
});

// Возврат к стартовому меню
bot.action('start_over', (ctx) => {
  ctx.session = {}; // сброс сессии
  ctx.reply(
    'Привет! Чтобы получить название фильма, подпишись на спонсоров:',
    Markup.inlineKeyboard(
      channels.map(ch => [Markup.button.url(ch.name, ch.link)])
    )
  );
  ctx.reply('После подписки нажми "Проверить подписку".', 
    Markup.inlineKeyboard([Markup.button.callback('✅ Проверить подписку', 'check_subscription')])
  );
});

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error('Ошибка на этапе обработки запроса:', err);
  ctx.reply('❌ Произошла ошибка. Попробуйте еще раз.');
});

// Запуск бота
bot.launch().then(() => {
  console.log('Бот запущен!');
}).catch((error) => {
  console.error('Ошибка запуска бота:', error);
});

// Для Replit (или других платформ): keep-alive
const http = require('http');
http.createServer((req, res) => res.end('Bot is alive!')).listen(3000);
