const express = require('express');
const router = express.Router();
const { getChallenges, getChallenge, submitSolution, seedChallenges } = require('../controllers/coding.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
router.get('/', protect, getChallenges);
router.get('/:slug', protect, getChallenge);
router.post('/:slug/submit', protect, submitSolution);
router.post('/admin/seed', protect, authorize('admin'), seedChallenges);
module.exports = router;