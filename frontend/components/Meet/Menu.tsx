import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSocket } from "@/contexts/SocketContext";
import { useUser } from "@/contexts/UserContext";
import Loader from "./Loader";
import { useGame } from "@/contexts/MeetContext";


export default function Menu() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]); 
  const [joiningGame, setJoiningGame] = useState(false);
  const [gameId, setGameId] = useState("");

  const { makeCSID, makeOSID } = useGame();

  const handleGameIdChange = (event) => {
    setGameId(event.target.value);
  };

  const handleJoinGameClick = () => {
    console.log("join");
    setJoiningGame(true);
  };

  const handleJoinWithGameId = async () => {
    makeCSID(socket.id);
    socket?.emit("oppoSID", socket.id);
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
    makeOSID(socket.id);
    socket?.emit("createSID", socket.id);
    setLoading(true);
    socket?.emit("create");
  };

  return (
    <>
      <div className="relative flex items-center justify-center w-full h-screen bg-center  bg-no-repeat bg-cover">
        <div className="relative h-full">
          <div className="absolute inset-0 flex items-center justify-center"></div>
          <div className="flex justify-center items-center h-full ">
            {loading ? (
              <Loader />
            ) : (
              <div className="max-w-sm bg-white rounded-lg shadow-2xl p-6 bg-orange-400">
                <button
                  onClick={handlePrivateGameClick}
                  className="menu-Button shadow-2xl bg-customC hover:bg-customh transform hover:scale-105 text-white border-2 border-customC rounded-full py-2 px-6 m-2 focus:outline-none focus:ring focus:border-blue-300"
                >
                  Start Meet
                </button>

                <button
                  onClick={handleJoinGameClick}
                  className="menu-Button shadow-2xl menu-Button-secondary bg-customC hover:bg-customh text-white transform hover:scale-105 border-2 border-customC rounded-full py-2 px-6 m-2 focus:outline-none focus:ring focus:border-blue-300"
                >
                  Join Meet
                </button>

                {joiningGame && (
                  <div className="menu-Buttons-1 p-4 rounded-lg shadow-md bg-gray-100">
                    <input
                      value={gameId}
                      onChange={handleGameIdChange}
                      type="text"
                      id="input-info"
                      placeholder="Enter Game ID"
                      className="w-full shadow-2xl p-2 border-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-300 rounded-md hover:shadow-lg relative z-10"
                      required
                    />

                    <button
                      onClick={handleJoinWithGameId}
                      className="menu-Button shadow-2xl bg-orange-400 mt-4 w-full p-2 transform hover:scale-105 text-white bg-customC hover:bg-customh rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    >
                      Join with Meet ID
                    </button>
                    {loading && <Loader />}
                  </div>
                )}

                {showOnline && (
                  <div className="text-white p-2 font-bold animate-pulse text-bg-customh-500">
                    Online:{" "}
                    <span className="font-bold animate-pulse text-bg-customh-500">
                      {onlineUsers.length}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
