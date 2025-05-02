const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// 创建 Express 应用
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// MongoDB 连接字符串
const MONGO_URI = 'mongodb+srv://zcr:czx225151@chatroom.mgzy5ff.mongodb.net/chatroom?retryWrites=true&w=majority&appName=chatroom';

// 连接到 MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('已连接 MongoDB'))
  .catch(err => console.error('MongoDB 连接失败:', err));

// 定义消息模型（Schema）
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  time: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// 发送 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// socket.io 逻辑
io.on('connection', (socket) => {
  console.log('用户已连接');

  // 发送历史消息
  Message.find()
    .then(messages => {
      socket.emit('load history', messages);
    })
    .catch(err => {
      console.error('加载历史消息失败:', err);
    });

  // 接收消息
  socket.on('chat message', (msg) => {
    if (msg.text && msg.user && msg.time) {
      const newMessage = new Message({
        user: msg.user,
        text: msg.text,
        time: msg.time
      });
      newMessage.save()
        .then(() => {
          io.emit('chat message', msg);
        })
        .catch(err => {
          console.error('保存消息失败:', err);
        });
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
