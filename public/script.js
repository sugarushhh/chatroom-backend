const socket = io('https://chatroom-backend-0wha.onrender.com');

const input = document.getElementById('message-input');
const button = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');

let myId = null;

// 获取自己的 socket id
socket.on('connect', () => {
  myId = socket.id;
});

// 发送消息
function sendMessage() {
  const msg = input.value.trim();
  if (msg) {
    socket.emit('chat message', msg); // 只发送文本内容
    input.value = '';
  }
}

// 点击按钮发送
button.addEventListener('click', sendMessage);

// 回车键发送
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// 接收消息
socket.on('chat message', ({ id, text }) => {
  const div = document.createElement('div');
  div.className = 'chat-bubble';

  // 区分自己和他人
  if (id === myId) {
    div.classList.add('self'); // 自己的消息靠右
  } else {
    div.classList.add('other'); // 别人的消息靠左
  }

  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});
