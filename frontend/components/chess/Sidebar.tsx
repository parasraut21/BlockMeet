
// @ts-nocheck

import React from 'react';
import Messages from './Messages';
import TapMessages from './TapMessages';
import { useGame } from '@/contexts/MeetContext';
import { allowLiveChat } from '@/var';
interface SidebarProps {
  gameId: string;
}

export default function Sidebar({ gameId }: SidebarProps) {
  const { game, gameOver, publicGame } = useGame();

  return (
    <React.Fragment>
   
      <div className='game-sidebar'>
        {publicGame && !allowLiveChat ? <TapMessages gameId={gameId} /> : <Messages gameId={gameId} />}
      </div>
      
    </React.Fragment>
  );
}
