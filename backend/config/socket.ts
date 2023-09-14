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

    socket.on("username", (_username) => {
      console.log("socket username", _username);
      if (!_username) return;
      username = _username;
      dev_users[playerId] = { username: _username, inGame: false };
    });

    console.log("Client connected: " + playerId);

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
      console.log("socket create");
      createGame(data);
    });

    socket.on("join game", (id, username) => {
      console.log("socket join");
      joinGame(id, username);
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
      console.log("Client disconnected: " + playerId, username);
      leave();
      delete dev_users[playerId];
    });
  });

  setInterval(() => {
    io.emit("get-users", Object.values(dev_users));
    io.emit("get-games", games.filter((g) => g.players.length === 2).length);
  }, 200);
};