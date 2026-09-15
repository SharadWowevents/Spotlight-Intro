const OpenAI = require('openai');
const IntroSession = require('../models/IntroSession');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Helper to retrieve or initialize a session document
 */
const getOrCreateSession = async (sessionId, formData) => {
  if (sessionId) {
    const existing = await IntroSession.findById(sessionId);
    if (existing) {
      if (formData) existing.userData = { ...existing.userData, ...formData };
      return existing;
    }
  }
  return new IntroSession({ userData: formData || {} });
};

/**
 * Suggest numbers/methods for Step 4 & Step 5
 * POST /api/intro/suggest
 */
exports.getSuggestions = async (req, res) => {
    console.log('Received suggestion request:', req.body);
  try {
    const { type, formData, sessionId } = req.body;

    if (!type || !formData) {
      return res.status(400).json({ error: 'Missing type or formData' });
    }

    const ctx = `Designation: ${formData.designation || ''}\nCompany: ${formData.company || ''}\nCity: ${formData.city || ''}\nTeam size: ${formData.teamSize || ''}\nThey help (ICP): ${formData.icp || ''}`;

    let prompt = '';
    let actionType = '';

    if (type === 'dreamOutcome') {
      actionType = 'suggest_dream_outcome';
      prompt = `You are helping a business owner craft a one-line self-introduction for a live workshop.\n\nContext:\n${ctx}\n\nSuggest exactly 3 short "Dream Outcome" phrases — the tangible result they deliver for that customer. Each MUST contain one concrete number, percentage, or timeframe. 6-14 words each, lowercase start, no trailing period, no quotation marks.\n\nReply with a JSON object shaped like: {"suggestions": ["...", "...", "..."]}`;
    } else if (type === 'bigPromise') {
      actionType = 'suggest_big_promise';
      prompt = `You are helping a business owner craft a one-line self-introduction for a live workshop.\n\nContext:\n${ctx}\nDream outcome: ${formData.dreamOutcome || ''}\n\nSuggest exactly 3 short "Big Promise" phrases — the mechanism, method, or guarantee that makes that outcome happen. Each MUST contain a concrete number, a percentage, or a specific named method (e.g., "our 90-day sprint system" or "a 3-step vendor-vetting process"). 5-12 words each, lowercase start, no trailing period, no quotation marks.\n\nReply with a JSON object shaped like: {"suggestions": ["...", "...", "..."]}`;
    } else {
      return res.status(400).json({ error: 'Invalid suggestion type' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const parsedData = JSON.parse(completion.choices[0].message.content);
    const suggestions = parsedData.suggestions || [];

    // Save user state and query to MongoDB
    const session = await getOrCreateSession(sessionId, formData);
    session.queries.push({
      action: actionType,
      prompt: prompt,
      modelOutput: suggestions,
      timestamp: new Date()
    });
    await session.save();

    return res.status(200).json({
      sessionId: session._id,
      suggestions
    });
  } catch (error) {
    console.error('OpenAI Suggestion Error:', error);
    return res.status(500).json({ error: 'Failed to generate suggestions' });
  }
};

/**
 * Generate final full & short introductions
 * POST /api/intro/generate
 */
exports.generateIntro = async (req, res) => {
  try {
    const { formData, sessionId } = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    const prompt = `Craft a spoken self-introduction for a live business workshop from these facts. Do not invent anything not given, and do not change any numbers.\n\nFull name: ${formData.fullName}\nDesignation: ${formData.designation}\nCompany: ${formData.company}\nCity: ${formData.city}\nTeam size: ${formData.teamSize}\nWho they serve (ICP): ${formData.icp}\nDream outcome: ${formData.dreamOutcome}\nBig promise: ${formData.bigPromise}\n\nWrite it as exactly one sentence following this shape: "I am [Full Name], [Designation] of [Company], [City], with a team of [Team Size]. We help [ICP] [Dream Outcome] by [Big Promise]."\n\nRules:\n- Sayable in one breath, 25-40 words total\n- Preserve the Dream Outcome's number/percentage and the Big Promise's number/method exactly as given\n- No filler words like "best", "leading", "world-class", "passionate", "innovative"\n- Only tighten grammar and flow — never add claims that weren't given\n\nAlso write a "short" version: an ultra-compact 8-12 word version for a fast-round intro that still includes one number.\n\nReply with a JSON object shaped like: {"full": "...", "short": "..."}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.4
    });

    const parsedData = JSON.parse(completion.choices[0].message.content);
    console.log('Generated Intro:', parsedData);
    // Save final output and query trace to MongoDB
    const session = await getOrCreateSession(sessionId, formData);
    session.result = {
      full: parsedData.full,
      short: parsedData.short,
      source: 'ai'
    };
    session.queries.push({
      action: 'generate_intro',
      prompt: prompt,
      modelOutput: parsedData,
      timestamp: new Date()
    });
    await session.save();

    return res.status(200).json({
      sessionId: session._id,
      full: parsedData.full,
      short: parsedData.short,
      source: 'ai'
    });
  } catch (error) {
    console.error('OpenAI Generation Error:', error);
    return res.status(500).json({ error: 'Failed to generate introduction' });
  }
};