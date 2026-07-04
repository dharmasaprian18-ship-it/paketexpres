import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path'; // Tambahkan ini
import { fileURLToPath } from 'url'; // Tambahkan ini
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

// === PERBAIKAN: Serve static files (Folder 'public') ===
app.use(express.static(path.join(__dirname, 'public')));

// Inject IO ke Request
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));