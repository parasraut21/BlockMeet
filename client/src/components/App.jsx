

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


import { SocketProvider } from '../contexts/SocketContext'
import { UserProvider } from '../contexts/UserContext'
import { GamesProvider } from '../contexts/MeetsContext'

import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  InputBase,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ScheduleIcon from '@mui/icons-material/Schedule';
import JoinIcon from '@mui/icons-material/GroupAdd';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Navbar from './Navbar'
import Footer from './Footer'



import GamePage from './GamePage'
import Menu from './Menu'


function App() {
  return (
    <>
 
        <UserProvider>
          <SocketProvider>
            <Router>
              <Routes>
                <Route exact path='/' element={<Menu />} />
                <Route path='/Meet/:gameId' element={<GamesProvider><GamePage /></GamesProvider>} />
                <Route path='*' element={<Menu />} />
              </Routes>
            </Router>
          </SocketProvider>
        </UserProvider>

    </>
  );
}

export default App;