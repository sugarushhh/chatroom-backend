const socket = io('https://chatroom-backend-0wha.onrender.com');
const input = document.getElementById('message-input');
const button = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');

let username = localStorage.getItem('username');

if (!username) {
  username = prompt('请输入你的昵称：');
  localStorage.setItem('username', username);
}

// 发送消息
function sendMessage() {
  const text = input.value.trim();
  if (text) {
    const message = {
      user: username,
      text,
      timestamp: new Date().toISOString(),
    };
    socket.emit('chat message', message);
    input.value = '';
  }
}

// 接收并显示消息
function displayMessage(msg) {
  const div = document.createElement('div');
  const isSelf = msg.user === username;
  div.className = 'chat-bubble ' + (isSelf ? 'right' : 'left');

  const userElem = document.createElement('div');
  userElem.className = 'username';
  userElem.textContent = msg.user;

  const textElem = document.createElement('div');
  textElem.textContent = msg.text;

  const timeElem = document.createElement('div');
  timeElem.className = 'timestamp';
  const time = new Date(msg.timestamp);
  timeElem.textContent = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

  div.appendChild(userElem);
  div.appendChild(textElem);
  div.appendChild(timeElem);

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 事件监听
button.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// 接收历史消息
socket.on('chat history', messages => {
  chatBox.innerHTML = '';
  messages.forEach(displayMessage);
});

// 接收实时消息
socket.on('chat message', msg => {
  displayMessage(msg);
});
