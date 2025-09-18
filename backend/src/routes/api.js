import express from "express";
import multer from "multer";
import Offer from "../models/Offer.js";
import Lead from "../models/Lead.js";
import Result from "../models/Result.js";
import { rulesScore, aiScore } from "../utils/scorer.js";
import { authenticate } from "./auth.js";
import { storage } from "../config/cloudinary.js";
import { FileService } from "../services/fileService.js";

const router = express.Router();

// Configure multer with Cloudinary storage for production, memory for development
const upload = multer({
  storage: process.env.NODE_ENV === 'production' ? storage : multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

router.post("/offer", authenticate, async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.json({ ok: true, offer });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});


router.post(
  "/leads/upload",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "CSV file required" });
    }

    try {
      let leads = [];

      if (process.env.NODE_ENV === 'production' && req.file.path) {
        // Production: Process from Cloudinary URL
        console.log('Processing CSV from Cloudinary:', req.file.path);
        leads = await FileService.processCSVFromCloudinary(req.file.path);
      } else {
        // Development: Process from memory buffer
        console.log('Processing CSV from memory buffer');
        leads = await FileService.processCSVFromBuffer(req.file.buffer);
      }

      if (leads.length === 0) {
        return res.status(400).json({
          ok: false,
          error: "No valid data found in CSV file"
        });
      }

      // Clear existing leads before inserting new ones
      await Lead.deleteMany({});
      const created = await Lead.insertMany(leads);

      res.json({
        ok: true,
        count: created.length,
        leads: created.map((l) => l._id),
        message: `Successfully processed ${created.length} leads`,
        fileInfo: process.env.NODE_ENV === 'production' ? {
          cloudinaryUrl: req.file.path,
          publicId: req.file.filename
        } : null
      });
    } catch (err) {
      console.error("CSV upload error:", err);
      res.status(500).json({
        ok: false,
        error: `Failed to process CSV: ${err.message}`
      });
    }
  }
);

// POST /score – body: { offerId }
router.post("/score", authenticate, async (req, res) => {
  const { offerId } = req.body;
  try {
    const offer = await Offer.findById(offerId).lean();
    if (!offer)
      return res.status(404).json({ ok: false, error: "Offer not found" });

    const leads = await Lead.find().lean();

    const results = await Promise.all(
      leads.map(async (lead) => {
        const rpts = rulesScore(offer, lead);
        const ai = await aiScore(offer, lead);
        const total = Math.min(100, rpts + ai.pts);

        await Result.create({
          lead: lead._id,
          intent: ai.label,
          score: total,
          reasoning: ai.reasoning,
        });

        return {
          lead,
          intent: ai.label,
          score: total,
          reasoning: ai.reasoning,
        };
      })
    );

    res.json({ ok: true, count: results.length, results });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});


router.get("/results", authenticate, async (req, res) => {
  try {
    const results = await Result.find().populate("lead").lean();
    res.json({ ok: true, results });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get leads count and basic info
router.get("/leads/info", authenticate, async (req, res) => {
  try {
    const count = await Lead.countDocuments();
    const sample = await Lead.findOne().lean();
    res.json({
      ok: true,
      count,
      sampleFields: sample ? Object.keys(sample).filter(key => key !== '_id' && key !== '__v') : []
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Clear all leads
router.delete("/leads", authenticate, async (req, res) => {
  try {
    const result = await Lead.deleteMany({});
    await Result.deleteMany({}); // Also clear results
    res.json({
      ok: true,
      message: `Deleted ${result.deletedCount} leads and all associated results`
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
