const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is alive!');
});

// Запуск сервера на порту 3000
server.listen(3000, () => {
  console.log('✅ Server is running on port 3000');
});

// Keep-Alive пингует сервер раз в 5 минут
setInterval(() => {
  http.get('https://386179a6-4d3a-455c-a1fb-a910afcfec9f-00-5ixm0lzdyxk6.riker.replit.dev/'); // Укажи свою ссылку
}, 300000); // 5 минут (300000 мс)

// Перезапуск при ошибках
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
  process.exit(1);
});
