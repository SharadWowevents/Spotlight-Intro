const mongoose = require('mongoose');

const InteractionQuerySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['suggest_dream_outcome', 'suggest_big_promise', 'generate_intro'],
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  modelOutput: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const IntroSessionSchema = new mongoose.Schema(
  {
    userData: {
      fullName: { type: String, trim: true, default: '' },
      designation: { type: String, trim: true, default: '' },
      company: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      teamSize: { type: String, trim: true, default: '' },
      icp: { type: String, trim: true, default: '' },
      dreamOutcome: { type: String, trim: true, default: '' },
      bigPromise: { type: String, trim: true, default: '' }
    },
    result: {
      full: { type: String, trim: true },
      short: { type: String, trim: true },
      source: { type: String, enum: ['ai', 'fallback'], default: 'ai' }
    },
    queries: [InteractionQuerySchema]
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('IntroSession', IntroSessionSchema);