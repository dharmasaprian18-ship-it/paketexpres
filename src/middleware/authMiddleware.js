import jwt from "jsonwebtoken";

// Middleware 1: Memverifikasi validitas Token JWT (Authentication)
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Akses ditolak, token tidak disediakan"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

        req.user = decoded; // Menyimpan data token (id, role) ke object request
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Token tidak valid atau telah kedaluwarsa"
        });
    }
};

// Middleware 2: Membatasi hak akses berdasarkan Role user (Authorization)
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user didapatkan setelah lolos dari middleware verifyToken
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Anda tidak memiliki hak akses untuk fitur ini"
            });
        }
        next();
    };
};