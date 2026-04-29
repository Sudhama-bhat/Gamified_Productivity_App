const Task = require('../models/Task');
const User = require('../models/User');
const XPConfig = require('../models/XPConfig');
const Level = require('../models/Level');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Category = require('../models/Category');

// Helper: Check and award achievements
const checkAchievements = async (user) => {
  const achievements = await Achievement.find({ isActive: true });
  const earned = await UserAchievement.find({ userId: user._id }).select('achievementId');
  const earnedIds = earned.map(e => e.achievementId.toString());
  const newlyEarned = [];

  for (const ach of achievements) {
    if (earnedIds.includes(ach._id.toString())) continue;
    let unlocked = false;
    if (ach.conditionType === 'tasks_completed' && user.tasksCompleted >= ach.conditionValue) unlocked = true;
    if (ach.conditionType === 'xp_earned' && user.xp >= ach.conditionValue) unlocked = true;
    if (ach.conditionType === 'streak' && user.streak >= ach.conditionValue) unlocked = true;
    if (ach.conditionType === 'level_reached' && user.level >= ach.conditionValue) unlocked = true;
    if (ach.conditionType === 'first_task' && user.tasksCompleted >= 1) unlocked = true;

    if (unlocked) {
      await UserAchievement.create({ userId: user._id, achievementId: ach._id });
      if (ach.xpBonus > 0) user.xp += ach.xpBonus;
      newlyEarned.push(ach);
    }
  }
  return newlyEarned;
};

// Helper: Update level based on XP
const updateLevel = async (user) => {
  const levels = await Level.find().sort('level');
  if (!levels.length) return;
  let newLevel = 1;
  for (const lvl of levels) {
    if (user.xp >= lvl.xpRequired) newLevel = lvl.level;
  }
  user.level = newLevel;
};

// ─── PROFILE ──────────────────────────────────────────────────────────────────

// GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const levels = await Level.find().sort('level');
    const currentLevel = levels.find(l => l.level === user.level) || { title: 'Beginner', badge: '🌱' };
    const nextLevel = levels.find(l => l.level === user.level + 1);
    const achievements = await UserAchievement.find({ userId: user._id }).populate('achievementId');
    res.json({ user, currentLevel, nextLevel, achievements });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── TASKS ────────────────────────────────────────────────────────────────────

// GET /api/user/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id })
      .populate('category', 'name color icon')
      .sort('-createdAt');
    res.json(tasks);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/user/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, categoryId, difficulty, dueDate, priority } = req.body;
    const xpConfig = await XPConfig.findOne({ difficulty });
    const xpReward = xpConfig ? xpConfig.xpPoints : 10;
    const task = await Task.create({
      userId: req.user._id,
      title, description,
      category: categoryId,
      difficulty, xpReward, dueDate, priority,
    });
    res.status(201).json(await task.populate('category', 'name color icon'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/user/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.status === 'completed') return res.status(400).json({ message: 'Task already completed' });
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/user/tasks/:id
const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Task deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/user/tasks/:id/complete
const completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.status === 'completed') return res.status(400).json({ message: 'Already completed' });

    task.status = 'completed';
    task.completedAt = new Date();
    await task.save();

    const user = await User.findById(req.user._id);
    user.xp += task.xpReward;
    user.tasksCompleted += 1;

    // Streak logic
    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastActive === today) { /* same day, no change */ }
    else if (lastActive === yesterday) user.streak += 1;
    else user.streak = 1;
    user.lastActiveDate = new Date();

    await updateLevel(user);
    const newAchievements = await checkAchievements(user);
    await user.save();

    res.json({ message: 'Task completed!', xpEarned: task.xpReward, newXP: user.xp, level: user.level, newAchievements });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

// GET /api/user/achievements
const getAchievements = async (req, res) => {
  try {
    const all = await Achievement.find({ isActive: true });
    const earned = await UserAchievement.find({ userId: req.user._id }).select('achievementId earnedAt');
    const earnedMap = {};
    earned.forEach(e => { earnedMap[e.achievementId.toString()] = e.earnedAt; });
    const result = all.map(a => ({ ...a.toObject(), earned: !!earnedMap[a._id.toString()], earnedAt: earnedMap[a._id.toString()] || null }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────

// GET /api/user/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['user', 'employee'] }, isActive: true })
      .select('name role xp level tasksCompleted')
      .sort('-xp').limit(20);
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── REPORT ───────────────────────────────────────────────────────────────────

// GET /api/user/report
const getReport = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).populate('category', 'name color');
    const completed = tasks.filter(t => t.status === 'completed');
    const pending = tasks.filter(t => t.status === 'pending');
    const inProgress = tasks.filter(t => t.status === 'in-progress');
    const totalXP = completed.reduce((sum, t) => sum + t.xpReward, 0);

    const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
    completed.forEach(t => { byDifficulty[t.difficulty] = (byDifficulty[t.difficulty] || 0) + 1; });

    const byCategory = {};
    completed.forEach(t => {
      const name = t.category?.name || 'Unknown';
      byCategory[name] = (byCategory[name] || 0) + 1;
    });

    // Daily completions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = completed.filter(t => new Date(t.completedAt) >= sevenDaysAgo);
    const dailyMap = {};
    recent.forEach(t => {
      const day = new Date(t.completedAt).toLocaleDateString('en-IN', { weekday: 'short' });
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

    res.json({
      total: tasks.length, completed: completed.length,
      pending: pending.length, inProgress: inProgress.length,
      totalXP, byDifficulty, byCategory, dailyActivity: dailyMap,
      user: { xp: req.user.xp, level: req.user.level, streak: req.user.streak, tasksCompleted: req.user.tasksCompleted }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET categories (public for task creation)
const getCategories = async (req, res) => {
  try { res.json(await Category.find({ isActive: true })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getProfile, getTasks, createTask, updateTask, deleteTask, completeTask, getAchievements, getLeaderboard, getReport, getCategories };
