const socket = io();
const input = document.getElementById('message-input');
const button = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');

// 发送消息
function sendMessage() {
  const msg = input.value.trim();
  if (msg) {
    socket.emit('chat message', msg);
    appendMessage({ text: msg, self: true }); // 立刻在本地添加
    input.value = '';
  }
}

button.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// 接收别人发的消息
socket.on('chat message', (msg) => {
  appendMessage({ text: msg, self: false });
});

// 渲染消息
function appendMessage({ text, self }) {
  const div = document.createElement('div');
  div.className = 'chat-bubble ' + (self ? 'self' : 'other');
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
