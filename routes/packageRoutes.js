import express from 'express';
const router = express.Router();

// Mock data agar tidak undefined
router.get('/', (req, res) => {
    res.json({ 
        data: [
            { resi: "JP123456", status: "Sedang Dikirim" },
            { resi: "JP789012", status: "Tiba di Gudang" }
        ] 
    });
});

router.post('/', (req, res) => {
    const { resi, status } = req.body;
    res.json({ success: true, message: "Data diterima", data: { resi, status } });
});

export default router;