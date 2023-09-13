import express from "express";
import * as http from 'http';

import { setupSocketIO } from "../config/socket";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
setupSocketIO(server);

// Middleware
app.use(cors());
app.use(express.json());


// Home Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});