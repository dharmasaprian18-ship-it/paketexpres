import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import packageRoutes from './routes/packageRoutes.js'; 

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

// === PERBAIKAN: Tambahkan Root Route ===
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Selamat Datang di API PaketExpress",
        version: "1.0.0",
        endpoints: {
            packages: "/api/packages"
        }
    });
});

// Routes
app.use('/api/packages', packageRoutes);

// Socket Logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_package', (resi) => socket.join(resi));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));