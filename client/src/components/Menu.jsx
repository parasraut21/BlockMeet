import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { generateId } from '../helpers'
import { useUser } from '../contexts/UserContext'
import { useSocket } from '../contexts/SocketContext'
import Loader from './Loader'

import { inDevelopment } from '../vars'

export default function Menu() {
  const [myGames, setMyGames] = useState()
  const [loading, setLoading] = useState(false)
  const [isPrivate, setIsPrivate] = useState()
  const [onlineUsers, setOnlineUsers] = useState([])
  const navigate = useNavigate()
  const [joiningGame, setJoiningGame] = useState(false);
  const socket = useSocket()
  const { username, id } = useUser()
  const [gameId, setGameId] = useState("");
  let showOnline = true;
    const handleGameIdChange = (event) => {
    setGameId(event.target.value);
  };

  const handleJoinGameClick = () => {
    console.log("join");
    setJoiningGame(true);
  };

  const handleJoinWithGameId = async () => {
  
    setLoading(true)
    console.log("Joining game with ID:", gameId);
  
    navigate(`/Game/${gameId}`);
        setLoading(false)
      
   
  };
  useEffect(() => {
    if(!socket) return
    socket.emit('username', username)
  }, [username, socket])

  useEffect(() => {
    if(!socket) return
    function gotogame(id) {
      navigate('/game/' + id)
    }
    socket.on('game id', gotogame)
    socket.emit('get-users')
    socket.on('get-users', _users => {
      setOnlineUsers(_users)
    })
    return () => {
      socket.off('game id')
      socket.off('get-users')
    }
  }, [socket])

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      { 
        loading ? <Loader /> :
        <>
          <div className='menu-buttons'>
            <button
              onClick={() => {
                setLoading(true);
                socket.emit('create');
              }}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Private Meeting<span className="ml-2">Send a link to a friend</span>
            </button>
            <button
                  onClick={handleJoinGameClick}
                  className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Join Game
                </button>
                {joiningGame && (
        <div className={`menu-buttons-1  p-8 rounded-lg shadow-md w-full max-w-sm`}>
       <input
  type="text"
  placeholder="Enter Game ID"
  value={gameId}
  onChange={handleGameIdChange}
  className={` w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 shadow-white hover:shadow-lg`}
  required
/>
          <button
            onClick={handleJoinWithGameId}
            className={`   mt-4 w-full p-2 bg-green-500 text-white rounded-md focus:outline-none focus:ring focus:border-blue-300`}
          >
            Join with Game ID
          </button>
          {loading && <Loader />}
        </div>
      )}
          </div>
          {showOnline && <div className="fixed top-8 left-8 bg-gray-100 p-2 rounded">Online: {onlineUsers.length}</div>}
          {inDevelopment && <div className='slide-down develop-message'>Development in process. Sorry for any inconvenience.</div>}
        </>
      }
    </div>
  );
}