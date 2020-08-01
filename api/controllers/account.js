const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/account");
const Product = require("../models/inventory");

const jwtSecret = "secretKey";

exports.user_signup = (req, res, next) => {
  const newUser = new User({
    username: req.body.userId,
    password: req.body.password,
    email: req.body.email,
    isAdmin: false,
    isSeller: false,
    isCustomer: true,
    isShipper: false,
    isRestricted: false
  });
  User.find({ email: req.body.emailId })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "email already exists"
        });
      } else {
        verifyPassword();
      }
      // 3- verify the Password the user entered
      function verifyPassword() {
        if (req.body.password !== req.body.verifyPassword) {
          res.status(400).json({
            message: "Passwords don't match"
          });
        } else {
          encryptDataAndSave();
        }
      }
      function encryptDataAndSave() {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
    
          // hash the password along with our new salt
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
    
            // override the cleartext password in the user with the hashed one
            newUser.password = hash;
    
            // if the email and the username are available, create a new user
            // with the hashed password and save it
            newUser
              .save()
              .then(user => {
                console.log("user"+user);
               generateNewToken(user);
              })
              .catch(err => {
                res.status(400).json({
                  message: "Error registering",
                  err
                });
              });
          });
        });
    }
  // generate and json token and send it with the user
  function generateNewToken(user) {
    jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        isCustomer: user.isCustomer,
        isShipper: user.isShipper
      },
      jwtSecret,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {throw err;}
        else{
          res.json({
            token,
            message: "Registered Succefully",
            user: {
              username: user.userId,
              email: user.email,
              creationDate: user.creationDate
            }
          });
        }
      }
    );
  }
  })
};


exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email
                        },
            "secret",
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Login successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ userId: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};