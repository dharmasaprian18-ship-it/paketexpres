import express from 'express';
import { createPackage, updatePackageStatus, trackPackage, getAllPackages } from "../controllers/packageController.js";

const router = express.Router();

router.post('/', createPackage);
router.patch('/:id', updatePackageStatus);
router.get('/:resi', trackPackage);
router.get('/', getAllPackages);

export default router;