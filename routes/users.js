const express = require('express');
const router = express.Router();
const {hashPassword} = require('../utils/bcrypt.js');
const registerUserValidationSchema = require('../utils/userValidationSchemas.js');
const {validationResult , checkSchema, matchedData} = require('express-validator');
const passport = require('passport');
const User = require('../database/schemas/user.js');
const checkAuthorization = require('../middlewares/authorizationMiddleware.js');



router.delete('/delete',checkAuthorization, async (req, res)=> {
  const userId = req.user;
  try {
   const deletedUser = await User.deleteOne({_id: userId});
    if (!deletedUser) {
      return res.status(422).json({error:'Deletion failed'});
    }
    req.logout((err) => {
      if (err) {
        return res.status(400).json({message: 'Logout failed'});
      }
      return res.status(200).json({ message: 'Account deleted successfully'});
    });
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error});
  }
});



router.post('/login', passport.authenticate('local'), function(req, res) {
  return res.status(200).json({ message: 'Login successful', user: req.user});
});

 
router.post('/logout', (req,res) => {
  if (!req.user) {
    return res.sendStatus(401).json({message: 'Unauthorized'});
  }
  req.logout((err) => {
    if (err) {
      return res.status(400).json({message: 'Logout failed'});
    }
    return res.status(200).json({message: 'Logout succesful'});
  });
});

router.post('/register', checkSchema(registerUserValidationSchema), async (req, res, next) => {

  const data =  matchedData(req); 

  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).json({ errors: errors.array() });
  }
  try{
    data.password = await hashPassword(data.password);
    const newUser = new User(data);
    const savedUser = await newUser.save();
    return res.status(201).send(savedUser)
  }
  catch (err){
    if (err.code === 11000) {
      return res.status(422).json({ error: 'Login already exists.'});
    }
    return res.status(500).json({error: "Internal Server error. Please try again"});
  }
});


module.exports = {
  router
}

