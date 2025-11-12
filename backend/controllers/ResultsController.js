const MatchResult = require('../models/ResultsModel');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// 🔧 Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 🖼️ Multer setup
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb(new Error('Only images (jpeg/jpg/png) are allowed'));
};
const upload = multer({ storage, fileFilter });

// 📤 Helper to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'match_results' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// 1️⃣ Submit Match Result
const submitResult = async (req, res) => {
  const {
    yourTeam,
    opponentTeam,
    yourScore,
    opponentScore,
    timePlayed,
    message
  } = req.body;

  try {
    if (!yourTeam || !opponentTeam || yourScore === undefined || opponentScore === undefined || !timePlayed) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Upload all images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
    }

    const newResult = new MatchResult({
      yourTeam,
      opponentTeam,
      yourScore,
      opponentScore,
      timePlayed,
      message,
      images: imageUrls,
      status: 'pending',
      submittedBy: req.user?._id // support for login later
    });

    await newResult.save();
    res.status(201).json({ message: 'Result submitted for review.', data: newResult });
  } catch (error) {
    res.status(500).json({ message: 'Submission failed.', error: error.message });
  }
};

// 2️⃣ Get All Results
const getAllResults = async (req, res) => {
  try {
    const results = await MatchResult.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results.', error: error.message });
  }
};

// 3️⃣ Update Result Status
const updateResultStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['accepted', 'denied'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    const updated = await MatchResult.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Result not found.' });

    res.json({ message: `Result ${status}.`, data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating result.', error: error.message });
  }
};

module.exports = {
  upload,              
  submitResult,
  getAllResults,
  updateResultStatus
};
