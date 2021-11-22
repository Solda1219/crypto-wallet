'use strict';

var bcrypt = require('bcrypt')
var mongoose = require('mongoose'),
 Account = mongoose.model('Account');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash;
}

async function comparePassword(password, hash) { // updated
  const isSame = await bcrypt.compare(password, hash) // updated
  return isSame;
}

async function getUserByEmail(email){
  var userInfo= await Account.find({email: email}).clone().catch(function(err){ console.log(err)});
  console.log("however user?", userInfo[0])
  return userInfo[0];
}

exports.register = async function(req, res) {
  var registeredUser= await getUserByEmail(req.body.email);
  if(registeredUser){
    res.json({message: "email in use"});
  }
  else{
    var hashedpassword= await hashPassword(req.body.password);
    var userInfo= {...req.body, password: hashedpassword};
    var new_user = new Account(userInfo);
    new_user.save(function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
  }
  
};

exports.login = async function(req, res){
  var loginUser= await getUserByEmail(req.body.email);
  if(loginUser){
    var passCorrect= await comparePassword(req.body.password, loginUser.password);
    if(passCorrect){
      res.json(loginUser);
    }
    else{
      res.json({error: "password"});
    }
  }
  else{
    res.json({error: "email"});
  }
}