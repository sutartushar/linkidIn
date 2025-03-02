const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.LINKEDIN_CALLBACK_URL,
  scope: ['r_liteprofile', 'r_emailaddress'],
  state: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOneAndUpdate(
      { linkedinId: profile.id },
      {
        accessToken,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileUrl: profile.profileUrl,
        email: profile.emails[0].value
      },
      { new: true, upsert: true }
    );
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));