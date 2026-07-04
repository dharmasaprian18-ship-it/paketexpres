const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Pastikan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET sudah ada di file .env Anda
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage' // Wajib menggunakan ini jika menggunakan alur flow: 'auth-code' di React
);

// Impor model User database Anda (Sesuaikan path-nya dengan struktur backend Anda)
const { User } = require('../models'); 

/**
 * @route   POST /api/auth/google
 * @desc    Autentikasi & Registrasi Otomatis via Google OAuth2
 * @access  Public (Memenuhi kriteria Sub-CPMK 2, 4, & 7)
 */
router.post('/google', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ 
            success: false, 
            message: "Otorisasi gagal: Auth-code dari Google tidak ditemukan." 
        });
    }

    try {
        // 1. Tukarkan auth-code dari frontend menjadi tokens resmi dari Google API
        const { tokens } = await client.getToken(token);
        
        // 2. Verifikasi ID Token untuk mendapatkan payload data user
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // 3. Integrasi Database (Sub-CPMK 1): Cari atau buat user baru secara otomatis
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Jika email Google belum terdaftar di sistem, buat akun baru otomatis sebagai CUSTOMER
            user = await User.create({
                name: name,
                email: email,
                role: 'CUSTOMER', // Default hak akses awal
                avatar: picture
            });
        }

        // 4. Manajemen Sesi & Keamanan (Sub-CPMK 4): Buat JWT Token internal aplikasi
        const sessionToken = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 5. Kirim respon sukses balik ke Frontend (REST API - Sub-CPMK 3)
        return res.status(200).json({
            success: true,
            message: "Autentikasi Google berhasil disinkronisasi.",
            token: sessionToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("OAuth Backend Error:", error);
        return res.status(401).json({ 
            success: false, 
            message: "Verifikasi enkripsi Google OAuth2 gagal di sisi server." 
        });
    }
});

module.exports = router;