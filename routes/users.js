const express = require("express");
const User = require("../models/User");
const Router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const PORT = 5000 || process.env.PORT;
Router.get("/login", (req, res) => res.render("login"));
Router.get("/register", (req, res) => res.render("register"));
Router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!email || !name || !password || !password2) {
    errors.push({ msg: "fill all fields" });
  } else if (password != password2) {
    errors.push({ msg: "passwords do not match" });
  } else if (password.length < 6) {
    errors.push({ msg: "password atleast of 6 charcaters" });
  }
  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    //validating passwords
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", { errors, name, email, password, password2 });
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are registered successfully and can login now!"
                );
                res.redirect("/users/login");
              })
              .catch((err) => {
                if (err) throw err;
              });
          });
        });
      }
    });
  }
});
Router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});
Router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
});
module.exports = Router;
