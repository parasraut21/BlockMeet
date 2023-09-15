import { Server as ServerSocket, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { generateId } from "../chess/helpers";
import Game from "../chess/Game";

let games: Game[] = [];
let waitlistGameId: string | null = null;
interface User {
  username: string;
  inGame: boolean;
}
let dev_users: { [playerId: string]: User } = {};
export const setupSocketIO = (server: HttpServer) => {
  const io = new ServerSocket(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    const playerId: string = socket.handshake.query.id as string;
    let currentGameId: string | null = null;
    let username: string;

      socket.on("meeting", (roomId, userId) => {
    socket.join(roomId);
    // console.log(roomId);
    // console.log(userId);
    socket.broadcast.emit("user-joined-meeting", roomId);
  });

 
    // main function listeners
    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })
  
    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
  

    socket.on("username", (_username) => {
      console.log("socket username", _username);
      if (!_username) return;
      username = _username;
      dev_users[playerId] = { username: _username, inGame: false };
    });

    console.log("Client connected: " + playerId,username);
    console.log("************",socket.id," ---",playerId)
   

    function createGame(options?: { id: string; isPublic?: boolean }): string {
      let id =  generateId();
      let game = new Game(options && options.isPublic);
      games.push(game);
      socket.emit("game id", game.id);
      return game.id;
    }

    function joinGame(gameId: string, username: string): boolean {

      if (!username) username = "Guest";
      let gameIndex = games.findIndex((g) => g.id === gameId);
      if (gameIndex === -1) {
        socket.emit("leave");
        return false;
      }
      let game = games[gameIndex];
      socket.join(game.id);
      let joined = game.join(playerId, username);
      if (!joined) {
        socket.emit("leave");
        return false;
      }
      currentGameId = game.id;
   

      socket.emit("game", game.data());
      if (game.players.length === 2) {
        
        if (currentGameId) {
          io.in(currentGameId).emit("players", game.players);
         }
      }
      return true;
    }

   
    socket.on("create", (data) => {
      socket.emit('socketIdc', socket.id);
      console.log("socket create");
      createGame(data);
    });

    socket.on("join game", (id, username,socketId) => {
     
      joinGame(id, username);
      socket.emit('createSIDB', socketId);
      socket.to(id).emit('getOSID', socketId);
    });

    socket.on("oppoSID", (socketId) => {
      console.log("OppoISD",socketId);
      socket.emit('OppoISDB', socketId);
    });

    socket.on("createSID", (socketId) => {
      console.log("createSID",socketId);
    socket.emit('OppoISDB', socketId);
    });



    async function leave(): Promise<void> {
      let gameIndex = games.findIndex((g) => g.id === currentGameId);
      if (gameIndex === -1) return;
      let game = games[gameIndex];
     
       
      
      if (currentGameId === waitlistGameId) {
        waitlistGameId = null;
      }
    
      await Promise.all([...socket.rooms].map(async (room) => {
        if (room !== socket.id) {
          await socket.leave(room);
        }
      }));
    
      if (currentGameId) {
        socket.broadcast.to(currentGameId).emit("player left");
      }
      currentGameId = null;
    }
   
   

    socket.on("message", (data) => {
      socket.broadcast.to(currentGameId!).emit("message", data);
    });

  

    socket.on("leave", () => {
      leave();
    });

    socket.on("disconnect", () => {
      console.log("socket disconnect");
      console.log("Client disconnected: " + playerId);
 
      leave();
      delete dev_users[playerId];
    });
  });

  setInterval(() => {
    io.emit("get-users", Object.values(dev_users));
    io.emit("get-games", games.filter((g) => g.players.length === 2).length);
  }, 200);
};