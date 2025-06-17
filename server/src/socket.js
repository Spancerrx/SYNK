import { Server } from 'socket.io';

export default function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", //secure later
            methods: ["GET", "POST"]
        }
    });
    const rooms = {};
    io.on("connection", (socket) => {
        console.log("New Client Connected", socket.id);

        socket.on("join", ({roomId, username}) => {
            socket.join(roomId);
            console.log(`${username} joined the room ${roomId}`);
            if (rooms[roomId]) {
                socket.emit("load-code", rooms[roomId]);
            }
        });
        //Real time sync
        socket.on("code-change", ({roomId, code }) => {
        rooms[roomId] = code;
            socket.to(roomId).emit("code-update", code)
        });
        socket.on("disconnect", () => {
            console.log("Socket Disconnected", socket.id)
        });
    })
    return io;
}