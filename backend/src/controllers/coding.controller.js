const CodingChallenge = require("../models/codingChallenge.model");

// Get list of challenges
exports.getChallenges = async (req, res, next) => {
  try {
    const challenges = await CodingChallenge.find({ isActive: true }).select(
      "title slug difficulty category tags",
    );
    res.json({ success: true, challenges });
  } catch (err) {
    next(err);
  }
};

// Get single challenge by slug
exports.getChallenge = async (req, res, next) => {
  try {
    const challenge = await CodingChallenge.findOne({ slug: req.params.slug });
    if (!challenge)
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found." });
    res.json({ success: true, challenge });
  } catch (err) {
    next(err);
  }
};

// Submit a solution (minimal placeholder)
exports.submitSolution = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const challenge = await CodingChallenge.findOne({ slug: req.params.slug });
    if (!challenge)
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found." });

    const submission = {
      userId: req.user?._id || null,
      code: code || "",
      language: language || "javascript",
      status: "queued",
      passedTests: 0,
      totalTests: challenge.testCases ? challenge.testCases.length : 0,
      submittedAt: new Date(),
    };

    challenge.submissions.push(submission);
    challenge.totalSubmissions = (challenge.totalSubmissions || 0) + 1;
    await challenge.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Submission received (placeholder).",
        submission,
      });
  } catch (err) {
    next(err);
  }
};

// Seed some example challenges (admin)
exports.seedChallenges = async (req, res, next) => {
  try {
    const sample = [
      {
        title: "Sum of Two Numbers",
        slug: "sum-of-two-numbers",
        description: "Return sum of two numbers provided as input.",
        difficulty: "easy",
        category: "math",
        tags: ["math", "beginner"],
        testCases: [{ input: "1 2", output: "3" }],
        starterCode: { javascript: "// Write your solution here" },
      },
    ];
    await CodingChallenge.insertMany(sample);
    res.json({ success: true, message: "Sample challenges seeded." });
  } catch (err) {
    next(err);
  }
};
