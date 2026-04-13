import express from 'express';
import multer from 'multer';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { authenticate, preventSuperAdmin } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Use disk storage to a temp folder so cloudinary.js can read and clean up the file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '..', 'public', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|avif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files (JPEG, JPG, PNG, WEBP, GIF, AVIF) are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

// @desc    Upload images to Cloudinary
// @route   POST /api/upload
router.post(
  '/',
  authenticate,
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    console.log(`[Upload] Body:`, req.body);
    console.log(`[Upload] Files:`, req.files?.map(f => ({ name: f.originalname, size: f.size, path: f.path })));

    if (!req.files || req.files.length === 0) {
      console.warn(`[Upload] No files received in request`);
      throw new ApiError(400, 'Please upload at least one image');
    }

    const uploadedUrls = [];

    console.log(`[Upload] Processing ${req.files.length} files...`);
    for (const file of req.files) {
      console.log(`[Upload] Uploading to Cloudinary: ${file.originalname}`);
      const result = await uploadOnCloudinary(file.path);
      if (!result) {
        console.error(`[Upload] Cloudinary upload failed for ${file.originalname}`);
        throw new ApiError(500, `Failed to upload file: ${file.originalname} to Cloudinary. Check backend logs.`);
      }
      uploadedUrls.push(result.secure_url);
    }

    return res.status(200).json({ 
      images: uploadedUrls,
      message: 'Images uploaded successfully' 
    });
  })
);

export default router;
