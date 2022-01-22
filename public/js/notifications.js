var socket = io();

socket.emit('open-notifications');
socket.on('update-notifications', (data) => {
  document.getElementById('notif-count').textContent = data;
});
