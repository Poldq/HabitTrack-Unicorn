const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../database/schemas/user.js');
const { comparePasswords } = require('../utils/bcrypt.js');

passport.serializeUser((user, done) =>{
    done(null, user.id)
     
});

passport.deserializeUser(async(id, done) => {
    try{
        const findUser = await User.findById(id);
        if (!findUser) {
            throw new Error("User not found")
        }
        done(null, findUser)

    }
    catch (err) {
        done(err)

    }
})
passport.use(
    new Strategy( {usernameField:'login'}, async (login, password, done) => {
      try {
        const findUser = await User.findOne({ login });
        if (!findUser) {
          return done(null, false, { message: 'User not found' });
        }
        if (!(await comparePasswords(password, findUser.password))) {
          return done(null, false, { message: 'Bad credentials' });
        }
        return done(null, findUser);
      } catch (err) {
        return done(err);
      }
    })
  );
  
module.exports = passport;