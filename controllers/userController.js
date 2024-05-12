const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('../utils/jwtUtil'); // Import utility for JWT handling

exports.registerUser = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: 'User already exists'});
        }
        user = new User({
            username,
            email,
            password
        });

        await user.save();
        const token = jwt.generateToken(user.id);
        res.status(201).json({success: true, token: token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email}).select('+password');
        if (!user) {
            return res.status(400).json({msg: 'Invalid Credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({msg: 'Invalid Credentials'});
        }

        const token = jwt.generateToken(user.id);
        res.status(201).json({success: true, token: token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.getUsers = async (req, res, next) => {
    try {
        // Fetch all users while excluding the password field
        const users = await User.find({}, {password: 0, __v: 0}).lean(); // Exclude the password and __v field

        // Map the result to rename '_id' to 'userId' and exclude any other unnecessary fields
        const modifiedUsers = users.map(user => {
            return {
                userId: user._id.toString(), // Renaming _id to userId
                username: user.username, email: user.email, createdAt: user.createdAt
            };
        });

        console.log("Got the users list: " + JSON.stringify(modifiedUsers));
        res.json({
            success: true, users: modifiedUsers
        });
    } catch (error) {
        console.log("Error while getting users: ", error);
        next(error);
    }
};

