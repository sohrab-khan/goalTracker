const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
    const {userId, title, description, minTimeline, maxTimeline, tasks} = req.body;
    try {
        const goalCount = await Goal.countDocuments({userId: userId});
        if (goalCount >= 2) {
            return res.status(400).json({
                success: false,
                message: 'Users can only have up to 2 goals.'
            });
        }
        const goal = await Goal.create({
            userId,
            title,
            description,
            minTimeline,
            maxTimeline,
            tasks
        });
        await goal.save();
        res.json(goal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({userId: req.user._id}, {_id: 0, __v: 0}).sort({date: -1});
        res.json(goals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
