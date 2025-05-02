const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// 创建 Express 应用
const app = express();

// 提供 public 目录中的静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 创建 HTTP 服务器并与 Socket.IO 配置连接
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// 允许跨域请求
app.use(cors());

// 处理根路径请求（返回静态文件）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 监听 socket.io 连接
io.on('connection', (socket) => {
  console.log('用户已连接');

  // 监听聊天消息并广播给所有用户
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // 发送消息给所有连接的用户
  });

  // 用户断开连接时的处理
  socket.on('disconnect', () => {
    console.log('用户已断开连接');
  });
});

// 启动服务器，监听端口
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
