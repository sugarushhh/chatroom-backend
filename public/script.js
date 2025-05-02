const socket = io('https://chatroom-backend-0wha.onrender.com');

let username = localStorage.getItem('username');
if (!username) {
  username = prompt("请输入你的用户名：") || "匿名";
  localStorage.setItem('username', username);
}

const input = document.getElementById('message-input');
const button = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function sendMessage() {
  const text = input.value.trim();
  if (text) {
    const message = {
      username,
      text,
      timestamp: Date.now()
    };
    socket.emit('chat message', message);
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

socket.on('chat message', message => {
  const messageDiv = document.createElement('div');
  const isSelf = message.username === username;
  messageDiv.className = `chat-message ${isSelf ? 'right' : 'left'}`;

  const nameSpan = document.createElement('div');
  nameSpan.className = 'username';
  nameSpan.textContent = message.username;

  const textSpan = document.createElement('div');
  textSpan.className = 'text';
  textSpan.textContent = message.text;

  const timeSpan = document.createElement('div');
  timeSpan.className = 'timestamp';
  timeSpan.textContent = formatTime(message.timestamp);

  messageDiv.appendChild(nameSpan);
  messageDiv.appendChild(textSpan);
  messageDiv.appendChild(timeSpan);

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});
