import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Fungsi Utility
const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({ success, message, data });
};

// 1. Fungsi createPackage (Fungsi yang dicari oleh routes)
export const createPackage = async (req, res) => {
    try {
        // Logika untuk membuat paket baru
        return sendResponse(res, 201, true, "Paket berhasil dibuat");
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// 2. Fungsi updatePackageStatus
export const updatePackageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { resi, status, posisi, keterangan } = req.body;
        
        const updatedPackage = await prisma.package.update({
            where: { id },
            data: { status }
        });

        await prisma.tracking.create({
            data: { packageId: id, status, posisi, keterangan }
        });

        req.io.to(resi).emit('status_updated', { status, posisi, keterangan });

        return sendResponse(res, 200, true, "Status diperbarui", updatedPackage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// 3. Fungsi trackPackage
export const trackPackage = async (req, res) => {
    try {
        // Logika track
        return sendResponse(res, 200, true, "Data ditemukan");
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// 4. Fungsi getAllPackages
export const getAllPackages = async (req, res) => {
    try {
        const packages = await prisma.package.findMany();
        return sendResponse(res, 200, true, "Data berhasil diambil", packages);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};