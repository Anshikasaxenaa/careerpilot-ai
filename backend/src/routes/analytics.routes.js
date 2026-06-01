const express = require('express');
const router = express.Router();
const { getUserAnalytics } = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');
router.use(protect);
router.get('/performance', getUserAnalytics);
module.exports = router;