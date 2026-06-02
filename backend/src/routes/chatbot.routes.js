const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatbot.controller');
const { protect } = require('../middlewares/auth.middleware');
router.use(protect);
router.post('/message', chat);
module.exports = router;