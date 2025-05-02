// 连接到服务器
const socket = io();

// 发送消息的按钮点击事件
document.getElementById('sendMessage').addEventListener('click', () => {
  const message = document.getElementById('messageInput').value;
  if (message.trim()) {
    socket.emit('chat message', message);  // 发送消息到后端
    document.getElementById('messageInput').value = '';  // 清空输入框
  }
});

// 监听回车键事件发送消息
document.getElementById('messageInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('sendMessage').click();  // 触发点击事件，发送消息
  }
});

// 接收消息并更新 UI
socket.on('chat message', (msg) => {
  const messageList = document.getElementById('messages');
  const messageItem = document.createElement('li');
  messageItem.textContent = msg;
  messageList.appendChild(messageItem);
});
