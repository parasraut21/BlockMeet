import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";

import Loader from "./Loader";

import styles from "./Game.module.css";
import { useSocket } from "@/contexts/SocketContext";
import { copyToClipboard } from "@/helpers";
import { useUser } from "@/contexts/UserContext";
import { useGame } from "@/contexts/GamesContext";
interface GameProps {
  gameId: string;
}

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  margin: "0",
  padding: "0",
};

export default function Game({ gameId }: GameProps) {
  const { game, players, publicGame } = useGame() || {};

  const socket = useSocket();
  const { id, username } = useUser();

  const [buttonClicked, setButtonClicked] = useState<false | boolean>();

  useEffect(() => {
    if (!socket) return;
    socket.emit("join game", gameId, username ? username : "Guest");
  }, [socket]);

  return  (
 
    <>
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
