const { chatbotResponse } = require('../services/ai/ai.service');

exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const response = await chatbotResponse(message, history);

    res.json({
      success: true,
      message: response,
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};