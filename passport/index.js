const passport = require('passport');
const local = require('./local');

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(local);

module.exports = passport;