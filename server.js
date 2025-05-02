const express = require('express');
const path = require('path');
const app = express();

// 提供静态文件
app.use(express.static(path.join(__dirname, 'public')));

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// 处理根路径请求
app.get('/', (req, res) => {
  res.send('Chatroom Backend is running!');
});

io.on('connection', (socket) => {
  console.log('用户已连接');

  socket.on('chat', (msg) => {
    io.emit('chat', msg);
  });

  socket.on('disconnect', () => {
    console.log('用户已断开连接');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器正在运行，端口：${PORT}`);
});
