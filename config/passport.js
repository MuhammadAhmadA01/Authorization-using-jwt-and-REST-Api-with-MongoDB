
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Email does not exist" });
          }
          bcrypt.compare(password, user.password, (err, isMatched) => {
            if (err) throw err;
            if (isMatched) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect Password" });
            }
          });
          
        })
        .catch((err) => console.log(err));
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
  
};
