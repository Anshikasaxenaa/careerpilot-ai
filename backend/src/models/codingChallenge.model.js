const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
});

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: {
    type: String,
    enum: ["accepted", "wrong_answer", "time_limit", "error"],
    default: "wrong_answer",
  },
  passedTests: { type: Number, default: 0 },
  totalTests: { type: Number, default: 0 },
  runtime: { type: String, default: "" },
  memory: { type: String, default: "" },
  aiReview: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now },
});

const codingChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    category: { type: String, required: true },
    tags: [String],
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    constraints: [String],
    testCases: [testCaseSchema],
    starterCode: {
      javascript: { type: String, default: "// Write your solution here\n" },
      python: { type: String, default: "# Write your solution here\n" },
      java: { type: String, default: "// Write your solution here\n" },
      cpp: { type: String, default: "// Write your solution here\n" },
    },
    submissions: [submissionSchema],
    totalSubmissions: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.CodingChallenge ||
  mongoose.model("CodingChallenge", codingChallengeSchema);
