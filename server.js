require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const goalRoutes = require('./routes/goalRoutes');

const app = express();
app.use(express.json());

connectDB();

app.use('/users', userRoutes);
app.use('/goals', goalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
