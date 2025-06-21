import { Server } from 'socket.io';

export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // secure later
      methods: ["GET", "POST"]
    }
  });

  const rooms = {}; // stores code per room

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join room
    socket.on("join", ({ roomId, username }) => {
      socket.join(roomId);
      console.log(`${username} joined room: ${roomId}`);

      // Send current code if already present
      if (rooms[roomId]) {
        socket.emit("load-code", rooms[roomId]);
      }
    });

    // Code editor sync
    socket.on("code-change", ({ roomId, code }) => {
      rooms[roomId] = code;
      socket.to(roomId).emit("code-update", code);
    });

    // Whiteboard drawing sync
    socket.on("whiteboard-draw", (data) => {
      const { roomId, x0, y0, x1, y1, color, size, opacity } = data;
      if (!roomId) return;
      socket.to(roomId).emit("whiteboard-draw", { x0, y0, x1, y1, color, size, opacity });
    });

    // Clear whiteboard
    socket.on("whiteboard-clear", ({ roomId }) => {
      if (!roomId) return;
      socket.to(roomId).emit("whiteboard-clear");
    });

    // Chat messaging
    socket.on("send-message", ({ roomId, username, message, timestamp }) => {
      const payload = { username, message, timestamp };
      socket.to(roomId).emit("receive-message", payload);
    });

    // Disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}
