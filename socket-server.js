const socketIOJwt = require('socketio-jwt');
const User = require('./models/user');
const Werewolf = require('./game/Werewolf');
const users = {};
// const games = [];
function socketServer(io) {
  const newGame = new Werewolf({
    endGameCallback: endTheGame
  });
  newGame.memberList = [
    { name: 0.162276533350459 },
    { name: 0.17786169229235882, isWerewolf: true },
    { name: 0.6341217339917959, isDoctor: true },
    { name: 0.628045600139415 },
    { name: 0.8504834046117196, isWerewolf: true },
    { name: 0.21137416164253042 },
    { name: 0.9661571781264835, isSeer: true }
  ];
  newGame.votes = {
    '0.628045600139415': 4,
    '0.162276533350459': 2,
    '0.21137416164253042': 1
  };
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

      socket.on('message', console.log);

      socket.on('new game', name => {
        games.push = new Werewolf();
        console.log(`new game created: ${name}`);
      });

      socket.on('add member', name => {
        newGame.addMember(name);
        console.log(newGame.memberList);
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
    io.emit('Go home', 'like seriously ' + winnerStr);
    console.log("Game's over go home!", winnerStr);
  }
}

module.exports = socketServer;
