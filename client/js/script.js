let socket = io('/');

socket.on('connect', () => {
  socket
    .on('authenticated', () => {
      console.log('authentication successful');
    })
    .emit('authenticate', {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViMzkzN2Q1OTA2MDhmMDM0YjcwMjk0NyIsImlhdCI6MTUzMDU2NjM1OX0.ESTEPUI9RUiwWWAIbL8kPiaF9fiYe2OGie3pQVwgE44'
    })
    .on('error', console.log);
});
