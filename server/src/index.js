import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import initSocket from "./socket.js";
import executeRoute from '../routes/execute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

initSocket(httpServer);

app.use(cors());
app.use(express.json());

app.use('/api/execute', executeRoute);
app.get('/api/health', (req, res) => {
    res.json({status: 'SYNK Server is running'});
});

httpServer.listen(PORT, () => {
    console.log(`SYNK Server running on http://localhost:${PORT}`);
});

