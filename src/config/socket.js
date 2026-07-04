import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Nanti sesuaikan dengan URL Frontend Vercel Anda
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 User terhubung ke Socket: ${socket.id}`);

        // Join room berdasarkan ID User untuk notifikasi personal atau Chat Room
        socket.on("join_room", (userId) => {
            socket.join(userId);
            console.log(`👥 User ${userId} bergabung ke room personal.`);
        });

        // Event Realtime Chat
        socket.on("send_message", (data) => {
            // data: { senderId, receiverId, message }
            io.to(data.receiverId).emit("receive_message", data);
        });

        // Event Live Tracking (Kurir membagikan koordinat/posisi)
        socket.on("update_location", (data) => {
            // data: { packageId, customerId, posisi, koordinat }
            io.to(data.customerId).emit("location_updated", data);
        });

        socket.on("disconnect", () => {
            console.log(`❌ User terputus dari Socket: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io belum diinisialisasi!");
    }
    return io;
};