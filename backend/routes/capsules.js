const express = require('express');
const Capsule = require('../models/Capsule');
const jwt = require('jsonwebtoken');
const router = express.Router();

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

router.get('/', async (req, res) => {
  const capsules = await Capsule.find({}).populate('user', { username: 1 });
  res.json(capsules);
});

router.post('/', async (req, res) => {
  const body = req.body;
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const capsule = new Capsule({
    title: body.title,
    content: body.content,
    date: body.date,
    image: body.image,
    user: decodedToken.id,
  });

  const savedCapsule = await capsule.save();
  res.status(201).json(savedCapsule);
});

router.delete('/:id', async (req, res) => {
  await Capsule.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = router;