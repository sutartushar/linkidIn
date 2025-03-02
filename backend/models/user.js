const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  linkedinId: String,
  accessToken: String,
  firstName: String,
  lastName: String,
  headline: String,
  summary: String,
  location: String,
  profileUrl: String,
  email: String,
  skills: [String],
  experience: [{
    title: String,
    company: String,
    duration: String
  }],
  preferredJobRoles: [String],
  manualUpdates: {
    bio: String,
    additionalSkills: [String]
  }
});

module.exports = mongoose.model('User', userSchema);