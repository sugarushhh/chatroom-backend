const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');

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

// 存储用户名与 IP 地址
let users = {}; // 存储用户数据

// 读取历史消息
function getHistoryMessages() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'messages.json'));
    return JSON.parse(data);
  } catch (err) {
    console.error('读取历史消息失败:', err);
    return [];  // 如果文件不存在或读取失败，返回空数组
  }
}

// 写入新消息到 messages.json
function saveMessage(msg, username) {
  const messages = getHistoryMessages();
  messages.push({ msg, username });
  fs.writeFileSync(path.join(__dirname, 'messages.json'), JSON.stringify(messages, null, 2));
}

// 处理根路径请求（返回静态文件）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 监听 socket.io 连接
io.on('connection', (socket) => {
  console.log('用户已连接');
  
  // 向新连接的用户发送历史消息
  const history = getHistoryMessages();
  socket.emit('chat history', history);

  // 监听设置用户名
  socket.on('set username', (data) => {
    users[socket.id] = { username: data.username, ip: socket.handshake.address };
    console.log(`用户 ${data.username} 连接，IP 地址: ${socket.handshake.address}`);
  });

  // 监听聊天消息并广播给所有用户
  socket.on('chat message', (data) => {
    const { msg, username } = data;
    saveMessage(msg, username);  // 保存消息和用户名
    io.emit('chat message', { msg, username });  // 广播消息给所有连接的用户
  });

  // 用户断开连接时的处理
  socket.on('disconnect', () => {
    const user = users[socket.id];
    console.log(`${user.username} 已断开连接`);
    delete users[socket.id];  // 删除已断开用户的数据
  });
});

// 启动服务器，监听端口
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
