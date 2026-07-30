const Interview = require('../models/interview.model');
const Resume = require('../models/resume.model');
const User = require('../models/user.model');

// @desc    Get user's performance analytics
// @route   GET /api/analytics/performance
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Interview stats
    const interviews = await Interview.find({ userId, status: 'completed' });

    const totalInterviews = interviews.length;
    const avgScore = totalInterviews > 0
      ? Math.round(interviews.reduce((s, i) => s + i.overallScore, 0) / totalInterviews)
      : 0;

    // Score trend (last 10 interviews)
    const scoreTrend = interviews
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
      .slice(-10)
      .map(i => ({ date: i.completedAt, score: i.overallScore, role: i.role }));

    // Topic-wise performance
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

    const topicAnalytics = Object.entries(topicScores).map(([topic, data]) => ({
      topic,
      avgScore: Math.round((data.total / data.count / 10) * 100),
      attempts: data.count,
    })).sort((a, b) => b.attempts - a.attempts);

    // Role distribution
    const roleCount = {};
    interviews.forEach(i => {
      roleCount[i.role] = (roleCount[i.role] || 0) + 1;
    });
    const roleDistribution = Object.entries(roleCount).map(([role, count]) => ({ role, count }));

    // Difficulty breakdown
    const difficultyBreakdown = {
      beginner: interviews.filter(i => i.difficulty === 'beginner').length,
      intermediate: interviews.filter(i => i.difficulty === 'intermediate').length,
      advanced: interviews.filter(i => i.difficulty === 'advanced').length,
    };

    // Strength/Weakness heatmap
    const strengths = [];
    const weaknesses = [];
    topicAnalytics.forEach(t => {
      if (t.avgScore >= 70) strengths.push(t.topic);
      else if (t.avgScore < 50) weaknesses.push(t.topic);
    });

    // Resume stats
    const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      analytics: {
        overview: {
          totalInterviews,
          avgScore,
          totalQuestions: interviews.reduce((s, i) => s + i.completedQuestions, 0),
          totalHours: Math.round(interviews.reduce((s, i) => s + i.duration, 0) / 60),
        },
        scoreTrend,
        topicAnalytics,
        roleDistribution,
        difficultyBreakdown,
        strengths,
        weaknesses,
        resumeAtsScore: latestResume?.atsScore || 0,
        communicationAvg: interviews.length > 0
          ? Math.round(interviews.reduce((s, i) => s + (i.aiFeedback?.communicationScore || 0), 0) / interviews.length)
          : 0,
        technicalAvg: interviews.length > 0
          ? Math.round(interviews.reduce((s, i) => s + (i.aiFeedback?.technicalScore || 0), 0) / interviews.length)
          : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};