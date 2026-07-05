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

// 1. Middleware Global
app.use(cors());
app.use(express.json());

// 2. Middleware CSP (Keamanan)
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data:;"
    );
    next();
});

// 3. Injeksi Socket.io (HARUS DI ATAS Routes agar API bisa pakai req.io)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// 4. API Routes
app.use('/api/packages', packageRoutes);

// 5. Static Files (Taruh di bawah agar API tidak terganggu static files)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// 6. Socket Connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_package', (resi) => socket.join(resi));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});