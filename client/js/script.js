let socket = io('/');

socket.on('connect', () => {
  console.log('connected');
  authenticate(sessionStorage.getItem('token'));
  socket
    .on('authenticated', () => {
      console.log('authentication successful');
      socket.on('Go home', console.log);
    })
    .on('invitation to join', onInvitationToJoin)
    .on('online users update', onUserUpdate)
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

  sendEvent('get online users', list => {
    list.forEach(user => {
      $('#onlineusers').append(`<p>${user}</p>`);
    });
  });

  $.get({
    url: '/api/profileInfo',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })
    .then(data => {
      $('#name').text(`${data.firstName} ${data.lastName}`);
    })
    .catch(console.log);
});

function onInvitationToJoin(gameId) {}

function onUserUpdate(list) {
  list.forEach(user => {
    $('#onlineusesr').append(`<p>${user}</p>`);
  });
}
