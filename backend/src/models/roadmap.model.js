const mongoose = require('mongoose');

const weekPlanSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  topic: { type: String, required: true },
  description: { type: String, default: '' },
  resources: [String],
  completed: { type: Boolean, default: false },
});

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weakTopics: [String],
  strongTopics: [String],
  suggestions: [String],
  weeklyPlan: [weekPlanSchema],
  targetRole: { type: String, default: '' },
  estimatedDuration: { type: String, default: '4 weeks' },
  generatedFrom: {
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    interviewIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }],
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);