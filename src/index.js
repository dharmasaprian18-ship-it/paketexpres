import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import packageRoutes from './routes/packageRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// 1. Serve static files dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 2. Route Utama: Mengirim index.html saat akses root (/)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inject IO ke Request (Opsional, untuk fitur real-time)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes API
app.use('/api/packages', packageRoutes);

// Socket Logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_package', (resi) => socket.join(resi));
});

// Gunakan process.env.PORT yang disediakan Railway
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});