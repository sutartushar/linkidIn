const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback', 
  passport.authenticate('linkedin', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);
    res.redirect(`${process.env.CLIENT_URL}/profile?token=${token}`);
  }
);