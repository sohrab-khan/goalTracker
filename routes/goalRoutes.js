const express = require('express');
const router = express.Router();
const { createGoal, getGoals } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.post('/createGoal', protect, createGoal);
router.get('/getGoals', protect, getGoals);

module.exports = router;
