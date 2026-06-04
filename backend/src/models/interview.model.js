const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['technical', 'behavioral', 'hr', 'coding'], default: 'technical' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  topic: { type: String, default: '' },
  userAnswer: { type: String, default: '' },
  aiFeedback: { type: String, default: '' },
  score: { type: Number, default: 0, min: 0, max: 10 },
  timeSpent: { type: Number, default: 0 }, // seconds
  followUpQuestions: [String],
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, default: 'Mock Interview' },
  role: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  type: { type: String, enum: ['technical', 'hr', 'mixed', 'behavioral'], default: 'mixed' },
  questions: [questionSchema],
  overallScore: { type: Number, default: 0, min: 0, max: 100 },
  totalQuestions: { type: Number, default: 0 },
  completedQuestions: { type: Number, default: 0 },
  duration: { type: Number, default: 0 }, // minutes
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  aiFeedback: {
    overall: { type: String, default: '' },
    strengths: [String],
    weaknesses: [String],
    improvementSuggestions: [String],
    communicationScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
  },
  startedAt: Date,
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);