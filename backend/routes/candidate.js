const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const { skills, minExperience } = req.query;
    const filter = {};
    
    if (skills) filter.skills = { $in: skills.split(',') };
    if (minExperience) filter['experience.duration'] = { $gte: parseInt(minExperience) };

    const candidates = await User.find(filter);
    res.json(candidates);
  } catch (error) {
    res.status(500).send(error.message);
  }
});