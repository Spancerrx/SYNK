import { Server } from 'socket.io';

export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Secure later
      methods: ["GET", "POST"]
    }
  });

  const rooms = {}; // { roomId: { code: '', users: [] } }

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join Room
    socket.on("join", ({ roomId, username }) => {
      socket.join(roomId);
//      console.log(`${username} joined room: ${roomId}`);

      // Initialize room if doesn't exist
      if (!rooms[roomId]) {
        rooms[roomId] = {
          code: '',
          users: []
        };
      }
      const userExists = rooms[roomId].users.some(u => u.id === socket.id);
      // Add user to room's user list
      if(!userExists) {
        rooms[roomId].users.push({ id: socket.id, username });
      }

      // Send existing code to the new user if present
      if (rooms[roomId].code) {
        socket.emit("load-code", rooms[roomId].code);
      }

      // Send updated user list to everyone in the room
      const userList = rooms[roomId].users.map(u => u.username);
      io.to(roomId).emit("update-users", userList);
    });

    // Code editor sync
    socket.on("code-change", ({ roomId, code }) => {
      if (rooms[roomId]) {
        rooms[roomId].code = code;
        socket.to(roomId).emit("code-update", code);
      }
    });

    // Whiteboard drawing sync
    socket.on("whiteboard-draw", (data) => {
      const { roomId, x0, y0, x1, y1, color, size, opacity } = data;
      if (rooms[roomId]) {
        socket.to(roomId).emit("whiteboard-draw", { x0, y0, x1, y1, color, size, opacity });
      }
    });

    // Clear whiteboard
    socket.on("whiteboard-clear", ({ roomId }) => {
      if (rooms[roomId]) {
        socket.to(roomId).emit("whiteboard-clear");
      }
    });

    // Chat messaging
    socket.on("send-message", ({ roomId, username, message, timestamp }) => {
      if (rooms[roomId]) {
        const payload = { username, message, timestamp };
        socket.to(roomId).emit("receive-message", payload);
      }
    });

    // Handle Disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      // Remove user from all rooms they were part of
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const userIndex = room.users.findIndex(u => u.id === socket.id);

        if (userIndex !== -1) {
          const username = room.users[userIndex].username;
          room.users.splice(userIndex, 1);

          // Send updated user list to others in the room
          const userList = room.users.map(u => u.username);
          io.to(roomId).emit("update-users", userList);

          console.log(`${username} left room: ${roomId}`);

          // Optionally clean up empty rooms
          if (room.users.length === 0) {
            delete rooms[roomId];
          }
        }
      }
    });
  });

  return io;
}
