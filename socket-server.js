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
        io.emit('online users update', Object.keys(users));
      } catch (err) {
        console.log(err);
      }

      socket.on('message', console.log);

      socket.on('new game', async name => {
        let newGame = new Werewolf();
        newGame.endGameCallback = endTheGame.bind(newGame);
        newGame.addMember({ name: socket.username });
        let gameData = {
          id: uuid(),
          game: newGame,
          name,
          messages: [],
          owner: socket.username,
          participants: [socket.username]
        };
        games.push(gameData);
        users[socket.username].currentGame = gameData;
        socket.join(gameData.id);
        console.log(`new game created: ${name}`);
      });

      socket.on('get online users', cb => {
        cb(Object.keys(users));
      });

      socket.on('invite member', name => {
        if (users[name]) {
          let gameId = users[socket.username].currentGame.id;
          users[name].sockets.forEach(sock => {
            io.to(sock).emit('invitation to join', {
              gameId,
              from: socket.username
            });
          });
        }
      });

      socket.on('join game', gameId => {
        socket.join(gameId);
        let gameObj = games.find(game => game.id === gameId);
        gameObj.participants.push(socket.username);
        gameObj.game.addMember({ name: socket.username });
        io.to(gameId).emit('new participant', gameObj.participants);
        users[socket.username].currentGame = gameObj;
        console.log(users);
      });

      socket.on('message', ({ recepients, message }) => {
        if (!recepients) {
          io.to(users[socket.username].currentGame).emit('message', message);
        } else {
          recepients.forEach(recepient => {
            let sockets = users[recepient].sockets;
            sockets.forEach(sock => {
              io.to(sock).emit('message', message);
            });
          });
        }
      });

      socket.on('assign roles', () => {
        let gameId = users[socket.username].currentGame;
        let gameObj = games.find(game => game.id === gameId).game;
        gameObj.assignRolesToMembers();
        console.log(gameObj);
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
