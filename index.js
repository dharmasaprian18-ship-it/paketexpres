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

// === PERBAIKAN PATH ===
// Kita akan mencari folder 'public' di mana pun index.js berada
const publicPath = path.resolve(__dirname, 'public'); 

console.log("Mencari folder public di:", publicPath);

// Middleware
app.use(cors());
app.use(express.json());

// CSP Middleware
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data:;"
    );
    next();
});

// 1. Serve static files
app.use(express.static(publicPath));

// 2. Route Utama
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// ... (sisanya tetap sama)
app.use('/api/packages', packageRoutes);

// Socket Logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_package', (resi) => socket.join(resi));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});