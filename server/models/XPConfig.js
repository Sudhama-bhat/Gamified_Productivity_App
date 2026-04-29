const mongoose = require('mongoose');

const xpConfigSchema = new mongoose.Schema({
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], unique: true, required: true },
  xpPoints: { type: Number, required: true },
  bonusMultiplier: { type: Number, default: 1.0 }, // streak bonus etc.
}, { timestamps: true });

module.exports = mongoose.model('XPConfig', xpConfigSchema);
