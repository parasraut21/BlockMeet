import React, { useState, useEffect } from "react";
import Game from "./Game";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import { useSocket } from "@/contexts/SocketContext";
import { useGame } from "@/contexts/GamesContext";



import Modal from "./Modal";

export default function GamePage() {
  type Popup = {
    message: string;
    extra: string;
    element: JSX.Element;
  };




  const socket = useSocket();
  const [popup, setPopup] = useState<Popup | null>(null);
  const router = useRouter();
  const { gameId } = router.query;



  

    

  const gotogame = () => {
    router.push("/Game");
  };
 

  useEffect(() => {
    if (!socket) return;

    const leaveHandler = () => {
      router.push("/");
    };

    const gotogame = () => {
      router.push("/Game");
    };

 

   

  

    socket.on("leave", leaveHandler);

 

    return () => {
      socket.off("leave", leaveHandler);
    

    };
  }, [socket]);
  const {  players } = useGame() || {};

  return (

     
      <div className="game-container">
        <div className="board-container">
          {gameId && <Game gameId={gameId as string} />}
        </div>
     <Sidebar
          gameId={gameId ? (Array.isArray(gameId) ? gameId[0] : gameId) : ""}
        /> 
       
        {popup && socket && (
          <>
          <Modal onClose={() => setPopup(null)}>
            <Modal.Header>{popup.message}</Modal.Header>
            <Modal.Body>
              <div style={{ marginBottom: "1em" }}>{popup.extra}</div>
              {popup.element}
            </Modal.Body>
          </Modal>
          </>
        )}
      </div>
   
  );
}