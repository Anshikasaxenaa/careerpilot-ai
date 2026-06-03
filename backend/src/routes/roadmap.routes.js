const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmap, updateWeekStatus } = require('../controllers/roadmap.controller');
const { protect } = require('../middlewares/auth.middleware');
router.use(protect);
router.get('/', getRoadmap);
router.post('/generate', generateRoadmap);
router.put('/:id/week', updateWeekStatus);
module.exports = router;