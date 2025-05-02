const socket = io('https://chatroom-backend-0wha.onrender.com');

const input = document.getElementById('message-input');
const button = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');
const usernameInput = document.getElementById('username-input');
const setUsernameButton = document.getElementById('set-username');

let userID = localStorage.getItem('chat-username') || '';

function renderMessage(msg) {
  const time = new Date(msg.time);
  const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${msg.user === userID ? 'chat-right' : 'chat-left'}`;
  msgDiv.innerHTML = `
    <div class="username">${msg.user}</div>
    <div class="text">${msg.text}</div>
    <div class="timestamp">${timeStr}</div>
  `;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const msg = input.value.trim();
  if (msg && userID) {
    const messageObj = {
      user: userID,
      text: msg,
      time: new Date().toISOString()
    };
    socket.emit('chat message', messageObj);
    input.value = '';
  }
}

setUsernameButton.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (name) {
    userID = name;
    localStorage.setItem('chat-username', name);
    document.querySelector('.username-setup').style.display = 'none';
    document.querySelector('.chat-wrapper').style.display = 'flex';
  }
});

button.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

socket.on('load history', msgs => {
  msgs.forEach(msg => renderMessage(msg));
});

socket.on('chat message', msg => {
  renderMessage(msg);
});

window.addEventListener('DOMContentLoaded', () => {
  if (userID) {
    document.querySelector('.username-setup').style.display = 'none';
    document.querySelector('.chat-wrapper').style.display = 'flex';
  }
});
