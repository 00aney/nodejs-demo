const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
  passport.serializeUser((user, done) => { // in server memory, [{ id: row id, cookie: 'cookie'}]
    return done(null, user.id);
  });

  passport.deserializeUser(async(id, done) => {
    try {
      const user = await db.User.findOne({
        where: { id },
      });
      return done(null, user);  // req.user
    } catch(e) {
      console.error(e);
      return done(e);
    }
  });

  local();
}
