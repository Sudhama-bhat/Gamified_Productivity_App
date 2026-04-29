const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  conditionType: {
    type: String,
    enum: ['tasks_completed', 'xp_earned', 'streak', 'level_reached', 'first_task'],
    required: true,
  },
  conditionValue: { type: Number, required: true },
  xpBonus: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
