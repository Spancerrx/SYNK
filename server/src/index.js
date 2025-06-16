import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
       origin: '*', //TODO: Update in prod
        methods: ['GET', 'POST'],
    },
});


app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({status: 'SYNK Server is running 🟢'});
});

io.on('connection' , (socket) => {
    console.log('New socket connected', socket.id);

    socket.on('Disconnect', () => {
    console.log('Socket disconnected', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`SYNK Server running on http://localhost:${PORT}`);
});

