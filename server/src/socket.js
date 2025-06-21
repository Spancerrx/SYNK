import { Server } from 'socket.io';

export default function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", // will secure later
            methods: ["GET", "POST"]
        }
    });

    const rooms = {};

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);
        //join room
        socket.on("join", ({ roomId, username }) => {
            socket.join(roomId);
            console.log(`${username} joined room: ${roomId}`);

            if (rooms[roomId]) {
                socket.emit("load-code", rooms[roomId]);
            }
        });
        socket.on("code-change", ({ roomId, code }) => {
                    rooms[roomId] = code;
                    socket.to(roomId).emit("code-update", code);
        });

        // 🧑‍🎨 Whiteboard Drawing Sync
        socket.on("whiteboard-draw", (data) => {
            const { roomId, x0, y0, x1, y1, color, size, opacity } = data;
            if (!roomId) return;
            socket.to(roomId).emit("whiteboard-draw", { x0, y0, x1, y1, color, size, opacity });
        });

        socket.on("whiteboard-clear", ({ roomId }) => {
            if (!roomId) return;
            socket.to(roomId).emit("whiteboard-clear");
        });

        // 💬 Chat Message Sync with Timestamp
        socket.on("chat-message", (msg) => {
            const { roomId } = msg;
            if (!roomId) return;
            socket.to(roomId).emit("chat-message", msg);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

            return io;
}
