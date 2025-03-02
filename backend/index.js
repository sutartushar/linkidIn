const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidates');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport configuration
require('./config/passport');

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes); // LinkedIn authentication routes
app.use('/api/candidates', candidateRoutes); // Candidate browsing routes

// Protected profile route (example)
app.get('/api/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});