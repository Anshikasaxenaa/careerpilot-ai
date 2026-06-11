const Resume = require("../models/Resume.model");
const { extractTextFromPDF, cleanText } = require("../services/resume.service");
const { analyzeResume } = require("../services/ai.service");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../middlewares/upload.middleware");

// @desc    Upload and analyze resume
// @route   POST /api/resume/upload
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }

    const targetRole = req.body.targetRole || "";

    // Upload to Cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // Extract text from the temp file before it's deleted
    let extractedText = "";
    try {
      extractedText = cleanText(await extractTextFromPDF(req.file.path));
    } catch (err) {
      console.warn("PDF text extraction failed:", err.message);
    }

    // Create resume record
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      resumeUrl: url,
      publicId,
      extractedText,
      targetRole,
    });

    // Run AI analysis in background
    if (extractedText) {
      analyzeResume(extractedText, targetRole)
        .then(async (analysis) => {
          await Resume.findByIdAndUpdate(resume._id, {
            atsScore: analysis.atsScore || 0,
            summary: analysis.summary || "",
            extractedSkills: analysis.extractedSkills || [],
            missingSkills: analysis.missingSkills || [],
            suggestions: analysis.suggestions || [],
            careerRecommendations: analysis.careerRecommendations || [],
            skillGapAnalysis: analysis.skillGapAnalysis || {},
            isProcessed: true,
          });
        })
        .catch((err) => console.error("AI analysis error:", err));
    }

    res.status(201).json({
      success: true,
      message: "Resume uploaded. AI analysis in progress...",
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resume analysis result
// @route   GET /api/resume/:id
exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found." });
    }
    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user resumes
// @route   GET /api/resume
exports.getUserResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found." });
    }

    if (resume.publicId) {
      await deleteFromCloudinary(resume.publicId);
    }

    await Resume.findByIdAndDelete(resume._id);
    res.json({ success: true, message: "Resume deleted." });
  } catch (error) {
    next(error);
  }
};

// @desc    Re-analyze resume with AI
// @route   POST /api/resume/:id/analyze
exports.reAnalyzeResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found." });
    }
    if (!resume.extractedText) {
      return res.status(400).json({
        success: false,
        message: "No text found in resume to analyze.",
      });
    }

    const analysis = await analyzeResume(
      resume.extractedText,
      req.body.targetRole || resume.targetRole,
    );
    const updated = await Resume.findByIdAndUpdate(
      resume._id,
      {
        atsScore: analysis.atsScore || 0,
        summary: analysis.summary || "",
        extractedSkills: analysis.extractedSkills || [],
        missingSkills: analysis.missingSkills || [],
        suggestions: analysis.suggestions || [],
        careerRecommendations: analysis.careerRecommendations || [],
        skillGapAnalysis: analysis.skillGapAnalysis || {},
        isProcessed: true,
        targetRole: req.body.targetRole || resume.targetRole,
      },
      { new: true },
    );

    res.json({
      success: true,
      message: "Resume re-analyzed.",
      resume: updated,
    });
  } catch (error) {
    next(error);
  }
};
