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
    .on('new participant', onParticipantUpdate)
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

  $('#gameInvitations').on('click', 'button', function() {
    sendEvent('join game', $(this).data('id'));
    $(this).remove();
  });

  $('#newGameForm').on('submit', function(e) {
    e.preventDefault();
    sendEvent('new game', $('#newGameName').val());
    $('#gameName').text($('#newGameName').val());
    $('#newGameName').val('');
  });

  $('#inviteForm').on('submit', function(e) {
    e.preventDefault();
    sendEvent('invite member', $('#memberInvite').val());
    $('#memberInvite').val('');
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

function onInvitationToJoin({ gameId, from }) {
  $('<button>')
    .data('id', gameId)
    .addClass('btn')
    .text(`Join ${from}`)
    .appendTo($('#gameInvitations'));
}

function onUserUpdate(list) {
  list.forEach(user => {
    $('#onlineusesr').append(`<p>${user}</p>`);
  });
}

function onParticipantUpdate(list) {
  $('#participants').text(`${list}`);
}
