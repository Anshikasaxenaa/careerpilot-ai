const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  publicId: { type: String }, // Cloudinary public_id
  extractedText: { type: String, default: '' },
  atsScore: { type: Number, default: 0, min: 0, max: 100 },
  extractedSkills: [String],
  missingSkills: [String],
  suggestions: [String],
  summary: { type: String, default: '' },
  careerRecommendations: [String],
  skillGapAnalysis: {
    type: Map,
    of: String,
    default: {},
  },
  targetRole: { type: String, default: '' },
  isProcessed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);