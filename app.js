//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://mg7237:Floyd123@cluster0-qoual.mongodb.net/secretsDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const userSchema = new mongoose.Schema({
  email : String,
  password: String
});

secretString = process.env.SECRET;

userSchema.plugin(encrypt,{secret: secretString, encryptedFields: ['password']});

const User = new mongoose.model("User",userSchema );

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");

});

app.post("/register",function(req,res){
  const email = req.body.username;
  const password = req.body.password;

  const newUser = new User ({email: email, password: password});
  newUser.save(function(err){
    if (!err) {
        res.render("secrets");
    } else {
        res.render("register");
    }

  });
});

app.post("/login",function(req,res){
  const email = req.body.username;
  const password = req.body.password;

  User.findOne({email: email},function(err, user){
    if (!err) {
      if (user) {
      if (user.password === password) {
        res.render("secrets");
      } else {
        console.log("Password incorrect");
        res.redirect("/");
      }
    } else {
      console.log('User not found');
      res.redirect("/");
    }
  }
  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
