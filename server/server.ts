import dotenv from "dotenv";
import http from "http";
import app from "./index";
import { Server } from "socket.io";
import { connectToDatabase } from "./utils/db";
import { setupSocketServer } from "./services/socketService";

dotenv.config();

const PORT = process.env.APP_PORT || 4000;

connectToDatabase()
  .then(() => {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    setupSocketServer(io);

    server.listen(PORT, () => {
      console.log(`Server running with Socket.IO on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
