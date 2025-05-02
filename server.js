const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const cors = require('cors');

// 创建 Express 应用
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// 消息缓存文件
const MESSAGE_FILE = path.join(__dirname, 'messages.json');

// 读取已有消息（如果存在）
let messages = [];
if (fs.existsSync(MESSAGE_FILE)) {
  try {
    const raw = fs.readFileSync(MESSAGE_FILE, 'utf8');
    messages = JSON.parse(raw);
  } catch (err) {
    console.error('读取消息失败:', err);
    messages = [];
  }
}

// 保存消息到文件
function saveMessages() {
  fs.writeFile(MESSAGE_FILE, JSON.stringify(messages, null, 2), err => {
    if (err) console.error('保存消息失败:', err);
  });
}

// 发送 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// socket.io 逻辑
io.on('connection', (socket) => {
  console.log('用户已连接');

  // 发送历史消息
  socket.emit('load history', messages);

  // 接收消息
  socket.on('chat message', (msg) => {
    if (msg.text && msg.user && msg.time) {
      msg.time = new Date(msg.time).toISOString(); // 确保时间格式是ISO格式
      messages.push(msg);
      if (messages.length > 500) messages.shift(); // 最多保留500条
      saveMessages();
      io.emit('chat message', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('用户断开连接');
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器正在监听端口 ${PORT}`);
});
