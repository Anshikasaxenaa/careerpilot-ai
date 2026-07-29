const Interview = require("../models/Interview.model");
const {
  generateInterviewQuestions,
  evaluateAnswer,
  generateInterviewFeedback,
} = require("../services/ai.service");

// @desc    Start a new interview
// @route   POST /api/interview/start
exports.startInterview = async (req, res, next) => {
  try {
    const { role, difficulty, type, questionCount = 10, targetCompany = "" } = req.body;

    const questions = await generateInterviewQuestions(
      role,
      difficulty,
      type,
      questionCount,
      targetCompany
    );

    const interview = await Interview.create({
      userId: req.user._id,
      title: `${role} - ${difficulty} Interview${targetCompany ? ` at ${targetCompany}` : ''}`,
      role,
      targetCompany,
      difficulty,
      type,
      questions: questions.map((q) => ({
        question: q.question,
        type: q.type,
        difficulty: q.difficulty,
        topic: q.topic,
        followUpQuestions: q.followUpQuestions || [],
      })),
      totalQuestions: questions.length,
      status: "in-progress",
      startedAt: new Date(),
    });

    res.status(201).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an answer for a question
// @route   POST /api/interview/:id/answer
exports.submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, answer, timeSpent } = req.body;

    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found." });
    }

    if (interview.status === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Interview already completed." });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    // AI evaluates the answer
    let evaluation = {
      score: 0,
      feedback: "No answer provided",
      strengths: [],
      improvements: [],
    };
    if (answer && answer.trim()) {
      evaluation = await evaluateAnswer(
        question.question,
        answer,
        interview.role,
      );
    }

    interview.questions[questionIndex].userAnswer = answer || "";
    interview.questions[questionIndex].aiFeedback = evaluation.feedback;
    interview.questions[questionIndex].score = evaluation.score;
    interview.questions[questionIndex].timeSpent = timeSpent || 0;
    if (evaluation.starBreakdown) {
      interview.questions[questionIndex].starBreakdown = evaluation.starBreakdown;
    }
    interview.completedQuestions = interview.questions.filter(
      (q) => q.userAnswer,
    ).length;

    interview.markModified("questions");
    await interview.save();

    res.json({
      success: true,
      evaluation,
      question: interview.questions[questionIndex],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete interview and get final report
// @route   POST /api/interview/:id/complete
exports.completeInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found." });
    }

    // Calculate overall score
    const answeredQuestions = interview.questions.filter((q) => q.userAnswer);
    const totalScore = answeredQuestions.reduce(
      (sum, q) => sum + (q.score || 0),
      0,
    );
    const overallScore =
      answeredQuestions.length > 0
        ? Math.round((totalScore / (answeredQuestions.length * 10)) * 100)
        : 0;

    // Generate AI overall feedback
    const aiFeedback = await generateInterviewFeedback(
      interview.questions,
      interview.role,
    );

    const duration = Math.round(
      (Date.now() - interview.startedAt.getTime()) / 60000,
    );

    interview.overallScore = overallScore;
    interview.aiFeedback = aiFeedback;
    interview.status = "completed";
    interview.completedAt = new Date();
    interview.duration = duration;

    await interview.save();

    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user interviews
// @route   GET /api/interview
exports.getUserInterviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const interviews = await Interview.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-questions.userAnswer -questions.aiFeedback");

    const total = await Interview.countDocuments(filter);

    res.json({
      success: true,
      interviews,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single interview with full details
// @route   GET /api/interview/:id
exports.getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found." });
    }
    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview
// @route   DELETE /api/interview/:id
exports.deleteInterview = async (req, res, next) => {
  try {
    await Interview.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    res.json({ success: true, message: "Interview deleted." });
  } catch (error) {
    next(error);
  }
};
