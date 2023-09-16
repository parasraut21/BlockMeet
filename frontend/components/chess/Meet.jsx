import React, { useState, useEffect } from "react";
import VideoChatApp from "./VideFrame";
import PropTypes from "prop-types";
import VideoFrame from "./VideFrame";

import styles from "./Meet.module.css";
import { useSocket } from "@/contexts/SocketContext";
import { copyToClipboard } from "@/helpers";
import { useUser } from "@/contexts/UserContext";
import { useGame } from "@/contexts/MeetContext";
// interface GameProps {
//   gameId: string;
// }

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  margin: "0",
  padding: "0",
};

export default function Game({ gameId }) {
  const { game, players, publicGame ,OSID,CSID} = useGame() || {};
  const [vidility, setVidility] = useState(false);
  const socket = useSocket();
  const { id, username } = useUser();
  const [opponentSocketId, setOpponentSocketId] = useState('')
  const [mySocketId, setMySocketId] = useState('')

  const [buttonClicked, setButtonClicked] = useState(false)

  
 
  useEffect(() => {
    if (!socket) return;
    socket.emit("join game", gameId, username ? username : "Guest",socket.id);

    socket.on('getOSID' , (socketId)=>{
setOpponentSocketId(socketId)
console.log("._________NOT________",socketId)
     })

     console.log("._________________",opponentSocketId)

  }, [socket]);

  useEffect(() => {
   
    socket.on('createSIDB', (socketId) => {
      setMySocketId(socketId)
      console.log("Creator socket.id: ", socketId);
    });

    // socket.on('OppoISDB', (socketId) => {
    //   setOpponentSocketId(socketId)
    //   console.log("createSIDB socket.id: ", mySocketId);
    // });

  }, []);


  return  (
 
    <>
   {/* {vidility ?    : ""} */}
   
   <VideoChatApp
                mySocketId={socket.id}
                opponentSocketId={opponentSocketId}
                myUserName="{props.myUserName}"
                opponentUserName="{opponentUserName}"
              /> 
              
    <div
            className="shadow p-2 d-flex bg-white justify-content-center align-items-center rounded-circle"
            style={{
              position: "absolute",
              right: "6rem",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() => {
              if (vidility) {
                setVidility(false);
                localStream.getVideoTracks()[0].stop();
              } else {
                setVidility(true);
                console.log("Yeah Boi",OSID,"---------",CSID);
              }
            }}
          >
          </div> 
      <div className={styles.body}>
        <a href="#" className={styles["animated-button"]}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <div>
            <div className={styles["waiting-content"]}>
              <div>
                {publicGame ? (
                  <>
                    <h1> The next person that joins will play against you</h1>
                    <h1>Waiting for opponent...</h1>
                  </>
                ) : (
                  <>
                    <h1>Invite a Friend to the Game</h1>
                    <h2>Your Game Id {gameId}</h2>
                    <h1>Waiting for opponent...</h1>
                    {buttonClicked ? (
                      <div
                        id="toast-success"
                        className="w-full max-w-md p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-md border-2 border-green-400 dark:text-gray-400 dark:bg-gray-800"
                      >
                        <div className="text-center text-sm font-normal">
                          <svg
                            className="w-5 h-5 inline-block mr-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                          Copied successfully to the clipboard
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          copyToClipboard(gameId);
                          setButtonClicked(true);
                        }}
                      >
                        Copy GameID to Clipboard
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </a>
      </div>
    </>
  );
}

Game.propTypes = {
  gameId: PropTypes.string.isRequired,
};
