import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name } = ticket.getPayload();
        // Anda bisa melakukan prisma.user.upsert di sini
        const sessionToken = jwt.sign({ email, name }, process.env.JWT_SECRET);
        res.json({ success: true, token: sessionToken });
    } catch (err) {
        res.status(401).json({ message: "Google Auth failed" });
    }
});

export default router;