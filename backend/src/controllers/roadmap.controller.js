// roadmap.controller.js
const Roadmap = require('../models/roadmap.model');
const Interview = require('../models/interview.model');
const Resume = require('../models/resume.model');
const { generateLearningRoadmap } = require('../services/ai.service');

exports.generateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { targetRole } = req.body;

    // Gather data
    const interviews = await Interview.find({ userId, status: 'completed' }).sort({ createdAt: -1 }).limit(5);
    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });

    // Find weak topics from interviews
    const topicScores = {};
    interviews.forEach(interview => {
      interview.questions.forEach(q => {
        if (q.topic && q.userAnswer) {
          if (!topicScores[q.topic]) topicScores[q.topic] = { total: 0, count: 0 };
          topicScores[q.topic].total += q.score;
          topicScores[q.topic].count++;
        }
      });
    });

    const weakTopics = Object.entries(topicScores)
      .filter(([, data]) => (data.total / data.count) < 6)
      .map(([topic]) => topic);

    if (resume?.missingSkills?.length) {
      weakTopics.push(...resume.missingSkills.slice(0, 3));
    }

    const role = targetRole || resume?.targetRole || 'Software Developer';
    const roadmapData = await generateLearningRoadmap(
      weakTopics.length > 0 ? weakTopics : ['Data Structures', 'Algorithms', 'System Design'],
      role,
      { avgScore: interviews.length > 0 ? Math.round(interviews.reduce((s, i) => s + i.overallScore, 0) / interviews.length) : 0 }
    );

    // Deactivate old roadmaps
    await Roadmap.updateMany({ userId, isActive: true }, { isActive: false });

    const roadmap = await Roadmap.create({
      userId,
      ...roadmapData,
      targetRole: role,
      generatedFrom: {
        resumeId: resume?._id,
        interviewIds: interviews.map(i => i._id),
      },
    });

    res.status(201).json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

exports.getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'No roadmap found. Generate one first.' });
    }
    res.json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

exports.updateWeekStatus = async (req, res, next) => {
  try {
    const { weekNumber, completed } = req.body;
    const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.user._id });
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

    const week = roadmap.weeklyPlan.find(w => w.week === weekNumber);
    if (week) { week.completed = completed; roadmap.markModified('weeklyPlan'); }

    await roadmap.save();
    res.json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};