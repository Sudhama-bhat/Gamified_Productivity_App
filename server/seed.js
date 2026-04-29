require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const XPConfig = require('./models/XPConfig');
const Level = require('./models/Level');
const Achievement = require('./models/Achievement');
const Category = require('./models/Category');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  // Admin user
  const adminExists = await User.findOne({ email: 'admin@gamified.com' });
  if (!adminExists) {
    await User.create({ name: 'Admin', email: 'admin@gamified.com', password: 'admin123', role: 'admin' });
    console.log('✅ Admin created: admin@gamified.com / admin123');
  }

  // XP Config
  await XPConfig.deleteMany({});
  await XPConfig.insertMany([
    { difficulty: 'Easy', xpPoints: 10 },
    { difficulty: 'Medium', xpPoints: 25 },
    { difficulty: 'Hard', xpPoints: 50 },
  ]);
  console.log('✅ XP Config seeded');

  // Levels
  await Level.deleteMany({});
  await Level.insertMany([
    { level: 1, xpRequired: 0, title: 'Novice', badge: 'Beginner' },
    { level: 2, xpRequired: 100, title: 'Apprentice', badge: 'Learner' },
    { level: 3, xpRequired: 250, title: 'Skilled', badge: 'Adept' },
    { level: 4, xpRequired: 500, title: 'Expert', badge: 'Pro' },
    { level: 5, xpRequired: 1000, title: 'Master', badge: 'Elite' },
    { level: 6, xpRequired: 2000, title: 'Grandmaster', badge: 'Veteran' },
    { level: 7, xpRequired: 3500, title: 'Legend', badge: 'Mythic' },
  ]);
  console.log('✅ Levels seeded');

  // Achievements
  await Achievement.deleteMany({});
  await Achievement.insertMany([
    { name: 'First Step', description: 'Complete your first task', icon: '', conditionType: 'first_task', conditionValue: 1, xpBonus: 5 },
    { name: 'Task Warrior', description: 'Complete 10 tasks', icon: '', conditionType: 'tasks_completed', conditionValue: 10, xpBonus: 20 },
    { name: 'Century Club', description: 'Complete 100 tasks', icon: '', conditionType: 'tasks_completed', conditionValue: 100, xpBonus: 100 },
    { name: 'XP Hunter', description: 'Earn 500 XP', icon: '', conditionType: 'xp_earned', conditionValue: 500, xpBonus: 25 },
    { name: 'XP Lord', description: 'Earn 2000 XP', icon: '', conditionType: 'xp_earned', conditionValue: 2000, xpBonus: 100 },
    { name: 'On Fire', description: 'Maintain a 7-day streak', icon: '', conditionType: 'streak', conditionValue: 7, xpBonus: 50 },
    { name: 'Unstoppable', description: 'Maintain a 30-day streak', icon: '', conditionType: 'streak', conditionValue: 30, xpBonus: 200 },
    { name: 'Level Up!', description: 'Reach Level 5', icon: '', conditionType: 'level_reached', conditionValue: 5, xpBonus: 50 },
  ]);
  console.log('✅ Achievements seeded');

  // Categories
  await Category.deleteMany({});
  await Category.insertMany([
    { name: 'Work', description: 'Professional tasks', color: '#111111', icon: 'W' },
    { name: 'Learning', description: 'Study and skill development', color: '#374151', icon: 'L' },
    { name: 'Health', description: 'Fitness and wellness', color: '#4b5563', icon: 'H' },
    { name: 'Personal', description: 'Personal development goals', color: '#6b7280', icon: 'P' },
    { name: 'Creative', description: 'Art, music, design', color: '#9ca3af', icon: 'C' },
  ]);
  console.log('✅ Categories seeded');

  console.log('\n🎉 Seeding complete!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
