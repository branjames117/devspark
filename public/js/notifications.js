var socket = io();

const notifSound = new Audio('/sounds/msg_sent.wav');

socket.emit('open-notifications');
socket.on('update-notifications', (data) => {
  const soundEnabled = localStorage.getItem('soundEnabled');
  if (soundEnabled == 1) notifSound.play();
  document.getElementById('notif-count').textContent = data;
});
