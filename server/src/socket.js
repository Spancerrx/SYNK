import { Server } from 'socket.io';

export default function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", //secure later
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New Client Connected", socket.id);

        socket.on("join", ({roomId, username}) => {
            socket.join(roomId);
            console.log(`${username} joined the room ${roomId}`);
        });

        socket.on("disconnect", () => {
            console.log("Socket Disconnected", socket.id)
        });
    })
    return io;
}