import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import authRoutes from './src/routes/authRoutes.js';
import * as packageController from './src/controllers/packageController.js';

const app = express();
const server = http.createServer(app);

// Konfigurasi Socket.io
const io = new Server(server, { cors: { origin: "*" } });

// Middleware Global
app.use(cors());
app.use(express.json());

// Set io ke app agar bisa diakses di controller
app.set('socketio', io);

// Socket Logic
io.on('connection', (socket) => {
    console.log("Client connected:", socket.id);
    
    // User masuk ke "ruangan" berdasarkan resi paket
    socket.on('join_package', (resi) => {
        socket.join(resi);
        console.log(`Socket ${socket.id} joined room: ${resi}`);
    });
});

// Routes
app.use('/api/auth', authRoutes);
// Anda bisa menambahkan route untuk package di sini
// app.use('/api/package', packageRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));