import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:5000";
const socket = io(BACKEND_URL, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    timeout: 10000
});

export default socket;
