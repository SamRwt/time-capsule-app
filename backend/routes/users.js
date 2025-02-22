const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    password: passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

router.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = router;