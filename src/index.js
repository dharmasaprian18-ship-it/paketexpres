import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import packageRoutes from './routes/packageRoutes.js'; // Pastikan path benar

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// Inject IO ke Request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/packages', packageRoutes);

// Socket Logic
io.on('connection', (socket) => {
    socket.on('join_package', (resi) => socket.join(resi));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));