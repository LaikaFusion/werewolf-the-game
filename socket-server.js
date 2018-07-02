const socketIOJwt = require('socketio-jwt');
const User = require('./models/user');
const users = {};
function socketServer(io) {
  io.sockets
    .on(
      'connection',
      socketIOJwt.authorize({
        secret: process.env.SECRET,
        timeout: 15000
      })
    )
    .on('authenticated', async socket => {
      // All socket events go here
      // Identify the user associated with this socket
      try {
        let user = await User.findById(socket.decoded_token.id);
        console.log(user);
        socket.username = user.username;
        console.log(
          `${socket.username} has connected through socket ${socket.id}`
        );

        if (!users.hasOwnProperty(socket.username)) users[socket.username] = {};

        if (users[socket.username].sockets) {
          users[socket.username].sockets.push(socket.id);
        } else {
          users[socket.username].sockets = [socket.id];
        }
        console.log(users);
      } catch (err) {
        console.log(err);
      }

      socket.on('disconnect', () => {
        users[socket.username].sockets = users[socket.username].sockets.filter(
          id => id !== socket.id
        );
      });
    });
}

module.exports = socketServer;
