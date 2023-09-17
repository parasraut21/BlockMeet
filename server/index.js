const http = require('http')
const express = require('express')
const cors = require('cors');

const Game = require('./Game')
const socketIO = require('socket.io');
const { generateId } = require('./helpers')

const app = express()
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

var users = {};
let games = []

let waitlistGameId;

let dev_users = {}

io.on('connection', socket => {

  socket.on('create', data => {
    console.log('socket create')
    createGame(data)
  })

  socket.on('join game', (id, username) => {
    console.log('socket join')
    joinGame(id, username)
    users[socket.id] = username;
    socket.broadcast.to(id).emit("new", username);
  })

  function joinGame(gameId, username) {
    if (!username) username = "Guest"
    let gameIndex = games.findIndex(g => g.id === gameId)
    if (gameIndex === -1) return socket.emit('leave')
    let game = games[gameIndex]
    socket.join(game.id)
    let joined = game.join(playerId, username)
    if (!joined) return socket.emit('leave')
    currentGameId = game.id

    socket.emit('game', game.data())
    if (game.players.length ===2) {
      game.start()
      io.in(currentGameId).emit('players', game.players)
    }
  }

  socket.on("meeting", (roomId, userId) => {
    socket.join(roomId);
    console.log(roomId);
    console.log(userId);
    socket.broadcast.to(roomId).emit("user-joined-meeting", userId);
  });

  // socket.on("disconnect", () => {
  //   socket.broadcast.to(gameId).emit("left", users[socket.id]);
  //   delete users[socket.id];
  // });
  socket.on("send", (message) => {
    if (message.type == "text") {
      socket.broadcast.to(message.gameId).emit("message", {
        name: users[socket.id],
        message: message.msg,
        type: "text",
      });
    }
    if (message.type == "file") {
      socket.broadcast.to(message.gameId).emit("message", {
        name: users[socket.id],
        url: message.url,
        type: "file",
      });
    }
  });

  const playerId = socket.handshake.query.id
  let currentGameId;
  let username;

  socket.on('username', _username => {
    console.log('socket username')
    if (!_username) return
    username = _username
    dev_users[playerId] = { username: _username, inGame: false }
  })

  console.log("Client connected: " + playerId)
  function createGame(options) {
    let id = options && options.id || generateId()
    let game = new Game(options && options.isPublic)
    games.push(game)
    socket.emit('game id', game.id)
    return game.id
  }

 



 



  socket.on('leave', () => {
    console.log('socket leave')
    leave()
  })
  function leave() {
    let gameIndex = games.findIndex(g => g.id === currentGameId)
    if (gameIndex === -1) return
    let game = games[gameIndex]
    let pIndex = game.players.findIndex(p => p.id === playerId)
    game.active[pIndex] = false
    games = games.filter(g => g.active.find(a => !!a))
    if (currentGameId === waitlistGameId) {
      waitlistGameId = null // make sure someone joining the waitlist doesn't get paired with someone who has already left
    }
    socket.leaveAll()
    socket.broadcast.to(currentGameId).emit('player left')
    currentGameId = null
  }

  socket.on('disconnect', () => {
    console.log('socket disconnect')
    console.log("Client disconnected: " + playerId, username)
    leave()
    delete dev_users[playerId]
  })

})
setInterval(() => {
  io.emit('get-users', Object.values(dev_users))
  io.emit('get-games', games.filter(g => g.players.length === 2).length)
}, 200)
server.listen(8000, () => {
  console.log(`Server listening on port ${8000}`);
});