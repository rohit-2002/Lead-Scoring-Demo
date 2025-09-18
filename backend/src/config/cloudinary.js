import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage for CSV files
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lead-scoring/csv-uploads',
        allowed_formats: ['csv', 'txt'],
        resource_type: 'raw', // For non-image files
        public_id: (req, file) => {
            const timestamp = Date.now();
            const originalName = file.originalname.replace(/\.[^/.]+$/, "");
            return `${originalName}-${timestamp}`;
        },
    },
});

export { cloudinary, storage };