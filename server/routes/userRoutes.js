const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProfile, getTasks, createTask, updateTask, deleteTask,
  completeTask, getAchievements, getLeaderboard, getReport, getCategories,
} = require('../controllers/userController');

router.use(protect, authorize('user'));

router.get('/profile', getProfile);
router.get('/categories', getCategories);
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.put('/tasks/:id/complete', completeTask);
router.get('/achievements', getAchievements);
router.get('/leaderboard', getLeaderboard);
router.get('/report', getReport);

module.exports = router;
