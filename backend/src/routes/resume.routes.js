const express = require('express');
const router = express.Router();
const { uploadResume, getResume, getUserResumes, deleteResume, reAnalyzeResume } = require('../controllers/resume.controller');
const { protect } = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/upload.middleware');

router.use(protect);
router.get('/', getUserResumes);
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);
router.post('/:id/analyze', reAnalyzeResume);

module.exports = router;