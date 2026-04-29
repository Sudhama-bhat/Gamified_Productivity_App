const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers, getUserById, updateUser, deleteUser,
  getCategories, createCategory, updateCategory, deleteCategory,
  getXPConfig, upsertXPConfig,
  getLevels, upsertLevel, deleteLevel,
  getAchievements, createAchievement, updateAchievement, deleteAchievement,
  getLeaderboard, getReports,
  getAllTasks,
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// XP Config
router.get('/xp-config', getXPConfig);
router.post('/xp-config', upsertXPConfig);

// Levels
router.get('/levels', getLevels);
router.post('/levels', upsertLevel);
router.delete('/levels/:id', deleteLevel);

// Achievements
router.get('/achievements', getAchievements);
router.post('/achievements', createAchievement);
router.put('/achievements/:id', updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Leaderboard & Reports
router.get('/leaderboard', getLeaderboard);
router.get('/reports', getReports);

// Tasks
router.get('/tasks', getAllTasks);

module.exports = router;
