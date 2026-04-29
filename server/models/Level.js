const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  level: { type: Number, required: true, unique: true },
  xpRequired: { type: Number, required: true },
  title: { type: String, required: true },
  badge: { type: String, default: '🏅' },
}, { timestamps: true });

module.exports = mongoose.model('Level', levelSchema);
