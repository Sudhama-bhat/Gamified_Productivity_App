const User = require('../models/User');
const Task = require('../models/Task');
const Category = require('../models/Category');
const Achievement = require('../models/Achievement');
const XPConfig = require('../models/XPConfig');
const Level = require('../models/Level');
const UserAchievement = require('../models/UserAchievement');
const bcrypt = require('bcryptjs');

// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/admin/employees  — admin creates employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const emp = await User.create({ name, email, password, role: 'employee', department: department || '' });
    res.status(201).json({ _id: emp._id, name: emp.name, email: emp.email, role: emp.role, department: emp.department });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, department, isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (department !== undefined) user.department = department;
    if (isActive !== undefined) user.isActive = isActive;
    await user.save();
    res.json({ message: 'User updated', user: { _id: user._id, name: user.name, email: user.email, isActive: user.isActive } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

const getCategories = async (req, res) => {
  try { res.json(await Category.find().sort('name')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

const createCategory = async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── XP CONFIG ────────────────────────────────────────────────────────────────

const getXPConfig = async (req, res) => {
  try { res.json(await XPConfig.find()); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

const upsertXPConfig = async (req, res) => {
  try {
    const { difficulty, xpPoints, bonusMultiplier } = req.body;
    const config = await XPConfig.findOneAndUpdate(
      { difficulty },
      { xpPoints, bonusMultiplier },
      { upsert: true, new: true }
    );
    res.json(config);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── LEVEL THRESHOLDS ─────────────────────────────────────────────────────────

const getLevels = async (req, res) => {
  try { res.json(await Level.find().sort('level')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

const upsertLevel = async (req, res) => {
  try {
    const { level, xpRequired, title, badge } = req.body;
    const lvl = await Level.findOneAndUpdate({ level }, { xpRequired, title, badge }, { upsert: true, new: true });
    res.json(lvl);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteLevel = async (req, res) => {
  try {
    await Level.findByIdAndDelete(req.params.id);
    res.json({ message: 'Level deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

const getAchievements = async (req, res) => {
  try { res.json(await Achievement.find().sort('conditionValue')); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

const createAchievement = async (req, res) => {
  try {
    const ach = await Achievement.create(req.body);
    res.status(201).json(ach);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateAchievement = async (req, res) => {
  try {
    const ach = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ach);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteAchievement = async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Achievement deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' }, isActive: true })
      .select('name email role department xp level tasksCompleted')
      .sort('-xp')
      .limit(50);
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── REPORTS ──────────────────────────────────────────────────────────────────

const getReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });

    // Top users by XP
    const topUsers = await User.find({ role: { $ne: 'admin' } })
      .select('name role xp level tasksCompleted')
      .sort('-xp').limit(10);

    // Tasks by category
    const tasksByCategory = await Task.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $project: { name: '$category.name', count: 1 } }
    ]);

    // Daily completions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyCompletions = await Task.aggregate([
      { $match: { status: 'completed', completedAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ totalUsers, totalEmployees, totalTasks, completedTasks, pendingTasks, topUsers, tasksByCategory, dailyCompletions });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── TASK MANAGEMENT (assign to employees) ────────────────────────────────────

const assignTask = async (req, res) => {
  try {
    const { userId, title, description, categoryId, difficulty, dueDate, priority } = req.body;
    const xpConfig = await XPConfig.findOne({ difficulty });
    const xpReward = xpConfig ? xpConfig.xpPoints : 10;
    const task = await Task.create({
      userId, title, description,
      category: categoryId,
      difficulty, xpReward, dueDate, priority,
      assignedBy: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET all tasks (admin view)
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('userId', 'name email role')
      .populate('category', 'name color')
      .populate('assignedBy', 'name')
      .sort('-createdAt');
    res.json(tasks);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  getUsers, getUserById, updateUser, deleteUser,
  getCategories, createCategory, updateCategory, deleteCategory,
  getXPConfig, upsertXPConfig,
  getLevels, upsertLevel, deleteLevel,
  getAchievements, createAchievement, updateAchievement, deleteAchievement,
  getLeaderboard, getReports, getAllTasks,
};
