import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
// Gunakan import prisma yang terpusat
import { prisma } from '../config/prismaClient.js'; 

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const { email, name, picture } = ticket.getPayload();

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({ data: { name, email, role: 'CUSTOMER', avatar: picture } });
        }

        const sessionToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token: sessionToken, user });
    } catch (error) {
        res.status(401).json({ success: false, message: "Autentikasi Google Gagal" });
    }
});

export default router;