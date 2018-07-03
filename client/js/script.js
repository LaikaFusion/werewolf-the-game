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
    .on('message', onMessage)
    .on('role update', onRoleUpdate)
    .on('choose victim', chooseVictim)
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
    $('#onlineusers').empty();
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

  $('#sendMessages').on('submit', function(e) {
    e.preventDefault();
    let recepients = $('#to').val();
    console.log(recepients);
    if (recepients === '') recepients = undefined;
    else recepients = recepients.split(',');
    sendEvent('message', { recepients, message: $('#message').val() });
    $('#message').val('');
    $('#to').val('');
  });

  $('#startGame').click(() => sendEvent('assign roles'));

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
  $('#onlineusers').empty();
  list.forEach(user => {
    $('#onlineusers').append(`<p>${user}</p>`);
  });
}

function onParticipantUpdate(list) {
  $('#participants').text(`${list}`);
}

function onMessage(data) {
  console.log(data);
  let chatBox = $('#chatbox');
  $(`<p>`)
    .text(`${data.from}: ${data.message}`)
    .appendTo(chatBox);
  chatBox.scrollTop(chatBox.attr('scrollHeight'));
}

function onRoleUpdate(role) {
  $('#role').text(`You are a ${role}`);
}

function chooseVictim(list) {
  let messageBox = $('#chatbox');
  list.forEach(villager => {
    let newDiv = $('<div>');
    newDiv.append(`<p>${villager.name}</p>`);
    let killBtn = $('<button>')
      .addClass('btn')
      .text('Kill');
    killBtn.click(() => {
      sendEvent('victimize', villager.name);
      killBtn.off('click');
    });
    newDiv.append(killBtn);
    newDiv.appendTo(messageBox);
  });
}
