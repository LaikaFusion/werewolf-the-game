let socket = io('/');

socket.on('connect', () => {
  console.log('connected');
  authenticate(sessionStorage.getItem('token'));
  socket
    .on('authenticated', () => {
      console.log('authentication successful');
      socket.on('Go home', console.log);
    })
    .on('invitation to join', console.log)
    .on('message', console.log)
    .on('error', console.log);
});

function sendEvent(event, data) {
  socket.emit(event, data);
}

function authenticate(token) {
  socket.emit('authenticate', {
    token
  });
}

$(function() {
  $('#logout').click(() => {
    sessionStorage.setItem('token', '');
  });
});
