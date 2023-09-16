import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSocket } from "@/contexts/SocketContext";
import { useUser } from "@/contexts/UserContext";
import Loader from "./Loader";
import { useGame } from "@/contexts/MeetContext";
import { Button, Card, TextInput } from "flowbite-react";

export default function Menu() {
  const router = useRouter();
 
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]); // Specify the type for onlineUsers
  const [joiningGame, setJoiningGame] = useState(false);
  const [gameId, setGameId] = useState("");

  const { makeCSID,makeOSID } = useGame();

  const handleGameIdChange = (event) => {
    setGameId(event.target.value);
  };

  const handleJoinGameClick = () => {
    console.log("join");
    setJoiningGame(true);
  };

  const handleJoinWithGameId = async () => {
    makeCSID(socket.id)
    socket?.emit("oppoSID",socket.id);
    setLoading(true);
    console.log("Joining game with ID:", gameId);
        router.push("/Meet/" + gameId);
        setLoading(false);
  };

  const socket = useSocket();
  const { username, id } = useUser();
  let showOnline = true;

  

  useEffect(() => {
    if (!socket) return;
    socket.emit("username", username);
  
  }, [username, socket]);

  useEffect(() => {
    if (!socket) return;
    async function gotogame(gameId: string) {
     
          router.push("/Meet/" + gameId);
      
    }

    async function gotoram(gameId: string) {
   
          router.push("/Meet/" + gameId);
       
    }

    socket.on("game id", gotogame);
    socket.on("ramdom id", gotoram);
    socket.emit("get-users");
    socket.on("get-users", (_users) => {
      setOnlineUsers(_users);
    });

    return () => {
      socket.off("game id", gotogame);
      socket.off("get-users");
    };
  }, [socket]);

  const handlePrivateGameClick = () => {
  makeOSID(socket.id)
    socket?.emit("createSID",socket.id);
    setLoading(true);
    socket?.emit("create");
  };
  const gotolib = () => {
    console.log("kjn")
  };

 

  return (
    <>
   
      <div className="relative flex items-center justify-center w-full h-screen bg-center bg-no-repeat bg-cover">
        <div className="relative h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-screen-md mx-auto">
            </div>
          </div>
          <div className="flex justify-center items-center h-full">
            {loading ? (
              <Loader />
            ) : (
              <Card className="max-w-sm bg-transparent border border-transparent border-opacity-0">
                <Button
                  onClick={handlePrivateGameClick}
                  className="menu-Button bg-customC hover:bg-customh transform hover:scale-105 text-black"
                >
                  Private Game
                </Button>
                <Button
                  onClick={() => {
                    setLoading(true);
                    socket?.emit("waitlist", username);
                  }}
                  className="menu-Button menu-Button-secondary bg-customC hover:bg-customh text-black transform hover:scale-105 text-black"
                >
                  Random Opponent
                </Button>
                <Button
                  onClick={handleJoinGameClick}
                  className="menu-Button menu-Button-secondary bg-customC hover:bg-customh text-black transform hover:scale-105 text-black"
                >
                  Join Game
                </Button>
                {joiningGame && (
                  <div className="menu-Buttons-1 p-8 rounded-lg shadow-md w-full max-w-sm bg-gray-100">
                    <TextInput
                      value={gameId}
                      onChange={handleGameIdChange}
                      color="info"
                      id="input-info"
                      placeholder="Enter Game ID"
                      className={`w-full p-2 border-0 focus:outline-none focus:ring focus:border-blue-300 shadow-white hover:shadow-lg`}
                      required
                    />

                    <Button
                      onClick={handleJoinWithGameId}
                      className="menu-Button mt-4 w-full p-2 transform hover:scale-105 text-black bg-customC hover:bg-customh text-black rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    >
                      Join with Game ID
                    </Button>
                    {loading && <Loader />}
                  </div>
                )}
                {showOnline && (
                  <div className="text-white p-2 font-bold animate-pulse text-white-500">
                    Online:{" "}
                    <span className="font-bold animate-pulse text-bg-customh-500">
                      {onlineUsers.length}
                    </span>
                  </div>
                )}

                <div>
                  <Button
                    onClick={gotolib}
                    className="menu-Button bg-customC text-black hover:bg-customh transform hover:scale-105 text-black"
                  >
                    Library
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
