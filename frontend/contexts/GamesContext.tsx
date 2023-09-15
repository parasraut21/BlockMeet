// @ts-nocheck
import React, { useState, useEffect, useContext, useRef } from "react";
import { Socket } from "socket.io-client";
import Chess from "@/lib/Chess";
import { useSocket } from "./SocketContext";
import { useUser } from "./UserContext";


type GameContextType = {
  game?: typeof Chess;
  createGame?: (data: any) => void;
  moves?: any[];
  players?: any[];

  publicGame?: boolean;

  makePublic?: () => void;

  makeOSID?: (SID) => void;
  makeCSID?: (SID) => void;
  OSID?: any;
  CSID?: any;
  opponent?: any;
  opponent?: any;
  
};

const GamesContext = React.createContext<GameContextType>({});

export function useGame() {
  return useContext(GamesContext);
}

interface GamesProviderProps {
  children: React.ReactNode;
}

export function GamesProvider({ children }: GamesProviderProps) {
  const socket = useSocket() as Socket;

  const [game, setGame] = useState<any | null>(null);

  const [OSID, setOSID] = useState<any | null>(null);
  const [CSID, setCSID] = useState<any | null>(null);


  const [players, setPlayers] = useState<any[]>([]);

  const [publicGame, setPublicGame] = useState<boolean>(false);

  const [opponent, setOpponent] = useState<any | null>(null); // Adjust the type here






  function createGame(data: any) {
    socket.emit("create", data);
  }

  function makePublic() {
    setPublicGame(true);
  }

  function makeOSID(SID) {
    setOSID(SID)
  }
  function makeCSID(SID) {
    setCSID(SID)
  }



  const value: GameContextType = {
    game,
    createGame,

    players,

    makeOSID,
    makeCSID,
    publicGame,
    makePublic,
  
   OSID,
   CSID,
    opponent,
  
  };

  return (
    <GamesContext.Provider value={value}>
      
      {children}
    </GamesContext.Provider>
  );
}