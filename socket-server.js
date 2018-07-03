const socketIOJwt = require('socketio-jwt');
const User = require('./models/user');
const uuid = require('uuid/v1');
const Werewolf = require('./game/Werewolf');
const users = {};
const games = [];
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
      } catch (err) {
        console.log(err);
      }

      socket.on('message', console.log);

      socket.on('new game', async name => {
        let newGame = new Werewolf();
        newGame.endGameCallback = endTheGame.bind(newGame);

        let gameData = {
          id: uuid(),
          game: newGame,
          name,
          messages: [],
          owner: socket.username,
          participants: [socket.username]
        };
        games.push(gameData);
        users[socket.username].currentGame = gameData.id;
        socket.join(gameData.id);
        console.log(`new game created: ${name}`);
      });

      socket.on('get online users', cb => {
        cb(Object.keys(users));
      });

      socket.on('invite member', name => {
        console.log(users);
        if (users[name]) {
          let gameId = users[socket.username].currentGame;
          users[name].sockets.forEach(sock => {
            io.to(sock).emit('invitation to join', gameId);
          });
        }
      });

      socket.on('join game', gameId => {
        socket.join(gameId);
        io.to(gameId).emit(
          'message',
          `${socket.username} has joined the game!`
        );
        users[socket.username].currentGame = gameId;
        console.log(users);
      });

      socket.on('assign roles', () => {
        newGame.assignRolesToMembers();
        console.log(newGame.memberList);
      });

      socket.on('vote tally', () => {
        newGame.voteTalley(console.log);
      });

      socket.on('werewolf vote', playerName => {
        newGame.voteAdding(playerName);
        console.log(newGame.votes);
      });

      socket.on('protect player', playerName => {
        newGame.protectPlayer(playerName);
        console.log(newGame.memberList);
      });

      socket.on('victimize', victim => {
        let killed = newGame.chooseVictim(victim);
        if (killed) console.log(`${victim} was devoured`);
        else console.log(`${victim} has survived the attack`);
        console.log(newGame.memberList);
      });

      socket.on('disconnect', () => {
        users[socket.username].sockets = users[socket.username].sockets.filter(
          id => id !== socket.id
        );
      });
    });
  function endTheGame(winnerStr) {
    io.to(this.gameId).emit('Go home', 'like seriously ' + winnerStr);
    console.log("Game's over go home!", winnerStr);
  }
}

module.exports = socketServer;
