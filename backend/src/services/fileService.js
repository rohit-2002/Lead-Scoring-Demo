import axios from 'axios';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { cloudinary } from '../config/cloudinary.js';

export class FileService {
    // Process CSV from memory buffer (current method)
    static async processCSVFromBuffer(buffer) {
        const leads = [];
        const csvString = buffer.toString('utf8');

        return new Promise((resolve, reject) => {
            Readable.from([csvString])
                .pipe(csv())
                .on('data', (data) => leads.push({ ...data, raw: data }))
                .on('end', () => resolve(leads))
                .on('error', reject);
        });
    }

    // Process CSV from Cloudinary URL
    static async processCSVFromCloudinary(cloudinaryUrl) {
        try {
            const response = await axios.get(cloudinaryUrl);
            const csvString = response.data;
            const leads = [];

            return new Promise((resolve, reject) => {
                Readable.from([csvString])
                    .pipe(csv())
                    .on('data', (data) => leads.push({ ...data, raw: data }))
                    .on('end', () => resolve(leads))
                    .on('error', reject);
            });
        } catch (error) {
            throw new Error(`Failed to fetch CSV from Cloudinary: ${error.message}`);
        }
    }

    // Delete file from Cloudinary
    static async deleteFromCloudinary(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: 'raw'
            });
            return result;
        } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
            throw error;
        }
    }

    // Get file info from Cloudinary
    static async getFileInfo(publicId) {
        try {
            const result = await cloudinary.api.resource(publicId, {
                resource_type: 'raw'
            });
            return result;
        } catch (error) {
            console.error('Error getting file info from Cloudinary:', error);
            throw error;
        }
    }
}