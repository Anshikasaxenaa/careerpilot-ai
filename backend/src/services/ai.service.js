const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

// Initialize AI clients
let genAI, openai;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Universal AI call - tries Gemini first, falls back to OpenAI
const callAI = async (prompt, systemPrompt = '') => {
  if (genAI) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } else if (openai) {
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 2000,
    });
    return completion.choices[0].message.content;
  }
  throw new Error('No AI API configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in .env');
};

// ─── RESUME ANALYSIS ────────────────────────────────────────────────────────

const analyzeResume = async (resumeText, targetRole = '') => {
  const prompt = `
Analyze this resume${targetRole ? ` for the role of ${targetRole}` : ''} and return a JSON response:

RESUME TEXT:
${resumeText}

Return ONLY valid JSON (no markdown) with this exact structure:
{
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence professional summary>",
  "extractedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "careerRecommendations": ["recommendation1", "recommendation2", ...],
  "skillGapAnalysis": {
    "technical": "<analysis>",
    "soft": "<analysis>",
    "domain": "<analysis>"
  }
}
`;

  const response = await callAI(prompt);
  const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
};

// ─── INTERVIEW QUESTIONS ─────────────────────────────────────────────────────

const generateInterviewQuestions = async (role, difficulty, type, count = 10) => {
  const prompt = `
Generate ${count} interview questions for a ${difficulty} level ${role} position.
Question types: ${type} (technical, behavioral, hr, or mixed).

Return ONLY valid JSON array (no markdown):
[
  {
    "question": "<question text>",
    "type": "<technical|behavioral|hr|coding>",
    "difficulty": "<easy|medium|hard>",
    "topic": "<topic area>",
    "followUpQuestions": ["<follow-up 1>", "<follow-up 2>"]
  }
]
`;

  const response = await callAI(prompt);
  const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
};

// ─── ANSWER EVALUATION ──────────────────────────────────────────────────────

const evaluateAnswer = async (question, answer, role) => {
  const prompt = `
You are an expert technical interviewer for ${role} positions.

QUESTION: ${question}
CANDIDATE'S ANSWER: ${answer || "(No answer provided)"}

Evaluate the answer and return ONLY valid JSON (no markdown):
{
  "score": <number 0-10>,
  "feedback": "<detailed constructive feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "idealAnswer": "<brief ideal answer outline>"
}
`;

  const response = await callAI(prompt);
  const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
};

// ─── OVERALL INTERVIEW FEEDBACK ──────────────────────────────────────────────

const generateInterviewFeedback = async (questions, role) => {
  const summary = questions.map((q, i) => 
    `Q${i+1}: ${q.question}\nAnswer: ${q.userAnswer}\nScore: ${q.score}/10`
  ).join('\n\n');

  const prompt = `
Based on this mock interview for ${role} role, provide comprehensive feedback.

INTERVIEW SUMMARY:
${summary}

Return ONLY valid JSON (no markdown):
{
  "overall": "<comprehensive 3-4 sentence overall feedback>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "improvementSuggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "communicationScore": <0-100>,
  "technicalScore": <0-100>,
  "confidenceScore": <0-100>
}
`;

  const response = await callAI(prompt);
  const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
};

// ─── LEARNING ROADMAP ────────────────────────────────────────────────────────

const generateLearningRoadmap = async (weakTopics, targetRole, interviewHistory) => {
  const prompt = `
Create a personalized learning roadmap for someone targeting a ${targetRole} role.

WEAK TOPICS IDENTIFIED: ${weakTopics.join(', ')}
RECENT INTERVIEW PERFORMANCE: ${JSON.stringify(interviewHistory || {})}

Return ONLY valid JSON (no markdown):
{
  "weakTopics": ["<topic 1>", "<topic 2>"],
  "strongTopics": ["<topic 1>", "<topic 2>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>"],
  "estimatedDuration": "<e.g. 4-6 weeks>",
  "weeklyPlan": [
    {
      "week": 1,
      "topic": "<topic>",
      "description": "<what to study>",
      "resources": ["<resource 1>", "<resource 2>"]
    }
  ]
}
`;

  const response = await callAI(prompt);
  const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
};

// ─── CODE REVIEW ────────────────────────────────────────────────────────────

const reviewCode = async (code, language, problemTitle) => {
  const prompt = `
Review this ${language} solution for: "${problemTitle}"

CODE:
${code}

Return ONLY valid JSON (no markdown):
{
  "review": "<detailed code review>",
  "timeComplexity": "<e.g. O(n)>",
  "spaceComplexity": "<e.g. O(1)>",
  "suggestions": ["<optimization 1>", "<optimization 2>"],
  "codeQuality": <1-10>,
  "isOptimal": <true|false>
}
`;

  const response = await callAI(prompt);
  const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
};

// ─── CHATBOT ────────────────────────────────────────────────────────────────

const chatbotResponse = async (message, conversationHistory = []) => {
  const systemPrompt = `You are PrepAI Assistant, an expert career coach and technical interview preparation guide. You help users with:
- Career guidance and job search strategies
- Resume tips and optimization
- Interview preparation (technical and behavioral)
- Learning path recommendations
- Coding interview strategies

Be concise, practical, and encouraging. Always provide actionable advice.`;

  if (genAI) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      systemInstruction: systemPrompt,
    });
    const result = await chat.sendMessage(message);
    return result.response.text();
  } else if (openai) {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ];
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
    });
    return completion.choices[0].message.content;
  }
  throw new Error('No AI API configured.');
};

module.exports = {
  callAI,
  analyzeResume,
  generateInterviewQuestions,
  evaluateAnswer,
  generateInterviewFeedback,
  generateLearningRoadmap,
  reviewCode,
  chatbotResponse,
};