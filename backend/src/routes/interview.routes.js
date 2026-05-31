// interview.routes.js
const express = require('express');
const router = express.Router();
const { startInterview, submitAnswer, completeInterview, getUserInterviews, getInterview, deleteInterview } = require('../controllers/interview.controller');
const { protect } = require('../middlewares/auth.middleware');
router.use(protect);
router.get('/', getUserInterviews);
router.post('/start', startInterview);
router.get('/:id', getInterview);
router.post('/:id/answer', submitAnswer);
router.post('/:id/complete', completeInterview);
router.delete('/:id', deleteInterview);
module.exports = router;