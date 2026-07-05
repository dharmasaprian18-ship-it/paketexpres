import express from 'express';
import { prisma } from '../config/prismaClient.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Semua orang boleh melihat
router.get('/', async (req, res) => {
    try {
        const packages = await prisma.package.findMany();
        res.json({ success: true, data: packages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengambil data" });
    }
});

// POST: Hanya Admin yang boleh tambah data (Dilindungi Middleware)
router.post('/', verifyToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const { resi, status } = req.body;
        const newPackage = await prisma.package.create({ data: { resi, status } });
        
        // Panggil io dari objek request untuk RTC
        req.io.emit('new_package', newPackage);
        
        res.status(201).json({ success: true, data: newPackage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal menambah data" });
    }
});

export default router;